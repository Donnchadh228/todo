const { Op } = require('sequelize');
const { Token, User } = require('../models/indexModel.js');

class TokenRepository {
  async save(refreshToken, expiryDate, userId) {
    return Token.create({ refreshToken, expiryDate: expiryDate, userId });
  }
  async delete(refreshToken) {
    const deleted = await Token.destroy({ where: { refreshToken } });
    return deleted > 0;
  }
  async findByTokenWithUser(refreshToken) {
    return Token.findOne({
      where: { refreshToken, expiryDate: { [Op.gt]: new Date() } },
      include: [
        {
          model: User,
          attributes: ['id', 'login', 'role'],
        },
      ],
    });
  }
  async countByUserId(userId) {
    return Token.count({ where: { userId } });
  }
  async findOldestByUserId(userId) {
    return Token.findOne({
      where: { userId },
      order: [['createdAt', 'ASC']],
    });
  }
}

module.exports = TokenRepository;
