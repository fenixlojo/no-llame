const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_TABLE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALET,
  }
);
sequelize.authenticate();
console.log("Database connection OK!");

const NoLlame = sequelize.define(
  "no_llame",
  {
    numero_s: {
      type: DataTypes.STRING, // Especificar que es un VARCHAR
      allowNull: false,
    },
  },
  {
    tableName: "no_llame", // Nombre de la tabla
  }
);

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

sequelize.sync(); // Este método crea las tablas si no existen

module.exports = { sequelize, NoLlame, Op, queries };
