FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files into the working directory
COPY . .

# Build your Nest.js application
RUN npm run build

# Define the entry point for the container to start your Nest.js application
CMD ["npm", "run", "start:prod"]