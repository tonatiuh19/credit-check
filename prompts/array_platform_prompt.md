# System Prompt — Credit Consultation Platform (Array.com + Stripe)

## Role

The platform integrates Array.com for credit data, Stripe for payments, and supports both SSN and ITIN users. The UI language is Spanish.

---

## Platform Overview

A subscription-based credit consultation platform where users can:

- View their credit score and full credit report
- Track score progress over time
- See actionable score improvement recommendations
- Access 3-bureau reports (Experian, TransUnion, Equifax)
- Subscribe via a 7-day trial at $7, then $25/month recurring

---

## Monetization & Billing (Stripe)

Integrate Stripe for all payments:

- **Trial plan**: $7 one-time charge for 7-day access
- **Subscription plan**: $25/month recurring, auto-billed after trial ends
- Use `stripe.checkout.Session` for onboarding flow
- Use Stripe Webhooks to:
  - Activate user account on `checkout.session.completed`
  - Suspend access on `customer.subscription.deleted` or `invoice.payment_failed`
  - Send reminder on `invoice.upcoming`
- Store `stripe_customer_id` and `subscription_status` on the user record
- Allow users to cancel, upgrade, or manage billing via Stripe Customer Portal

---

## User Types & Identity

### SSN Users (standard)

- Standard Array.com credit pull flow
- Soft pull: ~$1–2/pull, no credit score impact
- Allowed: 2 pulls per month maximum

### ITIN Users (immigrants / non-citizens)

- ITIN (Individual Taxpayer Identification Number) users require a **separate specialized report**
- Array.com does **not** support ITIN natively — use a dedicated ITIN-compatible provider
- **ITIN report cost: $60 per pull** — bill this as an add-on or include in a higher tier
- Consider limiting ITIN users to 1 pull/month due to cost
- **myFICO** is currently the primary provider that supports ITIN credit pulls
- Detect ITIN vs SSN at onboarding (ITIN starts with 9, format 9XX-XX-XXXX)
- Display a clear notice in Spanish to ITIN users explaining the $60 cost before confirming the pull

---

## Array.com Integration

### Authentication

- Use Array.com API keys (sandbox + production)
- Generate short-lived `userTokens` per session via Array's `/auth` endpoint
- Never expose API keys client-side

### Credit Dashboard Features to Implement

#### 1. ScoreTracker

- Display current score (e.g. 666) and starting score
- Show points gained since enrollment (e.g. "+6 pts so far")
- Pull from Array's credit score endpoint
- Render a score history chart (line graph, monthly)

#### 2. ScoreBuilder®

- Show potential score increase if user takes recommended actions (e.g. "+83 pts")
- Map to Array's score factors / recommendations endpoint
- Display top 3 actionable items with estimated point impact
- CTA button: "Tomar acción ahora" (Take Action Now)

#### 3. ScoreBoost™

- Show potential boost from on-time payments (e.g. "+20 pts")
- Show risk of score decrease from overspending or credit theft (e.g. "-148 pts")
- CTA button: "Iniciar un plan" (Start a Plan)

#### 4. Your Future Score

- Display projected future score (e.g. 769) in teal/blue accent color
- Calculated as: current score + ScoreBuilder potential + ScoreBoost potential

#### 5. Smart Credit Report®

- Letter grade display (A–F) based on overall credit health
- Pull from Array's full credit report endpoint
- Label: "Tu calificación actual" (Your Current Grade)

#### 6. 3B Report & Scores (3-Bureau)

- Display scores from all three bureaus: Experian, TransUnion, Equifax
- Show bureau logos
- Display last update timestamp
- Label: "Última actualización:" (Last Update:)

#### 7. myLONA® — Credit & Loan Offers

- Show pre-qualified credit card and loan offers
- Label: "Comparar ofertas sin afectar tu puntuación" (Compare offers without affecting your score)
- CTA: "Ver todas las ofertas" (View All Offers)
- Monetization opportunity: affiliate revenue from offer clicks

