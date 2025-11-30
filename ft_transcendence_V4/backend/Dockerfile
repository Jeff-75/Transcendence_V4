# =============================
# Stage 1 : Installer deps
# =============================
FROM node:22-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install --production


# =============================
# Stage 2 : Serveur Fastify prod
# =============================
FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

CMD ["node", "src/index.js"]
