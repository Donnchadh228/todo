const { Sequelize } = require("sequelize");
const { sequelize } = require("../bd.js");

const User = require("./UserModel")(sequelize, Sequelize.DataTypes);
const Group = require("./GroupModel")(sequelize, Sequelize.DataTypes);
const Task = require("./TaskModel")(sequelize, Sequelize.DataTypes);
const Token = require("./TokenModel")(sequelize, Sequelize.DataTypes);

const models = { User, Group, Task, Token };

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
