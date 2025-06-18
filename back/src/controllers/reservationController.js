const dao = require('../dao/reservationDao');

exports.createReservation = async (req, res) => {
    console.log("📩 POST /api/reservation hit");
  try {
    await dao.insertReservation(req.body);
    res.status(200).json({ message: 'Reservation saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
