ARG version

FROM harbor.expressosaomiguel.tec.br/tools/node:20.11.1 AS base

FROM base AS dependencies

WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./

RUN npm install --ignore-scripts

FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build
FROM harbor.expressosaomiguel.tec.br/tools/node:20.10.0-bullseye-slim AS runner
ARG version

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs \
 && apt-get update \ 
 && apt-get install -y --no-install-recommends dumb-init \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

USER nextjs

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV VERSION=$version

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 8080

CMD ["dumb-init", "node", "server.js"]