## Стадия сборки
#FROM node:18-bullseye as builder
#
#WORKDIR /app
#
## Копируем зависимости и устанавливаем их
#COPY package.json package-lock.json ./
#RUN npm ci --silent
#
## Копируем все файлы и собираем приложение
#COPY . .
#RUN npm run build
#
## Стадия выполнения
#FROM nginx:1.25-alpine as runner
#
## Копирование собранного приложения
#COPY --from=builder /app/dist /usr/share/nginx/html
#
## Копирование продакшен .env файла
#COPY .env.production /usr/share/nginx/html/.env
#
## Копирование кастомной конфигурации Nginx
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
## Health check
#HEALTHCHECK --interval=30s --timeout=3s \
#  CMD curl -f http://localhost/ || exit 1
#
#EXPOSE 80



# Использует Node.js для разработки
FROM node:18-bullseye

# Устанавливаем рабочий каталог
WORKDIR /app

# Копируем только package.json и package-lock.json для оптимизации кэширования
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Открываем порт
EXPOSE 5173

# Запускаем Vite
CMD ["npm", "run", "dev"]