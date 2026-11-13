# Vortex Tech — Loja de Celulares e Eletrônicos

Projeto desenvolvido para a 3ª Avaliação Interdisciplinar (AV3) das disciplinas de **Desenvolvimento Web para IA** (Prof. Tiago) e **Banco de Dados** (Prof. Gabriel) — Turno Manhã (PIT — Instituto de Tecnologia, Faculdade Estadual do Piauí).

---

## 👥 Integrantes

- **Savyo Vyctor**
- **Vinicius Vieira**
- **Arthur Gabriel**

---

## 📂 Estrutura de Pastas do Repositório

O projeto foi organizado de forma modular e didática em 3 pastas principais:

```
📁 vortex-tech/
├── 📁 front-end/        -> Apenas os arquivos visuais (HTML, CSS, JS e imagens)
│   ├── index.html
│   ├── loja.html
│   ├── style.css
│   ├── script.js
│   ├── loja.js
│   └── img/
│
├── 📁 back-end/         -> Servidor Node.js, API REST e Banco de Dados PostgreSQL
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── db/ (schema.sql, seed.sql, consultas-av3.sql, DER-esquema.md)
│
└── 📁 site-completo/    -> Projeto unificado e pronto para execução (Full-Stack)
    ├── tudo integrado com scripts de execução rápida (iniciar.bat e instalar.bat)
```

---

## 📌 Sobre o Projeto

O site conta com uma estrutura simples, limpa e funcional:

- **Cabeçalho:** logomarca oficial da Vortex Tech (PNG transparente) e menu com 4 seções;
- **Hero:** seção principal com mensagem de destaque e imagem de fundo tecnológica;
- **Sobre Nós:** apresentação da empresa Vortex Tech;
- **Produtos:** 3 cards de categorias (Smartphones 5G, Smartwatches, Fones & Gadgets) com botão para a loja completa;
- **Contato / Pedidos:** formulário com nome, e-mail, assunto e mensagem;
- **Rodapé:** contatos e identificação do projeto acadêmico;
- **Chatbot flutuante:** bolha fixa no canto inferior direito que abre a janela do **VortexBot**.

### Página da loja (`loja.html`)

Catálogo com 10 produtos e três filtros funcionais:

- busca por texto em tempo real;
- filtro por categoria (Smartphones, Smartwatches, Fones & Áudio, Acessórios);
- ordenação por preço (menor → maior / maior → menor).

O botão **Pedir / Comprar** leva ao formulário da página principal já com o nome do produto no campo *Assunto* — e o produto fica vinculado à mensagem no banco (`mensagens.produto_id`).

---

## ✅ Requisitos da AV3

| Requisito | Como foi cumprido | Onde ver |
|---|---|---|
| 3+ tabelas com chave primária | 4 tabelas (`categorias`, `produtos`, `clientes`, `mensagens`) | `db/schema.sql` |
| 2+ relacionamentos com chave estrangeira | 3 FKs: `produtos → categorias`, `mensagens → clientes`, `mensagens → produtos` | `db/schema.sql` |
| Formulário gravando no banco | `POST /api/contato` cria/atualiza o cliente e insere a mensagem | `server.js`, `script.js` |
| Consulta com `JOIN` + filtro, ordenação e agregação | Catálogo com `JOIN` e filtros na API; agregações prontas no arquivo de consultas | `db/consultas.sql`, `GET /api/produtos` |
| Índice adicional justificado + `EXPLAIN` antes/depois | `idx_mensagens_status_criado` — 12,8 ms → 0,118 ms com 50 mil linhas | `db/demo-indice.js`, `db/explain-antes-depois.txt` |
| Sem dados mock, localStorage ou JSON fixo | Catálogo e mensagens vêm do PostgreSQL; lista fixa removida | `server.js`, `loja.js` |
| Backend Node.js/Express | API em Express com rotas `/api/*` | `server.js` |
| Consultas parametrizadas | Todos os valores usam `$1`, `$2`, ... | `server.js` |
| `.env.example` | Modelo com todas as variáveis | `.env.example` |
| Layout: logo, 4 seções, cards, formulário, rodapé, responsivo | Flexbox + media queries | `index.html`, `loja.html`, `style.css` |
| Chatbot com API real e persona própria | VortexBot com Google Gemini e catálogo do banco | `server.js`, `db/conexao.js` |

