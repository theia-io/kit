FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm pkg delete scripts.prepare

ARG PACKAGE_VERSION
ARG API_BASE

# RUN npm ci --only=production
RUN npm ci

# TODO move this above as copying node_modules likely is not efficient
COPY . .

ENV PACKAGE_VERSION=$PACKAGE_VERSION
ENV API_BASE=$API_BASE

RUN npm run build:api -- --version=$PACKAGE_VERSION --apiBase=$API_BASE

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