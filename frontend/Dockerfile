# Use the official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start", "--host=0.0.0.0", "--port=3000"]  
# Added "--" before flags
