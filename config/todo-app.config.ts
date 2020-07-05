export default () => ({
  todoApp: {
    database: {
      host: process.env.TODO_APP_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.TODO_APP_DATABASE_PORT, 10) || 27017,
      user: process.env.TODO_APP_DATABASE_USERNAME || 'root',
      password: process.env.TODO_APP_DATABASE_PASSWORD || 'root',
    },
    rmq: {
      url: process.env.TODO_APP_RMQ_URL || 'amqp://localhost:5672',
    },
  },
});
