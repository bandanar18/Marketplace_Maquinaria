# 🎨 GUÍA DE DISEÑO — Marketplace Industrial de Maquinaria
> Versión 1.0 | Sistema de diseño inspirado en Yelp, adaptado a la estética industrial B2B

---

## 1. FILOSOFÍA DE DISEÑO

### 1.1 Principios
| Principio | Descripción |
|---|---|
| **Confianza ante todo** | Cada elemento visual debe transmitir seriedad, precisión y profesionalismo industrial. |
| **Claridad funcional** | La información técnica densa debe presentarse de forma escaneable y comprensible. |
| **Acción directa** | El camino al contacto/cotización debe ser siempre visible y accesible en 1 click. |
| **Densidad inteligente** | Más información que un e-commerce de consumo, pero con jerarquía clara. |
| **Progresión contextual** | Adaptar la profundidad de la UI según el rol del usuario (cliente vs empresa). |

### 1.2 Personalidad Visual
- **Tono:** Profesional, industrial, confiable — nunca frío ni burocrático.
- **Estética:** Yelp como base estructural + Paleta de aceros y naranjas industriales.
- **Voz visual:** "El LinkedIn del sector industrial, con la usabilidad de Yelp."

---

## 2. SISTEMA DE COLOR

### 2.1 Paleta Principal

```css
/* === COLORES PRIMARIOS === */
--color-primary:        #E85D04;   /* Naranja industrial (acción, CTAs, links activos) */
--color-primary-dark:   #C44B03;   /* Naranja oscuro (hover de botones primarios) */
--color-primary-light:  #FF8C42;   /* Naranja claro (estados activos en nav, badges) */
--color-primary-ultra:  #FFF3EC;   /* Naranja ultra suave (fondos de alertas / highlights) */

/* === COLORES SECUNDARIOS === */
--color-steel:          #1C2B3A;   /* Azul acero (header, sidebar, texto principal heavy) */
--color-steel-mid:      #2E4057;   /* Acero medio (elementos secundarios, iconos) */
--color-steel-light:    #4A6080;   /* Acero claro (texto secundario, subtítulos) */

/* === NEUTROS === */
--color-white:          #FFFFFF;
--color-bg:             #F7F8FA;   /* Fondo general de páginas */
--color-bg-card:        #FFFFFF;   /* Fondo de cards */
--color-border:         #E2E6EA;   /* Bordes suaves */
--color-border-strong:  #C8CDD4;   /* Bordes en inputs, separadores */
--color-text-primary:   #1A1A2E;   /* Texto principal */
--color-text-secondary: #5C6370;   /* Texto secundario, metadatos */
--color-text-muted:     #9099A6;   /* Placeholders, texto inactivo */

/* === ESTADOS === */
--color-success:        #27AE60;   /* Verde confirmación */
--color-success-bg:     #EAFAF1;
--color-warning:        #F39C12;   /* Amarillo advertencia */
--color-warning-bg:     #FEF9E7;
--color-error:          #E74C3C;   /* Rojo error */
--color-error-bg:       #FDEDEC;
--color-info:           #2980B9;   /* Azul información */
--color-info-bg:        #EBF5FB;

/* === RATINGS (Yelp-style) === */
--color-star-filled:    #FF9500;   /* Estrella activa */
--color-star-empty:     #D9DDE1;   /* Estrella vacía */

/* === ROLES (UI diferenciada) === */
--color-buyer-accent:   #E85D04;   /* Naranja → Cliente final */
--color-seller-accent:  #1C2B3A;   /* Acero → Empresa */
--color-admin-accent:   #6C3483;   /* Púrpura → SuperAdmin */
```

### 2.2 Uso de Color por Contexto

| Elemento | Color |
|---|---|
| Botón CTA primario | `--color-primary` con texto blanco |
| Botón secundario / outline | Borde `--color-primary`, texto `--color-primary` |
| Links en texto | `--color-primary` |
| Header / Navbar | `--color-steel` (fondo oscuro) |
| Sidebar empresa | `--color-steel-mid` |
| Panel SuperAdmin | Fondo oscuro `--color-steel` con acentos `--color-admin-accent` |
| Cards de producto | Fondo `--color-bg-card`, borde `--color-border` |
| Badge verificado | Fondo `--color-primary-ultra`, texto `--color-primary` |
| Rating stars | `--color-star-filled` / `--color-star-empty` |

---

