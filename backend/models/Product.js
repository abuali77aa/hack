class Product {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllProducts() {
    const [rows] = await this.pool.execute(
      'SELECT * FROM products WHERE active = 1'
    );
    return rows;
  }

  async getProductById(id) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM products WHERE id = ? AND active = 1',
      [id]
    );
    return rows[0];
  }

  async createProduct(productData) {
    const { name, description, price, game, category, stock } = productData;
    const [result] = await this.pool.execute(
      `INSERT INTO products (name, description, price, game, category, stock) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, game, category, stock]
    );
    return result.insertId;
  }
}

module.exports = Product;
