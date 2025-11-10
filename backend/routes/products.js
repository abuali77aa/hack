const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = req.app.get('dbPool');
    const Product = require('../models/Product');
    const productModel = new Product(pool);
    
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.get('dbPool');
    const Product = require('../models/Product');
    const productModel = new Product(pool);
    
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;
