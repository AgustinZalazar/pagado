# 💳 Plan de Implementación de Suscripciones - Estrategia Híbrida

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Propuesta](#arquitectura-propuesta)
3. [Modificaciones en Base de Datos](#modificaciones-en-base-de-datos)
4. [Nuevos API Routes](#nuevos-api-routes)
5. [Webhooks y Eventos](#webhooks-y-eventos)
6. [Componentes UI](#componentes-ui)
7. [Middleware y Autorización](#middleware-y-autorización)
8. [Planes de Suscripción](#planes-de-suscripción)
9. [Variables de Entorno](#variables-de-entorno)
10. [Flujos de Usuario](#flujos-de-usuario)
11. [Pruebas y Seguridad](#pruebas-y-seguridad)
12. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 1. Resumen Ejecutivo

### ✨ Objetivo
Implementar un sistema de suscripciones de pago utilizando **Stripe + Mercado Pago** como estrategia híbrida para maximizar conversión en el mercado latinoamericano.

### 🎯 Estrategia de Pagos: Por qué Stripe + Mercado Pago

#### **Opción #1: Stripe + Mercado Pago (Estrategia Híbrida)** ✅ SELECCIONADA

**Stripe para:**
- ✅ Clientes con tarjetas internacionales
- ✅ Expansión global futura
- ✅ Infraestructura robusta (Stripe Billing)
- ✅ API/documentación de clase mundial
- ✅ Soporta Boleto (Brasil) para suscripciones

**Mercado Pago para:**
- ✅ Máxima conversión en LATAM (PIX, OXXO, etc.)
- ✅ Métodos de pago locales populares
- ✅ Confianza del usuario (marca conocida en LATAM)
- ✅ Penetración en segmento sin tarjetas
- ✅ Soporta suscripciones vía API

### 📊 Ventajas de la Estrategia Híbrida

| Aspecto | Solo Stripe | Solo Mercado Pago | **Stripe + Mercado Pago** |
|---------|-------------|-------------------|---------------------------|
| Conversión LATAM | 60-70% | 90-95% | **90-95%** ✅ |
| Métodos de Pago Locales | Limitado | Completo | **Completo** ✅ |
| Expansión Global | Excelente | Limitado | **Excelente** ✅ |
| Calidad de API | Excelente | Bueno | **Excelente** ✅ |
| Costo Inicial | Bajo | Bajo | **Bajo** ✅ |
| Complejidad | Baja | Baja | **Media** ⚠️ |

### 💰 Comparación de Métodos de Pago

| Método de Pago | Stripe | Mercado Pago | País |
|----------------|--------|--------------|------|
| **Tarjetas de Crédito/Débito** | ✅ | ✅ | Todos |
| **PIX** | ❌ (solo one-time)* | ✅ | Brasil |
| **Boleto Bancário** | ✅ | ✅ | Brasil |
| **OXXO** | ❌ (solo one-time) | ✅ | México |
| **SPEI** | ❌ | ✅ | México |
| **Mercado Pago Wallet** | ❌ | ✅ | LATAM |
| **Apple/Google Pay** | ✅ | ✅ | Global |
| **PayPal** | ✅ | ❌ | Global |

\* PIX en Stripe solo soporta pagos únicos, no suscripciones recurrentes aún.

### 📊 Modelo de Negocio Propuesto
- **Plan Free**: Dashboard básico, WhatsApp bot sin IA, sin límites en transacciones/categorías
- **Plan Pro**: Gastos recurrentes, inversiones, WhatsApp bot con IA (5000 tokens)
- **Plan Premium**: Análisis predictivo, importación Excel con IA, reportes avanzados (10000 tokens)

---

## 2. Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO (Frontend)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Dashboard   │  │  Pricing     │  │  Subscription   │   │
│  │              │  │   Page       │  │   Management    │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Subscription │  │   Payment    │  │    Webhook      │   │
│  │     API      │  │     API      │  │    Handler      │   │
│  │              │  │  (Router)    │  │ (Multi-provider)│   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓               ↓
┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ MySQL Database │  │  Stripe API  │  │ Mercado Pago API │
│  - users       │  │  - Checkout  │  │  - Subscriptions │
│  - subs        │  │  - Billing   │  │  - Checkout      │
│  - payments    │  │  - Webhooks  │  │  - Webhooks      │
│  - invoices    │  └──────────────┘  └──────────────────┘
└────────────────┘
```

### 🔄 Flujo de Selección de Proveedor

```typescript
// Lógica de enrutamiento de pagos
function selectPaymentProvider(userCountry: string, paymentMethod: string): 'stripe' | 'mercadopago' {
    // Métodos exclusivos de Mercado Pago
    const mercadoPagoMethods = ['pix', 'oxxo', 'mercadopago', 'spei'];

    if (mercadoPagoMethods.includes(paymentMethod)) {
        return 'mercadopago';
    }

    // Países donde Mercado Pago es preferido (mejor conversión)
    const mercadoPagoCountries = ['AR', 'BR', 'MX', 'CL', 'CO', 'PE'];

    if (mercadoPagoCountries.includes(userCountry) && paymentMethod === 'card') {
        return 'mercadopago'; // Priorizar MP en LATAM para tarjetas
    }

    // Default: Stripe (PayPal, tarjetas internacionales, etc.)
    return 'stripe';
}
```

---

## 3. Modificaciones en Base de Datos

### 📊 Nuevo Schema (Drizzle ORM)

#### 3.1. Tabla `subscriptions`

```typescript
// db/schema.ts

export const subscriptions = mysqlTable("subscription", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 36 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    // Payment Provider Info (Stripe o Mercado Pago)
    provider: varchar("provider", { length: 20 }).notNull(), // 'stripe' | 'mercadopago'

    // Stripe fields
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),

    // Mercado Pago fields
    mercadopagoSubscriptionId: varchar("mercadopagoSubscriptionId", { length: 255 }).unique(),
    mercadopagoPayerId: varchar("mercadopagoPayerId", { length: 255 }),

    // Plan info
    planId: varchar("planId", { length: 50 }).notNull(), // 'free', 'pro', 'premium'
    planName: varchar("planName", { length: 100 }),

    // Status
    status: varchar("status", { length: 50 }).notNull(), // 'active', 'canceled', 'past_due', 'trialing', 'paused'

    // Pricing
    amount: int("amount").notNull(), // en centavos
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    billingCycle: varchar("billingCycle", { length: 20 }).notNull(), // 'monthly', 'yearly'

    // Dates
    currentPeriodStart: timestamp("currentPeriodStart", { mode: "date" }),
    currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
    canceledAt: timestamp("canceledAt", { mode: "date" }),
    trialEndsAt: timestamp("trialEndsAt", { mode: "date" }),

    // Metadata
    metadata: varchar("metadata", { length: 2048 }), // JSON string

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
});

// Indexes
export const subscriptionUserIdIndex = index("subscription_userId_idx").on(subscriptions.userId);
export const subscriptionStatusIndex = index("subscription_status_idx").on(subscriptions.status);
export const subscriptionProviderIndex = index("subscription_provider_idx").on(subscriptions.provider);
```

#### 3.2. Tabla `payments`

```typescript
export const payments = mysqlTable("payment", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 36 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: varchar("subscriptionId", { length: 36 })
        .references(() => subscriptions.id, { onDelete: "set null" }),

    // Payment Provider
    provider: varchar("provider", { length: 20 }).notNull(), // 'stripe' | 'mercadopago'

    // Stripe fields
    stripePaymentId: varchar("stripePaymentId", { length: 255 }).unique(),
    stripeChargeId: varchar("stripeChargeId", { length: 255 }),

    // Mercado Pago fields
    mercadopagoPaymentId: varchar("mercadopagoPaymentId", { length: 255 }).unique(),
    mercadopagoChargeId: varchar("mercadopagoChargeId", { length: 255 }),

    // Payment info
    amount: int("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(), // 'pending', 'succeeded', 'failed', 'refunded'
    paymentMethod: varchar("paymentMethod", { length: 100 }), // 'pix', 'card', 'oxxo', 'mercadopago', etc.

    // Receipt
    receiptUrl: varchar("receiptUrl", { length: 500 }),
    invoiceUrl: varchar("invoiceUrl", { length: 500 }),

    // Metadata
    metadata: varchar("metadata", { length: 2048 }),
    errorMessage: varchar("errorMessage", { length: 500 }),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
});

export const paymentUserIdIndex = index("payment_userId_idx").on(payments.userId);
export const paymentStatusIndex = index("payment_status_idx").on(payments.status);
export const paymentProviderIndex = index("payment_provider_idx").on(payments.provider);
```

#### 3.3. Tabla `invoices`

```typescript
export const invoices = mysqlTable("invoice", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 36 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: varchar("subscriptionId", { length: 36 })
        .references(() => subscriptions.id, { onDelete: "set null" }),
    paymentId: varchar("paymentId", { length: 36 })
        .references(() => payments.id, { onDelete: "set null" }),

    // Payment Provider
    provider: varchar("provider", { length: 20 }).notNull(),

    // Provider-specific fields
    stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }).unique(),
    mercadopagoInvoiceId: varchar("mercadopagoInvoiceId", { length: 255 }).unique(),

    // Invoice details
    invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
    amount: int("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(), // 'draft', 'open', 'paid', 'void', 'uncollectible'

    // Dates
    issuedAt: timestamp("issuedAt", { mode: "date" }).notNull(),
    dueDate: timestamp("dueDate", { mode: "date" }),
    paidAt: timestamp("paidAt", { mode: "date" }),

    // URLs
    hostedInvoiceUrl: varchar("hostedInvoiceUrl", { length: 500 }),
    pdfUrl: varchar("pdfUrl", { length: 500 }),

    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
});
```

#### 3.4. Modificación en tabla `users`

```typescript
export const users = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
    image: varchar("image", { length: 255 }),
    sheetId: varchar("sheetId", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    country: varchar("country", { length: 255 }),
    currency: varchar("currency", { length: 255 }),

    // 🆕 Subscription fields
    subscriptionStatus: varchar("subscriptionStatus", { length: 50 })
        .notNull()
        .default("free"), // 'free', 'active', 'canceled', 'past_due', 'trialing'
    currentPlanId: varchar("currentPlanId", { length: 50 })
        .notNull()
        .default("free"), // 'free', 'pro', 'premium'

    // Payment Provider IDs
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    mercadopagoPayerId: varchar("mercadopagoPayerId", { length: 255 }),

    // Feature flags
    hasAccessToWhatsappBotWithAI: boolean("hasAccessToWhatsappBotWithAI").default(false),
    hasAccessToRecurringExpenses: boolean("hasAccessToRecurringExpenses").default(false),
    hasAccessToInvestments: boolean("hasAccessToInvestments").default(false),
    hasAccessToPredictiveAnalysis: boolean("hasAccessToPredictiveAnalysis").default(false),
    hasAccessToAdvancedReports: boolean("hasAccessToAdvancedReports").default(false),
    hasAccessToExcelImportWithAI: boolean("hasAccessToExcelImportWithAI").default(false),

    // Token limits for AI features
    aiTokensLimit: int("aiTokensLimit").default(0), // 0 = free, 5000 = pro, 10000 = premium
    aiTokensUsed: int("aiTokensUsed").default(0),
    aiTokensResetDate: timestamp("aiTokensResetDate", { mode: "date" }),
});
```

### 🔄 Migración

```bash
# Generar migración
npx drizzle-kit generate:mysql

# Aplicar migración
npm run db:push

# O usar Drizzle Studio
npx drizzle-kit studio
```

---

## 4. Nuevos API Routes

### 📁 Estructura de API Routes

```
src/app/api/
├── subscription/
│   ├── route.ts                    # GET, POST (crear suscripción)
│   ├── [id]/route.ts              # GET, PUT, DELETE
│   ├── cancel/route.ts            # POST
│   ├── resume/route.ts            # POST
│   ├── upgrade/route.ts           # POST
│   └── downgrade/route.ts         # POST
├── payment/
│   ├── route.ts                    # GET, POST
│   ├── create-checkout/route.ts   # POST (enruta a Stripe/MP)
│   └── [id]/route.ts              # GET
├── webhook/
│   ├── stripe/route.ts            # POST (webhooks de Stripe)
│   └── mercadopago/route.ts       # POST (webhooks de Mercado Pago)
└── plans/
    └── route.ts                    # GET (obtener planes disponibles)
```

### 🔌 Implementación de API Routes

#### 4.1. `/api/payment/create-checkout/route.ts` (Router)

```typescript
// src/app/api/payment/create-checkout/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createStripeCheckout } from "@/lib/stripe/checkout";
import { createMercadoPagoCheckout } from "@/lib/mercadopago/checkout";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { planId, paymentMethod, userCountry } = body;

        // Determinar qué proveedor usar
        const provider = selectPaymentProvider(userCountry, paymentMethod);

        let checkoutUrl: string;
        let sessionId: string;

        if (provider === 'stripe') {
            const stripeSession = await createStripeCheckout({
                userId: session.user.id,
                userEmail: session.user.email!,
                userName: session.user.name!,
                planId,
            });
            checkoutUrl = stripeSession.url!;
            sessionId = stripeSession.id;
        } else {
            const mpSession = await createMercadoPagoCheckout({
                userId: session.user.id,
                userEmail: session.user.email!,
                userName: session.user.name!,
                planId,
            });
            checkoutUrl = mpSession.init_point;
            sessionId = mpSession.id;
        }

        return NextResponse.json({
            provider,
            checkoutUrl,
            sessionId
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating checkout:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

function selectPaymentProvider(
    userCountry: string,
    paymentMethod: string
): 'stripe' | 'mercadopago' {
    const mercadoPagoMethods = ['pix', 'oxxo', 'mercadopago', 'spei'];

    if (mercadoPagoMethods.includes(paymentMethod)) {
        return 'mercadopago';
    }

    const mercadoPagoCountries = ['AR', 'BR', 'MX', 'CL', 'CO', 'PE'];

    if (mercadoPagoCountries.includes(userCountry) && paymentMethod === 'card') {
        return 'mercadopago';
    }

    return 'stripe';
}
```

#### 4.2. `/lib/stripe/checkout.ts` (Stripe Helper)

```typescript
// src/lib/stripe/checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

interface CreateCheckoutParams {
    userId: string;
    userEmail: string;
    userName: string;
    planId: string;
}

export async function createStripeCheckout(params: CreateCheckoutParams) {
    const { userId, userEmail, userName, planId } = params;

    // Obtener o crear customer
    let customerId = await getOrCreateStripeCustomer(userId, userEmail, userName);

    // Crear checkout session
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: getStripePriceId(planId),
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/canceled`,
        metadata: {
            userId,
            planId,
            provider: 'stripe',
        },
        subscription_data: {
            trial_period_days: 14,
            metadata: {
                userId,
                planId,
            },
        },
    });

    return session;
}

async function getOrCreateStripeCustomer(
    userId: string,
    email: string,
    name: string
): Promise<string> {
    // Buscar customer existente en DB
    const user = await db.select()
        .from(users)
        .where(eq(users.id, userId))
        .then(rows => rows[0]);

    if (user.stripeCustomerId) {
        return user.stripeCustomerId;
    }

    // Crear nuevo customer en Stripe
    const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId },
    });

    // Guardar en DB
    await db.update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

    return customer.id;
}

function getStripePriceId(planId: string): string {
    const priceIds = {
        pro: process.env.STRIPE_PRICE_PRO!,
        premium: process.env.STRIPE_PRICE_PREMIUM!,
    };
    return priceIds[planId as keyof typeof priceIds];
}
```

#### 4.3. `/lib/mercadopago/checkout.ts` (Mercado Pago Helper)

```typescript
// src/lib/mercadopago/checkout.ts
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

interface CreateCheckoutParams {
    userId: string;
    userEmail: string;
    userName: string;
    planId: string;
}

export async function createMercadoPagoCheckout(params: CreateCheckoutParams) {
    const { userId, userEmail, planId } = params;

    const preApproval = new PreApproval(client);

    const planPrices = {
        pro: { amount: 5.00, title: 'Plan Pro Mensual' },
        premium: { amount: 10.00, title: 'Plan Premium Mensual' },
    };

    const plan = planPrices[planId as keyof typeof planPrices];

    const response = await preApproval.create({
        body: {
            reason: plan.title,
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: plan.amount,
                currency_id: 'USD',
            },
            back_urls: {
                success: `${process.env.NEXTAUTH_URL}/dashboard/subscription/success`,
                failure: `${process.env.NEXTAUTH_URL}/dashboard/subscription/canceled`,
            },
            payer_email: userEmail,
            status: 'pending',
            external_reference: userId,
            metadata: {
                user_id: userId,
                plan_id: planId,
                provider: 'mercadopago',
            },
        },
    });

    return response; // response.init_point contiene la URL de redirección
}
```

#### 4.4. `/api/webhook/stripe/route.ts`

```typescript
// src/app/api/webhook/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions, payments, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature')!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed:`, err.message);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Manejar eventos
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('Stripe webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed', details: error.message },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) return;

    // La suscripción se creará en el evento subscription.created
    console.log(`Checkout completed for user ${userId}, plan ${planId}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    const planId = subscription.metadata?.planId;

    if (!userId || !planId) return;

    await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId,
        provider: 'stripe',
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        planId,
        planName: getPlanName(planId),
        status: subscription.status,
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        billingCycle: subscription.items.data[0].price.recurring?.interval || 'month',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    await db.update(users)
        .set({
            subscriptionStatus: 'active',
            currentPlanId: planId,
            ...getPlanFeatures(planId),
        })
        .where(eq(users.id, userId));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await db.update(subscriptions)
        .set({
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await db.update(subscriptions)
        .set({
            status: 'canceled',
            canceledAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

    const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
        .then(rows => rows[0]);

    if (sub) {
        await db.update(users)
            .set({
                subscriptionStatus: 'canceled',
                currentPlanId: 'free',
            })
            .where(eq(users.id, sub.userId));
    }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    // Registrar pago exitoso
    console.log('Invoice paid:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // Notificar al usuario
    console.log('Invoice payment failed:', invoice.id);
}

function getPlanName(planId: string): string {
    const plans = {
        pro: 'Plan Pro',
        premium: 'Plan Premium',
    };
    return plans[planId as keyof typeof plans] || 'Unknown Plan';
}

function getPlanFeatures(planId: string) {
    const features = {
        pro: {
            hasAccessToWhatsappBotWithAI: true,
            hasAccessToRecurringExpenses: true,
            hasAccessToInvestments: true,
            aiTokensLimit: 5000,
            aiTokensUsed: 0,
            aiTokensResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        premium: {
            hasAccessToWhatsappBotWithAI: true,
            hasAccessToRecurringExpenses: true,
            hasAccessToInvestments: true,
            hasAccessToPredictiveAnalysis: true,
            hasAccessToAdvancedReports: true,
            hasAccessToExcelImportWithAI: true,
            aiTokensLimit: 10000,
            aiTokensUsed: 0,
            aiTokensResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    };
    return features[planId as keyof typeof features] || {};
}
```

#### 4.5. `/api/webhook/mercadopago/route.ts`

```typescript
// src/app/api/webhook/mercadopago/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions, payments, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('MercadoPago webhook received:', body);

        // Manejar notificaciones de suscripciones (PreApproval)
        if (body.type === 'subscription_preapproval' || body.action === 'subscription_preapproval') {
            const preapprovalId = body.data.id;

            // Obtener información de la suscripción desde Mercado Pago API
            const subscriptionInfo = await fetchMercadoPagoSubscription(preapprovalId);

            if (subscriptionInfo.status === 'authorized') {
                await handleSubscriptionAuthorized(subscriptionInfo);
            } else if (subscriptionInfo.status === 'cancelled') {
                await handleSubscriptionCancelled(subscriptionInfo);
            } else if (subscriptionInfo.status === 'paused') {
                await handleSubscriptionPaused(subscriptionInfo);
            }
        }

        // Manejar pagos individuales de la suscripción
        if (body.type === 'payment') {
            const paymentId = body.data.id;
            const paymentInfo = await fetchMercadoPagoPayment(paymentId);

            if (paymentInfo.status === 'approved') {
                await handlePaymentApproved(paymentInfo);
            } else if (paymentInfo.status === 'rejected') {
                await handlePaymentRejected(paymentInfo);
            }
        }

        // IMPORTANTE: Siempre retornar 200 para confirmar recepción
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('Mercado Pago webhook error:', error);
        // Aún en caso de error, retornar 200 para evitar reintentos
        return NextResponse.json({ received: true }, { status: 200 });
    }
}

async function fetchMercadoPagoSubscription(preapprovalId: string) {
    const response = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
        }
    );
    return response.json();
}

async function fetchMercadoPagoPayment(paymentId: string) {
    const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
        }
    );
    return response.json();
}

async function handleSubscriptionAuthorized(subscriptionInfo: any) {
    const userId = subscriptionInfo.external_reference || subscriptionInfo.metadata?.user_id;
    const planId = subscriptionInfo.metadata?.plan_id;

    if (!userId || !planId) {
        console.error('Missing userId or planId in subscription metadata');
        return;
    }

    // Verificar si ya existe la suscripción
    const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.mercadopagoSubscriptionId, subscriptionInfo.id))
        .then(rows => rows[0]);

    if (existingSub) {
        console.log('Subscription already exists:', subscriptionInfo.id);
        return;
    }

    // Crear suscripción
    await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId,
        provider: 'mercadopago',
        mercadopagoSubscriptionId: subscriptionInfo.id,
        mercadopagoPayerId: subscriptionInfo.payer_id,
        planId,
        planName: getPlanName(planId),
        status: 'active',
        amount: Math.round(subscriptionInfo.auto_recurring.transaction_amount * 100), // a centavos
        currency: subscriptionInfo.auto_recurring.currency_id,
        billingCycle: 'monthly',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Actualizar usuario
    await db.update(users)
        .set({
            subscriptionStatus: 'active',
            currentPlanId: planId,
            mercadopagoPayerId: subscriptionInfo.payer_id,
            ...getPlanFeatures(planId),
        })
        .where(eq(users.id, userId));

    console.log('Subscription created successfully for user:', userId);
}

async function handleSubscriptionCancelled(subscriptionInfo: any) {
    await db.update(subscriptions)
        .set({
            status: 'canceled',
            canceledAt: new Date(),
        })
        .where(eq(subscriptions.mercadopagoSubscriptionId, subscriptionInfo.id));

    const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.mercadopagoSubscriptionId, subscriptionInfo.id))
        .then(rows => rows[0]);

    if (sub) {
        await db.update(users)
            .set({
                subscriptionStatus: 'canceled',
                currentPlanId: 'free',
            })
            .where(eq(users.id, sub.userId));
    }
}

async function handleSubscriptionPaused(subscriptionInfo: any) {
    await db.update(subscriptions)
        .set({
            status: 'paused',
        })
        .where(eq(subscriptions.mercadopagoSubscriptionId, subscriptionInfo.id));

    const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.mercadopagoSubscriptionId, subscriptionInfo.id))
        .then(rows => rows[0]);

    if (sub) {
        await db.update(users)
            .set({
                subscriptionStatus: 'paused',
            })
            .where(eq(users.id, sub.userId));
    }
}

async function handlePaymentApproved(paymentInfo: any) {
    // Registrar pago exitoso en la tabla de payments
    await db.insert(payments).values({
        id: crypto.randomUUID(),
        userId: paymentInfo.metadata?.user_id || paymentInfo.external_reference,
        provider: 'mercadopago',
        mercadopagoPaymentId: paymentInfo.id,
        amount: Math.round(paymentInfo.transaction_amount * 100),
        currency: paymentInfo.currency_id,
        status: 'succeeded',
        paymentMethod: paymentInfo.payment_method_id,
    });

    console.log('Payment recorded:', paymentInfo.id);
}

async function handlePaymentRejected(paymentInfo: any) {
    console.log('Payment rejected:', paymentInfo.id);
    // Opcional: registrar el pago fallido
    await db.insert(payments).values({
        id: crypto.randomUUID(),
        userId: paymentInfo.metadata?.user_id || paymentInfo.external_reference,
        provider: 'mercadopago',
        mercadopagoPaymentId: paymentInfo.id,
        amount: Math.round(paymentInfo.transaction_amount * 100),
        currency: paymentInfo.currency_id,
        status: 'failed',
        paymentMethod: paymentInfo.payment_method_id,
        errorMessage: paymentInfo.status_detail,
    });
}

function getPlanName(planId: string): string {
    const plans = {
        pro: 'Plan Pro',
        premium: 'Plan Premium',
    };
    return plans[planId as keyof typeof plans] || 'Unknown Plan';
}

function getPlanFeatures(planId: string) {
    const features = {
        pro: {
            hasAccessToWhatsappBotWithAI: true,
            hasAccessToRecurringExpenses: true,
            hasAccessToInvestments: true,
            aiTokensLimit: 5000,
            aiTokensUsed: 0,
            aiTokensResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        premium: {
            hasAccessToWhatsappBotWithAI: true,
            hasAccessToRecurringExpenses: true,
            hasAccessToInvestments: true,
            hasAccessToPredictiveAnalysis: true,
            hasAccessToAdvancedReports: true,
            hasAccessToExcelImportWithAI: true,
            aiTokensLimit: 10000,
            aiTokensUsed: 0,
            aiTokensResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    };
    return features[planId as keyof typeof features] || {};
}
```

---

## 5. Componentes UI

### 🎨 PaymentMethodSelector Component

```tsx
// src/components/subscription/PaymentMethodSelector.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    provider: 'stripe' | 'mercadopago';
    availableIn: string[];
}

const paymentMethods: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        icon: <CreditCard className="h-5 w-5" />,
        description: 'Visa, Mastercard, American Express',
        provider: 'stripe',
        availableIn: ['all'],
    },
    {
        id: 'pix',
        name: 'PIX',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Pago instantáneo (Brasil)',
        provider: 'mercadopago',
        availableIn: ['BR'],
    },
    {
        id: 'oxxo',
        name: 'OXXO',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Pago en efectivo (México)',
        provider: 'mercadopago',
        availableIn: ['MX'],
    },
    {
        id: 'mercadopago',
        name: 'Mercado Pago',
        icon: <Wallet className="h-5 w-5" />,
        description: 'Wallet digital',
        provider: 'mercadopago',
        availableIn: ['AR', 'BR', 'MX', 'CL', 'CO', 'PE'],
    },
];

interface PaymentMethodSelectorProps {
    userCountry: string;
    onMethodSelect: (methodId: string, provider: 'stripe' | 'mercadopago') => void;
}

export function PaymentMethodSelector({ userCountry, onMethodSelect }: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState('card');

    const availableMethods = paymentMethods.filter(
        (method) => method.availableIn.includes('all') || method.availableIn.includes(userCountry)
    );

    const handleSelect = (methodId: string) => {
        setSelected(methodId);
        const method = paymentMethods.find((m) => m.id === methodId);
        if (method) {
            onMethodSelect(methodId, method.provider);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Método de Pago</h3>
            <RadioGroup value={selected} onValueChange={handleSelect}>
                <div className="grid gap-3">
                    {availableMethods.map((method) => (
                        <Label
                            key={method.id}
                            htmlFor={method.id}
                            className="cursor-pointer"
                        >
                            <Card className={selected === method.id ? 'border-primary' : ''}>
                                <CardContent className="flex items-center gap-4 p-4">
                                    <RadioGroupItem value={method.id} id={method.id} />
                                    <div className="flex items-center gap-3 flex-1">
                                        {method.icon}
                                        <div>
                                            <p className="font-medium">{method.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {method.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Label>
                    ))}
                </div>
            </RadioGroup>
        </div>
    );
}
```

---

## 9. Variables de Entorno

### 🔑 Nuevas Variables

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY="pk_live_xxxxxxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxx"

# Stripe Price IDs
STRIPE_PRICE_PRO="price_xxxxxxxxxxxxxxxx"
STRIPE_PRICE_PREMIUM="price_xxxxxxxxxxxxxxxx"

# Mercado Pago Configuration
MERCADOPAGO_PUBLIC_KEY="APP_USR-xxxxxxxx-xxxxxxxx"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-xxxxxxxx-xxxxxxxx"

# Subscription Settings
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS="true"
NEXT_PUBLIC_FREE_TRIAL_DAYS="14"
```

---

## 10. Pricing Comparison

### 💰 Costos de Procesamiento

| Proveedor | Tarjetas | Métodos Locales | Cuota Mensual |
|-----------|----------|-----------------|---------------|
| **Stripe** | 2.9% + $0.30 | Boleto: 3.4% + $0.30 | $0 |
| **Mercado Pago** | 3.99%+ | PIX/OXXO: 3.99%+ | $0 |

### 📊 Costo Promedio por Plan

Asumiendo 50% tarjetas Stripe, 50% métodos locales MP:

- **Plan Pro ($5/mes)**: Costo promedio ~$0.22 por transacción
- **Plan Premium ($10/mes)**: Costo promedio ~$0.37 por transacción

**Margen de ganancia: ~85-90%** después de costos de procesamiento y hosting

---

## 12. Roadmap de Implementación

### 📅 Fase 1: Setup Inicial (Semana 1)

**Tareas:**
- [ ] Crear cuentas en Stripe y Mercado Pago
- [ ] Configurar webhooks en ambas plataformas
- [ ] Crear migraciones de DB
- [ ] Configurar variables de entorno

### 📅 Fase 2: Integración Stripe (Semana 2)

**Tareas:**
- [ ] Implementar Stripe Checkout
- [ ] Implementar webhook handler de Stripe
- [ ] Crear planes en Stripe Dashboard
- [ ] Probar flujo completo con tarjetas

### 📅 Fase 3: Integración Mercado Pago (Semana 3)

**Tareas:**
- [ ] Implementar Mercado Pago Checkout
- [ ] Implementar webhook handler de Mercado Pago
- [ ] Configurar planes en Mercado Pago
- [ ] Probar flujo con PIX/OXXO/Mercado Pago

### 📅 Fase 4: UI y Experiencia de Usuario (Semana 4)

**Tareas:**
- [ ] Crear selector de métodos de pago
- [ ] Implementar pricing page
- [ ] Crear subscription settings page
- [ ] Agregar internacionalización

### 📅 Fase 5: Testing y Producción (Semana 5-6)

**Tareas:**
- [ ] Tests E2E de ambos flujos
- [ ] Validación de webhooks
- [ ] Deploy a producción
- [ ] Monitoreo y logging

---

## 🎯 Ventajas de Esta Implementación

1. ✅ **Máxima Conversión**: Soporta todos los métodos de pago populares en LATAM
2. ✅ **Mejor UX**: Usuario elige su método preferido
3. ✅ **Escalabilidad Global**: Stripe permite expansión fuera de LATAM
4. ✅ **Redundancia**: Si un proveedor falla, el otro funciona
5. ✅ **Flexibilidad**: Fácil agregar nuevos proveedores en el futuro
6. ✅ **Costos Optimizados**: Enrutamiento inteligente según región

---

## 📚 Recursos Adicionales

### Documentación
- [Stripe Checkout Docs](https://stripe.com/docs/checkout)
- [Stripe Billing Docs](https://stripe.com/docs/billing)
- [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/en/docs)
- [Mercado Pago Subscriptions](https://www.mercadopago.com.ar/developers/en/docs/subscriptions/overview)

### Librerías Necesarias

```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "mercadopago": "^2.0.0",
    "@upstash/ratelimit": "^1.0.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0"
  }
}
```

---

**Documento actualizado**: 2025-10-07
**Versión**: 2.0 (Estrategia Híbrida)
**Autor**: Pagado Development Team

---

**¡Listo para maximizar conversión en LATAM con Stripe + Mercado Pago! 🚀💰**