## 3. TIPOGRAFÍA

### 3.1 Fuentes

```css
/* Display / Títulos grandes */
--font-display: 'Barlow Condensed', sans-serif;
/* Weights: 600, 700, 800 */
/* Uso: Nombres de producto, hero titles, números grandes de métricas */

/* Cuerpo / UI general */
--font-body: 'DM Sans', sans-serif;
/* Weights: 400, 500, 600 */
/* Uso: Todo el texto de interfaz, descripciones, labels */

/* Monospace / Datos técnicos */
--font-mono: 'JetBrains Mono', monospace;
/* Weights: 400, 500 */
/* Uso: Especificaciones técnicas, códigos de producto, dimensiones */
```

### 3.2 Escala Tipográfica

```css
/* === TAMAÑOS === */
--text-xs:    11px;   /* Metadatos, timestamps, badges pequeños */
--text-sm:    13px;   /* Labels, textos secundarios */
--text-base:  15px;   /* Cuerpo principal */
--text-md:    17px;   /* Subtítulos, énfasis */
--text-lg:    20px;   /* Títulos de sección */
--text-xl:    24px;   /* Títulos de página */
--text-2xl:   30px;   /* Títulos de hero, nombre de empresa */
--text-3xl:   38px;   /* Display hero en landing */
--text-4xl:   48px;   /* Números grandes en métricas/stats */

/* === PESOS === */
--weight-regular:  400;
--weight-medium:   500;
--weight-semibold: 600;
--weight-bold:     700;
--weight-black:    800;

/* === LINE HEIGHT === */
--leading-tight:   1.2;
--leading-snug:    1.4;
--leading-normal:  1.6;
--leading-relaxed: 1.75;
```

### 3.3 Jerarquía Tipográfica

| Elemento | Fuente | Tamaño | Peso | Color |
|---|---|---|---|---|
| Hero title | Barlow Condensed | 48px | 800 | `--color-steel` |
| Nombre de producto | Barlow Condensed | 24px | 700 | `--color-text-primary` |
| Precio | DM Sans | 22px | 700 | `--color-primary` |
| Spec técnica label | JetBrains Mono | 12px | 400 | `--color-text-muted` |
| Spec técnica valor | JetBrains Mono | 14px | 500 | `--color-text-primary` |
| Descripción | DM Sans | 15px | 400 | `--color-text-secondary` |
| CTA button | DM Sans | 15px | 600 | White |
| Nav items | DM Sans | 14px | 500 | `--color-text-primary` |
| Rating count | DM Sans | 13px | 400 | `--color-text-muted` |

---

## 4. ESPACIADO Y GRID

### 4.1 Espaciado Base (8px grid)

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 4.2 Grid del Layout

```
Desktop (≥1280px): 12 columnas, gutter 24px, max-width 1248px
Tablet  (768–1279px): 8 columnas, gutter 20px
Mobile  (< 768px):  4 columnas, gutter 16px
```

### 4.3 Breakpoints

```css
--bp-sm:   480px;   /* Mobile landscape */
--bp-md:   768px;   /* Tablet */
--bp-lg:   1024px;  /* Laptop */
--bp-xl:   1280px;  /* Desktop */
--bp-2xl:  1536px;  /* Wide */
```

---

## 5. COMPONENTES UI

### 5.1 Botones

```
PRIMARIO
├── BG: --color-primary
├── Text: white, 15px, semibold
├── Padding: 12px 24px
├── Border radius: 6px
├── Hover: --color-primary-dark
└── Ejemplo: "Cotizar ahora", "Agregar al carrito"

SECUNDARIO / OUTLINE
├── BG: transparent
├── Border: 1.5px --color-primary
├── Text: --color-primary, 15px, semibold
├── Hover: BG --color-primary-ultra
└── Ejemplo: "Ver detalles", "Comparar"

GHOST / TEXTO
├── BG: transparent, sin borde
├── Text: --color-primary, 14px, medium
├── Hover: underline
└── Ejemplo: "Ver más", "Mostrar todo"

PELIGROSO
├── BG: --color-error
├── Text: white
└── Ejemplo: "Eliminar cuenta", "Cancelar pedido"

TAMAÑOS
├── sm: padding 8px 16px, texto 13px
├── md: padding 12px 24px, texto 15px (default)
└── lg: padding 16px 32px, texto 17px
```

### 5.2 Cards de Producto (inspirado en Yelp business card)

