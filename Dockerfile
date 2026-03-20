FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 1435

CMD ["node","Server.js"]
