FROM node:latest

WORKDIR /catalog_server

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000 

CMD ["npm","start" ]

RUN npm cache clean --force && npm install
