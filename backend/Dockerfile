# Stage 1: Install Python dependencies
FROM python:3.9 AS python-builder

# Set the working directory
WORKDIR /app

# Copy requirements.txt and install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Stage 2: Install Node.js dependencies and build the final image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json* ./

# Install npm dependencies
RUN npm install

# Rebuild native modules
#RUN npm rebuild bcrypt --build-from-source

# Copy Python dependencies from the python-builder stage
COPY --from=python-builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the rest of the backend application to /app
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run the application
CMD ["npx", "nodemon", "server.js"]
