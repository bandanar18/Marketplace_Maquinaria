# Plan.md — Plan de Desarrollo: Marketplace de Maquinaria

> Hoja de ruta técnica completa para que una IA implemente el marketplace de extremo a extremo. Incluye arquitectura, stack tecnológico, estructura de datos, fases de desarrollo y criterios de aceptación.

---

## 1. Visión General del Sistema

### 1.1 Descripción
Plataforma de marketplace B2B/B2C para compra, venta y cotización de maquinaria industrial, agrícola, de construcción y minería. Conecta a compradores individuales y empresas con vendedores verificados.

### 1.2 Objetivos Técnicos
- Alta disponibilidad (99.9% uptime)
- Tiempo de carga inicial < 2.5 segundos (LCP)
- Soporte para 10,000 usuarios concurrentes
- SEO-optimizado para tráfico orgánico
- Mobile-first con PWA

---

## 2. Stack Tecnológico

### 2.1 Frontend

```
Framework:        Next.js 14+ (App Router)
Lenguaje:         TypeScript
Estilos:          Tailwind CSS + CSS Variables
Componentes:      shadcn/ui (base) + componentes custom
Estado global:    Zustand
Formularios:      React Hook Form + Zod (validación)
Peticiones HTTP:  TanStack Query (React Query)
Gráficas:         Recharts
Tablas:           TanStack Table
Editor rich text: Tiptap
Mapas:            Leaflet + OpenStreetMap
Internacl.:       next-intl (español como idioma base)
Animaciones:      Framer Motion
Íconos:           Lucide React
Imágenes:         next/image (optimización automática)
Testing:          Vitest + React Testing Library + Playwright
```

### 2.2 Backend

```
Framework:        Node.js con NestJS (TypeScript)
  — o —
Framework alt.:   FastAPI (Python) si se prefiere Python
API:              REST + WebSockets (para mensajería)
ORM:              Prisma (con PostgreSQL)
Validación:       class-validator + class-transformer
Autenticación:    JWT (access + refresh tokens) + Passport.js
OAuth:            Google OAuth 2.0 (passport-google-oauth20)
Email:            Nodemailer + SendGrid (o Resend)
Archivos:         Multer + AWS S3 (o Cloudflare R2)
Search:           Elasticsearch (o MeiliSearch como alternativa ligera)
Cache:            Redis
Queue / Jobs:     Bull (Redis-based) para emails y procesos async
Testing:          Jest + Supertest
```

### 2.3 Base de Datos

```
Principal:        PostgreSQL 15+
Cache:            Redis 7+
Search:           Elasticsearch 8+ (o MeiliSearch 1.x)
Archivos:         AWS S3 / Cloudflare R2
```

### 2.4 Infraestructura

```
Hosting Frontend: Vercel (recomendado para Next.js)
  o:              AWS CloudFront + S3 (SSG/ISR)
Hosting Backend:  Railway / Render / AWS ECS
Base de datos:    Supabase (PostgreSQL managed) o AWS RDS
CDN imágenes:     Cloudflare Images o AWS CloudFront
CI/CD:            GitHub Actions
Monitoreo:        Sentry (errores) + Grafana/Prometheus (métricas)
Logs:             Winston + Logtail / Datadog
SSL:              Let's Encrypt / Cloudflare
```

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTES                           │
│  Browser (Next.js SSR/SSG) │ Mobile (PWA)               │
└─────────────────────────────────────────────────────────┘
                            │
                    [CDN / Load Balancer]
                            │
┌─────────────────────────────────────────────────────────┐
│                    API LAYER (NestJS)                   │
│  Auth Module │ Products Module │ Users Module           │
│  Quotes Module │ Messages Module │ Admin Module         │
│  Search Module │ Notifications Module │ Upload Module   │
└─────────────────────────────────────────────────────────┘
        │               │               │
   [PostgreSQL]      [Redis]      [Elasticsearch]
        │               │               
   [S3 / R2]       [Bull Queue]
                        │
               [Workers / Job Processors]
               (emails, notifications, indexing)
