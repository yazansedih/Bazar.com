FROM node:latest

WORKDIR /catalog_server


COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000 

CMD ["npm","start" ]