```
┌─────────────────────────────────────────────────────┐
│  [IMAGEN PRINCIPAL 320x200px]           [BADGE]     │
│                                       Verificado ✓  │
├─────────────────────────────────────────────────────┤
│  ★★★★☆  4.3  (127 reseñas)                         │
│  Torno CNC Industrial TM-200                        │
│  Metalmecánica Argeq S.A.  ·  Buenos Aires, AR      │
│                                                     │
│  Potencia: 7.5 kW  ·  Peso: 2.400 kg               │
│  [VENTA]  [ALQUILER]                                │
│                                                     │
│  $48.500 USD          [Cotizar]  [♡ Guardar]        │
└─────────────────────────────────────────────────────┘

Especificaciones:
- Ancho card: 100% (grid responsive)
- Imagen: aspect-ratio 16:9, object-fit cover
- Border: 1px --color-border, border-radius 10px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover shadow: 0 6px 20px rgba(0,0,0,0.12)
- Hover: leve transform translateY(-2px), transition 0.2s
```

### 5.3 Perfil de Empresa (Yelp Business Profile)

```
HEADER DE EMPRESA
┌─────────────────────────────────────────────────────┐
│ [PORTADA 1200x300px — imagen industrial]            │
│                                                     │
│  [LOGO]  METALMECÁNICA ARGEQ S.A.                   │
│   100x100  ★★★★☆ 4.3 · 312 reseñas                 │
│            ● Abierto ahora · Bs. Aires, AR           │
│            [Empresa Verificada ✓]  [ISO 9001]       │
│                                                     │
│  [Cotizar]  [Llamar]  [Compartir]  [Guardar]        │
└─────────────────────────────────────────────────────┘

TABS DE NAVEGACIÓN (Yelp-style)
[ Productos ] [ Reseñas ] [ Sobre nosotros ] [ Fotos ] [ Contacto ]
```

### 5.4 Sistema de Rating (Yelp-style)

```
ESTRELLAS DE VISUALIZACIÓN
Full:  ★★★★★  (SVG filled)
Half:  ★★★★½  (SVG half)
Empty: ★★★★☆  (SVG outline)

Color activo:  --color-star-filled  (#FF9500)
Color vacío:   --color-star-empty   (#D9DDE1)
Tamaño default: 16x16px
Tamaño en perfil: 22x22px

BREAKDOWN DE RATING (Yelp-style)
5 ★ ████████████░░  68%
4 ★ ████░░░░░░░░░░  20%
3 ★ ██░░░░░░░░░░░░   8%
2 ★ █░░░░░░░░░░░░░   3%
1 ★ ░░░░░░░░░░░░░░   1%

SUBCATEGORÍAS (adaptadas a industrial)
- Calidad del equipo:      ★★★★☆
- Cumplimiento de entrega: ★★★★★
- Relación precio/valor:   ★★★☆☆
- Atención postventa:      ★★★★☆
```

### 5.5 Ficha Técnica de Producto

```
ESPECIFICACIONES TÉCNICAS (estilo tabla industrial)
┌─────────────────────────────────────────────────────┐
│  ESPECIFICACIONES TÉCNICAS                          │
├────────────────────┬────────────────────────────────┤
│  Potencia          │  7.5 kW / 10 HP                │
│  Voltaje           │  220V / 380V trifásico          │
│  Peso              │  2.400 kg                       │
│  Dimensiones       │  2.200 × 1.100 × 1.800 mm      │
│  Capacidad máx.    │  Ø 400 mm sobre bancada         │
│  Velocidad         │  50 – 2000 RPM                  │
│  Material base     │  Fundición gris HT200           │
│  Año de fabricación│  2024                           │
│  Procedencia       │  Nacional                       │
│  Garantía          │  12 meses                       │
│  Certificaciones   │  CE · ISO 9001                  │
└────────────────────┴────────────────────────────────┘

Tipografía labels: JetBrains Mono, 12px, muted
Tipografía valores: JetBrains Mono, 13px, primary
BG filas alternadas: #FAFBFC / #FFFFFF
```

### 5.6 Badges y Tags

