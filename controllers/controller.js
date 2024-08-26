const { NoLlame,sequelize,Sequelize, Op } = require("../models/index");

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
  nativeFindAll: (string) => {
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

module.exports = queries;
