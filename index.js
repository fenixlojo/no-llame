const express = require("express");
require("dotenv").config();
const routes = require("./routes/routes");
const app = express();
const port = process.env.PORT || 3000;

app.use("/api", routes);

async function init() {
  console.log(`Starting Sequelize + Express example on port ${port}...`);

  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

init();

module.exports = app;
