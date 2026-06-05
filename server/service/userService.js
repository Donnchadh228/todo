const bcrypt = require('bcrypt');
const UserDto = require('../dtos/userDto.js');
const UserRepository = require('../repositories/userRepository.js');
const ApiError = require('../exceptions/apiError.js');

class UserService {
  _SALT = 7;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getUserDto(user) {
    return { ...new UserDto(user) };
  }

  async findUserByLogin(login) {
    return this.userRepository.findByLogin(login);
  }

  async createUser(login, password) {
    const existingUser = await this.findUserByLogin(login);
    if (existingUser) {
      throw ApiError.BadRequest('User with this login already exists');
    }

    const hashPassword = await bcrypt.hash(password, this._SALT);
    return this.userRepository.createUser(login, hashPassword);
  }
}

module.exports = UserService;
