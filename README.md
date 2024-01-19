# Nombre del Proyecto

Bienvenido al sistema web que se centra en la experiencia de compra y gestión empresarial para la empresa Konect Soluciones Tecnologicas CIA. LTA. Esta aplicación, ofrece un entorno interactivo que abarca desde la presentación de productos y servicios hasta una completa plataforma de administración.

## Tabla de Contenidos
1. [Sección de Inicio](#sección-de-inicio)
2. [Catálogo de Productos](#catálogo-de-productos)
3. [Carrito de Ventas y Pago](#carrito-de-ventas-y-pago)
4. [Sección Nosotros](#sección-nosotros)
5. [Contacto](#contacto)
6. [Área de Administración](#área-de-administración)
7. [Login y Gestión de Sesiones](#login-y-gestión-de-sesiones)
8. [Generación de Facturas e Instructivos de Pago](#generación-de-facturas-e-instructivos-de-pago)
9. [Integración de Mapas](#integración-de-mapas)
10. [Pruebas del Sistema](#pruebas-del-sistema)
11. [Instalación del Proyecto](#instalación-del-proyecto)
12. [Uso de la Base de Datos en Railway](#uso-de-la-base-de-datos-en-railway)

## Sección de Inicio
Apartado inicial donde se pueden ver los productos del mes y ademas las marcas y servicios que ofrece Konect.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/1d4ddd6d-d971-4f6e-92e5-4b9494ae1c97)

## Catálogo de Productos
Exploración del catálogo con detalles del producto, selección de cantidad y opciones de compra.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/2c949710-23df-441d-8493-83a73317a451)

## Carrito de Ventas y Pago
Instrucciones sobre cómo agregar productos al carrito, realizar pagos y el proceso de facturación.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/7bb71d5d-1d38-44c1-9a9e-157866cfd659)

## Sección Nosotros
Metas y objetivos de la empresa junto con capturas de pantalla representativas.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/ac70852d-8ff6-4558-8de8-67863aa016c9)

## Contacto
Información de contacto, dirección y mapa.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/f6a612f6-a016-40b1-aaee-b08fbab1bc1e)

## Área de Administración
Acceso al área de administración desde el catálogo para agregar, editar o eliminar productos.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/e9cd0bc5-0316-4efa-94ce-df64b6eda411)

## Login y Gestión de Sesiones
Descripción del sistema de login proporcionado por la gerencia.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/d6848386-614b-4aea-977e-df1577d36655)

## Generación de Facturas e Instructivos de Pago
Las facturas se generan automaticamente al hacer la compra y se le redirije al usuario a una vista del instructivos de pago.
![image](https://github.com/ErickStalin/EcommerceKonect/assets/117753868/6511f6ad-ce99-42f2-882e-806eb23ac00c)

## Manual de Instalación

Este manual proporciona los pasos necesarios para instalar y configurar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

- Abre tu terminal.
- Ejecuta el siguiente comando para clonar el repositorio de GitHub: git clone <URL_DEL_REPOSITORIO>

### 2. Conexión a la Base de Datos en Railway

- Abre el archivo .env.
- Asegúrate de que la variable de entorno relacionada con la base de datos (DATABASE_URL u otra) esté configurada con la conexión a la base de datos en Railway.

### 3. Instalación del Cliente MySQL

- Instala un cliente MySQL como MySQL Workbench.
- Conéctate y gestiona las tablas y datos de tu base de datos directamente desde el cliente MySQL.

### 4. Conexión al Servidor de Base de Datos

- Visualiza y gestiona las tablas y datos de tu base de datos directamente desde el cliente MySQL.

### 5. Configuración de Variables de Entorno

- Copia el archivo .envExample a un nuevo archivo llamado .env.
- Abre el archivo .env y configura las siguientes variables de entorno:
  - CLOUDINARY_API_KEY: Clave de API de Cloudinary.
  - CLOUDINARY_API_SECRET: Secreto de API de Cloudinary.
  - EMAIL_SMTP_USER: Usuario SMTP para enviar correos electrónicos.
  - EMAIL_SMTP_PASSWORD: Contraseña SMTP.

### 6. Instalación de Dependencias

- Ejecuta el siguiente comando para instalar las dependencias: npm install

### 7. Iniciar la Aplicación

- Inicia la aplicación con el siguiente comando: npm start
- La aplicación debería estar disponible en [http://localhost:PUERTO](http://localhost:PUERTO) (reemplaza "PUERTO" con el puerto configurado).

Siguiendo estos pasos, podrás tener la aplicación web en funcionamiento en tu entorno local y conectarte a la base de datos alojada en Railway.

---

*Nota:* Asegúrate de haber configurado adecuadamente las variables de entorno y la conexión a la base de datos antes de iniciar la aplicación.

