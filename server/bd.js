const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.BD_DATABASE,
  username: process.env.BD_USERNAME,
  password: process.env.BD_PASSWORD,
  host: process.env.BD_HOST,
  dialect: "mssql",
  port: process.env.BD_PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
      instanceName: "SQLEXPRESS",
      requestTimeout: 30000,
    },
  },
});

module.exports = { sequelize };
