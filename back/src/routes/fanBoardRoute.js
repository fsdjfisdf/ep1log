const express = require('express');
const router = express.Router();
const controller = require('../controllers/fanBoardController');

console.log("✅ fanBoardRoute loaded");

router.post('/fanboard', controller.createPost);
router.get('/fanboard', controller.getAllPosts);
router.delete('/fanboard/:id', controller.deletePost);

module.exports = router;
