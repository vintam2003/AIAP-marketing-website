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

# Copy the build output to the Nginx static file directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration to handle routing (SPA support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Inform Railway about the port (defaulting to 80, but Railway will override)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
