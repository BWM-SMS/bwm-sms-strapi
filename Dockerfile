# ./Dockerfile.prod

# Creating multi-stage build for production

# Stage 1: Build Stage
FROM node:18-alpine as build

# Update package index and install necessary build tools and dependencies
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

# Set environment variable for Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /opt/

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm add pg
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install --only=production

# Add node_modules binaries to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

# Set working directory for the application
WORKDIR /opt/app

# Copy application source code
COPY . .
RUN npm run build

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache vips-dev

# Set environment variable for Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /opt/

# Copy node_modules from build stage
COPY --from=build /opt/node_modules ./node_modules

# Set working directory for the application
WORKDIR /opt/app

# Copy application build from build stage
COPY --from=build /opt/app ./

# Add node_modules binaries to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

# Change ownership of application files to node user
RUN chown -R node:node /opt/app

# Switch to non-root user
USER node

# Expose application port
EXPOSE 1337

# Command to run the application
CMD ["npm", "run", "start"]