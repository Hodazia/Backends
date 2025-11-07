
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build TypeScript
RUN npm run build


EXPOSE 8080

CMD ["node", "dist/index.js"]
