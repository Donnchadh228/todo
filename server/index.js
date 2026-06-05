require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
});
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./DB/db.js');
const router = require('./router/indexRouter');
const { errorMiddleware } = require('./di.js');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const getSwaggerOptions = require('./swagger/getOptions.js');

const app = express();
const PORT = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

const options = getSwaggerOptions(`http://${host}:${PORT}`);
const swaggerSpec = swaggerJsDoc(options);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    require('./jobs/tokenCleanup');

    app.listen(PORT, () => {
      console.log('Server is running on port ' + PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
