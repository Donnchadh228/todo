const ApiError = require('../expectations/apiError.js');
const authService = require('../service/authService.js');
const tokenService = require('../service/tokenService.js');
const userService = require('../service/userService.js');
const setCookie = require('../utils/setRefreshTokenCookie.js');

class AuthController {
  async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      const authResult = await authService.registration(login, password);

      setCookie(res, authResult.refreshToken);

      const { refreshToken, ...userData } = authResult;

      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;

      const authResult = await authService.login(login, password);
      setCookie(res, authResult.refreshToken);

      const { refreshToken, ...userData } = authResult;

      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.json();
      }
      const token = await authService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.Unauthorized('Пользователь не авторизован');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await tokenService.refresh(refreshToken);

      setCookie(res, newRefreshToken);
      return res.json(accessToken);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async check(req, res, next) {
    try {
      const user = req.user;

      const userData = userService.getUserDto(user);

      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new AuthController();
