const jwt = require('jsonwebtoken');
const ApiError = require('../expectations/apiError');
const TokenRepository = require('../repositories/tokenRepository.js');

class TokenService {
  _MAX_COUNT_SESSION = 3;

  constructor(tokenRepository) {
    this.tokenRepository = tokenRepository;
  }
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
    const tokens = await this.tokenRepository.save(refreshToken, expiryDate, userId);

    return tokens;
  }

  async deleteToken(refreshToken) {
    const deletedCount = await this.tokenRepository.delete(refreshToken);
    return deletedCount > 0;
  }

  async findTokenWithUser(refreshToken) {
    return await this.tokenRepository.findByTokenWithUser(refreshToken);
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.SECRETKEY);
      return userData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.SECRETKEY_REFRESH);
      return userData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async refresh(refreshToken) {
    const tokenRecord = await this.tokenRepository.findByTokenWithUser(refreshToken);
    if (!tokenRecord) {
      throw ApiError.Unauthorized('Неверный токен обновления');
    }

    const destroyToken = await this.tokenRepository.delete(refreshToken);

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

    await this.tokenRepository.save(userFromDb.id, generatedTokens.refreshToken);

    return generatedTokens;
  }

  async enforceSessionLimit(userId) {
    const count = await this.tokenRepository.countByUserId(userId);

    if (count >= this._MAX_COUNT_SESSION) {
      const oldestSession = await this.tokenRepository.findOldestByUserId(userId);
      await this.tokenRepository.delete(oldestSession.refreshToken);
    }
  }
}
const tokenRepository = new TokenRepository();
module.exports = new TokenService(tokenRepository);
