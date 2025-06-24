const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/products', storeController.getAllProducts);
router.get('/products/:id', storeController.getProductDetails);
router.post('/products', storeController.registerProduct);
router.post('/purchase', storeController.requestPurchase);

module.exports = router;
