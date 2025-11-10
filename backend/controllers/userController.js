const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class UserController {
  constructor(pool) {
    this.pool = pool;
  }

  // تسجيل مستخدم جديد
  async register(req, res) {
    try {
      const { username, email, password, phone } = req.body;
      
      // التحقق من وجود المستخدم
      const [existing] = await this.pool.execute(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'المستخدم موجود مسبقاً' });
      }

      // تشفير كلمة المرور
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // إنشاء المستخدم
      const [result] = await this.pool.execute(
        `INSERT INTO users (username, email, password_hash, phone, referral_code) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, phone, uuidv4().substring(0, 8)]
      );

      // إنشاء token
      const token = jwt.sign(
        { userId: result.insertId, email: email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        token,
        user: {
          id: result.insertId,
          username,
          email,
          wallet_balance: 0.00
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'خطأ في السيرفر' });
    }
  }

  // تسجيل الدخول
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const [users] = await this.pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      res.json({
        message: 'تم تسجيل الدخول بنجاح',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          wallet_balance: user.wallet_balance
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'خطأ في السيرفر' });
    }
  }

  // الحصول على بيانات المستخدم
  async getProfile(req, res) {
    try {
      const userId = req.userId;
      
      const [users] = await this.pool.execute(
        `SELECT id, username, email, phone, wallet_balance, referral_code, 
                created_at FROM users WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'المستخدم غير موجود' });
      }

      // الحصول على طلبات المستخدم
      const [orders] = await this.pool.execute(
        `SELECT o.*, p.name as product_name, p.game 
         FROM orders o 
         JOIN products p ON o.product_id = p.id 
         WHERE o.user_id = ? 
         ORDER BY o.created_at DESC 
         LIMIT 10`,
        [userId]
      );

      res.json({
        user: users[0],
        recent_orders: orders
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: 'خطأ في السيرفر' });
    }
  }
}

module.exports = UserController;
