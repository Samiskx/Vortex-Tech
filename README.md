# Vortex Tech — Loja de Celulares e Eletrônicos

Projeto desenvolvido para a 3ª Avaliação Interdisciplinar (AV3) das disciplinas de **Desenvolvimento Web para IA** (Prof. MSc. Tiago Martins Ribeiro) e **Banco de Dados** (Prof. Gabriel Alencar Vale) — Turno Manhã (PIT — Instituto de Tecnologia, Faculdade Estadual do Piauí).

---

## 📌 Sobre o projeto

O **Vortex Tech** é um site institucional e de vendas de uma loja fictícia de celulares, smartwatches, fones e acessórios de tecnologia. O sistema permite:

* apresentar a loja e os produtos em destaque;
* consultar o catálogo completo, com busca, filtro por categoria e ordenação por preço;
* enviar pedidos e mensagens pelo formulário de contato;
* conversar com o **VortexBot**, um assistente virtual integrado à API do Google Gemini.

O front-end roda no navegador, o back-end em Node.js/Express atende as rotas da API e o PostgreSQL guarda categorias, produtos, clientes e mensagens.

**Deploy:** não há aplicação publicada em serviço de hospedagem. O sistema é executado localmente e fica disponível em `http://localhost:3000`.

---

## 🧰 Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Front-end | HTML5, CSS3 (Flexbox e media queries) e JavaScript puro |
| Back-end | Node.js 22 ou superior com Express 5 |
| Banco de dados | PostgreSQL 16 (driver `pg`) |
| Inteligência Artificial | Google Gemini — Interactions API, modelo `gemini-3.5-flash-lite` (configurável) |
| Ferramentas | Git e GitHub |

---

## 👥 Integrantes

- **Arthur Gabriel**
- **Savyo Vyctor**
- **Vinicius Vieira**

---

## 📂 Estrutura de Arquivos e Repositório GitHub

O repositório segue rigorosamente o padrão modular e limpo exigido:

```
📁 vortex-tech/
├── 📁 frontend/             -> Arquivos visuais (HTML com Flexbox, CSS responsivo e JS)
│   ├── index.html           (Página principal: hero, sobre, destaques, contato e chatbot)
│   ├── loja.html            (Catálogo completo da loja)
│   ├── style.css            (Design moderno e responsivo com Flexbox)
│   ├── script.js            (Envio do formulário assíncrono e controle do chatbot)
│   ├── loja.js              (Consumo da API REST e filtros dinâmicos de produtos)
│   ├── img/                 (Fotos locais de smartphones, smartwatches, fones e acessórios)
│   ├── hero-bg.jpg          (Banner da seção principal)
│   └── logo-vortex.png      (Logotipo oficial transparente da loja)
│
├── 📁 backend/              -> Código-fonte do servidor Node.js/Express e rotas da API
│   ├── server.js            (Servidor Express com rotas /api/produtos, /api/contato e /api/chat)
│   ├── setup.js             (Cria o banco e executa o database/script.sql: npm run setup)
│   ├── package.json         (Lista de dependências: express e pg)
│   └── package-lock.json    (Versões travadas das dependências)
│
├── 📁 database/             -> Modelagem e scripts do Banco de Dados PostgreSQL
│   ├── script.sql           (Script SQL limpo de criação das 4 tabelas + carga inicial de dados fictícios)
│   ├── der.png              (Diagrama Entidade-Relacionamento do banco de dados)
│   ├── consultas.sql        (Consultas analíticas com JOIN, GROUP BY, HAVING, COUNT, AVG, MIN, MAX)
│   └── esquema.md           (Documentação do esquema relacional 3FN e dicionário de dados)
│
├── .env.example             -> Modelo das variáveis de ambiente (Gemini e PostgreSQL)
├── .gitignore               -> Blindagem contra envio de .env e node_modules para o GitHub
├── instalar.bat             -> Script para instalar dependências em 1 clique
├── iniciar.bat              -> Script de execução rápida (inicia servidor e abre navegador)
└── README.md                -> Documentação principal do repositório
```

---

## 🤖 Chatbot Inteligente — VortexBot (Google Gemini)

O assistente virtual **VortexBot** atende os clientes na loja com foco total em produtos de tecnologia:

