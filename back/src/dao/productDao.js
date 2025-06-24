const pool = require('../../config/database');

// 전체 제품 목록 조회
exports.getAllProducts = async () => {
  const sql = `SELECT id, name, price, image_url FROM products`;
  const [rows] = await pool.execute(sql);
  return rows;
};

// 특정 제품 상세 정보 조회
exports.getProductById = async (id) => {
  const sql = `SELECT * FROM products WHERE id = ?`;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};
