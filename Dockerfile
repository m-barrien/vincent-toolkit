FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apk update && apk add ttf-liberation openjdk7-jre libreoffice-base libreoffice-calc libreoffice-common libreoffice-math libreoffice-writer libreoffice-sdk libreofficekit && apk del libreoffice-gnome

WORKDIR /home/node/app

COPY package*.json ./
COPY *.js ./

USER node

RUN npm install --no-optional

COPY --chown=node:node . .

EXPOSE 3000
CMD [ "npm", "start" ]