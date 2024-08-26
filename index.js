const express = require("express");
require("dotenv").config();
const { queries } = require("./sql");
const app = express();
const port = process.env.PORT || 3000;

app.get("/search/:number", (req, res) => {
  const number = req.params["number"];
  queries
    .findByNumber(number)
    .then((v) => {
      return res.json(v.map((e) => e.dataValues));
    })
    .catch((err) => res.json({ err }));
});

app.get("/exist/:number", (req, res) => {
  const number = req.params["number"];
  queries
    .existByNumber(number)
    .then((v) => {
      const exists = !!v;
      return res.json({ exists });
    })
    .catch((err) => res.json({ err }));
});

app.get("/add/:number", (req, res) => {
  const number = req.params["number"];
  queries.add(number);
});

app.get("/", (req, res) => {
  queries
    .findAll()
    .then((v) => {
      return res.json(v.map((e) => e.dataValues));
    })
    .catch((err) => res.json({ err }));
});

async function init() {
  console.log(`Starting Sequelize + Express example on port ${port}...`);

  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

init();

module.exports = app;
