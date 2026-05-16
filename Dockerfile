# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:stable-alpine

# Fix security vulnerabilities by upgrading packages
RUN apk update && apk upgrade --no-cache

# Copy build output to the Nginx static file directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration template to handle routing and dynamic port
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set up non-root user for better security
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

USER nginx

# Set a default port for local testing, Railway will override this
ENV PORT=80

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
