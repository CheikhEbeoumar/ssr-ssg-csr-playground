FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY docs/glossary.json ./docs/

# Install dependencies
WORKDIR /app/backend
RUN npm install --production

# Copy application code
COPY backend/index.js ./

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Start the application
CMD ["node", "index.js"]
