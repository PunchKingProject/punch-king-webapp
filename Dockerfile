# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Accept the mode from docker-compose (defaults to production if not set)
ARG VITE_MODE=production

# Install dependencies
# Using npm ci for consistent builds in Docker
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the app using the specified mode
# This ensures Vite loads .env.development when VITE_MODE is set to 'development'
RUN npm run build -- --mode ${VITE_MODE}

# --- Stage 2: Runner ---
FROM nginx:stable-alpine AS runner
WORKDIR /usr/share/nginx/html

# Clean the default nginx public folder
RUN rm -rf ./*

# Copy the static build from Vite's 'dist' folder
COPY --from=builder /app/dist .

# Add a custom nginx config to handle SPA routing
# This version is cleaner and ensures Vite's history mode works (no 404s on refresh)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]