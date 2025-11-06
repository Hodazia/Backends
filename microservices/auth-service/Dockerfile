FROM node:20-alpine AS builder


WORKDIR /app

# Copy package.json and package-lock.json first for dependency caching
COPY package*.json ./


RUN npm install


COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build


EXPOSE 3000


CMD ["node", "dist/index.js"]