```

### 3.2 Módulos del Backend

```
src/
├── auth/           — JWT, OAuth, guards, decorators
├── users/          — Perfiles, configuraciones
├── companies/      — Empresas, equipos, planes
├── products/       — CRUD, estados, moderación
├── categories/     — Árbol de categorías
├── quotes/         — Cotizaciones
├── messages/       — Mensajería + WebSockets
├── reviews/        — Reseñas y valoraciones
├── search/         — Motor de búsqueda
├── notifications/  — Sistema de notificaciones
├── uploads/        — Gestión de archivos
├── admin/          — Panel de administración
├── reports/        — Sistema de reportes
├── analytics/      — Métricas y reportes
├── subscriptions/  — Planes y pagos
└── common/         — Utilidades, filtros, interceptors
```

---

## 4. Modelo de Datos

### 4.1 Entidades Principales

#### User
```typescript
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String?
  googleId        String?   @unique
  role            Role      @default(CLIENT)
  status          UserStatus @default(PENDING_VERIFICATION)
  
  // Perfil
  firstName       String
  lastName        String
  phone           String?
  avatarUrl       String?
  country         String
  city            String
  
  // Empresa (si aplica)
  companyId       String?
  companyRole     CompanyRole?
  
  // Metadata
  emailVerifiedAt DateTime?
  lastLoginAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relaciones
  company         Company?  @relation(fields: [companyId], references: [id])
  favorites       Favorite[]
  quotesAsClient  Quote[]   @relation("ClientQuotes")
  messagesSent    Message[]
  reviews         Review[]
  notifications   Notification[]
}

enum Role {
  CLIENT
  COMPANY_MEMBER
  SUPERADMIN
}

enum UserStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  BANNED
}
```

#### Company
```typescript
model Company {
  id              String        @id @default(cuid())
  slug            String        @unique
  name            String
  taxId           String
  logoUrl         String?
  description     String
  website         String?
  phone           String
  email           String
  country         String
  city            String
  address         String
  
  // Estado
  status          CompanyStatus @default(PENDING_REVIEW)
  verifiedAt      DateTime?
  rejectionReason String?
  
  // Plan
  plan            PlanType      @default(BASIC)
  planExpiresAt   DateTime?
  
  // Metadata
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relaciones
  members         User[]
  products        Product[]
  documents       CompanyDocument[]
  quotes          Quote[]       @relation("CompanyQuotes")
}

enum CompanyStatus {
  PENDING_REVIEW
  ACTIVE
  SUSPENDED
  REJECTED
}

enum PlanType {
  BASIC
  PROFESSIONAL
  ENTERPRISE
}
```

#### Product
```typescript
model Product {
  id              String        @id @default(cuid())
  slug            String        @unique
  
  // Información básica
  title           String
  description     String        @db.Text
  categoryId      String
  brand           String
  model           String
  year            Int
  condition       Condition
  price           Decimal       @db.Decimal(14, 2)
  currency        String        @default("USD")
  isNegotiable    Boolean       @default(false)
  availability    Availability
  
  // Specs técnicas (JSON flexible)
  specs           Json?
  
  // Ubicación
  country         String
  city            String
  
  // Estado
  status          ProductStatus @default(DRAFT)
  rejectionReason String?
  
  // Estadísticas
  viewsCount      Int           @default(0)
  favoritesCount  Int           @default(0)
  
  // Metadata
  companyId       String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?
  
  // Relaciones
  company         Company       @relation(fields: [companyId], references: [id])
  category        Category      @relation(fields: [categoryId], references: [id])
  images          ProductImage[]
  documents       ProductDocument[]
  tags            ProductTag[]
  favorites       Favorite[]
  quotes          Quote[]
  reviews         Review[]
  reports         Report[]
}

