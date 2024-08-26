const express = require("express");
require("dotenv").config();
const { NoLlame, Op } = require("./sql");
const app = express();
const port = process.env.PORT || 3000;

app.get("/search/:number", (req, res) => {
  const number = req.params["number"];
  NoLlame.findAll({
    where: {
      numero_s: {
        [Op.like]: `%${number}%`, // Para números que terminan con '092095737'
      },
    },
  })
    .then((v) => {
      return res.json(v.map((e) => e.dataValues));
    })
    .catch((err) => res.json({ err }));
});

app.get("/exist/:number", (req, res) => {
  const number = req.params["number"];
  NoLlame.findOne({
    where: {
      numero_s: {
        [Op.like]: `%${number}%`, // Para números que terminan con '092095737'
      },
    },
  })
    .then((v) => {
      const exists = !!v;
      return res.json({ exists });
    })
    .catch((err) => res.json({ err }));
});

app.get("/add/:number", (req, res) => {
  const number = req.params["number"];
  NoLlame.create({
    numero_s: number,
  });
});

app.get("/", (req, res) => {
  NoLlame.findAll()
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
