const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const path = require("path");

module.exports = function () {
  const app = express();

  /* 미들웨어 설정 */
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(cors());

  // 정적 파일 제공
  app.use(express.static(path.join(__dirname, "../../front")));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));  // ✅ 업로드 이미지 제공 경로

  // 메인 페이지
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front/index.html"));
  });

  // 라우트 모듈 연결
  require("../src/routes/indexRoute")(app);

  const reservationRoute = require("../src/routes/reservationRoute");
  app.use("/api", reservationRoute);

  const fanBoardRoute = require('../src/routes/fanBoardRoute');
  app.use('/api', fanBoardRoute);

  const storeRoute = require('../src/routes/storeRoute');
  app.use('/api', storeRoute);

  const uploadRoute = require('../src/routes/uploadRoute');
  app.use('/api', uploadRoute);  // ✅ 반드시 있어야 함

  return app; // 중요: app 반환
};
