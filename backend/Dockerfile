# Use the official Node.js 20.11 image from Docker Hub
FROM node:20.11

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to /app
COPY package.json package-lock.json* ./

# Install npm dependencies
RUN npm install

# Install Python, pip, and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /app/venv

# Copy requirements.txt and install Python dependencies in the virtual environment
COPY requirements.txt ./
RUN /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r requirements.txt

# Copy the entire backend application to /app
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the backend application with nodemon
CMD ["/bin/bash", "-c", ". /app/venv/bin/activate && npx nodemon server.js"]
