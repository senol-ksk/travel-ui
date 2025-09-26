# ========== base (runtime only)
FROM node:20-alpine AS base
WORKDIR /app
EXPOSE 9192
ENV NODE_ENV=production
ENV PORT=9192
ENV HOSTNAME="0.0.0.0"

# ========== build (install + build)
FROM node:20-alpine AS build
WORKDIR /src

# Gerekli sistem paketleri
RUN apk add --no-cache libc6-compat

# Paket yöneticisi ve bağımlılık kurulumu
COPY package.json pnpm-lock.yaml* .env ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile --ignore-scripts

# Proje dosyaları
COPY . .

# Next.js build
RUN pnpm build

# ========== publish (standalone output)
FROM base AS publish

# Sadece ihtiyacımız olan dosyaları kopyala
COPY --from=build /src/public ./public
COPY --from=build /src/.next/standalone ./
COPY --from=build /src/.next/static ./.next/static

# Uygulamayı non-root kullanıcıyla çalıştır
USER node

# Entrypoint (Next.js standalone mode)
CMD ["node", "server.js"]
