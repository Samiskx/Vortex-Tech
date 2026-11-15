-- =========================================================
-- VORTEX TECH — DADOS INICIAIS (catálogo da loja)
-- =========================================================
-- Pode rodar quantas vezes quiser: não duplica nada.
-- Execute com: npm run db:setup
-- =========================================================

-- ---------------------------------------------------------
-- CATEGORIAS
-- ---------------------------------------------------------
INSERT INTO categorias (nome, slug, descricao) VALUES
    ('Smartphones',    'smartphones',  'Celulares e smartphones 5G'),
    ('Smartwatches',   'smartwatches', 'Relógios inteligentes'),
    ('Fones & Áudio',  'audio',        'Fones de ouvido e caixas de som'),
    ('Acessórios',     'acessorios',   'Carregadores, power banks e mais')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------
-- PRODUTOS
-- Cada INSERT busca o id da categoria pelo slug.
-- ---------------------------------------------------------
INSERT INTO produtos (categoria_id, nome, descricao, preco, estoque, imagem) VALUES
    ((SELECT id FROM categorias WHERE slug = 'smartphones'), 'Galaxy S24 Ultra 5G',
     'Tela 6.8" AMOLED 120Hz, Snapdragon 8 Gen 3, Câmera 200MP e caneta S-Pen integrada.', 5899.00, 10, 'img/galaxy-s24-ultra.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'smartphones'), 'iPhone 15 Pro Max',
     'Chip A17 Pro, chassi em titânio, tela Super Retina XDR de 6.7" e câmeras cinematográficas.', 6499.00, 8, 'img/iphone-15-pro-max.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'smartphones'), 'Xiaomi 14 Ultra',
     'Lentes Leica profissionais, Snapdragon 8 Gen 3 e carregamento ultra rápido de 90W.', 4699.00, 12, 'img/xiaomi-14-ultra.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'smartphones'), 'Galaxy A55 5G',
     'Design premium em metal e vidro, tela Super AMOLED 120Hz e bateria de 5.000mAh.', 1999.00, 25, 'img/galaxy-a55.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'smartwatches'), 'Apple Watch Series 9',
     'Gesto de dois toques, monitoramento avançado de ECG, oxigênio no sangue e tela brilhante.', 2999.00, 15, 'img/apple-watch-9.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'smartwatches'), 'Galaxy Watch 6 Pro',
     'Caixa em titânio, GPS de alta precisão, análise corporal por bioimpedância e bateria duradoura.', 1399.00, 20, 'img/galaxy-watch-6.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'audio'), 'AirPods Pro (2ª Geração)',
     'Cancelamento Ativo de Ruído até 2x melhor, Áudio Espacial personalizado e estojo MagSafe.', 1799.00, 30, 'img/airpods-pro-2.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'audio'), 'Headphone Sony WH-1000XM5',
     'Referência mundial em cancelamento de ruído, som Hi-Res cristalino e até 30h de bateria.', 2299.00, 18, 'img/sony-wh1000xm5.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'acessorios'), 'Carregador Turbo GaN 67W',
     'Carregador ultrarrápido com 3 portas (2x USB-C + 1x USB-A) para celulares e notebooks.', 149.00, 50, 'img/carregador-gan.jpg'),

    ((SELECT id FROM categorias WHERE slug = 'acessorios'), 'Power Bank 20.000mAh 22.5W',
     'Bateria externa de alta capacidade com suporte a Quick Charge e Power Delivery bidirecional.', 199.00, 40, 'img/power-bank.jpg')
ON CONFLICT (nome) DO UPDATE SET
    preco     = EXCLUDED.preco,
    descricao = EXCLUDED.descricao,
    estoque   = EXCLUDED.estoque,
    imagem    = EXCLUDED.imagem;
