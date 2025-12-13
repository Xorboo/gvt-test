FROM hugomods/hugo:exts-0.127.0 AS builder

WORKDIR /src

COPY . .

RUN hugo --minify

FROM nginx:alpine

COPY --from=builder /src/public /usr/share/nginx/html

# Handle clean URLs just in case
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ $uri.html =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80