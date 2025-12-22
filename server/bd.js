const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.BD_DATABASE,
  username: process.env.BD_USERNAME,
  password: process.env.BD_PASSWORD,
  host: "COMP",
  dialect: "mssql",
  port: process.env.BD_PORT,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: "SQLEXPRESS",
    },
  },
});

module.exports = { sequelize };
