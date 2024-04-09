# Use the official Node.js image as base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY app.js .

# Expose the port on which the Node.js app will run
EXPOSE 3000

# Command to start the Node.js app
CMD ["node", "app.js"]