const { NoLlame, sequelize, Sequelize, Op } = require("../models/index");
const multer = require("multer");
const XLSX = require("xlsx");

const queries = {
  findAll: () => NoLlame.findAll(),
  findByNumber: (number) =>
    NoLlame.findAll({
      where: {
        numero_s: {
          [Op.like]: `%${number}%`,
        },
      },
    }),
  nativeFindByNumber: (string) => {
    const sql = "SELECT * FROM no_llame WHERE numero_s = :numero";
    return sequelize.query(sql, {
      replacements: { numero: string },
      type: Sequelize.QueryTypes.SELECT,
    });
  },
  existByNumber: (number) =>
    NoLlame.findOne({
      where: {
        numero_s: {
          [Op.like]: `%${number}%`,
        },
      },
    }),
  add: (number) =>
    NoLlame.create({
      numero_s: number,
    }),
};

const logic = {
  parseExcel: (req, res) => {
    try {
      // Leer el buffer del archivo Excel recibido
      const excelBuffer = req.file.buffer;

      // Cargar el archivo Excel desde el buffer
      const workbook = XLSX.read(excelBuffer, { type: "buffer" });

      // Obtener la primera hoja de trabajo (worksheet)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir la hoja de trabajo a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Iterar sobre las filas y obtener la primera columna de cada fila
      const firstColumnData = jsonData.map((row) => row[0]);

      console.log(firstColumnData); // Muestra los datos de la primera columna en la consola

      res.json({ firstColumnData }); // Enviar los datos al cliente como respuesta
    } catch (error) {
      console.error("Error procesando el archivo Excel:", error);
      res.status(500).send("Error procesando el archivo");
    }
  },
};

module.exports = { queries, logic };
