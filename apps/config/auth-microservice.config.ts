export default () => ({
  authService: {
    name: process.env.AUTH_SERVICE_NAME || 'AUTH_MICROSERVICE',
    apiPort: parseInt(process.env.AUTH_SERVICE_API_PORT, 10) || 3000,
    messagePort: parseInt(process.env.AUTH_SERVICE_MESSAGE_PORT, 10) || 4000,
    jwtSecret: process.env.AUTH_SERVICE_JWT_SECRET || 'super-acces-token-secret-111!!1elf',
    jwtExpirationTimeInSec: process.env.AUTH_SERVICE_JWT_EXPIRATION_TIME_IN_SEC || '60',
    rmq: {
      queue: process.env.AUTH_SERVICE_RMQ_QUEUE_NAME || 'auth',
      url: process.env.AUTH_SERVICE_RMQ_URL || 'amqp://localhost:5672', 
    },
    database: {
      host:
        process.env.AUTH_SERVICE_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_DATABASE_PORT, 10) || 27017,
      user: process.env.AUTH_SERVICE_DATABASE_USERNAME || 'root',
      password: process.env.AUTH_SERVICE_DATABASE_PASSWORD || 'root',
      name: process.env.AUTH_SERVICE_DATABASE_NAME || 'auth',
    },
  },
});
