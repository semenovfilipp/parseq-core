# Stage 1: Build the application
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with a simple HTTP server
FROM node:16

# Set working directory
WORKDIR /app

# Copy build files from Stage 1
COPY --from=build /app/build ./build

# Install serve for static files
RUN npm install -g serve

# Expose port 10100
EXPOSE 10100

# Start serve
CMD ["serve", "-s", "build", "-l", "10100"]