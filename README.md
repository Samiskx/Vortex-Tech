# Vortex Tech — Loja de Celulares e Eletrônicos

Projeto desenvolvido para a 3ª Avaliação Interdisciplinar (AV3) das disciplinas de **Desenvolvimento Web para IA** (Prof. MSc. Tiago Martins Ribeiro) e **Banco de Dados** (Prof. Gabriel) — Turno Manhã (PIT — Instituto de Tecnologia, Faculdade Estadual do Piauí).

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
├── .env.example             -> Modelo das variáveis de ambiente (DATABASE_URL, GEMINI_API_KEY)
├── .gitignore               -> Blindagem contra envio de .env e node_modules para o GitHub
├── instalar.bat             -> Script para instalar dependências em 1 clique
├── iniciar.bat              -> Script de execução rápida (inicia servidor e abre navegador)
└── README.md                -> Documentação principal do repositório
```

---

## 🤖 Chatbot Inteligente — VortexBot (Google Gemini)

O assistente virtual **VortexBot** atende os clientes na loja com foco total em produtos de tecnologia:
* **Persona:** Especialista amigável e objetivo em celulares, fones e smartwatches.
* **Catálogo Ativo:** Conhece todos os aparelhos cadastrados no banco com seus respectivos preços.
* **Salvaguarda de Contexto (Obrigatória):** Recusa educadamente perguntas aleatórias ou fora do tema da loja (ex.: receitas culinárias, placares de jogos, fofocas), mantendo estrita conformidade com o regulamento do seminário.

---

## 🗄️ Banco de Dados (PostgreSQL)

* **4 Tabelas Relacionais:** `categorias`, `produtos`, `clientes` e `mensagens`.
* **Integridade Referencial:** 3 chaves estrangeiras com ações `ON DELETE RESTRICT`, `CASCADE` e `SET NULL`.
* **Normalização:** Atende rigorosamente até a 3ª Forma Normal (3FN).
* **Consultas:** Prontas no arquivo `database/consultas.sql`.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js** (versão 22 ou superior instalada na máquina)
- Conexão com a internet (para a API do Google Gemini)

### 2. Configurar o `.env`
Crie um arquivo `.env` na raiz do projeto (baseando-se no `.env.example`) com a sua chave do Google Gemini:
```env
PORT=3000
GEMINI_API_KEY=sua_chave_do_google_ai_studio
```

### 3. Iniciar o Projeto (1 Clique)
Basta dar dois cliques no arquivo **`iniciar.bat`** na raiz da pasta.  
O terminal instalará as dependências caso necessário, iniciará o servidor e abrirá automaticamente o navegador em:
**http://localhost:3000**
