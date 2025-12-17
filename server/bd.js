const { Sequelize } = require("sequelize");

module.exports = new Sequelize({
  database: process.env.BD_DATABASE,
  username: process.env.BD_USERNAME,
  password: process.env.BD_PASSWORD,
  host: "COMP",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: "SQLEXPRESS",
    },
  },
});
