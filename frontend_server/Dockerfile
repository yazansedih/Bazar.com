FROM node:latest

WORKDIR /frontend_server

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8082

CMD ["npm", "start"]
