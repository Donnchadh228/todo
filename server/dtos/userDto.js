module.exports = class UserDto {
  id;
  login;
  role;
  constructor(model) {
    this.id = model.id;
    this.login = model.login;
    this.role = model.role;
  }
};
