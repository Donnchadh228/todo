module.exports = function (duration) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };

  const match = duration.match(/^(\d+)([smhdy])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}.`);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  return value * units[unit];
};
