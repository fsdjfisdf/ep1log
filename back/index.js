const express = require("./config/express");
const app = express();
const { logger } = require("./config/winston");

const port = 3001;

app.listen(port, () => {
  logger.info(`🚀 API Server started on http://localhost:${port}`);
});
