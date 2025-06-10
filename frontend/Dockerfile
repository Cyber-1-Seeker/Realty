# Только для разработки (без сборки)
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]





## frontend/Dockerfile
#FROM node:18
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#
#EXPOSE 5173
#CMD ["npm", "run", "dev"]
#
## Финальный образ
#FROM nginx:alpine
#COPY --from=builder /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]