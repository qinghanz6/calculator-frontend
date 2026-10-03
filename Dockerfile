FROM nginx:stable-alpine
COPY index.html styles.css app.js /usr/share/nginx/html/
COPY config.container.js /usr/share/nginx/html/config.js
COPY nginx.conf /etc/nginx/conf.d/default.conf