#### 8. PrivacyMaster®

- Show how many websites contain the user's personal info (e.g. "Found on 44 New Websites")
- Show next scan date
- Label: "Tu información personal:" (Your personal info:)
- "Encontrado en X nuevos sitios web" (Found on X new websites)
- "Próximo escaneo en 7 días" (Next scan in 7 days)

---

## Navigation Structure

**Scores menu:**

- ScoreTracker → "Rastreador de puntuación"
- ScoreBuilder® → "Constructor de puntuación"
- ScoreBoost™ → "Impulso de puntuación"

**Reports menu:**

- Smart Credit Report® → "Reporte de crédito inteligente"
- 3B Report & Scores → "Reporte y puntuaciones de 3 bureaus"

---

## Pull Frequency & Access Control

- SSN users: max 2 pulls/month (soft pull via Array)
- ITIN users: max 1 pull/month (hard cost $60/pull — confirm with user before running)
- Show a pull counter in the dashboard: "Consultas disponibles este mes: X/2"
- Lock pull button and show message when limit is reached: "Has alcanzado tu límite mensual de consultas"
- Refresh button triggers a new pull and decrements counter

---

## Key Spanish UI Strings

| English                    | Spanish                               |
| -------------------------- | ------------------------------------- |
| Your Credit Score          | Tu puntuación de crédito              |
| As of [date]               | Al [fecha]                            |
| Your starting score was X  | Tu puntuación inicial fue X           |
| You added +X pts so far    | Has ganado +X pts hasta ahora         |
| Take Action Now            | Tomar acción ahora                    |
| Start a Plan               | Iniciar un plan                       |
| Your Future Score          | Tu puntuación futura                  |
| View All Offers            | Ver todas las ofertas                 |
| Your Current Grade         | Tu calificación actual                |
| Last Update                | Última actualización                  |
| Start 7-day trial for $7   | Inicia tu prueba de 7 días por $7     |
| Then $25/month             | Luego $25/mes                         |
| Cancel anytime             | Cancela cuando quieras                |
| Available pulls this month | Consultas disponibles este mes        |
| Monthly limit reached      | Has alcanzado tu límite mensual       |
| ITIN report costs $60      | El reporte ITIN tiene un costo de $60 |

---

## Database (TiDB Cloud)

- Database is **TiDB Cloud** (MySQL-compatible, serverless)
- Provide a complete `schema.sql` file ready to run in TiDB Cloud
- Use MySQL syntax (not PostgreSQL) — TiDB is MySQL-compatible
- The schema must include the following tables:

```sql
-- Users
users (id, email, name, password_hash, identity_type ENUM('SSN','ITIN'),
       stripe_customer_id, subscription_status, subscription_end_date,
       oauth_provider, oauth_provider_id, created_at, updated_at)

-- Subscriptions
subscriptions (id, user_id, stripe_subscription_id, stripe_price_id,
               status, trial_start, trial_end, current_period_start,
               current_period_end, canceled_at, created_at)

-- Credit pulls
credit_pulls (id, user_id, provider ENUM('ARRAY','MYFICO'), pull_date,
              bureau, score, report_data JSON, cost_usd, created_at)

-- Pull usage tracking
pull_usage (id, user_id, month CHAR(7), pulls_used, max_pulls, updated_at)

-- Consent log (FCRA)
consent_log (id, user_id, consent_type, ip_address, user_agent, consented_at)

-- Notifications log
notifications_log (id, user_id, type, channel, status, sent_at, metadata JSON)
```

- Add appropriate indexes on `user_id`, `email`, `stripe_customer_id`, and `pull_date`
- Use `DATETIME` for timestamps (not `TIMESTAMPTZ`)
- Include `ON DELETE CASCADE` on foreign keys where appropriate

---

## Authentication (OAuth)

Implement OAuth 2.0 alongside email/password login:

