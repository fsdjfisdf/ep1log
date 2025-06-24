const pool = require('../../config/database');
const bcrypt = require('bcrypt');

const insertPost = async ({ writer_name, password, content, reply_to, is_secret, ip_address }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO fan_board (writer_name, password, content, reply_to, is_secret, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return pool.execute(sql, [writer_name, hashedPassword, content, reply_to || null, is_secret || false, ip_address || null]);
};

const getAllPosts = async () => {
  const sql = `
    SELECT id, writer_name, content, created_at, reply_to, is_secret
    FROM fan_board
    WHERE is_deleted = FALSE
    ORDER BY created_at DESC
  `;
  return pool.execute(sql);
};

const deletePost = async (id, password) => {
  try {
    const [rows] = await pool.execute(`SELECT password FROM fan_board WHERE id = ?`, [id]);
    if (rows.length === 0) return false;

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) return false;

    await pool.execute(`UPDATE fan_board SET is_deleted = TRUE WHERE id = ?`, [id]);
    return true;
  } catch (err) {
    console.error('❌ deletePost error:', err);
    throw err;
  }
};

module.exports = {
  insertPost,
  getAllPosts,
  deletePost
};
