const cron = require("node-cron");
const { Op } = require("sequelize");
const { Token } = require("../models/indexModel");

module.exports = cron.schedule("0 3 * * *", async () => {
  try {
    await Token.destroy({ where: { expiryDate: { [Op.lt]: new Date() } } });
  } catch (e) {
    console.error("Ошибка при удалении refreshToken(cron):", e);
  }
});
