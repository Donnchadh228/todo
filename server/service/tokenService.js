const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/apiError');
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

  async saveToken(userId, refreshToken) {
    const decoded = jwt.decode(refreshToken);
    const expiryDate = new Date(decoded.exp * 1000);
    return this.tokenRepository.create(refreshToken, expiryDate, userId);
  }

  async deleteToken(refreshToken) {
    return this.tokenRepository.delete(refreshToken);
  }

  async refresh(refreshToken) {
    const tokenRecord = await this.tokenRepository.findByTokenWithUser(refreshToken);

    if (!tokenRecord || !tokenRecord.user) {
      throw ApiError.Unauthorized();
    }

    const isDeleted = await this.deleteToken(refreshToken);

    if (!isDeleted) {
      throw ApiError.BadRequest('Failed to delete old refresh token');
    }

    const user = tokenRecord.user;
    const payload = {
      id: user.id,
      login: user.login,
      role: user.role,
    };

    const newTokens = this.generateToken(payload);

    const savedTokenResult = await this.saveToken(user.id, newTokens.refreshToken);

    if (!savedTokenResult) {
      throw ApiError.BadRequest('Failed to save new refresh token');
    }

    return newTokens;
  }

  async enforceSessionLimit(userId) {
    const count = await this.tokenRepository.countByUserId(userId);

    if (count >= this._MAX_COUNT_SESSION) {
      const oldestSession = await this.tokenRepository.findOldestByUserId(userId);
      await this.tokenRepository.delete(oldestSession.refreshToken);
    }
  }
}
module.exports = TokenService;
