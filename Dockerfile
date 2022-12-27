FROM node:14.17.3

WORKDIR /app

COPY package.json apps.json ./

RUN npm install
RUN npm install pm2 -g
RUN pm2 start apps.json

COPY . .

CMD ["pm2-runtime", "apps.json"]