---

## 🎨 Paleta de Cores

| Cor | Código | Uso |
|---|---|---|
| Azul Escuro | `#0a192f` | Cabeçalho, títulos e rodapé |
| Azul Claro Tecnológico | `#00b4d8` | Destaques, botões e bordas de cards |
| Fundo | `#f4f6f8` / `#ffffff` | Seções e cards |

---

## 📁 Estrutura de Pastas

```text
vortex-tech/
├── index.html         → Página principal
├── loja.html          → Catálogo com filtros
├── style.css          → Estilos (variáveis :root, Flexbox e responsividade)
├── script.js          → Formulário (envia ao banco) e chat flutuante
├── loja.js            → Busca, filtro e ordenação (dados da API)
├── server.js          → Servidor Express, API do site e ponte com o Gemini
├── db/
│   ├── schema.sql     → Tabelas, chaves e índices
│   ├── seed.sql       → Categorias e produtos iniciais
│   ├── consultas.sql  → JOIN, filtros, ordenação e agregações do relatório
│   ├── DER-esquema.md → Diagrama DER, dicionário de dados e guia de apresentação
│   ├── conexao.js     → Conexão do Node com o PostgreSQL
│   ├── setup.js       → Cria o banco e roda schema + seed
│   ├── demo-indice.js → Demonstração do índice (EXPLAIN antes/depois)
│   └── explain-antes-depois.txt → Saída gerada pelo demo-indice.js
├── package.json       → Dependências e scripts
├── instalar.bat       → Instalação automática no Windows (npm + banco + site)
├── iniciar.bat        → Liga o site nos próximos usos
├── .env.example       → Modelo das variáveis de ambiente
├── .env               → Chaves e senha do banco (NÃO versionar)
├── img/               → Imagens dos produtos (locais, sem depender de internet)
├── logo-vortex.png    → Logomarca com fundo transparente
├── hero-bg.jpg        → Imagem de fundo da seção Hero
└── README.md
```

---

## ▶️ Como Executar

### Opção rápida no Windows (recomendada)

Com **Node.js** e **PostgreSQL** já instalados, dê **dois cliques** em:

```text
instalar.bat
```

O script faz sozinho:

1. confere o Node.js e o PostgreSQL;
2. cria o `.env` a partir do `.env.example`;
3. pede a senha do `postgres` e a chave do Gemini (e salva no `.env`);
4. roda `npm install`;
5. cria o banco, as tabelas e os produtos (`npm run db:setup`);
6. sobe o site e abre <http://localhost:3000>.

Nas próximas vezes, use **`iniciar.bat`** — ele só liga o site.

> Deixe a janela preta aberta enquanto estiver usando. Para desligar, aperte `Ctrl+C` ou feche a janela.

### Opção manual (qualquer sistema)

#### Pré-requisitos

- **Node.js 22 ou superior** (`node --version`) — o projeto usa `--env-file-if-exists`;
- **PostgreSQL 16** instalado e com o serviço **rodando** (no Windows: serviço `postgresql-x64-16`);
- a **senha do usuário `postgres`**, definida na instalação do PostgreSQL.

1. Clone o repositório:
   ```bash
   git clone <URL-DO-REPOSITORIO>
   ```