```
BADGE EMPRESA VERIFICADA
┌──────────────────┐
│ ✓ Verificada     │  BG: --color-primary-ultra
└──────────────────┘  Texto: --color-primary, 12px bold
                       Borde: 1px --color-primary, radius 4px

BADGE CONDICIÓN
┌──────┐  ┌──────┐
│ NUEVO│  │ USADO│
└──────┘  └──────┘
Nuevo: BG #EAFAF1, text #27AE60
Usado: BG #FEF9E7, text #F39C12

BADGE MODALIDAD
┌────────┐  ┌─────────┐
│ VENTA  │  │ ALQUILER│
└────────┘  └─────────┘
Venta:    BG #EBF5FB, text #2980B9
Alquiler: BG #F5EEF8, text #8E44AD

BADGE PLAN EMPRESA
┌──────┐  ┌────┐  ┌──────────┐
│ FREE │  │ PRO│  │ENTERPRISE│
└──────┘  └────┘  └──────────┘
Pro: BG #FFF3EC, text #E85D04, borde dorado
Enterprise: BG #1C2B3A, text white, gradiente
```

### 5.7 Formulario de Cotización (RFQ)

```
┌─────────────────────────────────────────────────────┐
│  Solicitar Cotización                               │
│                                                     │
│  Cantidad requerida        Unidad                   │
│  [_________ ]              [ Unidades ▼]            │
│                                                     │
│  Modalidad                                          │
│  ◉ Compra  ○ Alquiler  ○ Ambas opciones            │
│                                                     │
│  Fecha estimada de necesidad                        │
│  [dd/mm/aaaa ____]                                  │
│                                                     │
│  Mensaje al proveedor                               │
│  ┌─────────────────────────────────────────────┐   │
│  │ Ej: Necesito cotización para 2 unidades...  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ✓ Acepto recibir respuesta por email               │
│                                                     │
│            [Enviar cotización →]                    │
└─────────────────────────────────────────────────────┘
```

---

## 6. NAVEGACIÓN Y LAYOUT

### 6.1 Navbar Principal (inspirado en Yelp)

```
[LOGO]  [Buscar producto o empresa...]  [Ciudad ▼]  🔍
                                    [Publicar]  [Login]  [Registrarse]

SUB-NAV (categorías):
Metalmecánica | Construcción | Agro | Textil | Alimentos | Energía | + Ver todo
```

### 6.2 Página de Búsqueda / Resultados

```
┌──────────┬──────────────────────────────────────────────┐
│ FILTROS  │  RESULTADOS (342 productos encontrados)      │
│          │                                              │
│ Categoría│  [Ordenar: Relevancia ▼]  [Vista: ■ □]      │
│ ☐ Metal  │  ─────────────────────────────────────────   │
│ ☐ Agro   │  [CARD] [CARD] [CARD]                        │
│ ☐ Texto  │  [CARD] [CARD] [CARD]                        │
│          │  [CARD] [CARD] [CARD]                        │
│ Precio   │                                              │
│ $0─$500k │  ← Anterior  [1] [2] [3] ... [28]  Siguiente→│
│          │                                              │
│ Condición│                                              │
│ ◉ Todos  │                                              │
│ ○ Nuevo  │                                              │
│ ○ Usado  │                                              │
│          │                                              │
│ Modalidad│                                              │
│ ☐ Venta  │                                              │
│ ☐Alquiler│                                              │
│          │                                              │
│ Rating   │                                              │
│ ☐ 4★ o + │                                              │
│ ☐ 3★ o + │                                              │
│          │                                              │
│ País/    │                                              │
│ Región   │                                              │
│ [______] │                                              │
└──────────┴──────────────────────────────────────────────┘

Layout filtros: width 260px, fijo en desktop, drawer en mobile
```

### 6.3 Página de Detalle de Producto

```
SECCIÓN 1: GALERÍA + INFO PRINCIPAL (2 columnas)
├── Col izq (60%): Galería de imágenes / video
└── Col der (40%): Nombre, empresa, rating, precio, CTA, badges

SECCIÓN 2: TABS DE CONTENIDO
[ Descripción ] [ Especificaciones ] [ Archivos ] [ Sobre el proveedor ]

SECCIÓN 3: RESEÑAS (Yelp-style)
├── Resumen de ratings con breakdown
├── Lista de reseñas verificadas (con foto, nombre, fecha, stars, texto)
└── Respuestas del proveedor anidadas

SECCIÓN 4: PRODUCTOS RELACIONADOS (carousel)
```

### 6.4 Dashboard — Cliente Final

