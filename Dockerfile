# =============================================
# Dockerfile — App Corpo e Saúde (Expo Web)
# Deploy direto do dist pré-buildado
# =============================================

FROM nginx:alpine

# Copy pre-built files
COPY dist /usr/share/nginx/html

# Nginx config for SPA (single page app)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
  gzip on; \
  gzip_types text/plain text/css application/json application/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
