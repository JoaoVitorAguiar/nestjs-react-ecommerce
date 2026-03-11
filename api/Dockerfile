FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production


FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

# Copy only runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Switch user
USER nestjs

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/main.js"]