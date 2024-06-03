# Use basic image that contains latest Node.js
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy files from src folder into the container
COPY /src .

# Copy files from dist folder into the container
COPY /dist .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]

