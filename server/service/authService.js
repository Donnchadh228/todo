const ApiError = require('../expectations/apiError.js');
const tokenService = require('./tokenService.js');
const userService = require('./userService.js');
const bcrypt = require('bcrypt');

class AuthService {
  constructor(userService, tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  generateAuthResponse(userData, generatedJWT) {
    return { user: userData, ...generatedJWT };
  }

  async registration(login, password) {
    const newUser = await this.userService.createUser(login, password);

    // Выделить в отдельный общий метод
    const payload = this.userService.getUserDto(newUser);
    const generatedJWT = this.tokenService.generateToken(payload);
    const authResponse = this.generateAuthResponse(payload, generatedJWT);

    await this.tokenService.saveToken(payload.id, authResponse.refreshToken);
    return authResponse;
  }

  async login(login, password) {
    const user = await this.userService.findUserByLogin(login);
    if (!user) {
      throw ApiError.BadRequest('Неверный логин');
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    // Выделить в отдельный общий метод
    const payload = this.userService.getUserDto(user);
    const generatedJWT = this.tokenService.generateToken(payload);
    const authResponse = this.generateAuthResponse(payload, generatedJWT);

    await this.tokenService.enforceSessionLimit(user.id);
    await this.tokenService.saveToken(payload.id, authResponse.refreshToken);

    return authResponse;
  }

  async logout(refreshToken) {
    const token = await this.tokenService.deleteToken(refreshToken);
    return token;
  }
}

module.exports = new AuthService(userService, tokenService);