```
Bienvenido, Juan  |  [🔔 3]  [👤 Mi perfil]

┌─────────────────┬───────────────────────────────────┐
│ MI ACTIVIDAD    │                                   │
│                 │  COTIZACIONES RECIENTES            │
│ ● Cotizaciones  │  ┌──────────────────────────────┐ │
│   pendientes: 3 │  │ Torno CNC · Argeq · $48k     │ │
│                 │  │ Enviada: hace 2 días · ⏳     │ │
│ ● Guardados: 12 │  └──────────────────────────────┘ │
│                 │                                   │
│ ● Compras: 1    │  PRODUCTOS GUARDADOS (12)         │
│                 │  [MINI CARD] [MINI CARD] [...]    │
│ ● Reseñas: 2    │                                   │
│   pendientes    │  RESEÑAS PENDIENTES               │
│                 │  "Tienes 2 compras para reseñar"  │
└─────────────────┴───────────────────────────────────┘
```

### 6.5 Dashboard — Empresa

```
METALMECÁNICA ARGEQ  |  [Plan PRO ✓]  |  [Ver perfil público]

┌─────────────┬───────────┬────────────┬─────────────┐
│ Vistas hoy  │ Cotizaci. │ Conversión │ Rating      │
│   1,247     │  pendient.│   12.4%    │  ★★★★☆ 4.3 │
│  ↑ 8% vsayer│    14     │            │  312 reseñas│
└─────────────┴───────────┴────────────┴─────────────┘

TABS: [ Catálogo ] [ Cotizaciones ] [ Pedidos ] [ Analytics ] [ Configuración ]

COTIZACIONES PENDIENTES
┌───────────────────────────────────────────────────────┐
│ #RFQ-0482 · Torno CNC TM-200 · 2 unidades · Compra  │
│ Juan Ramírez · Córdoba · Hace 3 horas                 │
│ [Responder]  [Rechazar]  [Ver perfil cliente]         │
└───────────────────────────────────────────────────────┘
```

### 6.6 Panel — SuperAdmin

```
MARKETPLACE ADMIN  |  [Root]  |  [🔒 2FA activo]

┌──────────────────────────────────────────────────────────┐
│ RESUMEN GLOBAL                                           │
│  Empresas activas: 487  |  Productos: 12,304             │
│  RFQs hoy: 1,847        |  GMV mes: $2.4M USD            │
│  Reportes pendientes: 7  |  Disputas abiertas: 3         │
└──────────────────────────────────────────────────────────┘

SIDEBAR IZQUIERDO:
├── 📊 Dashboard
├── 🏢 Empresas
│   ├── Verificación pendiente (12)
│   ├── Activas
│   └── Suspendidas
├── 👥 Usuarios
├── 📦 Catálogo
│   ├── Reportados (7)
│   └── Pendientes de revisión
├── 💬 Reseñas
│   ├── Reportadas (4)
│   └── Disputadas
├── ⚖️ Disputas (3)
├── 💰 Finanzas
│   ├── Transacciones
│   ├── Liquidaciones
│   └── Comisiones
├── ⚙️ Configuración
│   ├── Planes y precios
│   ├── Categorías
│   └── Reglas del sistema
└── 📋 Auditoría

Color sidebar admin: fondo --color-steel, acentos --color-admin-accent
```

---

## 7. ICONOGRAFÍA

### 7.1 Sistema de Iconos
- Librería base: **Lucide Icons** (open source, consistente)
- Estilo: Outline (stroke width 1.5px) para interfaz general
- Estilo Filled: solo para estados activos / seleccionados
- Tamaños estándar: 16px (inline), 20px (UI general), 24px (nav/acciones), 32px (vacíos de estado)

### 7.2 Iconos Específicos del Dominio

| Concepto | Icono recomendado |
|---|---|
| Maquinaria / equipo | `Settings` / `Cog` |
| Cotización / RFQ | `FileText` + `Send` |
| Empresa verificada | `ShieldCheck` |
| Alquiler | `Clock` + `Key` |
| Venta | `ShoppingCart` + `Tag` |
| Ficha técnica | `ClipboardList` |
| Rating | `Star` |
| Reseña | `MessageSquare` |
| Categoría industrial | íconos custom SVG por vertical |
| Certificación | `Award` |
| Stock | `Package` |
| Entrega / Logística | `Truck` |

---

## 8. DISEÑO RESPONSIVE Y MOBILE

### 8.1 Adaptaciones Mobile

