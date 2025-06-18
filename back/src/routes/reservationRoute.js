const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
console.log("✅ reservationRoute loaded");

router.post('/reservation', controller.createReservation);


router.get('/reservations', controller.getAllReservations);
router.patch('/reservations/:id', controller.approveReservation);

module.exports = router;