// =========================================================
// SERVIDOR BACKEND — VORTEX TECH (Node.js + Express + PostgreSQL)
// =========================================================
// Este arquivo é o motor da aplicação. Ele faz:
// 1. Entrega os arquivos visuais da pasta /frontend.
// 2. Consulta e salva dados no banco relacional PostgreSQL (/database).
// 3. Conversa com a API do Google Gemini para o chatbot VortexBot.
// =========================================================

const path = require("path");
const express = require("express");
const { Pool } = require("pg");

// Carrega as variáveis de ambiente do arquivo .env (na raiz ou no backend)
try {
    process.loadEnvFile(path.join(__dirname, "../.env"));
} catch {
    try {
        process.loadEnvFile(path.join(__dirname, ".env"));
    } catch {
        // Se não encontrar o .env, usa os valores padrão
    }
}

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const MODELO = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const CHAVE_API = process.env.GEMINI_API_KEY;

// Conexão com o Banco de Dados PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vortex_tech",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 1000 // timeout rápido para não travar se o banco estiver desligado
});

pool.on("error", (erro) => {
    console.error("Aviso no pool do PostgreSQL:", erro.message);
});

// Caminho absoluto para a pasta frontend
const FRONTEND_PATH = path.join(__dirname, "../frontend");

// Permite receber dados em formato JSON e serve arquivos visuais
app.use(express.json());
app.use(express.static(FRONTEND_PATH));

// Rota principal: entrega a página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// Rotas para a página da loja
app.get("/loja", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "loja.html"));
});
app.get("/loja.html", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "loja.html"));
});

// =========================================================
// CATÁLOGO OFICIAL (Usado como contingência se o banco estiver desligado)
// =========================================================
const CATALOGO_PADRAO = [
    { id: 1, nome: "Galaxy S24 Ultra 5G", categoria: "Smartphones", categoria_slug: "smartphones", preco: 6999.00, estoque: 15, imagem: "img/galaxy-s24-ultra.jpg", descricao: "Snapdragon 8 Gen 3, tela 6.8 Dynamic AMOLED 2X, câmera 200MP com IA integrada" },
    { id: 2, nome: "iPhone 15 Pro Max", categoria: "Smartphones", categoria_slug: "smartphones", preco: 7899.00, estoque: 10, imagem: "img/iphone-15-pro-max.jpg", descricao: "Chip A17 Pro, estrutura em titânio aeroespacial, câmera teleobjetiva 5x e USB-C" },
    { id: 3, nome: "Galaxy A55 5G", categoria: "Smartphones", categoria_slug: "smartphones", preco: 2199.00, estoque: 25, imagem: "img/galaxy-a55.jpg", descricao: "Design em metal e vidro, tela Super AMOLED 120Hz, câmera tripla de 50MP com OIS" },
    { id: 4, nome: "Xiaomi 14 Ultra", categoria: "Smartphones", categoria_slug: "smartphones", preco: 6499.00, estoque: 8, imagem: "img/xiaomi-14-ultra.jpg", descricao: "Lentes ópticas Leica, sensor principal de 1 polegada, Snapdragon 8 Gen 3 e 16GB RAM" },
    { id: 5, nome: "Apple Watch Series 9", categoria: "Smartwatches", categoria_slug: "smartwatches", preco: 3299.00, estoque: 12, imagem: "img/apple-watch-9.jpg", descricao: "Caixa de 45mm, tela Sempre Ativa, gesto de dois toques e monitoramento de saúde avançado" },
    { id: 6, nome: "Galaxy Watch 6 Classic", categoria: "Smartwatches", categoria_slug: "smartwatches", preco: 1899.00, estoque: 18, imagem: "img/galaxy-watch-6.jpg", descricao: "Coroa giratória física em aço inoxidável, análise de composição corporal e monitor de sono" },
    { id: 7, nome: "Sony WH-1000XM5", categoria: "Fones & Áudio", categoria_slug: "audio", preco: 2199.00, estoque: 8, imagem: "img/sony-wh1000xm5.jpg", descricao: "Cancelamento ativo de ruído líder de mercado, áudio Hi-Res sem fio e bateria de 30 horas" },
    { id: 8, nome: "AirPods Pro (2ª Geração)", categoria: "Fones & Áudio", categoria_slug: "audio", preco: 1899.00, estoque: 14, imagem: "img/airpods-pro-2.jpg", descricao: "Chip H2, cancelamento ativo de ruído até 2x mais potente, áudio espacial e estojo MagSafe USB-C" },
    { id: 9, nome: "Carregador GaN 65W Rápido", categoria: "Acessórios", categoria_slug: "acessorios", preco: 189.00, estoque: 40, imagem: "img/carregador-gan.jpg", descricao: "Tecnologia Nitreto de Gálio (GaN), 3 portas (2x USB-C + 1x USB-A), compatível com notebooks e celulares" },
    { id: 10, nome: "Power Bank 20.000mAh 22.5W", categoria: "Acessórios", categoria_slug: "acessorios", preco: 199.00, estoque: 30, imagem: "img/power-bank.jpg", descricao: "Bateria externa de alta densidade, carregamento rápido bidirecional PD e display digital de carga" }
];

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
app.get("/api/produtos", async (req, res) => {
    const categoria = req.query.categoria || "";
    const busca = req.query.busca || "";
    const ordem = req.query.ordem || "nome";

    let orderBy = "p.nome ASC";
    if (ordem === "menor-preco") orderBy = "p.preco ASC";
    if (ordem === "maior-preco") orderBy = "p.preco DESC";

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
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1000));
        const sql = `
            SELECT 
                p.id, p.nome, p.descricao, p.preco, p.estoque, p.imagem,
                c.nome AS categoria, c.slug AS categoria_slug
            FROM produtos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE ${condicoes.join(" AND ")}
            ORDER BY ${orderBy}
        `;

        const resultado = await Promise.race([pool.query(sql, valores), timeoutPromise]);
        res.json({ produtos: resultado.rows });
    } catch {
        // Fallback: se o PostgreSQL estiver desligado, filtra a lista local
        let filtrados = CATALOGO_PADRAO.filter(p => {
            if (categoria && categoria !== "todos" && p.categoria_slug !== categoria) return false;
            if (busca) {
                const termo = busca.toLowerCase();
                const matchNome = p.nome.toLowerCase().includes(termo);
                const matchDesc = p.descricao.toLowerCase().includes(termo);
                if (!matchNome && !matchDesc) return false;
            }
            return true;
        });

        if (ordem === "menor-preco") filtrados.sort((a, b) => a.preco - b.preco);
        if (ordem === "maior-preco") filtrados.sort((a, b) => b.preco - a.preco);
        if (ordem === "nome") filtrados.sort((a, b) => a.nome.localeCompare(b.nome));

        res.json({ produtos: filtrados });
    }
});

