// =========================================================
// CONFIGURAÇÃO INICIAL DO BANCO — execute com: npm run setup
// =========================================================
const fs = require("fs");
const path = require("path");
const { Client, Pool } = require("pg");

try {
    process.loadEnvFile(path.join(__dirname, "../.env"));
} catch {
    try {
        process.loadEnvFile(path.join(__dirname, ".env"));
    } catch {}
}

const CONFIG = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vortex_tech"
};

async function principal() {
    console.log("\n[PostgreSQL] Verificando conexão e banco de dados...");
    
    // 1. Conecta no banco "postgres" para criar "vortex_tech" se necessário
    let cliente = null;
    try {
        cliente = new Client({ ...CONFIG, database: "postgres" });
        await cliente.connect();
        
        const existe = await cliente.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [CONFIG.database]
        );

        if (existe.rowCount === 0) {
            await cliente.query(`CREATE DATABASE ${CONFIG.database}`);
            console.log(`[OK] Banco de dados "${CONFIG.database}" criado com sucesso!`);
        } else {
            console.log(`[OK] Banco de dados "${CONFIG.database}" já existe.`);
        }
        await cliente.end();
    } catch (erro) {
        if (cliente) { try { await cliente.end(); } catch {} }
        console.log(`[AVISO] Não foi possível conectar ao PostgreSQL: ${erro.message}`);
        console.log(`(O site continuará funcionando em modo de contingência offline).`);
        return;
    }

    // 2. Conecta no banco "vortex_tech" e executa database/script.sql
    try {
        const pool = new Pool(CONFIG);
        const scriptPath = path.join(__dirname, "../database/script.sql");
        if (fs.existsSync(scriptPath)) {
            let sql = fs.readFileSync(scriptPath, "utf8").replace(/^\uFEFF/, "");
            await pool.query(sql);
            console.log(`[OK] Tabelas e produtos carregados a partir de database/script.sql!`);
        }
        await pool.end();
    } catch (erro) {
        console.error(`[AVISO] Erro ao aplicar script.sql: ${erro.message}`);
    }
}

principal();
