# Usa una imagen base de Node.js
FROM node:14

# Instala Python y otras dependencias necesarias
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-dev build-essential curl

# Establece el directorio de trabajo para el contenedor
WORKDIR /code

# Copia y configura el frontend
COPY frontend/ frontend/
WORKDIR /code/frontend
RUN npm install

# Copia y configura el backend
WORKDIR /code
COPY backend/ backend/
WORKDIR /code/backend

# Asegúrate de que requirements.txt está presente
RUN pip3 install --no-cache-dir -r requirements.txt

# Configura los puertos que se expondrán
EXPOSE 80 3000 4200 8001

# Comando para ejecutar tanto el backend como el frontend
# Para el backend el parámetro "--reload" reinicia el servidor, para mostrar los cambios
# Para el frontend el parámetro "start:dev" actualizará los cambios
CMD sh -c "cd /code/backend && php artisan serve --host=0.0.0.0 --port=8000 & cd /code/frontend && npm start"

