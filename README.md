# Gestión de Tareas — Proyecto Final

**Módulo 7: Desarrollo Front-end con ReactJS y Context API**
Diplomado en Desarrollo Full-Stack

---

## Descripción

Aplicación web de gestión de tareas (To-Do List) que implementa autenticación con JWT y operaciones CRUD completas sobre una API REST. Desarrollada como proyecto final del Módulo 7.

## Funcionalidades

- **Registro e inicio de sesión** con JWT almacenado en `localStorage`
- **Listado de tareas** del usuario autenticado
- **Crear** nuevas tareas
- **Editar** el nombre de una tarea existente
- **Eliminar** tareas con confirmación
- **Cambiar estado** entre Pendiente y Finalizada
- Rutas privadas protegidas por autenticación
- Notificaciones de feedback con alertas
- Validación de formularios con Zod

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Material UI (MUI) | 9 |
| React Router | 7 |
| Axios | 1.x |
| Zod | 4 |

## Demo en vivo

[https://zergioal.github.io/diplomado-react-proyecto/](https://zergioal.github.io/diplomado-react-proyecto/)

## Repositorio

[https://github.com/zergioal/diplomado-react-proyecto](https://github.com/zergioal/diplomado-react-proyecto)

## Backend

API REST desplegada en Render:
- Base URL: `https://taskdone-node.onrender.com/api`
- Documentación: [https://taskdone-node.onrender.com/api-docs](https://taskdone-node.onrender.com/api-docs)

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/zergioal/diplomado-react-proyecto.git
cd diplomado-react-proyecto

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo "VITE_API_URL=https://taskdone-node.onrender.com/api" > .env

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run deploy` | Deploy a GitHub Pages |

---

**Autor:** Sergio Mauricio Alcocer Valenzuela
