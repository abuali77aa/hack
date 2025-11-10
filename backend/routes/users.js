const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

module.exports = (pool) => {
  const userController = new UserController(pool);

  router.post('/register', (req, res) => userController.register(req, res));
  router.post('/login', (req, res) => userController.login(req, res));
  router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));

  return router;
};
