const bcrypt = require('bcrypt');
const UserDto = require('../dtos/userDto.js');
const UserRepository = require('../repositories/userRepository.js');
const ApiError = require('../expectations/apiError.js');

class UserService {
  _SALT = 3;
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  async getUserByLogin(login) {
    const user = await this.UserRepository.getUserByLogin(login);
    if (!user) {
      throw ApiError.NotFound('Пользователь не найден');
    }
    return user;
  }

  async findUserByLogin(login) {
    return await this.UserRepository.findByLogin(login);
  }

  async createUser(login, password) {
    const existingUser = await this.findUserByLogin(login);
    if (existingUser) {
      throw ApiError.BadRequest('Пользователь уже существует');
    }

    const hashPassword = await bcrypt.hash(password, this._SALT);
    return await this.UserRepository.createUser(login, hashPassword);
  }

  getUserDto(user) {
    return { ...new UserDto(user) };
  }
}

const userRepository = new UserRepository();
module.exports = new UserService(userRepository);
