export default () => ({
  authService: {
    name: process.env.AUTH_SERVICE_NAME || 'AUTH_MICROSERVICE',
    api: {
      host: process.env.AUTH_SERVICE_API_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_API_PORT, 10) || 3000,
    },
    database: {
      name: process.env.AUTH_SERVICE_DATABASE_NAME || 'auth',
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
        process.env.AUTH_SERVICE_JWT_EXPIRATION_TIME_IN_SEC || '300',
    },
    rmq: {
      queues: process.env.AUTH_SERVICE_RMQ_QUEUE_NAME || 'user',
    },
  },
});
