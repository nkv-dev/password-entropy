FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev --silent && npm cache clean --force

# Copy application code and set ownership
COPY --chown=node:node . .

# Create non-root user (node group already exists in base image)
RUN adduser -D -s /bin/sh -u 1000 node

USER node

EXPOSE 5000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]