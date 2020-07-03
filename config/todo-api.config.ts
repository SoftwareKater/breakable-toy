export default () => ({
  todoService: {
    name: process.env.TODO_SERVICE_NAME || 'TODO_API',
    api: {
      host: process.env.TODO_SERVICE_API_HOST || 'localhost',
      port: parseInt(process.env.TODO_SERVICE_API_PORT, 10) || 3333,
    },
    database: {
      name: process.env.TODO_SERVICE_DATABASE_NAME || 'todos',
    },
  },
});