2. Entre na pasta e instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` a partir do modelo:
   ```bash
   cp .env.example .env
   ```
4. Abra o `.env` e preencha **duas** coisas:

   **a) Chave do Google AI Studio** (gratuita em <https://aistudio.google.com/apikey>):
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

   **b) Senha do PostgreSQL** (a mesma definida na instalação do banco):
   ```env
   DB_PASSWORD=sua_senha_do_postgres
   ```

5. Crie o banco, as tabelas e os produtos iniciais:
   ```bash
   npm run db:setup
   ```
   Esse comando pode ser executado mais de uma vez: ele não apaga nem duplica nada.

6. Suba o servidor:
   ```bash
   npm start
   ```

7. Acesse <http://localhost:3000>.

> O site **precisa** ser aberto pelo servidor (`npm start`), porque o catálogo, o formulário e o chatbot usam as rotas `/api/*`. Abrir o `index.html` direto no navegador deixa o chat sem resposta e a loja sem produtos.

### Se algo não conectar

| Mensagem | Causa provável | Solução |
|---|---|---|
| `A porta 3000 já está sendo usada` | outro servidor rodando | feche o outro terminal ou troque `PORT` no `.env` |
| `Senha do usuário postgres incorreta` | `DB_PASSWORD` errada | corrija a linha no `.env` |
| `O PostgreSQL não está rodando` | serviço parado | inicie o serviço `postgresql-x64-16` |
| `bancoConectado: false` em `/api/status` | banco não criado | rode `npm run db:setup` |

---

## 🤖 Chatbot (VortexBot)

O **VortexBot** é o assistente virtual da loja e usa a **API do Google Gemini** de verdade.

- **Persona:** atendente consultivo da Vortex Tech, responde em português, em no máximo 4 frases.
- **Contexto:** recebe o catálogo real da loja (nome, categoria, preço e descrição) e recomenda produtos por perfil de uso (fotografia, jogos, bateria, trabalho).
- **Modelo padrão:** `gemini-3.5-flash-lite` — leve, rápido e com cota gratuita maior.
  Para usar outro modelo, basta trocar uma linha no `.env`:
  ```env
  # mais elaborado, porém consome a cota gratuita bem mais rápido
  GEMINI_MODEL=gemini-3.8-flash
  ```
- **Memória da conversa:** o servidor guarda o estado da conversa na própria API (`store` + `previous_interaction_id`), então o bot lembra do que já foi dito sem reenviar todo o histórico.
- **Proteções:** limite de 10 mensagens por minuto e 150 por dia por IP (configurável no `.env`), mensagens de até 500 caracteres e timeout de 25 segundos.

### Segurança da chave

A chave **nunca** vai para o navegador. O `script.js` chama `/api/chat` no próprio servidor, e é o `server.js` que conversa com o Google usando o valor de `GEMINI_API_KEY`. O arquivo `.env` está no `.gitignore`. Em produção, use também um gerenciador de segredos ou as variáveis de ambiente do serviço de hospedagem.

---

## 🗄️ Banco de Dados

Banco **PostgreSQL 16**, criado automaticamente pelo script `npm run db:setup` (que roda `db/schema.sql` e `db/seed.sql`).

### Tabelas

| Tabela | Função | Chave primária |
|---|---|---|
| `categorias` | Categorias do catálogo | `id` |
| `produtos` | Produtos da loja (FK → `categorias`) | `id` |
| `clientes` | Quem envia mensagem pelo site (e-mail único) | `id` |
| `mensagens` | Formulário de contato (FK → `clientes`, FK → `produtos`) | `id` |

São **4 tabelas**, **3 relacionamentos com chave estrangeira** (mais que o mínimo exigido) e nenhum dado fixo no JavaScript.

### O que cada parte do site usa

| Recurso | Rota | SQL |
|---|---|---|
| Catálogo da loja | `GET /api/produtos` | `JOIN` produtos + categorias, com filtro por categoria, busca `ILIKE` e `ORDER BY` |
| Formulário de contato | `POST /api/contato` | `INSERT`/`UPDATE` em `clientes` + `INSERT` em `mensagens` |
| Chatbot (catálogo) | `POST /api/chat` | `JOIN` dos produtos, com cache em memória de 60 s |
| Status | `GET /api/status` | `SELECT 1` para conferir a conexão |

Todas as consultas usam **parâmetros (`$1`, `$2`, ...)** — o valor digitado pelo usuário nunca é colado dentro do SQL.

A ordenação usa uma **lista branca** (`nome`, `menor-preco`, `maior-preco`), então o parâmetro `?ordem=` também não consegue injetar SQL.

### Consultas do relatório

O arquivo **`db/consultas.sql`** reúne, prontas para colar no pgAdmin/psql:

1. `JOIN` do catálogo com o nome da categoria;
2. filtro por categoria + busca por texto + `ORDER BY` por preço;
3. agregação por categoria (`COUNT`, `AVG`, `MIN`, `MAX`, `SUM`);
4. `JOIN` de 3 tabelas (mensagens + clientes + produtos);
5. agregação de mensagens por status.

### Índice adicional e `EXPLAIN`

A página de atendimento lista as mensagens mais novas filtrando por status. Para isso foi criado o índice:

```sql
CREATE INDEX idx_mensagens_status_criado
    ON mensagens (status, criado_em DESC);
```

Para provar o ganho, rode:

```bash
npm run db:indice
```

O script:

1. remove o índice;
2. insere **50.000 mensagens** de teste;
3. roda `EXPLAIN (ANALYZE, BUFFERS)` **antes** do índice → aparece `Seq Scan` + `Sort`;
4. cria o índice e roda de novo → aparece `Index Scan`;
5. apaga os dados de teste;
6. salva os dois planos em **`db/explain-antes-depois.txt`** (bom para anexar no relatório).

### Estrutura dos arquivos SQL

- `db/schema.sql` — tabelas, chaves, restrições (`CHECK`), índices e comentários.
- `db/seed.sql` — 4 categorias e 10 produtos. Pode rodar várias vezes sem duplicar (`ON CONFLICT`).

### Como conferir os dados salvos

No **pgAdmin**: `Servers → PostgreSQL 16 → Databases → vortex_tech → Schemas → public → Tables`. Clique com o botão direito em `mensagens` → **View/Edit Data → All Rows**.

Ou pelo terminal:

```bash
psql -U postgres -d vortex_tech -c "SELECT * FROM mensagens;"
```

Para ver as mensagens com o nome do cliente e do produto (o `JOIN` do relatório), use a consulta 4 de `db/consultas.sql`.

### Segurança

- A senha do PostgreSQL fica **somente** no `.env` (que está no `.gitignore`).
- O `.env.example` mostra os nomes das variáveis com valores de exemplo.
- Toda consulta é parametrizada e os textos são validados antes de chegar ao banco.

---

## 🎤 Roteiro de Apresentação (5 minutos)

1. Abrir <http://localhost:3000> e mostrar o layout responsivo (diminuir a janela).
2. Na **Loja**, filtrar por categoria, buscar “galaxy” e ordenar por preço.
3. Clicar em **Pedir / Comprar** e enviar o formulário.
4. No pgAdmin, mostrar a mensagem gravada em `mensagens` (com `cliente_id` e `produto_id`).
5. Abrir o **VortexBot** e perguntar o preço de um produto.
6. Rodar a consulta de agregação de `db/consultas.sql`.
7. Mostrar `db/explain-antes-depois.txt` e explicar o ganho do índice (12,8 ms → 0,118 ms).

---

## 🧪 Tecnologias Utilizadas

- HTML5 semântico
- CSS3 (variáveis, Flexbox, media queries)
- JavaScript (DOM, eventos, filtros, `fetch`)
- Node.js + Express (servidor e rotas `/api/*`)
- PostgreSQL 16 (banco de dados relacional)
- Google Gemini API (modelo `gemini-3.5-flash-lite`)
- Git e GitHub

---

## 📄 Licença

Projeto acadêmico desenvolvido para a AV3 do PIT. Uso livre para fins de estudo.