- **Supported providers**: Google, Apple (minimum)
- OAuth flow must:
  - Create a new user record if first login (`oauth_provider`, `oauth_provider_id` stored on `users`)
  - Link to existing account if email already exists
  - Skip password requirement for OAuth users
- After OAuth login, redirect to onboarding if `identity_type` is not yet set (user must choose SSN or ITIN and provide consent)
- Store OAuth tokens securely — never expose refresh tokens client-side
- Session management: use short-lived JWTs + refresh token rotation
- Spanish UI strings for auth:
  - "Continuar con Google" (Continue with Google)
  - "Continuar con Apple" (Continue with Apple)
  - "O inicia sesión con tu correo" (Or sign in with your email)
  - "Crear cuenta" (Create account)
  - "Iniciar sesión" (Sign in)

---

## Notifications (Resend)

Use **Resend** (resend.com) for all transactional email notifications:

- Install via `npm install resend`
- Use `Resend` SDK with `RESEND_API_KEY` env variable
- All emails sent in **Spanish**

### Email triggers and templates:

| Trigger                 | Subject (Spanish)                            | Content                                         |
| ----------------------- | -------------------------------------------- | ----------------------------------------------- |
| Trial started           | "Tu prueba de 7 días ha comenzado"           | Welcome, trial details, what to expect          |
| Trial ending (day 6)    | "Tu prueba termina mañana"                   | Reminder, what they'll lose, CTA to subscribe   |
| Subscription activated  | "¡Bienvenido a tu plan mensual!"             | Confirmation, billing date, manage billing link |
| Payment failed          | "Hubo un problema con tu pago"               | Alert, retry CTA, support link                  |
| Subscription canceled   | "Tu suscripción ha sido cancelada"           | Confirmation, reactivation CTA                  |
| Pull limit reached      | "Has usado tus consultas del mes"            | Info, next reset date                           |
| ITIN pull confirmation  | "Confirma tu consulta de reporte ITIN ($60)" | Cost warning, confirm CTA                       |
| New credit report ready | "Tu nuevo reporte de crédito está listo"     | Score summary, CTA to dashboard                 |

### Resend implementation notes:

- Create a `/lib/resend.ts` (or `.js`) helper that wraps all email sends
- Use React Email or plain HTML templates stored in `/emails/` folder
- Log every send attempt to `notifications_log` table (status: sent/failed)
- Handle Resend webhook for delivery status updates (delivered, bounced, complained)

---

## Internationalization (i18n)

Implement full i18n support with the following locale configuration:

- **Default language**: English (`en`)
- **Supported locales**: `en` (English), `es-MX` (Mexican Spanish), `fr` (French)
- Language is selected by the user at onboarding and stored on the `users` table (`locale` column)
- User can change language at any time from account settings
- Add `locale` column to `users` table: `locale ENUM('en','es-MX','fr') DEFAULT 'en'`

### Implementation

- Use a standard i18n library (e.g. `i18next`, `next-i18next`, or `react-i18next`)
- Store translation files in `/locales/` folder:
  - `/locales/en/common.json`
  - `/locales/es-MX/common.json`
  - `/locales/fr/common.json`
- All user-facing strings must use translation keys — no hardcoded text anywhere in the UI
- Date and number formats must respect locale:
  - `en`: MM/DD/YYYY, comma thousands separator (1,234.56)
  - `es-MX`: DD/MM/YYYY, period thousands separator (1.234,56)
  - `fr`: DD/MM/YYYY, space thousands separator (1 234,56)
- Currency always displayed in USD ($) regardless of locale

### Translation key examples (3-locale table)

