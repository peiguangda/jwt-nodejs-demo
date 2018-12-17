FROM node:8

WORKDIR /usr/src/app
##
COPY package*.json /usr/src/app/
##
RUN npm install
##
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
