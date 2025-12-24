module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;

    if (Array.isArray(errors) && errors.every(e => e && e.msg)) {
      this.errors = errors;
    } else {
      this.errors = [{ msg: message }];
    }
  }

  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized() {
    return new ApiError(401, "Пользователь не авторизован", ["Не авторизован"]);
  }

  static Forbidden() {
    return new ApiError(403, "Нет прав доступа", ["Доступ запрещён"]);
  }
};
