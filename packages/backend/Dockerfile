FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY packages/common/package.json ./packages/common/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run --cwd packages/common build
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run --cwd packages/backend build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/packages/backend/.next ./packages/backend/.next
COPY --from=build /app/packages/backend/public ./packages/backend/public
COPY --from=build /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=build /app/packages/backend/next.config.ts ./packages/backend/next.config.ts
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["bun", "run", "--cwd", "packages/backend", "start"]