| Key                        | English (`en`)                        | Mexican Spanish (`es-MX`)                 | French (`fr`)                                |
| -------------------------- | ------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| `dashboard.score.title`    | Your Credit Score                     | Tu puntuación de crédito                  | Votre score de crédit                        |
| `dashboard.score.as_of`    | As of {date}                          | Al {date}                                 | Au {date}                                    |
| `dashboard.score.starting` | Your starting score was {score}       | Tu puntuación inicial fue {score}         | Votre score initial était {score}            |
| `dashboard.score.gained`   | You added +{pts} pts so far           | Has ganado +{pts} pts hasta ahora         | Vous avez gagné +{pts} pts jusqu'ici         |
| `dashboard.future_score`   | Your Future Score                     | Tu puntuación futura                      | Votre score futur                            |
| `scorebuilder.cta`         | Take Action Now                       | Tomar acción ahora                        | Agir maintenant                              |
| `scoreboost.cta`           | Start a Plan                          | Iniciar un plan                           | Commencer un plan                            |
| `offers.cta`               | View All Offers                       | Ver todas las ofertas                     | Voir toutes les offres                       |
| `report.grade`             | Your Current Grade                    | Tu calificación actual                    | Votre note actuelle                          |
| `report.last_update`       | Last Update                           | Última actualización                      | Dernière mise à jour                         |
| `pulls.available`          | Available pulls this month: {n}/{max} | Consultas disponibles este mes: {n}/{max} | Consultations disponibles ce mois: {n}/{max} |
| `pulls.limit_reached`      | Monthly limit reached                 | Has alcanzado tu límite mensual           | Limite mensuelle atteinte                    |
| `itin.cost_warning`        | ITIN report costs $60 per pull        | El reporte ITIN tiene un costo de $60     | Le rapport ITIN coûte 60$ par consultation   |
| `auth.google`              | Continue with Google                  | Continuar con Google                      | Continuer avec Google                        |
| `auth.apple`               | Continue with Apple                   | Continuar con Apple                       | Continuer avec Apple                         |
| `auth.email`               | Or sign in with your email            | O inicia sesión con tu correo             | Ou connectez-vous avec votre email           |
| `auth.signup`              | Create account                        | Crear cuenta                              | Créer un compte                              |
| `auth.signin`              | Sign in                               | Iniciar sesión                            | Se connecter                                 |
| `billing.trial`            | Start 7-day trial for $7              | Inicia tu prueba de 7 días por $7         | Commencer l'essai de 7 jours pour 7$         |
| `billing.then`             | Then $25/month                        | Luego $25/mes                             | Puis 25$/mois                                |
| `billing.cancel`           | Cancel anytime                        | Cancela cuando quieras                    | Annulez à tout moment                        |
| `nav.scores.tracker`       | ScoreTracker                          | Rastreador de puntuación                  | Suivi de score                               |
| `nav.scores.builder`       | ScoreBuilder                          | Constructor de puntuación                 | Constructeur de score                        |
| `nav.scores.boost`         | ScoreBoost                            | Impulso de puntuación                     | Boost de score                               |
| `nav.reports.smart`        | Smart Credit Report                   | Reporte de crédito inteligente            | Rapport de crédit intelligent                |
| `nav.reports.3b`           | 3B Report & Scores                    | Reporte y puntuaciones de 3 bureaus       | Rapport et scores 3 bureaux                  |

### Resend email localization

- All transactional emails must be sent in the user's stored locale
- Maintain separate email templates per locale under `/emails/en/`, `/emails/es-MX/`, `/emails/fr/`
- Fall back to `en` if a template is missing for a given locale

---

## Compliance Notes

- All credit pulls require explicit written user consent (FCRA)
- Store consent timestamp and IP address per pull
- Display FCRA notice before first pull: "Al continuar, autorizas la consulta de tu historial crediticio..."
- Do not store raw credit report data longer than necessary
- ITIN users: additional disclosure required before $60 pull

---

## Environment Variables Required

```
ARRAY_API_KEY=
ARRAY_APP_KEY=
ARRAY_ENV=sandbox|production
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_TRIAL_PRICE_ID=
STRIPE_MONTHLY_PRICE_ID=
TIDB_HOST=
TIDB_PORT=4000
TIDB_USER=
TIDB_PASSWORD=
TIDB_DATABASE=
TIDB_SSL=true
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@yourdomain.com
JWT_SECRET=
JWT_REFRESH_SECRET=
```
