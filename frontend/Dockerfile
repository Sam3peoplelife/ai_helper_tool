# Use the official Node.js 20.11 image from Docker Hub
FROM node:20.11

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to /app
COPY airestool/package.json airestool/package-lock.json* ./

# Install npm dependencies
RUN npm install -g npm@10.8.2

# Copy the entire frontend application to /app
COPY airestool .

EXPOSE 3000

CMD ["npm", "start"]

