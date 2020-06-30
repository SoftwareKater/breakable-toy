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
    rmq: {
      url: process.env.AUTH_SERVICE_RMQ_URL || 'amqp://localhost:5672',
    },
    database: {
      host: process.env.USER_SERVICE_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_DATABASE_PORT, 10) || 27017,
      user: process.env.USER_SERVICE_DATABASE_USERNAME || 'root',
      password: process.env.USER_SERVICE_DATABASE_PASSWORD || 'root',
      name: process.env.USER_SERVICE_DATABASE_NAME || 'default',
    },
  },
});
