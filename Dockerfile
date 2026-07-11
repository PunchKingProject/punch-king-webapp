# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_MODE=production
ARG VITE_API_BASE_URL

ENV VITE_MODE=${VITE_MODE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build -- --mode ${VITE_MODE}


# --- Stage 2: Runner ---
FROM nginx:stable-alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

RUN echo 'server { \
    listen 80; \
    server_name _; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]