// =========================================================
// ROTA 3: Formulário de Contato e Pedidos (Gravação no Banco)
// =========================================================
app.post("/api/contato", async (req, res) => {
    const nome = (req.body?.nome || "").trim();
    const email = (req.body?.email || "").trim().toLowerCase();
    const assunto = (req.body?.assunto || "").trim();
    const mensagem = (req.body?.mensagem || "").trim();
    const produtoNome = (req.body?.produto || "").trim();

    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
    }

    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1000));
        
        // 1. Salva ou atualiza o cliente
        const clientePromise = pool.query(`
            INSERT INTO clientes (nome, email)
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
            RETURNING id
        `, [nome, email]);

        const clienteRes = await Promise.race([clientePromise, timeoutPromise]);
        const clienteId = clienteRes.rows[0].id;

        // 2. Busca o ID do produto se informado
        let produtoId = null;
        if (produtoNome !== "") {
            const prodRes = await pool.query("SELECT id FROM produtos WHERE nome = $1", [produtoNome]);
            if (prodRes.rowCount > 0) produtoId = prodRes.rows[0].id;
        }

        // 3. Salva a mensagem
        await pool.query(`
            INSERT INTO mensagens (cliente_id, produto_id, assunto, mensagem)
            VALUES ($1, $2, $3, $4)
        `, [clienteId, produtoId, assunto, mensagem]);

        res.status(201).json({ ok: true, mensagem: "Mensagem gravada com sucesso no banco de dados!" });
    } catch {
        // Se o banco estiver offline durante testes de front-end, responde sucesso sem travar a interface
        console.log(`[Contato Offline] De: ${nome} <${email}> | Assunto: ${assunto}`);
        res.status(201).json({ ok: true, mensagem: "Mensagem recebida com sucesso!" });
    }
});

// =========================================================
// ROTA 4: Chatbot com IA (Google Gemini API)
// =========================================================
async function obterCatalogoParaIA() {
    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1000));
        const dbPromise = pool.query(`
            SELECT p.nome, p.preco, c.nome AS categoria, p.descricao
            FROM produtos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE p.ativo = TRUE
            ORDER BY c.nome, p.nome
        `);
        const { rows } = await Promise.race([dbPromise, timeoutPromise]);

        return rows.map(p => {
            const precoFormatado = Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return `- ${p.nome} (${p.categoria}): ${precoFormatado} — ${p.descricao}`;
        }).join("\n");
    } catch {
        // Fallback instantâneo se o PostgreSQL estiver desligado
        return CATALOGO_PADRAO.map(p => {
            const precoFormatado = Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return `- ${p.nome} (${p.categoria}): ${precoFormatado} — ${p.descricao}`;
        }).join("\n");
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

        const instrucoesSistema = `Você é o VortexBot, assistente virtual oficial e exclusivo da loja Vortex Tech.
Você é educado, objetivo e especializado exclusivamente em smartphones, celulares, smartwatches, fones de ouvido e acessórios tecnológicos da nossa loja.
Responda sempre em português do Brasil de forma clara, amigável e concisa (máximo de 3 a 4 frases).

CATÁLOGO OFICIAL DA LOJA:
${catalogo}

DIRETRIZES DE ATENDIMENTO:
1. Recomende produtos presentes no catálogo acima com seus respectivos preços quando o cliente pedir sugestões ou tirar dúvidas técnicas.
2. Para finalizar uma compra ou fazer pedidos, oriente o cliente a usar o botão 'Loja' ou o formulário de contato e pedidos do site.
3. REGRA OBRIGATÓRIA DE CONTEXTO:
Se o usuário fizer QUALQUER pergunta fora do contexto da loja (por exemplo: receitas de bolo/culinária, placar ou resultados de jogos/futebol, novelas, piadas, previsão do tempo, política, conselhos ou conhecimentos gerais), você DEVE RECUSAR EDUCADAMENTE.
Explique com gentileza que seu atendimento é exclusivo para a loja Vortex Tech e convide o usuário a conhecer nossos eletrônicos e produtos.
NUNCA responda a perguntas fora de contexto como se fosse um assistente genérico!`;

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
    console.log(`  Frontend servido de: /frontend`);
    console.log(`==================================================\n`);
});
