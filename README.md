# 🛍️ Shop

**Shop** es una aplicación web de comercio electrónico que permite a los usuarios explorar productos, añadirlos al carrito y realizar compras.  
Está desarrollada con una arquitectura que separa el frontend y el backend, facilitando su mantenimiento y escalabilidad.

---

## 📦 Tecnologías utilizadas

- **Frontend**: HTML, CSS, JavaScript (React)  
- **Backend**: PHP (Laravel)  
- **Contenedores**: Docker, Docker Compose  
- **Bases de datos**: MySQL + PHPMyAdmin

---

## 🚀 Instalación y ejecución

### Requisitos previos

Antes de comenzar, asegúrate de tener instalados en tu sistema:

- Node.js  
- Docker

---

### 1. Definir el entorno de trabajo

Este proyecto asume que se usará el directorio `C:\proyecto` como ruta base.  
Puedes usar otra ruta, pero asegúrate de ajustar las configuraciones de los volúmenes si lo haces.

---

### 2. Instalar y configurar Portainer

Portainer facilita la gestión de contenedores Docker a través de una interfaz web.

#### a. Crear volumen para Portainer

```bash
docker volume create portainer_data
```

#### b. Descargar e instalar Portainer
```bash
	docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v portainer_data:/data \
  	portainer/portainer-ce:latest
```

#### c. Accede a la interfaz
	Abre tu navegador en: https://localhost:9443

---

### 3. Crear la red personalizada en Portainer
Desde la interfaz de Portainer:
	-Ir a Networks
	-Click en + Add network
	-Configura:
			Name:     red1
			Subnet:   172.20.0.0/26
			Gateway:  172.20.0.1

---

### 4. Crear contenedores mediante Portainer

#### 🐬 MySQL

	Name: mysql
	Image: mysql:5.7
	Published Ports: 3306:3306

	Volumes:
		Container: /var/lib/mysql  
		Host:      C:\proyecto\mysql-data

	Network: red1
	IPv4: 172.20.0.8

	Environment Variables:
		MYSQL_ROOT_PASSWORD=root

#### 🧰 phpMyAdmin

	Name: PHPMyAdmin
	Image: phpmyadmin:latest
	Published Ports: 82:80
	Network: red1
	IPv4: 172.20.0.6

	Environment Variables:
		MYSQL_ROOT_PASSWORD=root  
		PMA_PORT=3306  
		PMA_HOST=172.20.0.8
  
Accede desde **http://localhost:82** para crear la base de datos desde phpMyAdmin.

---

### 5. Configuración del frontend y backend

#### a. Crear el proyecto React  
Desde `C:\proyecto\code`, ejecuta:

```bash
npx create-react-app frontend
```

#### b. Añadir archivos de configuración
Coloca los archivos Dockerfile y docker-compose.yml dentro de la carpeta code.

#### c. Construcción y despliegue  
Desde `C:\proyecto\code`, ejecuta:

```bash
docker-compose up --build
```

#### d. Acceso a la aplicación
Abre tu navegador en: 
```bash
http://localhost:8000
```
