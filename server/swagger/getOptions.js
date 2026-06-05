module.exports = function (url) {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refreshToken',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Group', description: 'Group management' },
        { name: 'Task', description: 'Task management' },
      ],
      servers: [{ url: `${url}/api` }],
    },
    apis: ['./router/**/*.js', './swagger/**.js'],
  };
};
