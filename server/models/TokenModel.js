const sequelize = require("../bd");
const { DataTypes } = require("sequelize");

const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING },
  expiryDate: { type: DataTypes.DATE },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = Token;
