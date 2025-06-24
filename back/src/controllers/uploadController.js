const multer = require('multer');
const path = require('path');

// 저장 위치와 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

exports.uploadImage = upload.single('image');  // 'image'는 input name
exports.saveImageUrl = (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: filePath });
};
