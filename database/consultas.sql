-- =========================================================
-- VORTEX TECH — CONSULTAS DO PROJETO
-- =========================================================
-- Estas são as consultas que o site usa (ou equivalentes).
-- Rode uma de cada vez no pgAdmin/psql para mostrar no relatório.
-- =========================================================


-- ---------------------------------------------------------
-- 1) JOIN: catálogo com o nome da categoria
--    Usada pela página da loja (GET /api/produtos).
-- ---------------------------------------------------------
SELECT
    p.id,
    p.nome,
    p.preco,
    p.estoque,
    c.nome AS categoria
FROM produtos p
INNER JOIN categorias c ON c.id = p.categoria_id
WHERE p.ativo = TRUE
ORDER BY p.nome;


-- ---------------------------------------------------------
-- 2) FILTRO + ORDENAÇÃO: só smartphones, do mais barato ao mais caro
--    Exemplo de busca por texto + filtro por categoria + ORDER BY.
-- ---------------------------------------------------------
SELECT
    p.nome,
    p.preco,
    c.nome AS categoria
FROM produtos p
INNER JOIN categorias c ON c.id = p.categoria_id
WHERE p.ativo = TRUE
  AND c.slug = 'smartphones'
  AND (p.nome ILIKE '%galaxy%' OR p.descricao ILIKE '%galaxy%')
ORDER BY p.preco ASC;


-- ---------------------------------------------------------
-- 3) AGREGAÇÃO: resumo por categoria
--    (quantidade, preço médio, mais barato, mais caro, estoque)
-- ---------------------------------------------------------
SELECT
    c.nome              AS categoria,
    COUNT(p.id)         AS quantidade,
    ROUND(AVG(p.preco), 2) AS preco_medio,
    MIN(p.preco)        AS mais_barato,
    MAX(p.preco)        AS mais_caro,
    SUM(p.estoque)      AS itens_em_estoque
FROM categorias c
INNER JOIN produtos p ON p.categoria_id = c.id
WHERE p.ativo = TRUE
GROUP BY c.nome
ORDER BY quantidade DESC;


-- ---------------------------------------------------------
-- 4) JOIN com 3 tabelas: mensagens recebidas pelo formulário
--    Mostra o cliente, o produto (se houver) e a data.
-- ---------------------------------------------------------
SELECT
    m.id,
    c.nome       AS cliente,
    c.email,
    m.assunto,
    p.nome       AS produto,
    m.status,
    m.criado_em
FROM mensagens m
INNER JOIN clientes c ON c.id = m.cliente_id
LEFT JOIN produtos p ON p.id = m.produto_id
ORDER BY m.criado_em DESC
LIMIT 20;


-- ---------------------------------------------------------
-- 5) AGREGAÇÃO: quantas mensagens existem em cada status
-- ---------------------------------------------------------
SELECT
    status,
    COUNT(*) AS total
FROM mensagens
GROUP BY status
ORDER BY total DESC;


-- ---------------------------------------------------------
-- 6) Update simples de atendimento (usado pela equipe)
--    Trocar 1 pelo id da mensagem.
-- ---------------------------------------------------------
UPDATE mensagens
SET status = 'respondido'
WHERE id = 1;
