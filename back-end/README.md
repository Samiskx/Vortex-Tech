# ⚙️ Vortex Tech — Back-End

Esta pasta contém o servidor Node.js (API REST), a integração com o Banco de Dados PostgreSQL e a Inteligência Artificial (Google Gemini).

## 📁 Arquivos desta pasta:
- `server.js`: Servidor Express com todas as rotas da API:
  - `GET /api/produtos` (retorna produtos com categoria usando `INNER JOIN`).
  - `POST /api/contato` (salva cliente e mensagem nas tabelas do PostgreSQL).
  - `POST /api/chat` (recebe a mensagem do usuário, consulta o Google Gemini e responde de forma humanizada e inteligente).
- `package.json`: Lista de dependências do Node.js (`express`, `pg`, `dotenv`, `@google/genai`).
- `.env.example`: Modelo das variáveis de ambiente necessárias (banco de dados e chave da API do Gemini).
- `db/schema.sql`: Script SQL de criação das 4 tabelas (`categorias`, `produtos`, `clientes`, `mensagens`) e índices.
- `db/seed.sql`: Inserção dos dados iniciais (categorias e produtos cadastrados).
- `db/consultas-av3.sql`: Consultas exigidas no trabalho (JOIN, GROUP BY, HAVING, subconsulta, agregação e EXPLAIN).
- `db/DER-esquema.md`: Diagrama Entidade-Relacionamento, dicionário de dados e roteiro para defesa oral.

## 🚀 Como rodar o Back-End:
1. Abra um terminal nesta pasta:
   ```bash
   cd back-end
   npm install
   ```
2. Crie o arquivo `.env` baseado no `.env.example`:
   ```bash
   GEMINI_API_KEY=sua_chave_aqui
   DATABASE_URL=postgresql://postgres:suasenha@localhost:5432/vortex_tech
   PORT=3000
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
   O servidor iniciará em `http://localhost:3000`.