enum Condition {
  NEW
  USED
  REFURBISHED
}

enum Availability {
  IN_STOCK
  ON_ORDER
  QUOTE_ONLY
}

enum ProductStatus {
  DRAFT
  PENDING_REVIEW
  ACTIVE
  PAUSED
  SOLD
  REJECTED
  ARCHIVED
}
```

#### Quote (Cotización)
```typescript
model Quote {
  id              String      @id @default(cuid())
  clientId        String
  companyId       String
  productId       String
  
  // Solicitud
  message         String      @db.Text
  quantity        Int         @default(1)
  
  // Respuesta
  responseMessage String?     @db.Text
  responsePrice   Decimal?    @db.Decimal(14, 2)
  responseAt      DateTime?
  
  // Estado
  status          QuoteStatus @default(PENDING)
  expiresAt       DateTime
  
  // Metadata
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relaciones
  client          User        @relation("ClientQuotes", fields: [clientId], references: [id])
  company         Company     @relation("CompanyQuotes", fields: [companyId], references: [id])
  product         Product     @relation(fields: [productId], references: [id])
}

enum QuoteStatus {
  PENDING
  RESPONDED
  ACCEPTED
  REJECTED
  EXPIRED
  CANCELLED
}
```

#### Category
```typescript
model Category {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  description String?
  iconUrl     String?
  parentId    String?
  level       Int        // 1, 2, o 3
  order       Int        @default(0)
  isActive    Boolean    @default(true)
  
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]
}
```

#### Message
```typescript
model Message {
  id          String   @id @default(cuid())
  threadId    String
  senderId    String
  content     String   @db.Text
  isRead      Boolean  @default(false)
  readAt      DateTime?
  createdAt   DateTime @default(now())
  
  thread      Thread   @relation(fields: [threadId], references: [id])
  sender      User     @relation(fields: [senderId], references: [id])
}

