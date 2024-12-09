# Usa una imagen base de Node.js para el frontend
FROM node:18 AS frontend

# Establece el directorio de trabajo para el contenedor
WORKDIR /code/frontend

# Instala dependencias
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
#Es posible que haya que ejecutar este comando desde el container
RUN npm install react-router-dom

# Copia los archivos del frontend
COPY frontend/ .

# Expone el puerto 3000 para el servidor de desarrollo de React
EXPOSE 3000

# Comando por defecto para desarrollo del frontend
CMD ["npm", "run", "start:nodemon"]

# Usa una imagen base de PHP para el backend
FROM php:8.1-fpm AS backend

# Instala extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    libpq-dev zip unzip git && \
    docker-php-ext-install pdo pdo_mysql && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

# Establece el directorio de trabajo para el backend
WORKDIR /code/backend

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia los archivos del backend
COPY backend/ .

# Instala las dependencias de Laravel
RUN composer install

# Expone el puerto 80 para el backend
EXPOSE 80 4200 8001

# Comando por defecto para desarrollo del backend
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
