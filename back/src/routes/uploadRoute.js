const express = require('express');
const router = express.Router();
const controller = require('../controllers/uploadController');

router.post('/image', controller.uploadImage, controller.saveImageUrl);

module.exports = router;
