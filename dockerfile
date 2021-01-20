FROM node:8.4.0-alpine as build-env
WORKDIR /mybelongings
COPY package.json /mybelongings/package.json
RUN npm install --unsafe-perm
RUN apk add --no-cache imagemagick bash

FROM node:8.4.0-alpine
WORKDIR /mybelongings
COPY --from=build-env /mybelongings /mybelongings
ENV VERSION '0.0.0'
RUN ./node_modules/.bin/gulp build && cp -r build/* .
RUN rm -rf build/app
EXPOSE 8080
CMD npm run start-packaged
