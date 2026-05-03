const jwt = require('jsonwebtoken');
const { Token, User } = require('../models/indexModel');
const ApiError = require('../expectations/apiError');

class TokenService {
  _MAX_COUNT_SESSION = 3;
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRETKEY, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
    const refreshToken = jwt.sign(payload, process.env.SECRETKEY_REFRESH, {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const decoded = jwt.decode(refreshToken);
    const expiryDate = new Date(decoded.exp * 1000);
    const token = await Token.create({ refreshToken, expiryDate: expiryDate, userId });
    return token;
  }

  async deleteToken(refreshToken) {
    const deletedCount = await Token.destroy({ where: { refreshToken } });
    return deletedCount > 0;
  }

  async findTokenWithUser(refreshToken) {
    return await Token.findOne({
      where: { refreshToken },
      include: [
        {
          model: User,
          attributes: ['id', 'login', 'role'],
        },
      ],
    });
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.SECRETKEY);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.SECRETKEY_REFRESH);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async refreshToken(refreshToken) {
    const tokenRecord = await this.findTokenWithUser(refreshToken);
    if (!tokenRecord) {
      throw ApiError.Unauthorized('Неверный токен обновления');
    }

    const destroyToken = await this.deleteToken(refreshToken);

    if (!destroyToken) {
      throw ApiError.BadRequest('ошибка при удалении токена');
    }

    const userFromDb = tokenRecord.user;
    const payload = {
      id: userFromDb.id,
      login: userFromDb.login,
      role: userFromDb.role,
    };

    const generatedTokens = this.generateToken(payload);

    await this.saveToken(userFromDb.id, generatedTokens.refreshToken);

    return generatedTokens;
  }

  async enforceSessionLimit(userId) {
    const count = await Token.count({ where: { userId } });

    if (count >= this._MAX_COUNT_SESSION) {
      const oldestSession = await Token.findOne({
        where: { userId },
        order: [['createdAt', 'ASC']],
      });
      await oldestSession.destroy();
    }
  }
}
module.exports = new TokenService();
