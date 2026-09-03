# Stage 1: Dependencies and Build Stage
FROM node:24-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production Runtime Environment
FROM node:24-alpine AS runtime-stage
WORKDIR /app
COPY --from=build-stage /app/package*.json ./
RUN npm install --omit=dev
COPY --from=build-stage /app/server.js ./
EXPOSE 3000
CMD ["npm", "start"]