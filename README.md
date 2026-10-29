# 🏀 Sport-Wilches — Tienda de artículos deportivos

Tienda en línea (e-commerce) de artículos deportivos, desarrollada como proyecto de grado.
Permite explorar productos, filtrarlos por categoría, buscarlos, agregarlos a un carrito
de compras y completar un pedido con datos de envío, previamente iniciando sesión.

## ✨ Funcionalidades

- 📦 **Catálogo de productos** por categoría (Fútbol, Boxeo, Tenis, Ciclismo, etc.)
- 🔎 **Búsqueda** de productos por nombre
- 🗂️ **Filtro** por categoría
- 🛒 **Carrito de compras** con cantidades, subtotales y total en pesos colombianos (COP)
- 💾 El carrito **persiste** aunque se recargue la página (localStorage)
- 👤 **Registro e inicio de sesión** con contraseñas encriptadas y token JWT (backend)
- 📜 **Historial de pedidos** guardado en la base de datos, leído desde la API
- 🔒 **Ruta protegida**: el checkout requiere sesión iniciada
- 🧾 **Checkout** con datos de envío y número de pedido de confirmación
- 📜 **Historial de pedidos**: cada usuario ve sus compras anteriores en "Mis pedidos"
- 🧭 Página **404** para rutas inexistentes

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| [React 19](https://react.dev) | Biblioteca para construir la interfaz |
| [Vite](https://vite.dev) | Herramienta de desarrollo y compilación |
| [React Router 7](https://reactrouter.com) | Navegación entre páginas |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos de la interfaz |
| [Express 5](https://expressjs.com) | Backend: API REST de productos y usuarios |
| [MongoDB + Mongoose](https://mongoosejs.com) | Base de datos de productos y usuarios |
| [JWT](https://jwt.io) | Autenticación con tokens (en el backend) |
| Context API + localStorage | Sesión del usuario y carrito persistentes |

## 🚀 Cómo ejecutar el proyecto

Requiere tener instalado [Node.js](https://nodejs.org) (versión 18 o superior).

```bash
# 1. Instalar las dependencias del frontend
npm install

# 2. Iniciar el servidor de desarrollo del frontend
npm run dev
```

Luego abre en el navegador: http://localhost:5173

### Backend (API real)

El backend vive en la carpeta `backend/` y usa Node.js, Express y MongoDB Atlas.

```bash
# 1. Instalar las dependencias del backend
cd backend
npm install

# 2. Configurar las variables de entorno
#    (copia backend/.env.example como backend/.env y pon tu MONGO_URI)

# 3. Cargar los productos de ejemplo en la base de datos
npm run seed

# 4. Iniciar el backend en otra terminal
npm run dev
```

El backend corre en http://localhost:4000 y el frontend lo consume
automáticamente gracias a la variable `VITE_API_URL` del archivo `.env`
(copia `.env.example` como `.env` en la raíz del proyecto).

### Otros comandos útiles

```bash
npm run build    # Genera la versión de producción en la carpeta dist/
npm run preview  # Sirve localmente la versión de producción
npm run lint     # Revisa errores de estilo y código con ESLint
```

## 📁 Estructura del proyecto

```
mi-tienda/
├── backend/             # API REST (Express + MongoDB)
│   ├── models/          # Esquemas de la base de datos (Product, User)
│   ├── routes/          # Endpoints de la API (products, users)
│   ├── scripts/         # Carga de datos de ejemplo (seed)
│   └── server.js        # Punto de entrada del servidor
├── public/              # Imágenes y archivos estáticos
└── src/                 # Frontend (React)
    ├── components/      # Componentes reutilizables (Navbar, ProductCard, ProtectedRoute)
    ├── context/         # Contextos globales (sesión de usuario, carrito)
    ├── data/            # Datos de ejemplo locales (ya no se usa, se conserva de referencia)
    ├── pages/           # Una carpeta por pantalla: Home, Cart, Checkout, Login...
    ├── services/        # Comunicación con la API del backend
    └── utils/           # Funciones de utilidad compartidas (formato de precios)
```

## 🧭 Próximos pasos

- [x] Respetar el inventario (stock) al agregar productos al carrito
- [x] Guardar los pedidos realizados en la base de datos e historial para el usuario
- [x] Conectar el frontend con el backend (API real) y base de datos
- [x] Autenticación segura con contraseñas encriptadas (bcrypt + JWT)
- [ ] Pruebas automatizadas

## 👤 Autor

**Proyecto de grado** — *Sport-Wilches*
**Jeison Rodriguez**
**Aprendiz SENA** - *ADSO*