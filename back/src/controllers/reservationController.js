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

// 목록 조회
exports.getAllReservations = async (req, res) => {
  try {
    const [rows] = await require('../dao/reservationDao').getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '조회 실패' });
  }
};

// 상태 변경
exports.approveReservation = async (req, res) => {
  const id = req.params.id;
  try {
    await require('../dao/reservationDao').approve(id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '승인 실패' });
  }
};
