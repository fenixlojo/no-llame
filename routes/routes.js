const express = require("express");
const queries = require("../controllers/controller");
const router = express.Router();

router.get("/search/:number", (req, res) => {
  try {
    const number = req.params["number"];
    queries
      .findByNumber(number)
      .then((v) => {
        return res.json(v.map((e) => e.dataValues));
      })
      .catch((err) => res.json({ err }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el número" });
  }
});

router.get("/exist/:number", (req, res) => {
  try {
    const number = req.params["number"];
    queries
      .existByNumber(number)
      .then((v) => {
        const exists = !!v;
        return res.json({ exists });
      })
      .catch((err) => res.json({ err }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el número" });
  }
});

router.post("/add/:number", (req, res) => {
  try {
    const number = req.params["number"];
    queries.add(number);
    return res.status(200).json({ body: "Agregado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el número" });
  }
});

router.post("/add-list", (req, res) => {
  try {
    const lista = req.body;
    console.log(lista);
    lista.forEach((element) => {
      queries.add(element);
    });
    return res.status(200).json({ body: "Agregado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el número" });
  }
});

router.get("/all", (req, res) => {
  try {
    queries
      .findAll()
      .then((v) => {
        return res.json(v.map((e) => e.dataValues));
      })
      .catch((err) => res.json({ err }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al buscar" });
  }
});

module.exports = router;
