// =========================================================
// SERVIDOR — VORTEX TECH (Node.js + Express + PostgreSQL)
// =========================================================
// Este arquivo é o backend do site. Ele faz três coisas:
// 1. Entrega os arquivos visuais (HTML, CSS, imagens e JS).
// 2. Consulta e salva dados no banco PostgreSQL.
// 3. Conversa com a API do Google Gemini para o chatbot.
// =========================================================

const path = require("path");
const express = require("express");
const pool = require("./db/conexao.js");

// Carrega as variáveis do arquivo .env (chave da IA e senha do banco)
try {
    process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
    // Se o .env não existir, o servidor sobe com os valores padrão
}

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const MODELO = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const CHAVE_API = process.env.GEMINI_API_KEY;

// Permite receber dados em formato JSON e serve os arquivos da pasta
app.use(express.json());
app.use(express.static(__dirname));

// Rota principal: garante a entrega da página inicial (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Rota amigável para a loja (/loja ou /loja.html)
app.get("/loja", (req, res) => {
    res.sendFile(path.join(__dirname, "loja.html"));
});
app.get("/loja.html", (req, res) => {
    res.sendFile(path.join(__dirname, "loja.html"));
});

// =========================================================
// ROTA 1: Status do Sistema
// =========================================================
app.get("/api/status", async (req, res) => {
    let bancoConectado = false;
    try {
        await pool.query("SELECT 1");
        bancoConectado = true;
    } catch {
        bancoConectado = false;
    }

    res.json({
        ok: true,
        modelo: MODELO,
        chaveConfigurada: Boolean(CHAVE_API),
        bancoConectado
    });
});

// =========================================================
// ROTA 2: Catálogo de Produtos (Leitura do Banco de Dados)
// =========================================================
// Lê os produtos cadastrados no PostgreSQL usando INNER JOIN com categorias.
// Suporta filtros simples por categoria, busca por nome e ordenação por preço.
app.get("/api/produtos", async (req, res) => {
    const categoria = req.query.categoria || "";
    const busca = req.query.busca || "";
    const ordem = req.query.ordem || "nome";

    // Define a ordenação de forma segura
    let orderBy = "p.nome ASC";
    if (ordem === "menor-preco") orderBy = "p.preco ASC";
    if (ordem === "maior-preco") orderBy = "p.preco DESC";

    // Monta a consulta de forma segura (parametrizada contra SQL Injection)
    const condicoes = ["p.ativo = TRUE"];
    const valores = [];

    if (categoria !== "" && categoria !== "todos") {
        valores.push(categoria);
        condicoes.push(`c.slug = $${valores.length}`);
    }

    if (busca !== "") {
        valores.push(`%${busca}%`);
        condicoes.push(`(p.nome ILIKE $${valores.length} OR p.descricao ILIKE $${valores.length})`);
    }

    try {
        const sql = `
            SELECT 
                p.id, p.nome, p.descricao, p.preco, p.estoque, p.imagem,
                c.nome AS categoria, c.slug AS categoria_slug
            FROM produtos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE ${condicoes.join(" AND ")}
            ORDER BY ${orderBy}
        `;

        const resultado = await pool.query(sql, valores);
        res.json({ produtos: resultado.rows });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro.message);
        res.status(500).json({ erro: "Erro ao buscar produtos no banco de dados." });
    }
});

// =========================================================
// ROTA 3: Formulário de Contato e Pedidos (Gravação no Banco)
// =========================================================
// Salva quem enviou a mensagem na tabela "clientes" e o texto na tabela "mensagens".
app.post("/api/contato", async (req, res) => {
    const nome = (req.body?.nome || "").trim();
    const email = (req.body?.email || "").trim().toLowerCase();
    const assunto = (req.body?.assunto || "").trim();
    const mensagem = (req.body?.mensagem || "").trim();
    const produtoNome = (req.body?.produto || "").trim();

    // Validação básica dos campos
    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
    }

    try {
        // 1. Salva o cliente (ou atualiza o nome se o e-mail já existir)
        const clienteRes = await pool.query(`
            INSERT INTO clientes (nome, email)
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
            RETURNING id
        `, [nome, email]);

        const clienteId = clienteRes.rows[0].id;

        // 2. Se o cliente veio da loja com um produto selecionado, busca o ID do produto
        let produtoId = null;
        if (produtoNome !== "") {
            const prodRes = await pool.query("SELECT id FROM produtos WHERE nome = $1", [produtoNome]);
            if (prodRes.rowCount > 0) produtoId = prodRes.rows[0].id;
        }

        // 3. Salva a mensagem no banco de dados
        await pool.query(`
            INSERT INTO mensagens (cliente_id, produto_id, assunto, mensagem)
            VALUES ($1, $2, $3, $4)
        `, [clienteId, produtoId, assunto, mensagem]);

        res.status(201).json({ ok: true, mensagem: "Mensagem gravada com sucesso!" });
    } catch (erro) {
        console.error("Erro ao salvar mensagem:", erro.message);
        res.status(500).json({ erro: "Não foi possível gravar a mensagem no banco de dados." });
    }
});

