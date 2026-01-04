require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./bd");
const router = require("./router/indexRouter");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();

    require("./jobs/tokenCleanup");

    app.listen(PORT, () => {
      console.log("Сервер работает на порту " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
