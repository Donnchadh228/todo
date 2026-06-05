const ApiError = require('../exceptions/apiError.js');
const tokenService = require('./tokenService.js');
const userService = require('./userService.js');
const bcrypt = require('bcrypt');

class AuthService {
  constructor(userService, tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  _generateAuthResponse(userData, generatedJWT) {
    return { user: userData, ...generatedJWT };
  }
  _issueTokensForUser(userData) {
    const payload = this.userService.getUserDto(userData);
    const generatedJWT = this.tokenService.generateToken(payload);
    return this._generateAuthResponse(payload, generatedJWT);
  }

  async registration(login, password) {
    const newUser = await this.userService.createUser(login, password);

    const authResponse = this._issueTokensForUser(newUser);

    await this.tokenService.saveToken(authResponse.user.id, authResponse.refreshToken);
    return authResponse;
  }

  async login(login, password) {
    const user = await this.userService.findUserByLogin(login);

    if (!user) {
      throw ApiError.BadRequest('Login incorrect');
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest('Password incorrect');
    }

    const authResponse = this._issueTokensForUser(user);

    await this.tokenService.enforceSessionLimit(user.id);
    await this.tokenService.saveToken(authResponse.user.id, authResponse.refreshToken);

    return authResponse;
  }

  async logout(refreshToken) {
    return this.tokenService.deleteToken(refreshToken);
  }
}

module.exports = AuthService;
