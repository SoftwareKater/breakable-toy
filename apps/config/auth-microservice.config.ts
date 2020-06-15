export default () => ({
  authService: {
    apiPort:
      parseInt(process.env.AUTH_SERVICE_API_PORT, 10) || 3000,
    messagePort:
      parseInt(process.env.AUTH_SERVICE_MESSAGE_PORT, 10) || 4000,
  },
});