// =========================================================
// ROTA 4: Chatbot com IA (Google Gemini API)
// =========================================================
// Função auxiliar para buscar o catálogo no banco e fornecer para a IA
async function obterCatalogoParaIA() {
    try {
        const { rows } = await pool.query(`
            SELECT p.nome, p.preco, c.nome AS categoria, p.descricao
            FROM produtos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE p.ativo = TRUE
            ORDER BY c.nome, p.nome
        `);

        return rows.map(p => {
            const precoFormatado = Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return `- ${p.nome} (${p.categoria}): ${precoFormatado} — ${p.descricao}`;
        }).join("\n");
    } catch {
        return "(Catálogo temporariamente indisponível)";
    }
}

app.post("/api/chat", async (req, res) => {
    if (!CHAVE_API) {
        return res.status(503).json({
            erro: "A chave GEMINI_API_KEY não foi configurada no arquivo .env."
        });
    }

    const mensagemUsuario = (req.body?.mensagem || "").trim();
    const conversaId = req.body?.conversaId || null;

    if (!mensagemUsuario) {
        return res.status(400).json({ erro: "Digite uma mensagem antes de enviar." });
    }

    try {
        const catalogo = await obterCatalogoParaIA();

        const instrucoesSistema = `Você é o VortexBot, assistente virtual oficial da loja Vortex Tech.
Você é educado, objetivo e especializado em celulares, smartwatches, fones e acessórios tecnológicos.
Responda sempre em português do Brasil de forma clara e amigável (máximo de 3 a 4 frases).
Recomende produtos presentes no catálogo abaixo com seus respectivos preços quando o cliente pedir sugestões:

CATÁLOGO DA LOJA:
${catalogo}

Para finalizar uma compra ou agendar entrega, oriente o cliente a usar o botão 'Loja' ou o formulário de contato do site.`;

        // Chama a API oficial do Google Gemini
        const respostaGemini = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": CHAVE_API,
                "Api-Revision": "2026-05-20"
            },
            body: JSON.stringify({
                model: MODELO,
                input: mensagemUsuario,
                system_instruction: instrucoesSistema,
                generation_config: { max_output_tokens: 300 },
                store: true,
                ...(conversaId ? { previous_interaction_id: conversaId } : {})
            })
        });

        const dados = await respostaGemini.json();

        if (!respostaGemini.ok) {
            console.error("Erro retornado pelo Gemini:", dados);
            return res.status(502).json({ erro: "A IA está temporariamente indisponível. Tente novamente em instantes." });
        }

        // Extrai o texto da resposta
        let textoResposta = dados?.output_text;
        if (!textoResposta && dados?.steps) {
            const passo = dados.steps.find(s => s.type === "model_output");
            textoResposta = passo?.content?.find(c => c.type === "text")?.text;
        }

        if (!textoResposta) {
            textoResposta = "Desculpe, não consegui entender. Poderia reformular a pergunta?";
        }

        res.json({
            resposta: textoResposta.trim(),
            conversaId: dados.id || conversaId
        });
    } catch (erro) {
        console.error("Erro na comunicação com a IA:", erro.message);
        res.status(500).json({ erro: "Não foi possível conectar com o assistente inteligente." });
    }
});

// =========================================================
// INICIALIZAÇÃO DO SERVIDOR
// =========================================================
app.listen(PORTA, () => {
    console.log(`\n==================================================`);
    console.log(`  Vortex Tech rodando em: http://localhost:${PORTA}`);
    console.log(`==================================================\n`);
});
