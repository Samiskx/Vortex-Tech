// =========================================================
// DEMONSTRAÇÃO DO ÍNDICE — execute com: npm run db:indice
// ---------------------------------------------------------
// Mostra o mesmo SELECT duas vezes:
//   ANTES  do índice  → o banco lê a tabela inteira (Seq Scan)
//   DEPOIS do índice  → o banco usa o índice (Index Scan)
//
// O que a consulta faz: listar as 20 mensagens mais novas
// que estão com status 'novo' (é o que a tela de atendimento faz).
//
// O índice testado é:
//   idx_mensagens_status_criado ON mensagens (status, criado_em DESC)
// =========================================================

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

try {
    process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
    // usa os valores padrão abaixo
}

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vortex_tech"
});

const CONSULTA = `
SELECT id, cliente_id, assunto, criado_em
FROM mensagens
WHERE status = 'novo'
ORDER BY criado_em DESC
LIMIT 20;
`;

const TOTAL_TESTE = 50000;

async function explicar(titulo) {
    const { rows } = await pool.query(`EXPLAIN (ANALYZE, BUFFERS) ${CONSULTA}`);
    const plano = rows.map((linha) => linha["QUERY PLAN"]).join("\n");
    console.log(`\n===== ${titulo} =====\n${plano}`);
    return plano;
}

async function main() {
    if (!process.env.DB_PASSWORD) {
        console.error("Preencha DB_PASSWORD no arquivo .env antes de rodar.");
        process.exit(1);
    }

    let planoAntes;
    let planoDepois;

    try {
        // O schema já cria o índice; removemos para mostrar o "antes"
        await pool.query("DROP INDEX IF EXISTS idx_mensagens_status_criado");
        console.log(`Índice removido. Inserindo ${TOTAL_TESTE} mensagens de teste...`);

        // Cliente temporário para segurar as mensagens de teste
        const cliente = await pool.query(
            `INSERT INTO clientes (nome, email)
             VALUES ('Cliente Demonstração', 'demo.indice@vortextech.com')
             ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
             RETURNING id`
        );
        const clienteId = cliente.rows[0].id;

        // 50 mil mensagens, 3 status diferentes
        await pool.query(
            `INSERT INTO mensagens (cliente_id, assunto, mensagem, status, criado_em)
             SELECT
                 $1,
                 'Mensagem de teste ' || g,
                 'Carga gerada para a demonstração do índice.',
                 (ARRAY['novo', 'em_atendimento', 'respondido'])[1 + (g % 3)],
                 NOW() - (g || ' minutes')::interval
             FROM generate_series(1, $2) AS g`,
            [clienteId, TOTAL_TESTE]
        );

        await pool.query("ANALYZE mensagens");

        planoAntes = await explicar("EXPLAIN ANTES DO ÍNDICE");

        await pool.query(
            "CREATE INDEX idx_mensagens_status_criado ON mensagens (status, criado_em DESC)"
        );
        await pool.query("ANALYZE mensagens");

        planoDepois = await explicar("EXPLAIN DEPOIS DO ÍNDICE");

        // Limpa a carga de teste para o banco ficar limpo
        await pool.query("DELETE FROM mensagens WHERE cliente_id = $1", [clienteId]);
        await pool.query("DELETE FROM clientes WHERE id = $1", [clienteId]);
        await pool.query("ANALYZE mensagens");

        const relatorio = [
            "VORTEX TECH — EXPLAIN ANTES x DEPOIS DO ÍNDICE",
            "Índice: idx_mensagens_status_criado (status, criado_em DESC)",
            "",
            "ANTES:",
            planoAntes,
            "",
            "DEPOIS:",
            planoDepois,
            ""
        ].join("\n");

        const destino = path.join(__dirname, "explain-antes-depois.txt");
        fs.writeFileSync(destino, relatorio, "utf8");

        console.log(`\nPronto! Dados de teste removidos.`);
        console.log(`Relatório salvo em: ${destino}\n`);
    } catch (erro) {
        console.error("\nFalha na demonstração:", erro.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
