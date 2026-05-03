const parseDuration = require('./parseDuration.js');
module.exports = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: parseDuration(process.env.REFRESH_TOKEN_TIME),
    httpOnly: true,
  });
};
