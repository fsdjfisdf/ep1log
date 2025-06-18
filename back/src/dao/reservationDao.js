const db = require("../../config/database");

exports.insertReservation = ({ name, people_count, age_group, favorite_member, address, amount }) => {
  const sql = `
    INSERT INTO reservations (name, people_count, age_group, favorite_member, address, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [name, people_count, age_group, favorite_member, address, amount]);
};
