FROM node:latest

WORKDIR /order_server

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8081 

CMD ["npm","start" ]

