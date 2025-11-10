const { v4: uuidv4 } = require('uuid');

class OrderController {
  constructor(pool) {
    this.pool = pool;
  }

  // إنشاء طلب جديد
  async createOrder(req, res) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { product_id, player_id, quantity = 1, payment_method } = req.body;
      const user_id = req.userId;

      // الحصول على بيانات المنتج
      const [products] = await connection.execute(
        'SELECT * FROM products WHERE id = ? AND active = 1',
        [product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'المنتج غير موجود' });
      }

      const product = products[0];
      const total_price = product.price * quantity;

      // التحقق من رصيد المحفظة إذا كان الدفع بالمحفظة
      if (payment_method === 'wallet') {
        const [users] = await connection.execute(
          'SELECT wallet_balance FROM users WHERE id = ?',
          [user_id]
        );

        if (users[0].wallet_balance < total_price) {
          await connection.rollback();
          return res.status(400).json({ error: 'رصيد المحفظة غير كافي' });
        }

        // خصم من المحفظة
        await connection.execute(
          'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
          [total_price, user_id]
        );
      }

      // إنشاء الطلب
      const order_id = uuidv4();
      const [result] = await connection.execute(
        `INSERT INTO orders (order_id, user_id, product_id, player_id, quantity, 
         total_price, payment_method, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [order_id, user_id, product_id, player_id, quantity, total_price, payment_method]
      );

      await connection.commit();

      res.status(201).json({
        message: 'تم إنشاء الطلب بنجاح',
        order: {
          id: result.insertId,
          order_id: order_id,
          product_name: product.name,
          total_price: total_price,
          status: 'pending'
        }
      });

      // بدء معالجة الطلب (سيتم تنفيذها في الخلفية)
      this.processOrder(order_id);

    } catch (error) {
      await connection.rollback();
      console.error('Create order error:', error);
      res.status(500).json({ error: 'خطأ في إنشاء الطلب' });
    } finally {
      connection.release();
    }
  }

  // معالجة الطلب (محاكاة)
  async processOrder(order_id) {
    try {
      // انتظار لمحاكاة المعالجة
      await new Promise(resolve => setTimeout(resolve, 5000));

      const [orders] = await this.pool.execute(
        'SELECT * FROM orders WHERE order_id = ?',
        [order_id]
      );

      if (orders.length > 0) {
        // 90% نجاح، 10% فشل (لمحاكاة الواقع)
        const success = Math.random() > 0.1;
        
        await this.pool.execute(
          'UPDATE orders SET status = ? WHERE order_id = ?',
          [success ? 'completed' : 'failed', order_id]
        );

        if (!success) {
          // استرجاع الرصيد إذا فشل الطلب وكان الدفع بالمحفظة
          const order = orders[0];
          if (order.payment_method === 'wallet') {
            await this.pool.execute(
              'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
              [order.total_price, order.user_id]
            );
          }
        }
      }
    } catch (error) {
      console.error('Process order error:', error);
    }
  }

  // تتبع الطلب
  async trackOrder(req, res) {
    try {
      const { order_id } = req.params;

      const [orders] = await this.pool.execute(
        `SELECT o.*, p.name as product_name, p.game, p.image 
         FROM orders o 
         JOIN products p ON o.product_id = p.id 
         WHERE o.order_id = ?`,
        [order_id]
      );

      if (orders.length === 0) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }

      res.json({ order: orders[0] });
    } catch (error) {
      console.error('Track order error:', error);
      res.status(500).json({ error: 'خطأ في السيرفر' });
    }
  }

  // الحصول على طلبات المستخدم
  async getUserOrders(req, res) {
    try {
      const user_id = req.userId;

      const [orders] = await this.pool.execute(
        `SELECT o.*, p.name as product_name, p.game, p.image 
         FROM orders o 
         JOIN products p ON o.product_id = p.id 
         WHERE o.user_id = ? 
         ORDER BY o.created_at DESC`,
        [user_id]
      );

      res.json({ orders });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({ error: 'خطأ في السيرفر' });
    }
  }
}

module.exports = OrderController;
