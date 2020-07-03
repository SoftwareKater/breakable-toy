# BreakableToy

This project is comprised of different microservices, libraries and frontend applications. The following table gives an overview:

| Component       | Type            | Path                                      | Description                                          |
| --------------- | --------------- | ----------------------------------------- | ---------------------------------------------------- |
| auth            | Microservice    | `apps/auth`                               | Handles auth subjects, authentication, access tokens |
| mongo-storage   | Nest Library    | `libs/shared/data-access/mongo-storage`   | Generic storage service                              |
| todo            | Angular App     | `apps/todo`                               | Frontend for the todo app                            |
| todo-api        | Microservice    | `apps/todo-api`                           | Serves the API for the todo app                      |
| User            | Microservice    | `apps/user`                               | Handles auth users                                   |
|                 |                 |                                           |                                                      |
| auth-api-client | Angular Library | `libs/shared/data-access/auth-api-client` | Generated                                            |
| user-api-client | Angular Library | `libs/shared/data-access/user-api-client` | Generated                                            |
| todo-api-client | Angular Library | `libs/todo/data-access/todo-api-client`   | Generated                                            |

## Get Started

### Run it

Start a MongoDB and a Rabbit MQ. Start the Mircoservices, the API and the frontend with

```shell
nx serve auth
nx serve user
nx serve todo-api
nx serve todo
```

Visit you browser at `http://localhost:4200`.

### Configure

You can configure the services via environment variables, but most config values have defaults. The following table only shows a summary of the most important config values. Investigate the files in `config/`, to learn about the other config values.

| Environment Variable          | Default                 | Description                 |
| ----------------------------- | ----------------------- | --------------------------- |
| AUTH_SERVICE_API_PORT         | `3000`                  |                             |
| AUTH_SERVICE_TCP_MESSAGE_PORT | `4000`                  |                             |
| USER_SERVICE_API_PORT         | `3010`                  |                             |
| TODO_SERVICE_API_PORT         | `3333`                  |                             |
| TODO_APP_RMQ_URL              | `http://localhost:5672` | Rabbit MQ connection string |
