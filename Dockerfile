# Imagen base para el frontend
FROM node:18 AS frontend

# Definimos el directorio de trabajo
WORKDIR /code/frontend

# Instalación de dependencias
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
#Es posible que haya que ejecutar este comando desde el container
RUN npm install react-router-dom
RUN npm install axios

# Copia los archivos del frontend
COPY frontend/ .

# Exposición de puertos
EXPOSE 3000

# Comando para iniciar el servicio del frontend
CMD ["npm", "run", "start:nodemon"]

# Imagen base para el backend
FROM php:8.1-fpm AS backend

# Instala extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    libpq-dev zip unzip git && \
    docker-php-ext-install pdo pdo_mysql && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

# Establece el directorio de trabajo
WORKDIR /code/backend

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia los archivos del backend
COPY backend/ .

# Instala las dependencias de Laravel
RUN composer install

# Expone los puertos para el backend
EXPOSE 80 4200 8001

# Comando para iniciar el servicio del backend
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
