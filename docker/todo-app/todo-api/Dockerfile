FROM node:12.14.0-alpine as build 
WORKDIR /app
COPY ./src/package*.json ./
RUN npm install
COPY ./src .

EXPOSE 3333

RUN npm run build todo-api

CMD [ "npm", "run", "start", "todo-api"]