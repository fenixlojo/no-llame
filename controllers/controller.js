const { NoLlame, Op } = require("../models/index");

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

module.exports = queries;
