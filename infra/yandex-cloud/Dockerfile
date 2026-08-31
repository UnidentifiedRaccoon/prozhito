FROM node:22.22.2-alpine
WORKDIR /app
RUN apk add --no-cache ca-certificates curl && curl --fail --silent --show-error https://storage.yandexcloud.net/cloud-certs/CA.pem -o /app/ca.pem
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY server/*.ts ./
COPY server/migrations/ ./migrations/
COPY .work/prozhito/seed/seed.json ./seed.json
ENV NODE_ENV=production PGSSLROOTCERT=/app/ca.pem
USER node
EXPOSE 8080
CMD ["node","--experimental-strip-types","index.ts"]
