export default () => ({
  userService: {
    name: process.env.USER_SERVICE_NAME || 'USER_MICROSERVICE',
    api: {
      host: process.env.USER_SERVICE_API_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_API_PORT, 10) || 3010,
    },
    tcp: {
      host: process.env.USER_SERVICE_TCP_MESSAGE_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_TCP_MESSAGE_PORT, 10) || 4010,
    },
    database: {
      name: process.env.USER_SERVICE_DATABASE_NAME || 'users',
    },
  },
});
