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
- 👤 **Registro e inicio de sesión** de usuarios
- 🔒 **Ruta protegida**: el checkout requiere sesión iniciada
- 🧾 **Checkout** con datos de envío y número de pedido de confirmación
- 🧭 Página **404** para rutas inexistentes

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| [React 19](https://react.dev) | Biblioteca para construir la interfaz |
| [Vite](https://vite.dev) | Herramienta de desarrollo y compilación |
| [React Router 7](https://reactrouter.com) | Navegación entre páginas |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos de la interfaz |
| Context API + localStorage | Sesión del usuario y carrito persistentes |

## 🚀 Cómo ejecutar el proyecto

Requiere tener instalado [Node.js](https://nodejs.org) (versión 18 o superior).

```bash
# 1. Instalar las dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Luego abre en el navegador: http://localhost:5173

### Otros comandos útiles

```bash
npm run build    # Genera la versión de producción en la carpeta dist/
npm run preview  # Sirve localmente la versión de producción
npm run lint     # Revisa errores de estilo y código con ESLint
```

## 📁 Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Navbar, ProductCard, ProtectedRoute)
├── context/          # Contextos globales (sesión de usuario, carrito)
├── data/             # Datos de los productos (mientras no haya backend conectado)
├── pages/            # Una carpeta por pantalla: Home, Cart, Checkout, Login...
├── services/         # Comunicación con los datos (simula una API)
└── utils/            # Funciones de utilidad compartidas (formato de precios)
```

## 🧭 Próximos pasos

- [ ] Respetar el inventario (stock) al agregar productos al carrito
- [ ] Guardar los pedidos realizados e historial para el usuario
- [ ] Conectar el frontend con el backend (API real) y base de datos
- [ ] Autenticación segura con contraseñas encriptadas
- [ ] Pruebas automatizadas

## 👤 Autor

**Proyecto de grado** — *Sport-Wilches*
