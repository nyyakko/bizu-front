FROM node:latest

ADD . bizu-front/
WORKDIR /bizu-front

RUN npm install

EXPOSE 3000 3000

ENTRYPOINT ["npm", "start"]
