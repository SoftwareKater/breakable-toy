FROM node:12.14.0-alpine as build 
WORKDIR /app
COPY ./src/package*.json ./
RUN npm install
COPY ./src .
RUN npm run build todo

FROM nginx 
EXPOSE 4200
COPY ./src/apps/todo/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/todo /usr/share/nginx/html
