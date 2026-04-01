# Frontend Dockerfile
FROM node:20

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Copy package.json for caching
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy frontend source
COPY . .

# Expose frontend port
EXPOSE 5173

# Enable file watching for Windows/WSL2
ENV CHOKIDAR_USEPOLLING=true

# Start frontend server
CMD ["npm", "run", "dev", "--", "--host"]