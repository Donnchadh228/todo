const { User } = require('../models/indexModel');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/userDto.js');

class UserService {
  async getUserByLogin(login) {
    const user = await User.findOne({ where: { login } });
    return user;
  }

  async createUser(login, password) {
    const hashPassword = await bcrypt.hash(password, 3);

    return await User.create({ login, password: hashPassword });
  }

  formatAuthResponse(user) {
    const userData = new UserDto(user);
    // const responseData = { user: { ...userData }, tokenId };
    const responseData = { user: { ...userData } };
    return responseData;
  }
}

module.exports = new UserService();
