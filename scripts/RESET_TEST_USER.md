# reset-test-user

CLI script to fully wipe a test user from all systems — Stripe, Clerk, and the database.

## What it does

Runs in this order for each matched user:

1. **Stripe** — cancels any `active`, `trialing`, or `past_due` subscriptions, then deletes the customer record (removes all saved cards and payment history)
2. **Clerk** — deletes the user account via the Clerk Management API
3. **Database** — deletes the row from `users`; all child records are removed automatically via `ON DELETE CASCADE` (`subscriptions`, `credit_pulls`, `pull_usage`, `consent_log`, `notifications_log`)

## Usage

```bash
# Reset a single user by email
npm run reset-user axgoomez@gmail.com

# Wipe every user in the database (5-second abort window before it runs)
npm run reset-user -- --all
```

## Requirements

- `.env` file at the project root with valid values for:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `STRIPE_SECRET_KEY`
  - `CLERK_SECRET_KEY`
- `mysql2`, `stripe`, and `dotenv` packages installed (all already in `package.json`)

## Output example

```
Resetting 1 user(s)…

── [axgoomez@gmail.com | id=3] ──────────────────────────────
  ✓ Stripe subscription canceled: sub_1ABC...
  ✓ Stripe customer deleted: cus_XYZ...
  ✓ Clerk user deleted: user_2abc...
  ✓ DB rows deleted (affected: 1)

✅  Done.
```

## Safety notes

- `--all` has a **5-second countdown** before executing — press `Ctrl+C` to abort
- Only use against test/sandbox environments; never run against production Stripe/Clerk keys
- Stripe cancellations use `prorate: false` so no refunds are issued
