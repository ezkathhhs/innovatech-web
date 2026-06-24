# Etapa 1: Construcción (Build)
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Construimos los estáticos (ej. React, Angular o Vue)
RUN npm run build

# Etapa 2: Producción (Serve)
FROM nginx:alpine
# Copiamos los archivos compilados al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Exponemos el puerto 80
EXPOSE 80
# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]