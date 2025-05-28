# TiendaInterviewFrontend

## Introducción
Este proyecto es una aplicación de comercio electrónico moderna construida con React, TypeScript y Vite. Permite a los usuarios navegar por productos, añadirlos al carrito, realizar pagos y ver su historial de pedidos. Puedes ver la aplicación desplegada en vivo aquí: [https://tienda-interview-frontend.vercel.app/](https://tienda-interview-frontend.vercel.app/).

## Características Principales
- Autenticación de Usuarios: Inicio de sesión y registro de usuarios.
- Listado y Búsqueda de Productos: Visualización de productos con opción de búsqueda.
- Carrito de Compras: Funcionalidad para añadir y gestionar productos en el carrito.
- Proceso de Checkout: Pasos para finalizar la compra y realizar el pago.
- Historial de Pedidos: Visualización de los pedidos realizados por el usuario.

## Tecnologías Utilizadas
- React
- TypeScript
- Vite
- Redux (con Redux Toolkit)
- React Router DOM
- Tailwind CSS
- React Query (TanStack Query)
- Axios
- React Hook Form
- Yup (para validación de esquemas)

## Estructura del Proyecto
La estructura principal del proyecto dentro de la carpeta `src/` se organiza de la siguiente manera:
```
src/
├── assets/         # Iconos, imágenes y otros recursos estáticos.
├── components/     # Componentes React reutilizables y generales.
│   ├── Auth/       # Componentes específicos para autenticación.
│   ├── Form/       # Componentes para la creación de formularios.
│   └── Layout/     # Componentes para la estructura visual principal (ej. cabecera, pie de página).
├── features/       # Módulos funcionales principales de la aplicación.
│   ├── checkout/   # Lógica y componentes para el proceso de pago.
│   ├── historial/  # Lógica y componentes para el historial de pedidos.
│   ├── home/       # Componentes y lógica para la página principal.
│   └── products/   # Lógica y componentes para la visualización y gestión de productos.
├── hooks/          # Hooks personalizados de React.
│   ├── cart/       # Hooks relacionados con el carrito de compras.
│   └── products/   # Hooks relacionados con los productos.
├── lib/            # Configuraciones de librerías externas y utilidades (ej. axios.ts, storage.ts).
├── provider/       # Proveedores de contexto de React (ej. AppProvider.tsx).
├── routes/         # Definición de las rutas principales de la aplicación (allRoutes.tsx, index.tsx).
├── store/          # Configuración del estado global con Redux.
│   └── slices/     # Definiciones de los diferentes 'slices' del estado.
├── utils/          # Funciones de utilidad generales.
├── App.tsx         # Componente principal de la aplicación.
└── main.tsx        # Punto de entrada de la aplicación React.
```

## Configuración e Instalación
Si solo quieres ver la aplicación en acción, puedes acceder directamente a [https://tienda-interview-frontend.vercel.app/](https://tienda-interview-frontend.vercel.app/).

Para correr este proyecto localmente, sigue estos pasos:
1. Clona el repositorio:
   ```bash
   git clone https://[URL-DEL-REPOSITORIO]
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd nombre-del-directorio
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Backend URL:
   ```env
   nVITE_APP_API_URL = http://localhost:8080
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles
En el archivo `package.json`, encontrarás los siguientes scripts:
- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Compila el proyecto TypeScript y empaqueta la aplicación para producción con Vite.
- `npm run lint`: Ejecuta ESLint para analizar el código y detectar problemas.
- `npm run preview`: Inicia un servidor local para previsualizar el build de producción.

## Fotos del Proyecto
Aquí puedes añadir capturas de pantalla de la aplicación para mostrar sus características principales y la interfaz de usuario.

**Página Principal:**
![image](https://github.com/user-attachments/assets/a1158d65-8d34-4a77-a882-c520db3361fe)

**Vista de Producto:**
![image](https://github.com/user-attachments/assets/8e90f3bc-58b1-4f56-a324-5a4924a81e5f)

**Vista del producto en móvil:**
![image](https://github.com/user-attachments/assets/3fa6ed8a-13d4-48d1-98fd-de37b9dcf9ad)

**Carrito de compras**
![image](https://github.com/user-attachments/assets/8c129fba-7ce7-4c47-bd23-331f2f3e693b)

**Primera pantalla del proceso de compra**
![image](https://github.com/user-attachments/assets/2578db12-075d-4d20-8404-b768a0ef5e64)