model Thread {
  id          String    @id @default(cuid())
  productId   String?
  quoteId     String?
  participantIds String[] // Array de IDs de usuarios
  lastMessageAt  DateTime?
  createdAt   DateTime  @default(now())
  messages    Message[]
}
```

---

## 5. API Endpoints

### 5.1 Autenticación — `/api/auth`

```
POST   /auth/register              — Registro cliente final
POST   /auth/register/company      — Registro empresa
POST   /auth/login                 — Login email+password
POST   /auth/login/google          — OAuth Google
POST   /auth/logout                — Cerrar sesión
POST   /auth/refresh               — Renovar access token
POST   /auth/verify-email          — Verificar email con token
POST   /auth/resend-verification   — Reenviar verificación
POST   /auth/forgot-password       — Solicitar recuperación
POST   /auth/reset-password        — Establecer nueva contraseña
```

### 5.2 Usuarios — `/api/users`

```
GET    /users/me                   — Perfil propio
PATCH  /users/me                   — Actualizar perfil
DELETE /users/me                   — Solicitar eliminación de cuenta
GET    /users/me/favorites         — Mis favoritos
GET    /users/me/quotes            — Mis cotizaciones
GET    /users/me/notifications     — Mis notificaciones
PATCH  /users/me/notifications/read — Marcar como leídas
```

### 5.3 Productos — `/api/products`

```
GET    /products                   — Listar/buscar productos (público)
GET    /products/:id               — Detalle de producto (público)
POST   /products                   — Crear producto [COMPANY]
PATCH  /products/:id               — Editar producto [COMPANY owner]
DELETE /products/:id               — Archivar producto [COMPANY owner]
POST   /products/:id/favorite      — Guardar/quitar favorito [CLIENT]
POST   /products/:id/view          — Registrar vista
POST   /products/:id/report        — Reportar producto [AUTH]
```

### 5.4 Empresa — `/api/company`

```
GET    /company/me                 — Perfil de la empresa propia [COMPANY]
PATCH  /company/me                 — Actualizar empresa [COMPANY owner]
GET    /company/me/products        — Productos de mi empresa [COMPANY]
GET    /company/me/quotes          — Cotizaciones recibidas [COMPANY]
GET    /company/me/analytics       — Analytics de la empresa [COMPANY]
GET    /company/me/team            — Miembros del equipo [COMPANY owner]
POST   /company/me/team            — Invitar miembro [COMPANY owner]
DELETE /company/me/team/:userId    — Remover miembro [COMPANY owner]
GET    /company/:slug              — Perfil público de empresa
```

### 5.5 Cotizaciones — `/api/quotes`

```
POST   /quotes                     — Crear cotización [CLIENT/COMPANY]
GET    /quotes/:id                 — Ver cotización [participantes]
POST   /quotes/:id/respond         — Responder cotización [COMPANY]
POST   /quotes/:id/accept          — Aceptar cotización [CLIENT]
POST   /quotes/:id/reject          — Rechazar cotización [CLIENT]
POST   /quotes/:id/cancel          — Cancelar cotización [CLIENT]
```

### 5.6 Mensajes — `/api/messages`

```
GET    /messages/threads           — Lista de conversaciones [AUTH]
GET    /messages/threads/:id       — Mensajes de un hilo [participantes]
POST   /messages/threads           — Iniciar conversación [AUTH]
POST   /messages/threads/:id       — Enviar mensaje [participante]
PATCH  /messages/threads/:id/read  — Marcar como leído [participante]
```

### 5.7 Categorías — `/api/categories`

```
GET    /categories                 — Árbol completo (público)
GET    /categories/:slug/products  — Productos de una categoría (público)
```

### 5.8 Reseñas — `/api/reviews`

```
GET    /reviews/company/:slug      — Reseñas de una empresa (público)
POST   /reviews                    — Crear reseña [CLIENT con transacción]
PATCH  /reviews/:id                — Editar reseña [autor, dentro de 30 días]
POST   /reviews/:id/respond        — Responder reseña [COMPANY]
POST   /reviews/:id/report         — Reportar reseña [AUTH]
```

### 5.9 Admin — `/api/admin`

```
# Usuarios
GET    /admin/users                — Listar usuarios (con filtros)
GET    /admin/users/:id            — Detalle de usuario
PATCH  /admin/users/:id/status     — Cambiar estado (suspender/activar)

# Empresas
GET    /admin/companies            — Listar empresas
GET    /admin/companies/pending    — Empresas pendientes de aprobación
PATCH  /admin/companies/:id/approve — Aprobar empresa
PATCH  /admin/companies/:id/reject  — Rechazar empresa (razón obligatoria)

# Productos
GET    /admin/products             — Listar productos
GET    /admin/products/pending     — Productos en revisión
PATCH  /admin/products/:id/approve — Aprobar producto
PATCH  /admin/products/:id/reject  — Rechazar producto

# Reportes
GET    /admin/reports              — Lista de reportes
PATCH  /admin/reports/:id/resolve  — Resolver reporte

# Categorías
POST   /admin/categories           — Crear categoría
PATCH  /admin/categories/:id       — Editar categoría
DELETE /admin/categories/:id       — Eliminar categoría

