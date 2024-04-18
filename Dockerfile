FROM node:18-alpine

# Expose port 3000
EXPOSE 3000

# Create work directory
WORKDIR /usr/src/app

COPY package*.json .

# Install app dependencies
RUN npm install

# Copy app source to work directory
COPY . /usr/src/app

# Build and run the app
CMD ["npm","run","start"]