# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_FASTAPI_URL
ARG VITE_GEMINI_FASTAPI_URL

# Set environment variables for build
ENV VITE_FASTAPI_URL=$VITE_FASTAPI_URL
ENV VITE_GEMINI_FASTAPI_URL=$VITE_GEMINI_FASTAPI_URL

# Build the application (skip TypeScript type checking)
RUN npx vite build

# Production stage
FROM nginx:alpine

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Set default port
ENV PORT=80

# Expose port
EXPOSE 80

# Use envsubst to replace PORT in nginx config and start nginx
CMD sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
