FROM node:22.20.0-alpine

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install --optional=true

COPY . .

#RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]