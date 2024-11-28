FROM node:20.18-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm set-script prepare "" 
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000 

CMD ["node", "dist/apps/api/main.js"] 