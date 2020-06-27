export default () => ({
  authService: {
    name: process.env.AUTH_SERVICE_NAME || 'AUTH_MICROSERVICE',
    api: {
      host: process.env.AUTH_SERVICE_API_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_API_PORT, 10) || 3000,
    },
    tcp: {
      host: process.env.AUTH_SERVICE_TCP_MESSAGE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_TCP_MESSAGE_PORT, 10) || 4000,
    },
    jwt: {
      secret:
        process.env.AUTH_SERVICE_JWT_SECRET ||
        'super-acces-token-secret-111!!1elf',
      expirationTimeInSec:
        process.env.AUTH_SERVICE_JWT_EXPIRATION_TIME_IN_SEC || '60',
    },
    rmq: {
      queues: process.env.AUTH_SERVICE_RMQ_QUEUE_NAME || 'user',
      url: process.env.AUTH_SERVICE_RMQ_URL || 'amqp://localhost:5672',
    },
    database: {
      host: process.env.AUTH_SERVICE_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_DATABASE_PORT, 10) || 27017,
      user: process.env.AUTH_SERVICE_DATABASE_USERNAME || 'root',
      password: process.env.AUTH_SERVICE_DATABASE_PASSWORD || 'root',
      name: process.env.AUTH_SERVICE_DATABASE_NAME || 'auth',
    },
  },
});
