module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define("group", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
  });

  Group.associate = function (models) {
    Group.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Group.hasMany(models.Task, {
      foreignKey: "groupId",
    });
  };

  return Group;
};
