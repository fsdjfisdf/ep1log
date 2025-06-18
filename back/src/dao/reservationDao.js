const db = require("../../config/database");

exports.insertReservation = ({ name, people_count, age_group, favorite_member, address, amount }) => {
  const sql = `
    INSERT INTO reservations (name, people_count, age_group, favorite_member, address, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [name, people_count, age_group, favorite_member, address, amount]);
};

exports.getAll = () => {
  const sql = `SELECT * FROM reservations ORDER BY created_at DESC`;
  return db.execute(sql);
};

exports.approve = (id) => {
  const sql = `UPDATE reservations SET status = 'completed' WHERE id = ?`;
  return db.execute(sql, [id]);
};
