CREATE DATABASE IF NOT EXISTS gaming_site;
USE gaming_site;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    game VARCHAR(50) NOT NULL,
    category ENUM('coins', 'diamonds', 'subscription', 'credit'),
    stock INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed'),
    player_id VARCHAR(100),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- بيانات أولية
INSERT INTO products (name, description, price, game, category, stock) VALUES
('UC PUBG 60', '60 UC for PUBG Mobile', 10.00, 'pubg', 'coins', 100),
('تيك توك 100 عملة', '100 TikTok Coins', 5.00, 'tiktok', 'coins', 200),
('ألماس فري فاير 100', '100 Free Fire Diamonds', 15.00, 'freefire', 'diamonds', 150);
