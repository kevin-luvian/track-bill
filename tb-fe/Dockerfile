FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build

# server
FROM node:16-alpine AS runner

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 80

ENV PORT 80

CMD ["node", "server.js"]