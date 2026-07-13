# Single source of truth for the pinned Hugo version:
# the GitHub Pages workflow (.github/workflows/hugo.yml) reads it from this line.
FROM hugomods/hugo:0.164.0 AS builder

WORKDIR /src

COPY . .

RUN hugo --minify

FROM nginx:alpine

# Pull patched alpine packages without waiting for the nginx image rebuild cycle
RUN apk upgrade --no-cache

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