module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 },
  });

  Task.associate = function (models) {
    Task.belongsTo(models.Group, {
      foreignKey: "groupId",
    });
    Task.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Task;
};
