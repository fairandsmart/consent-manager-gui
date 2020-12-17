FROM nginx:1.19.2-alpine
COPY dist/consent-manager-gui /usr/share/nginx/html
COPY fs /
EXPOSE 80
ENTRYPOINT ["/scripts/docker-entrypoint.sh"]
