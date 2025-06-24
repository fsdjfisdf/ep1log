const pool = require('../../config/database');

// 구매 요청 등록
exports.createPurchase = async ({ product_id, buyer_name, phone, address, message }) => {
  const sql = `
    INSERT INTO purchases (product_id, buyer_name, phone, address, message)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [product_id, buyer_name, phone, address, message]);
};
