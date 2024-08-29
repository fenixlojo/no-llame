const { NoLlame, sequelize, Sequelize, Op } = require("../models/index");

const XLSX = require("xlsx");
const csv = require("csv-parser");

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
  findOrCreate: async (number) => {
    const transaction = await sequelize.transaction();
    try {
      const result = await NoLlame.findOrCreate({
        where: { numero_s: number },
        defaults: { numero_s: number },
        transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

const logic = {
  parseExcel: (req, res) => {
    if (!req.file) {
      return res.status(400).send("No se ha enviado ningún archivo.");
    }
    try {
      const excelBuffer = req.file.buffer;

      const workbook = XLSX.read(excelBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const firstColumnData = jsonData.map((row) => row[0]);

      if (firstColumnData.length > 0) {
        parseNumberBatch(firstColumnData);
      } else {
        res.status(400).send("Archivo sin número a procesar");
      }

      res.json({ firstColumnData });
    } catch (error) {
      console.error("Error procesando el archivo Excel:", error);
      res.status(500).send("Error procesando el archivo");
    }
  },

  parseCSV: (req, res) => {
    if (!req.file) {
      return res.status(400).send("No se ha enviado ningún archivo.");
    }

    try {
      const csvBuffer = req.file.buffer;
      const results = [];

      // Crear un stream a partir del buffer
      const stream = require("stream");
      const readable = new stream.Readable();
      readable._read = () => {}; // _read es un método necesario para Readable, lo definimos vacío
      readable.push(csvBuffer);
      readable.push(null); // Indica que no hay más datos

      // Procesar el archivo CSV usando csv-parser
      readable
        .pipe(csv())
        .on("data", (row) => {
          // Aquí puedes cambiar "columna1" por el nombre de la primera columna de tu CSV
          results.push(row["columna1"]);
        })
        .on("end", () => {
          if (results.length > 0) {
            parseNumberBatch(results); // Llama a la función para procesar los datos
            res.json({ firstColumnData: results });
          } else {
            res.status(400).send("Archivo sin número a procesar");
          }
        })
        .on("error", (error) => {
          console.error("Error procesando el archivo CSV:", error);
          res.status(500).send("Error procesando el archivo");
        });
    } catch (error) {
      console.error("Error procesando el archivo CSV:", error);
      res.status(500).send("Error procesando el archivo");
    }
  },
  searchExcel: async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No se ha enviado ningún archivo.");
    }
    try {
      const excelBuffer = req.file.buffer;

      const workbook = XLSX.read(excelBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const firstColumnData = jsonData.map((row) => row[0]);
      const noLlamar = [];

      if (firstColumnData.length > 0) {
        res.json(await searchNumberBatch(firstColumnData, noLlamar));
      } else {
        res.status(400).send("Archivo sin número a procesar");
      }
    } catch (error) {
      console.error("Error procesando el archivo Excel:", error);
      res.status(500).send("Error procesando el archivo");
    }
  },
};

const BATCH_SIZE = 1000;

const parseNumberBatch = async (numbers) => {
  const transaction = await sequelize.transaction();
  try {
    for (let i = 0; i < numbers.length; i += BATCH_SIZE) {
      const batch = numbers.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (num) => {
          const numStr = num.toString();
          if (isValidNumber(numStr)) {
            await queries.findOrCreate(numStr);
          }
        })
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const searchNumberBatch = async (numbers, list) => {
  const transaction = await sequelize.transaction();
  try {
    for (let i = 0; i < numbers.length; i += BATCH_SIZE) {
      const batch = numbers.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (num) => {
          const numStr = num.toString();
          if (isValidNumber(numStr)) {
            const isInList = await queries.existByNumber(numStr);
            if (isInList) {
              list.push(numStr);
            }
          }
        })
      );
    }
    await transaction.commit();
    return list;
  } catch (error) {
    await transaction.rollback();
    throw error;
    return list;
  }
};

const isValidNumber = (numStr) => {
  return (
    numStr.startsWith("0") ||
    numStr.startsWith("9") ||
    numStr.startsWith("5") ||
    numStr.startsWith("2") ||
    numStr.startsWith("4") ||
    numStr.startsWith("+")
  );
};

module.exports = { queries, logic };
