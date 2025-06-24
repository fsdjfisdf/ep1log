const express = require('express');
const router = express.Router();
const controller = require('../controllers/fanBoardController');


console.log('✅ fanBoardRoute loaded');

router.post('/fanboard', controller.createPost); // ✅ createPost 정의돼 있어야 함
router.get('/fanboard', controller.getAllPosts);
router.delete('/fanboard/:id', controller.deletePost);

module.exports = router;
