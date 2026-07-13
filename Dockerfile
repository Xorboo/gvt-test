# version is parsed from this line by .github/workflows/hugo.yml
FROM hugomods/hugo:0.164.0 AS builder

WORKDIR /src

COPY . .

RUN hugo --minify

FROM nginx:alpine

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