const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
console.log("✅ reservationRoute loaded");

router.post('/reservation', controller.createReservation);

module.exports = router;
