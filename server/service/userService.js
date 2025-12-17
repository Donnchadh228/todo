const { User, Token } = require("../models/indexModel");
const ApiError = require("../expectations/apiError.js");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/userDto.js");
const tokenService = require("../service/tokenService.js");

class UserService {
  async registration(login, password) {
    const candidate = await User.findOne({ where: { login } });
    if (candidate) {
      throw ApiError.BadRequest("Данный пользователь уже есть");
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ login, password: hashPassword });

    const userDto = new UserDto(user);

    const generatedJWT = tokenService.generateToken({ ...userDto });
    const { id: tokenId } = await tokenService.saveToken(userDto.id, generatedJWT.refreshToken);

    return { user: userDto, ...generatedJWT, tokenId };
  }
  async login(login, password) {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      throw ApiError.BadRequest("Неверный логин");
    }

    const count = await Token.count({ where: { userId: user.id } });

    if (count >= 3) {
      const oldestSession = await Token.findOne({ where: { userId: user.id }, order: [["createdAt", "ASC"]] });
      await oldestSession.destroy();
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    const { id: tokenId } = await tokenService.saveToken(user.id, tokens.refreshToken);

    return { user: userDto, ...tokens, tokenId };
  }
  async logout(id, refreshToken) {
    const token = await tokenService.removeToken(id, refreshToken);
    return token;
  }
  async refreshToken(refreshToken, tokenId) {
    const userData = await tokenService.validationAndFindRefreshToken(refreshToken, tokenId);

    const userById = await User.findByPk(userData.id);

    const user = new UserDto(userById);

    const token = await tokenService.updateToken(user, refreshToken, tokenId);

    return token;
  }
}

module.exports = new UserService();
