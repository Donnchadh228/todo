const { DataTypes } = require("sequelize");
const sequelize = require("../bd.js");

const Task = sequelize.define("task", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "groups",
      key: "id",
    },
  },
});

module.exports = Task;
