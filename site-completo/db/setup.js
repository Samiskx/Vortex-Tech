// =========================================================
// CRIAÇÃO DO BANCO — execute com: npm run db:setup
// ---------------------------------------------------------
// 1. Conecta no banco "postgres" (que já existe)
// 2. Cria o banco "vortex_tech" se ele ainda não existir
// 3. Roda db/schema.sql (tabelas e índices)
// 4. Roda db/seed.sql (categorias e produtos)
//
// Pode rodar quantas vezes quiser: nada é duplicado.
// =========================================================

const fs = require("fs");
const path = require("path");
const { Client, Pool } = require("pg");

try {
    process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
    // segue em frente: usa os valores padrão abaixo
}

const CONFIG = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vortex_tech"
};

async function criarBancoSePrecisar() {
    // Valida o nome porque nome de banco não pode ser parâmetro ($1)
    if (!/^[a-z_][a-z0-9_]*$/.test(CONFIG.database)) {
        throw new Error(`Nome de banco inválido: ${CONFIG.database}`);
    }

    const cliente = new Client({ ...CONFIG, database: "postgres" });
    await cliente.connect();

    const existe = await cliente.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [CONFIG.database]
    );

    if (existe.rowCount === 0) {
        await cliente.query(`CREATE DATABASE ${CONFIG.database}`);
        console.log(`Banco "${CONFIG.database}" criado.`);
    } else {
        console.log(`Banco "${CONFIG.database}" já existe.`);
    }

    await cliente.end();
}

async function rodarArquivo(pool, arquivo) {
    const caminho = path.join(__dirname, arquivo);
    const sql = fs.readFileSync(caminho, "utf8");
    await pool.query(sql);
    console.log(`OK: ${arquivo}`);
}

async function main() {
    if (!CONFIG.password) {
        console.error("\nFalta a senha do PostgreSQL.");
        console.error("Abra o arquivo .env e preencha a linha DB_PASSWORD=...\n");
        process.exit(1);
    }

    try {
        await criarBancoSePrecisar();

        const pool = new Pool(CONFIG);
        await rodarArquivo(pool, "schema.sql");
        await rodarArquivo(pool, "seed.sql");

        const { rows } = await pool.query(
            "SELECT (SELECT COUNT(*) FROM categorias) AS categorias, (SELECT COUNT(*) FROM produtos) AS produtos"
        );
        console.log("\nBanco pronto:", rows[0]);
        console.log("Agora rode: npm start\n");

        await pool.end();
    } catch (erro) {
        console.error("\nNão foi possível preparar o banco.");
        if (erro.code === "ECONNREFUSED") {
            console.error("O PostgreSQL não está rodando. Verifique o serviço postgresql-x64-16.");
        } else if (erro.code === "28P01") {
            console.error("Senha do usuário postgres incorreta. Confira DB_PASSWORD no .env.");
        } else {
            console.error(erro.message);
        }
        process.exit(1);
    }
}

main();