* **Persona:** especialista amigável e objetivo em celulares, smartwatches, fones de ouvido e acessórios da Vortex Tech.
* **Tom de voz:** educado, claro e conciso, em português do Brasil, com respostas de no máximo 3 a 4 frases.
* **Contexto:** a cada pergunta, o servidor lê do banco o catálogo de produtos ativos (nome, categoria, preço e descrição) e envia esses dados ao modelo; se o PostgreSQL estiver indisponível, usa um catálogo padrão em memória para não deixar o chat sem resposta.
* **Regras de atendimento:** recomenda apenas produtos do catálogo, com os respectivos preços; para comprar, orienta o cliente a usar a página **Loja** ou o formulário de contato; e recusa educadamente qualquer assunto fora da loja (culinária, esportes, política, conhecimentos gerais etc.), convidando o visitante a conhecer os produtos.
* **Configuração:** modelo definido por `GEMINI_MODEL` (padrão `gemini-3.5-flash-lite`) e chave em `GEMINI_API_KEY`, lida do `.env` apenas no servidor.

---

## 🗄️ Banco de Dados (PostgreSQL)

* **4 Tabelas Relacionais:** `categorias`, `produtos`, `clientes` e `mensagens`.
* **Integridade Referencial:** 3 chaves estrangeiras com ações `ON DELETE RESTRICT`, `CASCADE` e `SET NULL`.
* **Normalização:** Atende rigorosamente até a 3ª Forma Normal (3FN).
* **Consultas:** Prontas no arquivo `database/consultas.sql`.

### Artefatos de banco de dados e API no repositório

* **Diagrama Entidade-Relacionamento (DER):** `database/der.png`
* **Script de criação e povoamento** (4 tabelas + dados fictícios): `database/script.sql`
* **Consultas analíticas:** `database/consultas.sql`
* **Esquema relacional 3FN e dicionário de dados:** `database/esquema.md`
* **API que consome o banco:** `backend/server.js`
* **Criação automática da base e execução do script:** `backend/setup.js` (`npm run setup`)

---

## ✅ Funcionalidades principais

* **Página inicial:** cabeçalho com logomarca e menu, seção de destaque (hero), apresentação da loja, produtos em destaque, formulário de contato e botão flutuante do chatbot.
* **Catálogo (`loja.html`):** lista os produtos ativos com imagem, categoria, descrição e preço em reais.
* **Busca e filtros:** pesquisa por nome ou descrição, filtro por categoria e ordenação por nome, menor preço ou maior preço.
* **Formulário de contato e pedido:** grava o cliente e a mensagem no banco; quando o visitante escolhe um produto, o pedido é vinculado a ele.
* **Chatbot VortexBot:** assistente virtual no canto da tela, com contexto do catálogo e regras de atendimento.
* **Layout responsivo:** adaptado a computador, tablet e celular.

---

## 🚀 Como executar o projeto localmente

### 1. Pré-requisitos

* **Node.js 22 ou superior** instalado;
* **PostgreSQL 16** instalado e em execução;
* Conexão com a internet (para a API do Google Gemini).

### 2. Instalar as dependências

No Windows, basta dar dois cliques em **`instalar.bat`**: ele cria o `.env` a partir do `.env.example`, instala as dependências e executa a configuração do banco.

Manualmente, na raiz do projeto:

```bash
npm --prefix backend install
```

### 3. Configurar o arquivo `.env`

Copie o `.env.example` para `.env`, na raiz do projeto, e preencha os valores da sua máquina:

```env
# Chave oficial da API do Google Gemini (obter no Google AI Studio)
GEMINI_API_KEY=sua_chave_do_google_ai_studio
GEMINI_MODEL=gemini-3.5-flash-lite

# Porta do servidor
PORT=3000

# Banco de dados PostgreSQL (local ou nuvem como Neon/Supabase)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=suasenha
DB_NAME=vortex_tech
```

O arquivo `.env` não é enviado ao GitHub (está no `.gitignore`).

### 4. Criar o banco e carregar os dados

O comando abaixo cria o banco `vortex_tech` (se ainda não existir) e executa o `database/script.sql`, que cria as 4 tabelas e insere as 4 categorias e os 10 produtos fictícios:

```bash
npm --prefix backend run setup
```

Também é possível fazer manualmente, com o `psql`:

```bash
psql -U postgres -c "CREATE DATABASE vortex_tech;"
psql -U postgres -d vortex_tech -f database/script.sql
```

### 5. Iniciar o servidor

No Windows, dê dois cliques em **`iniciar.bat`**. Ou, manualmente:

```bash
npm --prefix backend start
```

Depois, abra o navegador em **http://localhost:3000**. Mantenha o terminal aberto enquanto usa o site; para encerrar, pressione `Ctrl+C`.

### Resumo dos comandos

```bash
npm --prefix backend install
npm --prefix backend run setup
npm --prefix backend start
```
