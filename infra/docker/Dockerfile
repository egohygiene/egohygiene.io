# Export this target locally to check Docker's actual .dockerignore behavior.
# It does not run a package install or become part of the final server image.
FROM scratch AS context
COPY . /

FROM node:24.21.0-alpine AS builder
WORKDIR /app
COPY . .
RUN test "$(node --version)" = "v24.21.0" \
    && corepack enable \
    && test "$(pnpm --version)" = "11.28.5" \
    && pnpm install --frozen-lockfile --ignore-scripts --strict-peer-dependencies=false \
    && VITE_STORE_PREVIEW=false pnpm build

FROM caddy:2.11.7-alpine
COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/apps/egohygiene.io/dist /srv
HEALTHCHECK CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
