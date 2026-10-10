FROM node:24.21-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts && pnpm build

FROM caddy:2.10-alpine
COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/apps/egohygiene.io/dist /srv
HEALTHCHECK CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
