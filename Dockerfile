FROM node:14.4.0-alpine3.10 AS build-front
COPY src /usr/src/app/src
COPY angular.json /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY tsconfig.app.json /usr/src/app
COPY tsconfig.base.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm run maven-build

FROM nginx:1.19.2-alpine AS run
COPY --from=build-front /usr/src/app/dist /usr/share/nginx/html
COPY fs /
EXPOSE 80
ENTRYPOINT ["/scripts/docker-entrypoint.sh"]