REACT: GESTOR DE MÚSICA (FRONTEND)

DESCRIPCIÓN GENERAL
Este repositorio contiene el cliente web (Frontend) para el Examen Final "Gestor de Música". Es una aplicación Single Page Application (SPA) construida con React, Material UI y Vite, que consume una API REST externa y maneja autenticación segura.

CARACTERÍSTICAS IMPLEMENTADAS

1. Interfaz de Usuario y Componentes (Material UI)
   - Diseño Responsivo: Adaptable a móviles y escritorio usando el Grid System de MUI.
   - Componentes Reutilizables: ArtistCard, AlbumsCrud, SongsCrud.
   - Feedback Visual: Uso de Modales (Dialogs), Chips para filtros y Spinners de carga.
   - Navegación: Barra de navegación persistente con React Router.

2. Consumo de API REST (Axios)
   - CRUD Completo: Creación, lectura, actualización y eliminación de Artistas, Álbumes y Canciones.
   - Filtrado Dinámico: Relación en cascada (Artista -> Álbumes -> Canciones).
   - Servicios Separados: Lógica de negocio aislada en la carpeta /services.

3. Seguridad y Autenticación (OAuth 2.0)
   - Login Seguro: Autenticación mediante credenciales contra Django OAuth Toolkit.
   - Manejo de Tokens: Almacenamiento seguro de access_token y refresh_token.
   - Interceptores: Inyección automática del token en cabeceras HTTP con Axios.
   - Rutas Protegidas: Componente ProtectedRoute que restringe el acceso a usuarios no autenticados.

PRERREQUISITOS DEL SISTEMA
Antes de iniciar, asegúrese de tener instalado:
- Node.js v18 o superior
- NPM (Node Package Manager)
- Navegador Web Moderno (Chrome, Firefox, Edge)
- Git

INSTALACIÓN DEL PROYECTO

1. Clonar el repositorio:
   git clone https://github.com/alanyandun-coder/FRONTEND-MUSICA.git

2. Instalar dependencias:
   npm install

3. Ejecutar el servidor de desarrollo:
   npm run dev

VARIABLES DE ENTORNO (.env)
Es necesario crear un archivo .env en la raíz con las siguientes credenciales:

VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_CLIENT_ID=tu_client_id_de_django
VITE_CLIENT_SECRET=tu_client_secret_de_django

ESTRUCTURA DEL PROYECTO
/src
  /components      (Componentes visuales reutilizables)
  /pages           (Vistas principales: Dashboard, Login, Detalle)
  /services        (Lógica de conexión a la API)
  .env             (Variables de entorno)
  main.jsx         (Punto de entrada de React)

SOLUCIÓN DE PROBLEMAS COMUNES
- La página no carga los datos: Verifica que el servidor de Django (Backend) esté corriendo en el puerto 8000.
- Error de CORS: Asegúrate de estar accediendo desde http://localhost:5173 y no desde una IP de red local.

AUTOR
Proyecto desarrollado por:
- Nombre: Alan Yandun
- Universidad: UISEk
- Materia: Desarrollo de Aplicaciones Wed
- Año: 2026