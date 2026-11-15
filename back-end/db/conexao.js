// =========================================================
// CONEXÃO COM O POSTGRESQL
// Um único "pool" (conjunto de conexões) é criado aqui e
// reutilizado por todo o servidor.
// =========================================================

const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vortex_tech",
    max: 10,                       // no máximo 10 conexões ao mesmo tempo
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000  // desiste se não conectar em 5s
});

// Erros em conexões ociosas não podem derrubar o servidor
pool.on("error", (erro) => {
    console.error("Erro inesperado no PostgreSQL:", erro.message);
});

module.exports = pool;
