const jwt = require("jsonwebtoken");
const { Token } = require("../models/indexModel");
const ApiError = require("../expectations/apiError");

class TokenService {
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

  async removeToken(id, refreshToken) {
    const token = await Token.destroy({ where: { id, refreshToken } });
    if (!token) {
      throw ApiError.BadRequest("Ошибка при удалении токена");
    }
    return token;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.SECRETKEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.SECRETKEY_REFRESH);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async validationAndFindRefreshToken(refreshToken, tokenId) {
    if (!refreshToken) {
      throw ApiError.BadRequest("Токена нет");
    }

    const userData = this.validateRefreshToken(refreshToken);

    const tokenRecord = await Token.findOne({ where: { id: tokenId } });
    if (!userData || !tokenRecord) {
      throw ApiError.BadRequest("Токен не валиден либо его нет в базе данных");
    }
    return userData;
  }

  async updateToken(userData, refreshToken, tokenIdDb) {
    const destroyToken = await this.removeToken(tokenIdDb, refreshToken);
    if (!destroyToken) {
      throw ApiError.BadRequest("ошибка при удалении токена");
    }

    const generatedTokens = this.generateToken({ ...userData });
    const { id: tokenId } = await this.saveToken(userData.id, generatedTokens.refreshToken);

    return { user: userData, ...generatedTokens, tokenId };
  }
}
module.exports = new TokenService();
