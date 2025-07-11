# WeightTracker - Dashboard de Pérdida de Peso

Una aplicación web moderna para el seguimiento de peso personal, construida con Next.js, Tailwind CSS y NextAuth.js.

## Características

- ✅ Autenticación con Google usando NextAuth.js
- ✅ Landing page responsiva en español
- ✅ Dashboard personal para usuarios autenticados
- ✅ Diseño moderno con Tailwind CSS
- ✅ Preparado para despliegue en Vercel

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credenciales" y crea una nueva credencial OAuth 2.0
5. Configura las URIs autorizadas:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.vercel.app/api/auth/callback/google` (producción)
6. Copia el Client ID y Client Secret a tu archivo `.env.local`

### 4. Generar NEXTAUTH_SECRET

Para generar un secret seguro, ejecuta:

```bash
openssl rand -base64 32
```

O usa cualquier string aleatorio de al menos 32 caracteres.

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Configuración de NextAuth
│   ├── dashboard/page.tsx               # Página del dashboard
│   ├── layout.tsx                      # Layout principal
│   ├── page.tsx                        # Landing page
│   └── providers.tsx                   # Provider de NextAuth
├── components/
│   └── Navbar.tsx                      # Componente de navegación
```

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **NextAuth.js** - Autenticación
- **Vercel** - Plataforma de despliegue

## Próximas Funcionalidades

- [ ] Registro de peso diario
- [ ] Gráficos de progreso
- [ ] Establecimiento de metas
- [ ] Recordatorios
- [ ] Estadísticas avanzadas
