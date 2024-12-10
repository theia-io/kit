FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm pkg delete scripts.prepare
# RUN npm ci --only=production
RUN npm ci

COPY . .

RUN npm run build:api

EXPOSE 3000 

CMD ["node", "dist/apps/api/main.js"] 

# Final stage
# FROM nginx:alpine

# # Copy the compiled NestJS app from the builder stage
# COPY --from=builder /app/dist /app/dist
# # COPY --from=builder dist/apps/api/ /app/dist

# # Copy your Nginx configuration file (you'll need to create this)
# COPY nginx.conf /etc/nginx/nginx.conf 

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"] 