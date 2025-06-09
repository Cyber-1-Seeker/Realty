# frontend/Dockerfile
FROM node:18 as builder

# Копируем и устанавливаем зависимости
WORKDIR /app
COPY package*.json ./
RUN npm install

# Копируем исходный код И .env файлы
COPY . .

# Собираем приложение (Vite автоматически использует .env.production)
RUN npm run build

# Финальный образ
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]