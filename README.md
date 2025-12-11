# Colegio de Antropología de Jujuy – Plataforma Digital  
Documentación técnica del proyecto

Este repositorio contiene la plataforma digital desarrollada para el **Colegio de Antropología de Jujuy**, construida con **React + Vite + TypeScript** e integrada con **Supabase** para la gestión de datos, autenticación y almacenamiento.

El proyecto incluye:

- Sitio público institucional  
- Módulo de trámites y consultas para profesionales  
- Panel administrativo completo  
- Integración con Supabase para noticias, documentos, galería, profesionales, deudas y facturas  

---

## 🚀 Tecnologías principales

- **React 18**  
- **Vite 5**  
- **TypeScript**  
- **Tailwind CSS + shadcn/ui**  
- **React Router DOM**  
- **TanStack React Query**  
- **Supabase** (PostgreSQL, Auth, Storage)  
- **Vercel** (deploy)

---

## 📁 Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables y UI
├── hooks/             # Custom hooks (React Query, lógica)
├── integrations/      # Conexiones con Supabase u otras APIs
├── lib/               # Funciones utilitarias y clientes (supabaseClient, helpers)
├── pages/             # Rutas principales (públicas y admin)
│   ├── admin/         # Panel administrativo completo
│   └── tramites/      # Módulos de trámites (matriculación, deudas, facturas)
├── App.tsx            # Router principal
├── main.tsx           # Entry point
public/                # Assets estáticos
```

---

## 🔧 Requisitos previos

- **Node.js 18+**
- **npm**, **pnpm** o **bun**
- **Proyecto en Supabase** con:
  - Base de datos PostgreSQL
  - Buckets configurados (galería y documentos)
  - Supabase Auth habilitado

---

## ⚙️ Variables de entorno

Crear un archivo `.env` con las siguientes variables:

```env
# Supabase público (frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase administrativo (backend/serverless)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Nota:  
> `SUPABASE_SERVICE_ROLE_KEY` **no debe exponerse en el navegador**.  
> Debe configurarse solo en las Environment Variables privadas de Vercel.

---

## ▶️ Cómo levantar el proyecto en desarrollo

1. Instalar dependencias:

```bash
npm install
```

2. Levantar servidor local:

```bash
npm run dev
```

3. Acceder en el navegador:

```
http://localhost:8080
```

---

## 🏗️ Build para producción

Generar la build:

```bash
npm run build
```

Previsualizar la build:

```bash
npm run preview
```

---

## 🔐 Acceso al panel administrativo

El panel está disponible en:

```
/admin/login
```

El acceso utiliza **Supabase Auth**.  
Los usuarios administradores se crean desde la consola de Supabase.

---

## 📡 Integración con Supabase

El proyecto utiliza:

### Base de datos (tablas principales)

- `profesionales`
- `news`
- `documents`
- `gallery_images`
- `contact_messages`
- `profesional_matriculacion_solicitudes`
- `profesional_deudas`
- `profesional_facturas`

### Storage

- Bucket `galeria`  
- Bucket `documentos`

### Autenticación

- Supabase Auth para administración interna

---

## 🧩 Funcionalidades principales

### Sitio público
- Noticias institucionales + detalle  
- Historia, servicios, publicaciones  
- Galería de imágenes  
- Formulario de contacto  
- Listado de profesionales activos  
- **Solicitud de matriculación online**  
- **Consulta de deudas por DNI**  
- **Consulta y descarga de facturas por DNI**

### Panel administrativo
- Gestión de:
  - Noticias  
  - Documentos  
  - Galería  
  - Profesionales  
  - Solicitudes de matriculación  
  - Consultas de contacto  
  - Facturas  
  - Deudas  

- Rol único: **Admin general**

---

## 🛠️ Scripts disponibles

```json
"dev": "vite",
"build": "vite build",
"build:dev": "vite build --mode development",
"lint": "eslint .",
"preview": "vite preview"
```

---

## 📦 Deploy

El proyecto está configurado para desplegarse en **Vercel**.  
Recomendaciones:

1. Configurar variables de entorno desde el dashboard de Vercel.
2. Habilitar build automática desde la rama principal.
3. Mantener `.env.local` solo para desarrollo, nunca en el repositorio.

---

## 🧪 Entornos disponibles

Actualmente el proyecto cuenta con:

- **Producción** (Vercel)

No existe entorno staging en esta versión.

---

## 📄 Licencia

Código propiedad de **ÉtherCode**.  
Su uso, modificación y redistribución requiere autorización expresa.

---
