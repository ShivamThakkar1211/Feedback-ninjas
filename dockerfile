# Use official Node.js image as a base image
FROM node:18 AS base

# Set the working directory inside the container
WORKDIR /ama-app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js project for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "start"]
