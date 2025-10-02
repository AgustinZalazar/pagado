# 💰 Pagado - Sistema de Gestión Financiera Personal

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-Integration-green?logo=google-sheets)

**Pagado** es una aplicación web moderna de gestión financiera personal que utiliza Google Sheets como backend de datos, permitiendo a los usuarios gestionar sus ingresos, gastos, presupuestos y cuentas de manera intuitiva y segura.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Diagramas](#-diagramas)
- [Tipos de Datos](#-tipos-de-datos)
- [API Routes](#-api-routes)
- [Componentes Principales](#-componentes-principales)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Internacionalización](#-internacionalización)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)

---

## ✨ Características Principales

### 🔐 Autenticación
- Login con Google OAuth 2.0
- Gestión automática de tokens de acceso y refresh tokens
- Sesiones basadas en base de datos con NextAuth v5
- Protección de rutas con middleware

### 💳 Gestión de Transacciones
- Registro de ingresos y gastos
- Categorización personalizable con iconos y colores
- Filtrado por categoría, método de pago y fechas
- Edición y eliminación de transacciones
- Visualización en tablas interactivas con TanStack Table

### 📊 Dashboard Analítico
- Gráficos de ingresos y gastos mensuales
- Desglose de gastos por categoría (pie chart)
- Tarjetas de resumen con variaciones porcentuales
- Marquesina de tasas de cambio en tiempo real
- Pagos recurrentes destacados

### 🏦 Gestión de Cuentas
- Creación de cuentas personalizadas
- Métodos de pago asociados (tarjetas de crédito/débito, efectivo, etc.)
- Tipos de tarjetas (Visa, Mastercard, American Express, etc.)

### 📈 Presupuestos
- Definición de presupuestos por categoría
- Seguimiento de porcentaje de gasto
- Indicadores visuales de progreso

### 🌍 Soporte Multimoneda
- 30+ monedas soportadas
- Conversión automática de divisas
- Tasas de cambio actualizadas

### 🌐 Internacionalización
- Soporte para español e inglés
- Cambio de idioma dinámico
- Traducción de toda la interfaz

### 🎨 UI/UX Moderna
- Modo claro y oscuro
- Diseño responsive (móvil, tablet, desktop)
- Componentes animados con Framer Motion
- UI basada en Radix UI y Tailwind CSS

---

## 🏗️ Arquitectura del Proyecto

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Next.js)                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │  Landing   │  │    Auth    │  │  Dashboard (RSC)    │   │
│  │   Pages    │  │   Pages    │  │   - Home            │   │
│  │            │  │            │  │   - Transactions    │   │
│  └────────────┘  └────────────┘  │   - Budget          │   │
│                                   │   - Accounts        │   │
│                                   └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE API (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Transaction  │  │  Category    │  │    Methods      │   │
│  │     API      │  │     API      │  │      API        │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  User API    │  │ Google Sheets│  │   Auth API      │   │
│  │              │  │     API      │  │  (NextAuth)     │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │   MySQL (Drizzle)    │  │  Google Sheets API       │    │
│  │  - Users             │  │  - Transactions          │    │
│  │  - Accounts          │  │  - Categories (Config)   │    │
│  │  - Sessions          │  │  - Methods (Config)      │    │
│  │  - Tokens            │  │  - Monthly Sheets        │    │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```mermaid
graph TD
    A[Usuario ingresa] --> B{¿Primera vez?}
    B -->|Sí| C[Login con Google]
    B -->|No| D[Verificar sesión]
    C --> E[NextAuth OAuth]
    E --> F[Obtener tokens]
    F --> G{¿Usuario existe?}
    G -->|No| H[Crear usuario en DB]
    G -->|Sí| I[Verificar Google Sheet]
    H --> J[Crear Google Sheet]
    J --> K[Setup inicial del Sheet]
    K --> L[Guardar sheetId]
    I --> M{¿Sheet existe?}
    M -->|No| J
    M -->|Sí| N{¿Sheet válido?}
    N -->|No| K
    N -->|Sí| O[Acceso al Dashboard]
    L --> O
    D --> P{¿Sesión válida?}
    P -->|Sí| O
    P -->|No| C
```

### Flujo de Transacciones

```mermaid
graph LR
    A[Usuario crea transacción] --> B[Formulario de validación]
    B --> C[Envío a API /api/transaction]
    C --> D[Autenticación]
    D --> E[Obtener sheetId del usuario]
    E --> F[Conectar a Google Sheets API]
    F --> G[Determinar hoja mensual]
    G --> H[Calcular próximo ID]
    H --> I[Insertar datos en Sheet]
    I --> J[Respuesta exitosa]
    J --> K[Revalidación de datos]
    K --> L[Actualización UI]
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14.2 (App Router)
- **Lenguaje**: TypeScript 5
- **Styling**: Tailwind CSS 3.3
- **Componentes UI**: Radix UI
- **Animaciones**: Framer Motion (motion)
- **Gráficos**: Recharts
- **Tablas**: TanStack Table (React Table)
- **Formularios**: React Hook Form + Zod
- **Gestión de Estado**: React Query (TanStack Query)
- **Internacionalización**: next-intl 3.26

### Backend & Base de Datos
- **Base de Datos**: MySQL
- **ORM**: Drizzle ORM 0.38
- **Autenticación**: NextAuth v5 (beta)
- **Adaptador DB**: Drizzle Adapter
- **API Externa**: Google Sheets API v4

### Herramientas de Desarrollo
- **Linting**: ESLint
- **Formateo**: Prettier
- **Gestor de Paquetes**: npm/yarn/pnpm

---

## 📁 Estructura del Proyecto

```
pagado_front/
│
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── [locale]/                 # Rutas internacionalizadas
│   │   │   ├── (auth)/              # Grupo de rutas de autenticación
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (protected)/         # Grupo de rutas protegidas
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx     # Dashboard principal
│   │   │   │       ├── incomes/     # Gestión de transacciones
│   │   │   │       ├── budget/      # Gestión de presupuestos
│   │   │   │       ├── accounts/    # Gestión de cuentas
│   │   │   │       └── settings/    # Configuración
│   │   │   └── page.tsx             # Landing page
│   │   └── api/                      # API Routes
│   │       ├── transaction/
│   │       ├── category/
│   │       ├── methods/
│   │       ├── accounts/
│   │       ├── user/
│   │       ├── google-sheets/
│   │       └── auth/
│   │
│   ├── components/                   # Componentes React
│   │   ├── ui/                      # Componentes base (Radix/shadcn)
│   │   ├── dashboard/               # Componentes del dashboard
│   │   │   ├── home/               # Componentes de la página principal
│   │   │   ├── incomes/            # Componentes de transacciones
│   │   │   ├── budget/             # Componentes de presupuesto
│   │   │   ├── accounts/           # Componentes de cuentas
│   │   │   ├── modals/             # Modales
│   │   │   └── DataTableComponents/ # Componentes de tabla
│   │   ├── auth/                    # Componentes de autenticación
│   │   └── landing/                 # Componentes de landing page
│   │
│   ├── actions/                      # Server Actions
│   ├── hooks/                        # Custom React Hooks
│   ├── helpers/                      # Funciones helper
│   ├── lib/                          # Utilidades y configuraciones
│   ├── i18n/                         # Configuración de internacionalización
│   ├── context/                      # React Contexts
│   └── middleware.ts                 # Middleware de Next.js
│
├── types/                            # Definiciones de tipos TypeScript
│   ├── transaction.ts
│   ├── category.ts
│   ├── PaymentMethod.ts
│   ├── Accounts.ts
│   ├── User.ts
│   └── Currency.ts
│
├── db/                               # Configuración de base de datos
│   ├── schema.ts                    # Esquema Drizzle
│   └── index.ts
│
├── data/                             # Data estática
│   ├── currency.ts
│   ├── colors.ts
│   └── icons.ts
│
├── schemas/                          # Esquemas de validación Zod
├── public/                           # Archivos estáticos
├── auth.ts                           # Configuración de NextAuth
├── auth.config.ts                    # Configuración extendida de auth
├── routes.ts                         # Definición de rutas
├── drizzle.config.ts                # Configuración de Drizzle
└── middleware.ts                     # Middleware principal
```

---

## 📊 Diagramas

### Modelo de Datos (Base de Datos MySQL)

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email (UNIQUE)          │
│ emailVerified           │
│ image                   │
│ sheetId                 │◄──── ID de Google Sheet del usuario
│ phone                   │
│ country                 │
│ currency                │
└─────────────────────────┘
           │
           │ 1:N
           ▼
┌─────────────────────────┐
│       accounts          │
├─────────────────────────┤
│ userId (FK)             │
│ type                    │
│ provider                │
│ providerAccountId (PK)  │
│ refresh_token           │
│ access_token            │◄──── Token de Google
│ expires_at              │
│ token_type              │
│ scope                   │
│ id_token                │
│ session_state           │
└─────────────────────────┘

┌─────────────────────────┐
│       sessions          │
├─────────────────────────┤
│ sessionToken (PK)       │
│ userId (FK)             │
│ expires                 │
└─────────────────────────┘

┌─────────────────────────┐
│  verificationTokens     │
├─────────────────────────┤
│ identifier (PK)         │
│ token (PK)              │
│ expires                 │
└─────────────────────────┘
```

### Modelo de Datos (Google Sheets)

```
Google Sheet del Usuario
│
├── Enero (Sheet)
│   ├── Columnas: [id, description, type, category, amount, currency, date, account, method]
│   └── Datos de transacciones del mes
│
├── Febrero (Sheet)
├── Marzo (Sheet)
├── ... (Hojas para cada mes)
│
└── Config (Sheet)
    ├── Sección Categorías (A:E)
    │   └── [id, nombre, color, porcentaje, icon]
    │
    └── Sección Métodos de Pago (L:O)
        └── [id, title, cardType, idAccount]
```

### Arquitectura de Componentes (Dashboard)

```
DashboardLayout
│
├── AppSidebar
│   ├── Logo
│   ├── Navigation Items
│   ├── Language Toggle
│   └── Dark Mode Toggle
│
└── Main Content
    │
    ├── Dashboard Home
    │   ├── CurrencyMarquee
    │   ├── IncomeChart
    │   ├── ExpenseChart
    │   ├── SummaryCards (Savings/Debt)
    │   ├── ExpensePieChart
    │   ├── RecurringPayments
    │   └── CategoryBreakdown
    │
    ├── Transactions (Incomes/Expenses)
    │   ├── FilterControls
    │   ├── SummaryCards
    │   ├── NewTransactionWindow
    │   └── DataTable
    │       ├── Columns (custom)
    │       ├── Pagination
    │       └── Row Actions (Edit/Delete)
    │
    ├── Budget
    │   ├── NewCategoryWindow
    │   └── CategoryCards
    │       ├── Progress Indicator
    │       ├── EditPopover
    │       └── DeleteButton
    │
    └── Accounts
        ├── DialogWindowAccount
        ├── DialogWindowMethod
        └── AccountList
            └── CardMethod
```

---

## 📝 Tipos de Datos

### Transaction
```typescript
type Transaction = {
    id: string;
    description: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    currency: string;
    date: string;
    account: string;
    method: string;
}
```

### Category
```typescript
interface Category {
    id: string;
    nombre: string;
    color?: string;
    porcentaje: number;
    icon: string;
}

interface SummaryCategory {
    currentMonth: {
        month: string;
        category: string;
        total: number;
    };
    previousMonth: {
        month: string;
        category: string;
        total: number;
    };
    percentage: string;
}
```

### Account & Method
```typescript
interface Account {
    id: string;
    title: string;
    type: string;
    color: string;
    Methods?: Method[];
}

interface Method {
    id: string;
    title: string;
    cardType: string;
    idAccount?: string;
}
```

### User
```typescript
interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    country: string;
    currency: string;
    sheetId: string;
}
```

### Currency
```typescript
interface CountryCurrency {
    country: string;
    currency: string;
    code: string;
    phoneCode: string;
    iso: string;
}
```

---

## 🔌 API Routes

### Transacciones

#### `GET /api/transaction?month=YYYY-MM&mail=email`
Obtiene todas las transacciones de un mes específico.

**Query Params:**
- `month`: Mes en formato YYYY-MM
- `mail`: Email del usuario (opcional si está autenticado)

**Headers:**
- `Authorization: Bearer <token>` (si no hay sesión)

**Respuesta:**
```json
{
  "formattedTransactions": [
    {
      "id": "1",
      "description": "Compra supermercado",
      "type": "expense",
      "category": "Alimentación",
      "amount": 50000,
      "currency": "ARS",
      "date": "2025-10-01",
      "account": "Cuenta Personal",
      "method": "Tarjeta Débito"
    }
  ]
}
```

#### `POST /api/transaction`
Crea una nueva transacción.

**Body:**
```json
{
  "description": "Salario",
  "type": "income",
  "category": "Trabajo",
  "amount": 500000,
  "currency": "ARS",
  "date": "2025-10-01",
  "account": "Cuenta Personal",
  "method": "Transferencia"
}
```

#### `PUT /api/transaction`
Actualiza una transacción existente.

#### `DELETE /api/transaction`
Elimina una transacción.

### Categorías

#### `GET /api/category?mail=email`
Obtiene todas las categorías del usuario.

#### `POST /api/category`
Crea una nueva categoría.

**Body:**
```json
{
  "nombre": "Transporte",
  "color": "#FF5733",
  "porcentaje": 15,
  "icon": "car"
}
```

#### `PUT /api/category`
Actualiza una categoría.

#### `DELETE /api/category`
Elimina una categoría.

### Métodos de Pago

#### `GET /api/methods?mail=email`
Obtiene todos los métodos de pago.

#### `POST /api/methods`
Crea un nuevo método de pago.

**Body:**
```json
{
  "title": "Visa Personal",
  "cardType": "Visa",
  "idAccount": "1"
}
```

#### `PUT /api/methods`
Actualiza un método.

#### `DELETE /api/methods`
Elimina un método.

### Usuarios

#### `GET /api/user/[email]`
Obtiene información del usuario por email.

#### `PATCH /api/user/[email]`
Actualiza información del usuario (sheetId, phone, currency, etc.).

#### `GET /api/user/phone/[phone]`
Obtiene usuario por número de teléfono.

### Google Sheets

#### `POST /api/google-sheets`
Crea una nueva hoja de cálculo para el usuario.

#### `GET /api/google-sheets/validate?sheetId=xxx`
Valida si una hoja de cálculo existe y está correctamente configurada.

#### `POST /api/setup-sheet`
Configura la estructura inicial de una hoja (meses + hoja Config).

#### `GET /api/drive/check-quota`
Verifica el espacio disponible en Google Drive.

### Resúmenes

#### `GET /api/transaction/summary/bymonth?month=YYYY-MM`
Obtiene resúmenes de transacciones por mes.

#### `GET /api/transaction/category?month=YYYY-MM`
Obtiene totales por categoría en un mes.

#### `GET /api/transaction/method?month=YYYY-MM`
Obtiene totales por método de pago en un mes.

---

## 🎨 Componentes Principales

### Dashboard

- **`SummaryCard`**: Tarjeta de resumen con monto, cambio y porcentaje de variación
- **`IncomeChart` / `ExpenseChart`**: Gráficos de barras para ingresos/gastos mensuales
- **`ExpensePieChart`**: Gráfico circular de distribución de gastos
- **`CurrencyMarquee`**: Marquesina de tasas de cambio
- **`RecurringPayments`**: Lista de pagos recurrentes
- **`CategoryBreakdown`**: Desglose de gastos por categoría

### Transacciones

- **`DataTable`**: Tabla interactiva con filtrado, ordenamiento y paginación
- **`NewTransactionWindow`**: Modal para crear transacciones
- **`FormTransaction`**: Formulario de transacción con validación
- **`FilterControls`**: Controles de filtrado por categoría/método/fechas
- **`EditPopover`**: Popover para editar transacciones

### Presupuesto

- **`FormCategories`**: Formulario para crear/editar categorías
- **`IconSelector`**: Selector de iconos para categorías
- **`CardsContainer`**: Contenedor de tarjetas de categorías
- **`EditPopover`**: Edición rápida de categorías

### Cuentas

- **`FormAccount`**: Formulario de creación de cuentas
- **`FormMethod`**: Formulario de métodos de pago
- **`CardMethod`**: Tarjeta visual de método de pago
- **`AccountList`**: Lista de cuentas y métodos

### UI Base (Radix)

- Button, Dialog, Popover, Select, Input, Label
- Toast, Tooltip, Card, Avatar, Badge
- Table, Progress, Separator, ScrollArea
- Collapsible, HoverCard, Command

---

## 🔐 Autenticación y Seguridad

### NextAuth v5 Configuration

- **Estrategia de sesión**: Database (MySQL)
- **Proveedor OAuth**: Google
- **Scopes solicitados**:
  - `openid email profile`
  - `https://www.googleapis.com/auth/drive.file` (acceso a Google Sheets)

### Flujo de Autenticación

1. Usuario inicia sesión con Google
2. NextAuth almacena cuenta y tokens en MySQL
3. Se verifica si el usuario tiene un `sheetId`
4. Si no existe, se crea automáticamente una Google Sheet
5. La hoja se configura con estructura mensual y hoja Config
6. Se actualiza el usuario con el `sheetId`
7. En cada request, se valida el token de acceso
8. Si está expirado, se usa el refresh token automáticamente

### Protección de Rutas

- Middleware de internacionalización con next-intl
- Validación de sesión para rutas `/dashboard/*`
- API routes protegidas con validación de token o sesión

### Tokens y Sesiones

- **Access Token**: Guardado en tabla `accounts`, usado para Google API
- **Refresh Token**: Usado para renovar access token
- **Session Token**: Cookie de sesión gestionada por NextAuth
- **API Secret Token**: Token interno para comunicación entre APIs

---

## 🌐 Internacionalización

### Configuración (next-intl)

- **Idiomas soportados**: Español (es), Inglés (en)
- **Locale por defecto**: Español
- **Routing**: Basado en prefijo de URL (`/es/*`, `/en/*`)

### Archivos de Traducción

```
messages/
├── es.json
└── en.json
```

### Uso en Componentes

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('Dashboard.Home');
return <h1>{t('title')}</h1>;
```

### Cambio de Idioma

Selector de idioma disponible en:
- Landing page
- Dashboard sidebar

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 20+
- MySQL 8+
- Cuenta de Google Cloud (para OAuth y Sheets API)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd pagado_front
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:
```env
# Base de datos
DATABASE_URL="mysql://user:password@localhost:3306/pagado"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-aqui"

# Google OAuth
AUTH_GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_CLIENT_SECRET="tu-client-secret"

# API Secret (para comunicación interna)
API_SECRET_TOKEN="tu-token-secreto"
```

4. **Configurar Google Cloud Console**

- Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
- Habilitar Google Sheets API y Google Drive API
- Crear credenciales OAuth 2.0
- Agregar URLs autorizadas:
  - `http://localhost:3000`
  - `http://localhost:3000/api/auth/callback/google`

5. **Ejecutar migraciones de base de datos**
```bash
npm run db:push
# o usar Drizzle Studio para gestionar la DB
npx drizzle-kit studio
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

7. **Abrir en navegador**
```
http://localhost:3000
```

---

## 🔑 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión MySQL | `mysql://user:pass@host:3306/db` |
| `NEXTAUTH_URL` | URL base de la aplicación | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret para encriptar tokens | `openssl rand -base64 32` |
| `AUTH_GOOGLE_CLIENT_ID` | Client ID de Google OAuth | `xxxxx.apps.googleusercontent.com` |
| `AUTH_GOOGLE_CLIENT_SECRET` | Client Secret de Google | `GOCSPX-xxxx` |
| `API_SECRET_TOKEN` | Token para APIs internas | `cualquier-string-secreto` |

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint

# Base de datos (Drizzle)
npm run db:push      # Aplica cambios del schema a la DB
npm run db:studio    # Abre Drizzle Studio
```

---

## 📄 Licencia

Este proyecto es privado y de uso personal.

---

## 👨‍💻 Autor

**Pagado Team**

---

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, abre un issue en el repositorio.

---

## 🔄 Estado del Proyecto

🚧 **En desarrollo activo** - Nuevas funcionalidades se agregan constantemente.

### Próximas Funcionalidades
- Integración con WhatsApp Bot
- Exportación de reportes PDF
- Notificaciones push
- Análisis predictivo de gastos
- Gestión de inversiones
- Módulo de ahorros por objetivos

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
