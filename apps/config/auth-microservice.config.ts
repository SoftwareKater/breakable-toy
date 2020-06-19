export default () => ({
  authService: {
    apiPort: parseInt(process.env.AUTH_SERVICE_API_PORT, 10) || 3000,
    messagePort: parseInt(process.env.AUTH_SERVICE_MESSAGE_PORT, 10) || 4000,
    jwtSecret: process.env.AUTH_SERVICE_JWT_SECRET || 'super-acces-token-secret-111!!1elf',
    jwtExpirationTimeInSec: process.env.AUTH_SERVICE_JWT_EXPIRATION_TIME_IN_SEC || '60'
  },
});
