FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY frontend/package*.json ./

# Configure npm to use more retries and longer timeout
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm install

# Copy the rest of the application
COPY frontend ./

EXPOSE 3000

CMD ["npm", "start"]