# Analytics
GET    /admin/analytics/overview   — KPIs globales
GET    /admin/analytics/products   — Métricas de productos
GET    /admin/analytics/users      — Métricas de usuarios
GET    /admin/analytics/revenue    — Métricas de ingresos
```

---

## 6. Estructura del Proyecto Frontend

```
src/
├── app/                          — Next.js App Router
│   ├── (public)/
│   │   ├── page.tsx              — Landing page
│   │   ├── marketplace/
│   │   │   ├── page.tsx          — Listado de productos
│   │   │   └── [category]/
│   │   │       └── page.tsx      — Por categoría
│   │   ├── producto/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      — Detalle de producto
│   │   └── empresa/
│   │       └── [slug]/
│   │           └── page.tsx      — Perfil de empresa
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   └── registro/empresa/page.tsx
│   ├── (dashboard)/
│   │   ├── mi-cuenta/            — Dashboard cliente final
│   │   └── mi-empresa/           — Dashboard empresa
│   └── (admin)/
│       └── admin/                — Panel super admin
│
├── components/
│   ├── ui/                       — Componentes base (shadcn)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductFilters.tsx
│   ├── quote/
│   │   ├── QuoteForm.tsx
│   │   └── QuoteList.tsx
│   ├── messaging/
│   │   ├── ThreadList.tsx
│   │   └── ChatWindow.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── admin/
│       ├── UserTable.tsx
│       ├── ProductModerationTable.tsx
│       └── CompanyApprovalTable.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useQuotes.ts
│   └── useMessages.ts
│
├── stores/
│   ├── authStore.ts
│   ├── cartStore.ts (futuro)
│   └── uiStore.ts
│
├── lib/
│   ├── api.ts                    — Cliente HTTP (axios/fetch + interceptors)
│   ├── auth.ts                   — Helpers de autenticación
│   ├── utils.ts                  — Utilidades generales
│   └── validations/              — Schemas Zod
│
└── types/
    ├── api.ts                    — Tipos de respuesta API
    ├── models.ts                 — Tipos de modelos de datos
    └── common.ts                 — Tipos compartidos
