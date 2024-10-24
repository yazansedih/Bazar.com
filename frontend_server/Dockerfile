FROM node:latest

WORKDIR /frontend_server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]
