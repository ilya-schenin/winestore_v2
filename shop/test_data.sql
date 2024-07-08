-- Вставка данных в таблицу shop_country
INSERT INTO shop_country (id, name) VALUES
('1', 'France'),
('2', 'Germany');

-- Вставка данных в таблицу shop_category
INSERT INTO shop_category (id, name, slug, parent_id, npp) VALUES
('1', 'Wine', 'wine', NULL, 1),
('2', 'Beer', 'beer', NULL, 2),
('3', 'Red Wine', 'red-wine', '1', 3);

-- Вставка данных в таблицу shop_color_vine
INSERT INTO shop_color_vine (id, name) VALUES
('1', 'Red'),
('2', 'White');

-- Вставка данных в таблицу shop_color_beer
INSERT INTO shop_color_beer (id, name) VALUES
('1', 'Dark'),
('2', 'Light');

-- Вставка данных в таблицу shop_sugar
INSERT INTO shop_sugar (id, name) VALUES
('1', 'Dry'),
('2', 'Sweet');

-- Вставка данных в таблицу shop_product
INSERT INTO shop_product (
    id, name, slug, volume, description, price, strenght, npp,
    category_id, country_id, color_vine_id, color_beer_id, sugar_id
) VALUES
('1', 'Chateau Margaux', 'chateau-margaux', 0.75, 'A famous red wine from France.', 250.00, 13.5, 1,
    '3', '1', '1', NULL, '1'),
('2', 'Heineken', 'heineken', 0.5, 'Popular light beer from Netherlands.', 2.50, 5.0, 2,
    '2', '2', NULL, '2', NULL);