```

---

## 7. Fases de Desarrollo

### FASE 1 — Fundamentos (Semanas 1–4)

**Objetivo:** Sistema funcional base con flujo core del marketplace.

#### Backend
- [ ] Setup proyecto NestJS + Prisma + PostgreSQL
- [ ] Módulo de autenticación (JWT + refresh tokens)
- [ ] Registro y login de Cliente Final
- [ ] Verificación de email
- [ ] CRUD de Categorías (árbol)
- [ ] CRUD básico de Productos (sin moderación)
- [ ] Listado y búsqueda básica de productos
- [ ] Upload de imágenes (S3)
- [ ] Tests unitarios módulos core

#### Frontend
- [ ] Setup Next.js + TypeScript + Tailwind
- [ ] Sistema de diseño base (tokens, tipografía, colores)
- [ ] Componentes UI base (Button, Input, Card, Modal)
- [ ] Landing page
- [ ] Listado de productos con filtros básicos
- [ ] Detalle de producto
- [ ] Formulario de login y registro (Cliente Final)
- [ ] Layout del dashboard de cliente

**Entregable Fase 1:** Marketplace básico navegable con productos, categorías y autenticación de clientes.

---

### FASE 2 — Flujos de Negocio (Semanas 5–8)

**Objetivo:** Registro de empresas, cotizaciones y mensajería.

#### Backend
- [ ] Registro y aprobación de empresas (flujo completo)
- [ ] Publicación de productos con moderación
- [ ] Sistema de cotizaciones
- [ ] Sistema de mensajería (REST + WebSockets)
- [ ] Sistema de favoritos
- [ ] Notificaciones (email + in-app)
- [ ] Motor de búsqueda (Elasticsearch / MeiliSearch)
- [ ] Paginación y ordenamiento avanzado

#### Frontend
- [ ] Formulario de registro de empresa (multi-step)
- [ ] Dashboard de empresa (básico)
- [ ] Formulario de publicación de producto
- [ ] Gestión de mis productos
- [ ] Flujo de cotización (solicitar y responder)
- [ ] Chat de mensajería
- [ ] Centro de notificaciones
- [ ] Buscador con filtros avanzados

**Entregable Fase 2:** Empresas pueden publicar, clientes pueden cotizar y mensajear.

---

### FASE 3 — Panel de Administración (Semanas 9–11)

**Objetivo:** Super Admin con control total del sistema.

#### Backend
- [ ] Módulo Admin completo (CRUD usuarios, empresas, productos)
- [ ] Flujos de aprobación/rechazo
- [ ] Sistema de reportes y moderación
- [ ] Analytics básicos (KPIs globales)
- [ ] Gestión de planes de suscripción
- [ ] Anti-fraude y seguridad

#### Frontend
- [ ] Panel Admin (layout, sidebar, navegación)
- [ ] Gestión de usuarios (tabla + acciones)
- [ ] Cola de aprobación de empresas
- [ ] Cola de moderación de productos
- [ ] Dashboard de KPIs (gráficas)
- [ ] Gestión de categorías (drag & drop árbol)
- [ ] Centro de reportes
- [ ] Gestión de banners/publicidad

**Entregable Fase 3:** Super Admin puede moderar y gestionar todo el marketplace.

---

### FASE 4 — Pulido y Optimización (Semanas 12–14)

**Objetivo:** Calidad production-ready.

- [ ] Sistema de reseñas completo
- [ ] Perfil público de empresa
- [ ] Dashboard analytics de empresa (gráficas)
- [ ] Gestión de equipo de empresa
- [ ] SEO optimization (meta tags, sitemap, robots.txt)
- [ ] PWA (service worker, offline básico, instalable)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Accesibilidad WCAG AA
- [ ] Testing E2E (Playwright) para flujos críticos
- [ ] Dark mode
- [ ] Internacionalización (base en español)
- [ ] Rate limiting y seguridad production

**Entregable Fase 4:** Sistema completo listo para lanzamiento.

---

### FASE 5 — Pagos y Monetización (Post-lanzamiento)

- [ ] Integración Stripe para suscripciones
- [ ] Portal de facturación de empresas
- [ ] Upgrade/downgrade de planes automático
- [ ] Productos destacados (pagados)
- [ ] Reportes financieros para admin

---

## 8. Flujos de Usuario — Paso a Paso

### 8.1 Registro y Primera Cotización (Cliente Final)

```
1. Visita landing page
2. Hace clic en "Registrarse"
3. Llena formulario (nombre, email, password, ciudad)
4. Recibe email de verificación
5. Hace clic en enlace → email verificado
6. Redirigido al marketplace
7. Busca "tractor agrícola" en el buscador
8. Aplica filtros (precio, año, condición)
9. Abre detalle de un producto
10. Hace clic en "Solicitar Cotización"
11. Llena formulario de cotización (cantidad, mensaje)
12. Envía → notificación a la empresa
13. Espera respuesta → notificación cuando la empresa responde
14. Acepta o rechaza la cotización
```

### 8.2 Publicación de Producto (Cliente Empresa)

```
1. Empresa registrada y aprobada
2. Ingresa al dashboard de empresa
3. Clic en "Publicar Producto"
4. Llena formulario multi-step:
   Step 1: Categoría y datos básicos
   Step 2: Especificaciones técnicas
   Step 3: Precio y disponibilidad
   Step 4: Fotos y documentos
   Step 5: Revisión y envío
