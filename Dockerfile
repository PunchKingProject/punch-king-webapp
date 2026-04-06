# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Stage 2: Runner ---
FROM nginx:stable-alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy the static build from Vite's 'dist' folder
COPY --from=builder /app/dist .

# Add a custom nginx config to handle SPA routing (optional but recommended)
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