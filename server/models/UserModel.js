module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
  });

  User.associate = function (models) {
    User.hasMany(models.Token, { foreignKey: "userId" });
    User.hasMany(models.Group, { foreignKey: "userId" });
    User.hasMany(models.Task, { foreignKey: "userId" });
  };

  return User;
};
