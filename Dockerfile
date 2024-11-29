FROM node:20.18-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm pkg delete scripts.prepare
# RUN npm ci --only=production
RUN npm ci

COPY . .

RUN npm run build:api

EXPOSE 3000 

CMD ["node", "dist/apps/api/main.js"] 