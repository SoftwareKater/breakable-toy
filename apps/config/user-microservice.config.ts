export default () => ({
  userService: {
    apiPort:
      parseInt(process.env.USER_SERVICE_API_PORT, 10) || 3010,
    messagePort:
      parseInt(process.env.USER_SERVICE_MESSAGE_PORT, 10) || 4010,
    database: {
      host:
        process.env.USER_SERVICE_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_DATABASE_PORT, 10) || 27017,
      user: process.env.USER_SERVICE_DATABASE_USERNAME || 'root',
      password: process.env.USER_SERVICE_DATABASE_PASSWORD || 'root',
      name: process.env.USER_SERVICE_DATABASE_NAME || 'default',
    },
  },
});
