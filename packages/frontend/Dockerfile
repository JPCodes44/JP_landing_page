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
RUN bun run --cwd packages/frontend build

FROM oven/bun:1 AS runner
WORKDIR /app
COPY --from=build /app/packages/frontend/dist ./dist
EXPOSE 5173
CMD ["bunx", "serve", "-p", "5173", "./dist"]
