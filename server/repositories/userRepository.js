const { User } = require('../models/indexModel.js');

class UserRepository {
  async findByLogin(login) {
    return User.findOne({ where: { login } });
  }

  async createUser(login, password) {
    return User.create({ login, password: password });
  }
}

module.exports = UserRepository;
