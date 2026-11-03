FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
# dev deps kept: migrate/seed scripts run through tsx
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["sh", "-c", "npm run migrate && npm start"]
