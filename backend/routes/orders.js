const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

module.exports = (pool) => {
  const orderController = new OrderController(pool);

  router.post('/', authMiddleware, (req, res) => orderController.createOrder(req, res));
  router.get('/track/:order_id', (req, res) => orderController.trackOrder(req, res));
  router.get('/my-orders', authMiddleware, (req, res) => orderController.getUserOrders(req, res));

  return router;
};
