const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_TABLE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALET,
    pool: {
      max: 20, 
      min: 0,
      acquire: 300000, // 5 minutos
      idle: 10000
    }
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
    indexes: [
      {
        unique: false,
        fields: ["numero_s"],
      },
    ],
  }
);

sequelize.sync(); // Este método crea las tablas si no existen

module.exports = { sequelize, NoLlame, Op, Sequelize };
