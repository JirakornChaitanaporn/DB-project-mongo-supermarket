FROM node:22.20.0-alpine

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install -g nodemon

RUN npm install

COPY . .

#RUN npm run build

EXPOSE 5175

CMD ["npm", "run", "dev"]