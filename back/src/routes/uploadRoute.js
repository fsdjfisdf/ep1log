const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 저장 경로
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 확장자
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage });

// 이미지 업로드 라우트
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 없습니다.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`; // 나중에 DB에 저장할 경로
  res.json({ imageUrl });
});

module.exports = router;
