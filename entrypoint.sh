#!/bin/sh
# Replace string in static files
# sed -i "s/old-text/new-text/g" input.txt
# Example:
# docker run  -p 8081:80 -e API_URL="http://localhost:8000" -e SERVER_NAME="localhost" marcelomaia/terceirizadas_frontend:latest
set -xe
  : "${API_URL?Precisa de uma variavel de ambiente API_URL}"

set -xe
  : "${SERVER_NAME?Precisa de uma variavel de ambiente SERVER_NAME}"

set -xe
  : "${USERNAME?Precisa de uma variavel de ambiente USERNAME}"

set -xe
  : "${PASSWORD?Precisa de uma variavel de ambiente PASSWORD}"


sed -i "s,API_URL_REPLACE_ME,$API_URL,g" /usr/share/nginx/html/static/js/main*.js
sed -i "s,REACT_USERNAME_REPLACE_ME,$USERNAME,g" /usr/share/nginx/html/static/js/main*.js
sed -i "s,REACT_PASSWORD_REPLACE_ME,$PASSWORD,g" /usr/share/nginx/html/static/js/main*.js
sed -i "s,REACT_PASSWORD_REPLACE_ME,$SERVER_NAME,g" /etc/nginx/conf.d/default.conf

exec "$@"