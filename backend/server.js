const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connection to database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gaming_site',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// create connection pool
const pool = mysql.createPool(dbConfig);

// routes with pool injection
app.use('/api/users', require('./routes/users')(pool));
app.use('/api/products', require('./routes/products')(pool));
app.use('/api/orders', require('./routes/orders')(pool));

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'الخادم يعمل بشكل طبيعي' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'الصفحة غير موجودة' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في السيرفر' });
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