5. Sistema crea producto en estado PENDING_REVIEW
6. Admin recibe notificación de producto pendiente
7. Admin revisa y aprueba
8. Empresa recibe notificación de aprobación
9. Producto aparece en el marketplace
```

### 8.3 Moderación (Super Admin)

```
1. Admin recibe notificación: "Nueva empresa pendiente de revisión"
2. Entra al panel admin → Empresas → Pendientes
3. Revisa información, documentos adjuntos
4. Decide: Aprobar o Rechazar (con razón si rechaza)
5. Sistema notifica a la empresa por email
6. Si aprobada → empresa puede publicar productos
```

---

## 9. Seguridad — Checklist de Implementación

### 9.1 Autenticación y Autorización
- [ ] Guards de roles en todos los endpoints privados
- [ ] Validación de ownership (usuario solo ve/edita sus datos)
- [ ] Tokens de corta duración con refresh
- [ ] Revocación de tokens en logout y cambio de contraseña
- [ ] Rate limiting por IP y por usuario

### 9.2 Entrada de Datos
- [ ] Validación de inputs en backend (independiente del frontend)
- [ ] Sanitización contra XSS en todos los campos de texto
- [ ] Protección contra SQL injection (via ORM)
- [ ] Validación de tipos de archivo en upload
- [ ] Límites de tamaño de archivo
- [ ] Escaneo de archivos subidos (antivirus opcional)

### 9.3 Infraestructura
- [ ] HTTPS forzado
- [ ] Headers de seguridad (HSTS, CSP, X-Frame-Options)
- [ ] CORS configurado correctamente
- [ ] Secrets en variables de entorno (nunca en código)
- [ ] Backups automáticos de base de datos
- [ ] Logs de auditoría para acciones críticas

---

## 10. Variables de Entorno Requeridas

### Backend (.env)
```bash
# Base de datos
DATABASE_URL="postgresql://user:password@host:5432/marketplace"
REDIS_URL="redis://host:6379"

# JWT
JWT_SECRET="[secret-muy-largo-y-aleatorio]"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="[sendgrid-api-key]"
EMAIL_FROM="noreply@marketplace.com"

# OAuth
GOOGLE_CLIENT_ID="[google-client-id]"
GOOGLE_CLIENT_SECRET="[google-client-secret]"
GOOGLE_CALLBACK_URL="https://api.marketplace.com/auth/google/callback"

# Storage
AWS_ACCESS_KEY_ID="[aws-key]"
AWS_SECRET_ACCESS_KEY="[aws-secret]"
AWS_BUCKET_NAME="marketplace-assets"
AWS_REGION="us-east-1"

# Search
ELASTICSEARCH_URL="http://localhost:9200"

# App
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://marketplace.com"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="https://api.marketplace.com"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="[google-client-id]"
NEXT_PUBLIC_SITE_URL="https://marketplace.com"
```

---

## 11. Criterios de Aceptación por Módulo

### Autenticación
- Un usuario puede registrarse, recibir el email de verificación y activar su cuenta
- Un usuario puede iniciar sesión con email/password y con Google
- Un usuario puede recuperar su contraseña vía email
- Los endpoints protegidos retornan 401 si no hay token válido
- Los endpoints retornan 403 si el rol no es suficiente

### Productos
- Una empresa puede publicar un producto que queda en PENDING_REVIEW
- El admin puede aprobar/rechazar el producto y la empresa recibe notificación
- Un usuario no autenticado puede ver y buscar productos ACTIVE
- El buscador retorna resultados relevantes en < 500ms
- Los filtros combinados funcionan correctamente

### Cotizaciones
- Un cliente puede solicitar cotización para un producto
- La empresa recibe notificación inmediata
- La empresa puede responder con precio y condiciones
- El cliente puede aceptar o rechazar la cotización
- Las cotizaciones expiran después de 5 días hábiles sin respuesta

### Admin Panel
- El admin puede aprobar/rechazar empresas con razón
- El admin puede ver todos los usuarios con filtros y paginación
- El admin puede suspender/activar cuentas
- Los KPIs del dashboard se actualizan correctamente

---

## 12. Métricas de Éxito

### Performance
- Lighthouse Score > 90 en Performance, Accessibility, SEO
- Time to First Byte (TTFB) < 200ms
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

### Negocio (primeros 3 meses)
- Tasa de conversión visita → cotización > 3%
- Tiempo promedio de respuesta a cotización < 24h
- Tasa de aprobación de productos > 90% (pocas revisiones)
- NPS de empresas vendedoras > 7

### Técnico
- Cobertura de tests > 70%
- Tiempo de build < 3 minutos
- Zero downtime deployments
- Recovery Time Objective (RTO) < 1 hora
