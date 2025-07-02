const pool = require('../../config/database');

// 전체 제품 목록 조회
exports.getAllProducts = async () => {
  const sql = `SELECT id, name, price, image_urls, description FROM products`;
  const [rows] = await pool.execute(sql);

  // image_urls를 JSON으로 파싱
  return rows.map(row => ({
    ...row,
    image_urls: row.image_urls ? JSON.parse(row.image_urls) : []
  }));
};

// 특정 제품 상세 정보 조회
exports.getProductById = async (id) => {
  const sql = `SELECT * FROM products WHERE id = ?`;
  const [rows] = await pool.execute(sql, [id]);

  const row = rows[0];
  if (row && row.image_urls) {
    row.image_urls = JSON.parse(row.image_urls);
  }

  return row;
};

// 상품 등록
exports.createProduct = async ({ name, price, description, image_urls }) => {
  const sql = `
    INSERT INTO products (name, price, description, image_urls)
    VALUES (?, ?, ?, ?)
  `;
  await pool.execute(sql, [name, price, description, image_urls]);
};