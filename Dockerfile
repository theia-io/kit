FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm pkg delete scripts.prepare

ARG PACKAGE_VERSION

# RUN npm ci --only=production
RUN npm ci

# TODO move this above as copying node_modules likely is not efficient
COPY . .

# for env file
ENV PACKAGE_VERSION=$PACKAGE_VERSION
ENV BASE_URL=https://api.kitouch.io
ENV API_PREFIX=/api
ENV FE_URL=https://kitouch.io

# for auth0
ENV AUTH0_ISSUER=https://dev-vnf24cue82dabkvw.eu.auth0.com
ENV AUTH0_CLIENT_ID=0D8B9G0xhhknbbGFg6gavIendOxwZFnY
ENV AUTH0_CALLBACK_URL=https://api.kitouch.io/api/auth/callback

#S3 
ENV S3_REGION=eu-north-1
ENV S3_IDENTITY_POOL_ID=eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec
ENV S3_BUCKET_PROFILE=kitouch-public-profiles-dev
ENV S3_BUCKET_FAREWELL=kitouch-public-farewell-dev
ENV S3_BUCKET_KUDOBOARD=kitouch-public-kudoboard-dev

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