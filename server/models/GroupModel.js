const { DataTypes } = require("sequelize");
const sequelize = require("../bd.js");

const Group = sequelize.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false, allowNull: false },
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

module.exports = Group;
