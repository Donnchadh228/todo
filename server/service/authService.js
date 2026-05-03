const ApiError = require('../expectations/apiError.js');
const tokenService = require('./tokenService.js');
const userService = require('./userService.js');
const bcrypt = require('bcrypt');

class AuthService {
  async generateAuthResult(userData) {
    const generatedJWT = tokenService.generateToken(userData);
    await tokenService.saveToken(userData.id, generatedJWT.refreshToken);

    return { user: userData, ...generatedJWT };
  }

  async registration(login, password) {
    const candidate = await userService.getUserByLogin(login);

    if (candidate) {
      throw ApiError.BadRequest('Данный пользователь уже существует');
    }

    const user = await userService.createUser(login, password);

    const payload = {
      id: user.id,
      login: user.login,
      role: user.role,
    };
    return await this.generateAuthResult(payload);
  }

  async login(login, password) {
    const user = await userService.getUserByLogin(login);
    if (!user) {
      throw ApiError.BadRequest('Неверный логин');
    }

    await tokenService.enforceSessionLimit(user.id);
    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    const userData = {
      id: user.id,
      login: user.login,
      role: user.role,
    };

    return await this.generateAuthResult(userData);
  }

  async logout(refreshToken) {
    const token = await tokenService.deleteToken(refreshToken);
    return token;
  }
}

module.exports = new AuthService();
