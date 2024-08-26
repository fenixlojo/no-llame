module.exports = {
  enviroment: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TABLE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALET, // O el que estés usando (postgres, sqlite, etc.)
  },
};