| Elemento | Desktop | Mobile |
|---|---|---|
| Navbar | Horizontal completo | Hamburger + bottom nav |
| Filtros búsqueda | Sidebar izquierdo fijo | Drawer desde abajo (bottom sheet) |
| Cards de producto | Grid 3 columnas | Lista 1 columna o grid 2 col |
| Ficha técnica | 2 columnas | 1 columna scrollable |
| Galería de producto | Thumbnails + zoom | Swipe carousel |
| Panel empresa | Sidebar + contenido | Tabs en la parte superior |
| Formulario RFQ | Modal lateral | Full screen modal |
| Comparador | 4 columnas | 2 columnas con scroll |

### 8.2 Navegación Bottom Bar (Mobile)
```
┌──────────────────────────────────────────────┐
│  🔍 Buscar  ♡ Guardados  📋 Cotiz.  👤 Perfil│
└──────────────────────────────────────────────┘
```

---

## 9. ESTADOS DE UI

### 9.1 Estados Vacíos (Empty States)

```
🏭  "Aún no hay productos en esta categoría"
     Sé el primero en publicar maquinaria aquí.
     [Publicar producto]

📋  "Sin cotizaciones todavía"
     Los proveedores responderán en menos de 48 horas.
     [Explorar catálogo]

⭐  "Sin reseñas todavía"
     Completa una compra para ser el primero en opinar.
```

### 9.2 Estados de Carga (Skeleton Loaders)
- Cards: skeleton rectangulares animados (pulse animation)
- Imágenes: BG placeholder `--color-border` con shimmer
- Texto: líneas de skeleton con width variable (60–90%)

### 9.3 Toasts y Notificaciones

```
SUCCESS: ✓ Cotización enviada exitosamente    [BG success-bg, text success]
ERROR:   ✗ Error al enviar. Intenta de nuevo  [BG error-bg, text error]
INFO:    ℹ La empresa respondió tu cotización  [BG info-bg, text info]
WARNING: ⚠ Tu suscripción vence en 3 días     [BG warning-bg, text warning]

Posición: top-right en desktop / top-center en mobile
Duración: 4 segundos (auto-dismiss)
```

---

## 10. ANIMACIONES Y MICRO-INTERACCIONES

```css
/* Transiciones base */
--transition-fast:   0.15s ease;
--transition-base:   0.25s ease;
--transition-slow:   0.4s ease;
--transition-spring: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Hover en cards */
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(0,0,0,0.12);
transition: var(--transition-base);

/* Hover en botón primario */
background: --color-primary-dark;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(232,93,4,0.3);

/* Page load: staggered reveal */
.card:nth-child(n) { animation-delay: calc(n * 0.05s); }

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

/* Star rating hover */
.star:hover ~ .star { color: --color-star-empty; }
.star:hover { color: --color-star-filled; }
```

---

## 11. ACCESIBILIDAD

- Contraste mínimo WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
- Todos los inputs con `<label>` asociado o `aria-label`
- Focus visible en todos los elementos interactivos (outline 2px `--color-primary`)
- Alt text obligatorio en imágenes de producto
- Estructura semántica: `<main>`, `<nav>`, `<article>`, `<section>`
- Roles ARIA en componentes custom (modales, dropdowns, tabs)
- Skip to content link al inicio del documento
- Formularios con validación y mensajes de error accesibles
- Compatibilidad con lectores de pantalla (NVDA, VoiceOver)

---

## 12. ASSETS Y RECURSOS

### 12.1 Logo Guidelines
- Versión primaria: isotipo + logotipo horizontal
- Colores: versión naranja (fondo claro) y versión blanca (fondo oscuro)
- Espacio mínimo libre alrededor: 1× altura del logotipo
- No distorsionar, rotar ni cambiar colores del logo

### 12.2 Imágenes por Defecto

| Elemento | Dimensiones | Formato |
|---|---|---|
| Hero de landing | 1440 × 600px | WebP |
| Portada empresa | 1200 × 300px | WebP |
| Logo empresa | 200 × 200px | PNG (transparente) |
| Imagen producto (principal) | 1200 × 900px | WebP |
| Imagen producto (galería) | 800 × 600px | WebP |
| Avatar usuario | 200 × 200px | WebP/PNG |
| OG Image | 1200 × 630px | JPG |

---

*Este documento es la fuente de verdad del diseño. Todo nuevo componente debe seguir este sistema antes de ser implementado.*
