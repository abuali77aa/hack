-- تحديث جدول المستخدمين
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN referral_code VARCHAR(10) UNIQUE,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- تحديث جدول الطلبات
ALTER TABLE orders 
ADD COLUMN order_id VARCHAR(50) UNIQUE,
ADD COLUMN payment_method ENUM('wallet', 'credit_card', 'crypto') DEFAULT 'wallet',
ADD COLUMN player_id VARCHAR(100) NOT NULL,
MODIFY status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending';

-- تحديث جدول المنتجات
ALTER TABLE products 
ADD COLUMN image VARCHAR(255),
ADD COLUMN description TEXT;

-- تحديث بيانات المنتجات
UPDATE products SET 
image = '/images/pubg-uc.jpg',
description = '60 UC for PUBG Mobile - شحن فوري' 
WHERE name = 'UC PUBG 60';

UPDATE products SET 
image = '/images/tiktok-coins.jpg', 
description = '100 TikTok Coins - لعمل الهدايا والميزات المميزة' 
WHERE name = 'تيك توك 100 عملة';

UPDATE products SET 
image = '/images/freefire-diamonds.jpg',
description = '100 Free Fire Diamonds - للشراء داخل اللعبة' 
WHERE name = 'ألماس فري فاير 100';

-- إضافة منتجات جديدة
INSERT INTO products (name, description, price, game, category, stock, image) VALUES
('ببجي 325 UC', '325 UC for PUBG Mobile - أفضل عروض الكمية', 45.00, 'pubg', 'coins', 150, '/images/pubg-325.jpg'),
('تيك توك 500 عملة', '500 TikTok Coins - حزمة متميزة', 22.00, 'tiktok', 'coins', 300, '/images/tiktok-500.jpg'),
('فري فاير 500 ألماس', '500 Free Fire Diamonds - عروض حصرية', 65.00, 'freefire', 'diamonds', 200, '/images/freefire-500.jpg'),
('Mobile Legends 100 Diamond', '100 Diamonds for Mobile Legends', 12.00, 'mobile_legends', 'diamonds', 180, '/images/ml-100.jpg');
