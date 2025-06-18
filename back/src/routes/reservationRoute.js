const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');

router.post('/reservation', controller.createReservation);

module.exports = router;
