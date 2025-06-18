const { pool } = require("../../config/database");

exports.insertReservation = ({ name, people_count, age_group, favorite_member, address, amount }) => {
  const sql = `
    INSERT INTO reservations (name, people_count, age_group, favorite_member, address, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return pool.execute(sql, [name, people_count, age_group, favorite_member, address, amount]);
};

exports.getAll = () => {
  const sql = `SELECT * FROM reservations ORDER BY created_at DESC`;
  return pool.execute(sql);
};

exports.approve = (id) => {
  const sql = `UPDATE reservations SET status = 'completed' WHERE id = ?`;
  return pool.execute(sql, [id]);
};

exports.getReservationStatus = async ({ name, age_group }) => {
  const sql = `
    SELECT status, people_count, favorite_member, address
    FROM reservations
    WHERE name = ? AND age_group = ?
    ORDER BY id DESC
    LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [name, age_group]);
  return rows[0];
};
