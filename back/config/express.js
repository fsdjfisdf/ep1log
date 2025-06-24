const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");
const path = require("path");


module.exports = function () {
  const app = express();

  /* 미들웨어 설정 */
  app.use(compression()); // HTTP 요청을 압축 및 해제
  app.use(express.json()); // body값을 파싱
  app.use(express.urlencoded({ extended: true })); // form 으로 제출되는 값 파싱
  app.use(methodOverride()); // put, delete 요청 처리
  app.use(cors()); // 웹브라우저 cors 설정을 관리
  app.use(express.static(path.join(__dirname, "../../front")));
  // app.use(express.static(process.cwd() + '/public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/index.html"));
});

  /* 직접 구현해야 하는 모듈 */
  require("../src/routes/indexRoute")(app);
const reservationRoute = require("../src/routes/reservationRoute");
app.use("/api", reservationRoute);  // ✅ 이렇게 고쳐야 함

// index.js 또는 express.js 설정 파일에 추가
const fanBoardRoute = require('../src/routes/fanBoardRoute');
app.use('/api', fanBoardRoute);

const storeRoute = require('../src/routes/storeRoute');
app.use('/api', storeRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadRoute = require('../src/routes/uploadRoute');
app.use('/api', uploadRoute);  // ✅ 이 줄이 반드시 있어야 함
app.use('/uploads', express.static('uploads'));





  return app;
};
