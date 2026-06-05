const ApiError = require('../exceptions/apiError.js');
const setCookie = require('../utils/setRefreshTokenCookie.js');
const autoBind = require('auto-bind').default;

class AuthController {
  constructor(authService, tokenService, userService) {
    this.authService = authService;
    this.tokenService = tokenService;
    this.userService = userService;

    autoBind(this);
  }

  async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      const authResult = await this.authService.registration(login, password);

      setCookie(res, authResult.refreshToken);

      const { refreshToken, ...userData } = authResult;

      return res.json(userData);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;

      const authResult = await this.authService.login(login, password);

      setCookie(res, authResult.refreshToken);

      const { refreshToken, ...userData } = authResult;

      return res.json(userData);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.json();
      }

      await this.authService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json(true);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.Unauthorized();
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.tokenService.refresh(refreshToken);

      setCookie(res, newRefreshToken);

      return res.json(accessToken);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async check(req, res, next) {
    try {
      const user = req.user;

      const userData = this.userService.getUserDto(user);

      return res.json(userData);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = AuthController;
