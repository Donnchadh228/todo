const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mssql",
  port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
      // instanceName: "SQLEXPRESS",

      requestTimeout: 30000,
    },
  },
});

module.exports = { sequelize };
