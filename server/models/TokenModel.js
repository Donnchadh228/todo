module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING },
    expiryDate: { type: DataTypes.DATE },
  });

  Token.associate = function (models) {
    Token.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Token;
};
