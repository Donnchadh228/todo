const userService = require("../service/userService.js");

class UserController {
  async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      const userData = await userService.registration(login, password);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { login, password } = req.body;

      const user = await userService.login(login, password);

      res.cookie("refreshToken", user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      res.json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { tokenId } = req.body;
      const { refreshToken } = req.cookies;
      const token = await userService.logout(tokenId, refreshToken);

      res.clearCookie("refreshToken");

      res.json(token);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const { tokenId } = req.body;
      const { refreshToken } = req.cookies;

      const userData = await userService.rotateRefreshToken(refreshToken, tokenId);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = new UserController();
