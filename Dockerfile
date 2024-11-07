# Stage 1: Build Stage
FROM --platform=linux/amd64 node:20.12 as build

# Set environment variable for Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /opt/

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Add node_modules binaries to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

# Set working directory for the application
WORKDIR /opt/app

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM --platform=linux/amd64 node:20.12

# Set environment variable for Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Asia/Singapore"

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
CMD ["npm", "run", "start:prod"]