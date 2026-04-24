import "dotenv/config";
import cookieParser from "cookie-parser";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type RequestHandler, type Request } from "express";
import Stripe from "stripe";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { dbQuery } from "../lib/db";
import {
  sendWelcome,
  sendTrialStarted,
  sendPaymentFailed,
  sendSubscriptionCanceled,
  sendCreditReportReady,
} from "../lib/email";
import type {
  UserDTO,
  CreditReportDTO,
  PullUsageDTO,
  ScoreHistoryPoint,
  CheckoutSessionResponse,
  EmbeddedCheckoutResponse,
  BillingPortalResponse,
  BillingStatusDTO,
  CancelSubscriptionResponse,
} from "../shared/api";

// Create the Express app once (reused across Vercel invocations)
let app: express.Application | null = null;

// ============= STRIPE SETUP =============
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia" as any,
    });
  }
  return _stripe;
}

// ─── Auth middleware ────────────────────────────────────────────────────────
interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

// Lazy Clerk middleware so it only instantiates on first request (not at Vite config load time)
let _clerkMiddleware: RequestHandler | null = null;
function getClerkMiddleware(): RequestHandler {
  if (!_clerkMiddleware) {
    _clerkMiddleware = clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }
  return _clerkMiddleware;
}

const requireAuth: RequestHandler = async (req: AuthRequest, res, next) => {
  const { userId: clerkUserId } = getAuth(req as any);
  if (!clerkUserId) {
    res.status(401).json({ error: { code: "401", message: "Unauthorized" } });
    return;
  }
  try {
    const [rows] = await dbQuery<any[]>(
      "SELECT id, email FROM users WHERE clerk_user_id = ?",
      [clerkUserId],
    );
    if (rows.length === 0) {
      res.status(401).json({
        error: {
          code: "401",
          message: "User not synced. Please sign in again.",
        },
      });
      return;
    }
    req.userId = rows[0].id;
    req.userEmail = rows[0].email;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    res
      .status(500)
      .json({ error: { code: "500", message: "Authentication failed" } });
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function scoreToGrade(score: number): string {
  if (score >= 800) return "A+";
  if (score >= 740) return "A";
  if (score >= 670) return "B";
  if (score >= 580) return "C";
  if (score >= 500) return "D";
  return "F";
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function toUserDTO(row: any): UserDTO {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? "",
    identityType: row.identity_type ?? null,
    subscriptionStatus: row.subscription_status ?? "inactive",
    locale: row.locale ?? "en",
  };
}

// ─── GET /api/ping ──────────────────────────────────────────────────────────
const handlePing: RequestHandler = (_req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
};

function createServer() {
  const expressApp = express();

  // Middleware — raw body needed for Stripe webhooks
  expressApp.use((req, res, next) => {
    if (req.originalUrl === "/api/webhooks/stripe") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(cookieParser());

  // Clerk authentication middleware — validates session tokens on every request
  expressApp.use((req, res, next) => getClerkMiddleware()(req, res, next));

  if (process.env.NODE_ENV !== "production") {
    expressApp.use((req, _res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
  }

  // ==================== ROUTES ====================

  expressApp.get("/api/ping", handlePing);

  // ── AUTH ───────────────────────────────────────────────────────────────────

  /** POST /api/auth/sync — upsert user in DB after Clerk sign-in */
  expressApp.post("/api/auth/sync", async (req, res) => {
    const { userId: clerkUserId } = getAuth(req as any);
    if (!clerkUserId) {
      res.status(401).json({ error: { code: "401", message: "Unauthorized" } });
      return;
    }
    const { email, name } = req.body as { email?: string; name?: string };
    if (!email) {
      res
        .status(400)
        .json({ error: { code: "400", message: "email is required" } });
      return;
    }
    try {
      const [existing] = await dbQuery<any[]>(
        "SELECT * FROM users WHERE clerk_user_id = ?",
        [clerkUserId],
      );
      if (existing.length > 0) {
        await dbQuery(
          "UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE clerk_user_id = ?",
          [name ?? existing[0].name, email, clerkUserId],
        );
        const [updated] = await dbQuery<any[]>(
          "SELECT * FROM users WHERE clerk_user_id = ?",
          [clerkUserId],
        );
        res.json(toUserDTO(updated[0]));
      } else {
        const [result] = await dbQuery<any>(
          "INSERT INTO users (clerk_user_id, email, name) VALUES (?, ?, ?)",
          [clerkUserId, email, name ?? ""],
        );
        const newUser: UserDTO = {
          id: result.insertId,
          email,
          name: name ?? "",
          identityType: null,
          subscriptionStatus: "inactive",
          locale: "en",
        };
        res.status(201).json(newUser);
        // Fire-and-forget welcome email for new sign-ups
        sendWelcome(email, result.insertId, name ?? "", "en").catch(() => {});
      }
    } catch (err) {
      console.error("Sync error:", err);
      res
        .status(500)
        .json({ error: { code: "500", message: "User sync failed" } });
    }
  });

  /** GET /api/auth/me */
  expressApp.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const [rows] = await dbQuery<any[]>("SELECT * FROM users WHERE id = ?", [
        req.userId,
      ]);
      if (rows.length === 0) {
        res
          .status(404)
          .json({ error: { code: "404", message: "User not found" } });
        return;
      }
      res.json(toUserDTO(rows[0]));
    } catch (err) {
      res
        .status(500)
        .json({ error: { code: "500", message: "Failed to fetch user" } });
    }
  });

  /** PATCH /api/auth/locale */
  expressApp.patch(
    "/api/auth/locale",
    requireAuth,
    async (req: AuthRequest, res) => {
      const { locale } = req.body;
      const valid = ["en", "es-MX", "fr"];
      if (!valid.includes(locale)) {
        res
          .status(400)
          .json({ error: { code: "400", message: "Invalid locale" } });
        return;
      }
      try {
        await dbQuery("UPDATE users SET locale = ? WHERE id = ?", [
          locale,
          req.userId,
        ]);
        const [rows] = await dbQuery<any[]>(
          "SELECT * FROM users WHERE id = ?",
          [req.userId],
        );
        res.json(toUserDTO(rows[0]));
      } catch {
        res
          .status(500)
          .json({ error: { code: "500", message: "Failed to update locale" } });
      }
    },
  );

  // ── ONBOARDING ─────────────────────────────────────────────────────────────

  /** POST /api/onboarding/identity */
  expressApp.post(
    "/api/onboarding/identity",
    requireAuth,
    async (req: AuthRequest, res) => {
      const { identityType } = req.body;
      if (!["SSN", "ITIN"].includes(identityType)) {
        res.status(400).json({
          error: { code: "400", message: "identityType must be SSN or ITIN" },
        });
        return;
      }
      try {
        await dbQuery("UPDATE users SET identity_type = ? WHERE id = ?", [
          identityType,
          req.userId,
        ]);
        // Set pull limits based on type
        const maxPulls = identityType === "ITIN" ? 1 : 2;
        const month = currentMonth();
        await dbQuery(
          `INSERT INTO pull_usage (user_id, month, pulls_used, max_pulls)
         VALUES (?, ?, 0, ?)
         ON DUPLICATE KEY UPDATE max_pulls = ?`,
          [req.userId, month, maxPulls, maxPulls],
        );
        res.json({ message: "Identity type saved" });
      } catch {
        res.status(500).json({
          error: { code: "500", message: "Failed to save identity type" },
        });
      }
    },
  );

  /** POST /api/onboarding/consent */
  expressApp.post(
    "/api/onboarding/consent",
    requireAuth,
    async (req: AuthRequest, res) => {
      const { consentType, agreed } = req.body;
      if (!agreed) {
        res
          .status(400)
          .json({ error: { code: "400", message: "Consent is required" } });
        return;
      }
      try {
        await dbQuery(
          "INSERT INTO consent_log (user_id, consent_type, ip_address, user_agent) VALUES (?, ?, ?, ?)",
          [
            req.userId,
            consentType ?? "FCRA",
            req.ip ?? "",
            req.headers["user-agent"] ?? "",
          ],
        );
        res.json({ message: "Consent recorded" });
      } catch {
        res.status(500).json({
          error: { code: "500", message: "Failed to record consent" },
        });
      }
    },
  );

  // ── CREDIT ─────────────────────────────────────────────────────────────────

  /** GET /api/credit/report */
  expressApp.get(
    "/api/credit/report",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [pulls] = await dbQuery<any[]>(
          "SELECT * FROM credit_pulls WHERE user_id = ? ORDER BY pull_date DESC LIMIT 1",
          [req.userId],
        );
        if (pulls.length === 0) {
          res.status(404).json({
            error: { code: "404", message: "No credit report found" },
          });
          return;
        }
        const latest = pulls[0];
        // Fetch starting score (oldest pull)
        const [oldest] = await dbQuery<any[]>(
          "SELECT score FROM credit_pulls WHERE user_id = ? ORDER BY pull_date ASC LIMIT 1",
          [req.userId],
        );
        const startingScore = oldest[0]?.score ?? latest.score;
        const reportData = latest.report_data
          ? JSON.parse(JSON.stringify(latest.report_data))
          : {};
        const bureauScores = reportData.bureauScores ?? [
          {
            bureau: "Experian",
            score: latest.score,
            lastUpdated: latest.pull_date,
          },
          {
            bureau: "TransUnion",
            score: latest.score - 5,
            lastUpdated: latest.pull_date,
          },
          {
            bureau: "Equifax",
            score: latest.score + 3,
            lastUpdated: latest.pull_date,
          },
        ];
        const scoreFactors = reportData.scoreFactors ?? [
          {
            factor: "Payment History",
            impact: 35,
            description: "On-time payments improve your score",
          },
          {
            factor: "Credit Utilization",
            impact: 30,
            description: "Keep usage below 30%",
          },
          {
            factor: "Credit Age",
            impact: 15,
            description: "Older accounts help your score",
          },
        ];
        const report: CreditReportDTO = {
          score: latest.score,
          startingScore,
          grade: scoreToGrade(latest.score),
          bureauScores,
          scoreFactors,
          lastPullDate: latest.pull_date,
          provider: latest.provider,
        };
        res.json(report);
      } catch (err) {
        console.error("Fetch report error:", err);
        res.status(500).json({
          error: { code: "500", message: "Failed to fetch credit report" },
        });
      }
    },
  );

  /** GET /api/credit/pull-usage */
  expressApp.get(
    "/api/credit/pull-usage",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const month = currentMonth();
        const [rows] = await dbQuery<any[]>(
          "SELECT * FROM pull_usage WHERE user_id = ? AND month = ?",
          [req.userId, month],
        );
        if (rows.length === 0) {
          const response: PullUsageDTO = { pullsUsed: 0, maxPulls: 2, month };
          res.json(response);
          return;
        }
        const response: PullUsageDTO = {
          pullsUsed: rows[0].pulls_used,
          maxPulls: rows[0].max_pulls,
          month,
        };
        res.json(response);
      } catch {
        res.status(500).json({
          error: { code: "500", message: "Failed to fetch pull usage" },
        });
      }
    },
  );

  /** GET /api/credit/score-history */
  expressApp.get(
    "/api/credit/score-history",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [rows] = await dbQuery<any[]>(
          `SELECT DATE_FORMAT(pull_date, '%Y-%m') as date, MAX(score) as score
         FROM credit_pulls WHERE user_id = ?
         GROUP BY DATE_FORMAT(pull_date, '%Y-%m')
         ORDER BY date ASC
         LIMIT 12`,
          [req.userId],
        );
        const history: ScoreHistoryPoint[] = rows.map((r) => ({
          date: r.date,
          score: r.score,
        }));
        res.json(history);
      } catch {
        res.status(500).json({
          error: { code: "500", message: "Failed to fetch score history" },
        });
      }
    },
  );

  /** POST /api/credit/pull */
  expressApp.post(
    "/api/credit/pull",
    requireAuth,
    async (req: AuthRequest, res) => {
      const { confirmed } = req.body;
      try {
        const [userRows] = await dbQuery<any[]>(
          "SELECT * FROM users WHERE id = ?",
          [req.userId],
        );
        const user = userRows[0];
        if (!user) {
          res
            .status(404)
            .json({ error: { code: "404", message: "User not found" } });
          return;
        }
        // Check subscription
        if (!["trialing", "active"].includes(user.subscription_status)) {
          res.status(403).json({
            error: { code: "403", message: "Active subscription required" },
          });
          return;
        }
        const month = currentMonth();
        const [usageRows] = await dbQuery<any[]>(
          "SELECT * FROM pull_usage WHERE user_id = ? AND month = ?",
          [req.userId, month],
        );
        const usage = usageRows[0] ?? {
          pulls_used: 0,
          max_pulls: user.identity_type === "ITIN" ? 1 : 2,
        };
        if (usage.pulls_used >= usage.max_pulls) {
          res.status(429).json({
            error: { code: "429", message: "Monthly pull limit reached" },
          });
          return;
        }
        // ITIN requires explicit confirmation
        if (user.identity_type === "ITIN" && !confirmed) {
          res.status(402).json({
            error: {
              code: "402",
              message: "ITIN_CONFIRMATION_REQUIRED",
              details: "$60 charge",
            },
          });
          return;
        }
        const provider = user.identity_type === "ITIN" ? "MYFICO" : "ARRAY";
        const costUsd = user.identity_type === "ITIN" ? 60 : 2;
        // In production: call Array.com or myFICO API here
        // For now, generate a mock score (replace with real API call)
        const mockScore = Math.floor(580 + Math.random() * 220);
        await dbQuery(
          `INSERT INTO credit_pulls (user_id, provider, bureau, score, cost_usd)
         VALUES (?, ?, 'all', ?, ?)`,
          [req.userId, provider, mockScore, costUsd],
        );
        // Update usage
        await dbQuery(
          `INSERT INTO pull_usage (user_id, month, pulls_used, max_pulls)
         VALUES (?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE pulls_used = pulls_used + 1`,
          [req.userId, month, usage.max_pulls],
        );
        // Send email notification
        await sendCreditReportReady(
          user.email,
          user.id,
          mockScore,
          user.locale ?? "en",
        ).catch(() => {});
        // Return updated report
        const [oldest] = await dbQuery<any[]>(
          "SELECT score FROM credit_pulls WHERE user_id = ? ORDER BY pull_date ASC LIMIT 1",
          [req.userId],
        );
        const report: CreditReportDTO = {
          score: mockScore,
          startingScore: oldest[0]?.score ?? mockScore,
          grade: scoreToGrade(mockScore),
          bureauScores: [
            {
              bureau: "Experian",
              score: mockScore,
              lastUpdated: new Date().toISOString(),
            },
            {
              bureau: "TransUnion",
              score: mockScore - 5,
              lastUpdated: new Date().toISOString(),
            },
            {
              bureau: "Equifax",
              score: mockScore + 3,
              lastUpdated: new Date().toISOString(),
            },
          ],
          scoreFactors: [
            {
              factor: "Payment History",
              impact: 35,
              description: "On-time payments improve your score",
            },
            {
              factor: "Credit Utilization",
              impact: 30,
              description: "Keep usage below 30%",
            },
            {
              factor: "Credit Age",
              impact: 15,
              description: "Older accounts help your score",
            },
          ],
          lastPullDate: new Date().toISOString(),
          provider,
        };
        res.json(report);
      } catch (err) {
        console.error("Pull error:", err);
        res
          .status(500)
          .json({ error: { code: "500", message: "Credit pull failed" } });
      }
    },
  );

  // ── BILLING ────────────────────────────────────────────────────────────────

  /** POST /api/billing/checkout */
  expressApp.post(
    "/api/billing/checkout",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [rows] = await dbQuery<any[]>(
          "SELECT * FROM users WHERE id = ?",
          [req.userId],
        );
        const user = rows[0];
        if (!user) {
          res
            .status(404)
            .json({ error: { code: "404", message: "User not found" } });
          return;
        }
        let customerId = user.stripe_customer_id;
        if (!customerId) {
          const customer = await getStripe().customers.create({
            email: user.email,
            name: user.name,
          });
          customerId = customer.id;
          await dbQuery(
            "UPDATE users SET stripe_customer_id = ? WHERE id = ?",
            [customerId, req.userId],
          );
        }
        const setupIntent = await getStripe().setupIntents.create({
          customer: customerId,
          payment_method_types: ["card"],
          usage: "off_session",
        });
        const response: EmbeddedCheckoutResponse = {
          clientSecret: setupIntent.client_secret!,
        };
        res.json(response);
      } catch (err) {
        console.error("Setup intent error:", err);
        res.status(500).json({
          error: {
            code: "500",
            message: "Failed to create payment setup",
          },
        });
      }
    },
  );

  /** POST /api/billing/subscribe */
  expressApp.post(
    "/api/billing/subscribe",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const { paymentMethodId } = req.body as { paymentMethodId: string };
        if (!paymentMethodId) {
          res
            .status(400)
            .json({
              error: { code: "400", message: "Payment method required" },
            });
          return;
        }
        const [rows] = await dbQuery<any[]>(
          "SELECT * FROM users WHERE id = ?",
          [req.userId],
        );
        const user = rows[0];
        if (!user?.stripe_customer_id) {
          res
            .status(400)
            .json({
              error: { code: "400", message: "No billing account found" },
            });
          return;
        }
        const customerId: string = user.stripe_customer_id;

        // Attach PM to customer and set as default
        await getStripe().paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
        await getStripe().customers.update(customerId, {
          invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Charge $7 trial access fee immediately
        const trialFee = await getStripe().paymentIntents.create({
          amount: 700,
          currency: "usd",
          customer: customerId,
          payment_method: paymentMethodId,
          confirm: true,
          off_session: true,
          description: "MyCreditFICO Pro – 7-day trial access fee",
          metadata: { userId: String(req.userId) },
        });

        if (
          trialFee.status === "requires_action" ||
          trialFee.status === "requires_confirmation"
        ) {
          res.json({
            requiresAction: true,
            clientSecret: trialFee.client_secret,
          });
          return;
        }

        if (trialFee.status !== "succeeded") {
          res.status(400).json({
            error: { code: "400", message: "Trial fee payment failed" },
          });
          return;
        }

        // Create $25/month subscription with 7-day trial
        const subscription = await getStripe().subscriptions.create({
          customer: customerId,
          items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID! }],
          default_payment_method: paymentMethodId,
          trial_period_days: 7,
          metadata: { userId: String(req.userId) },
        });

        // Persist to DB
        await dbQuery(
          `INSERT INTO subscriptions
             (user_id, stripe_subscription_id, stripe_price_id, status,
              trial_start, trial_end, current_period_start, current_period_end)
           VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), FROM_UNIXTIME(?), FROM_UNIXTIME(?))`,
          [
            req.userId,
            subscription.id,
            process.env.STRIPE_MONTHLY_PRICE_ID,
            subscription.status,
            subscription.trial_start,
            subscription.trial_end,
            (subscription as any).current_period_start,
            (subscription as any).current_period_end,
          ],
        );

        // Update user subscription status
        await dbQuery("UPDATE users SET subscription_status = ? WHERE id = ?", [
          subscription.status,
          req.userId,
        ]);

        res.json({
          success: true,
          subscriptionId: subscription.id,
          status: subscription.status,
        });
      } catch (err: any) {
        console.error("Subscribe error:", err);
        res.status(500).json({
          error: {
            code: "500",
            message: err?.message ?? "Failed to create subscription",
          },
        });
      }
    },
  );

  /** POST /api/billing/portal */
  expressApp.post(
    "/api/billing/portal",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [rows] = await dbQuery<any[]>(
          "SELECT stripe_customer_id FROM users WHERE id = ?",
          [req.userId],
        );
        const customerId = rows[0]?.stripe_customer_id;
        if (!customerId) {
          res.status(400).json({
            error: { code: "400", message: "No billing account found" },
          });
          return;
        }
        const session = await getStripe().billingPortal.sessions.create({
          customer: customerId,
          return_url: `${req.headers.origin}/dashboard`,
        });
        const response: BillingPortalResponse = { url: session.url };
        res.json(response);
      } catch (err) {
        console.error("Portal error:", err);
        res.status(500).json({
          error: { code: "500", message: "Failed to open billing portal" },
        });
      }
    },
  );

  /** GET /api/billing/status */
  expressApp.get(
    "/api/billing/status",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [rows] = await dbQuery<any[]>(
          `SELECT stripe_subscription_id, status, current_period_end, cancel_at_period_end
           FROM subscriptions WHERE user_id = ?
           ORDER BY created_at DESC LIMIT 1`,
          [req.userId],
        );
        const row = rows[0];
        const response: BillingStatusDTO = {
          status: row?.status ?? "inactive",
          subscriptionId: row?.stripe_subscription_id ?? null,
          currentPeriodEnd: row?.current_period_end
            ? new Date(row.current_period_end).toISOString()
            : null,
          cancelAtPeriodEnd: Boolean(row?.cancel_at_period_end),
        };
        res.json(response);
      } catch (err) {
        console.error("Billing status error:", err);
        res.status(500).json({
          error: { code: "500", message: "Failed to fetch billing status" },
        });
      }
    },
  );

  /** POST /api/billing/cancel */
  expressApp.post(
    "/api/billing/cancel",
    requireAuth,
    async (req: AuthRequest, res) => {
      try {
        const [rows] = await dbQuery<any[]>(
          `SELECT stripe_subscription_id FROM subscriptions
           WHERE user_id = ? AND status IN ('trialing', 'active')
           ORDER BY created_at DESC LIMIT 1`,
          [req.userId],
        );
        const subscriptionId = rows[0]?.stripe_subscription_id;
        if (!subscriptionId) {
          res.status(400).json({
            error: { code: "400", message: "No active subscription found" },
          });
          return;
        }
        const updated = await getStripe().subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        const cancelAt = updated.cancel_at
          ? new Date(updated.cancel_at * 1000).toISOString()
          : null;
        await dbQuery(
          `UPDATE subscriptions SET cancel_at_period_end = 1 WHERE stripe_subscription_id = ?`,
          [subscriptionId],
        );
        const response: CancelSubscriptionResponse = {
          success: true,
          cancelAt,
        };
        res.json(response);
      } catch (err) {
        console.error("Cancel subscription error:", err);
        res.status(500).json({
          error: { code: "500", message: "Failed to cancel subscription" },
        });
      }
    },
  );

  // ── STRIPE WEBHOOKS ────────────────────────────────────────────────────────

  /** POST /api/webhooks/stripe */
  expressApp.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      res
        .status(400)
        .json({ error: { code: "400", message: "Invalid webhook signature" } });
      return;
    }
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata?.userId);
        await dbQuery(
          "UPDATE users SET subscription_status = 'trialing' WHERE id = ?",
          [userId],
        );
        const [rows] = await dbQuery<any[]>(
          "SELECT email, locale FROM users WHERE id = ?",
          [userId],
        );
        if (rows[0]) {
          await sendTrialStarted(
            rows[0].email,
            userId,
            rows[0].locale ?? "en",
          ).catch(() => {});
        }
      } else if (event.type === "customer.subscription.updated") {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string"
            ? sub.customer
            : (sub.customer as any).id;
        const [rows] = await dbQuery<any[]>(
          "SELECT id, email, locale FROM users WHERE stripe_customer_id = ?",
          [customerId],
        );
        if (rows[0]) {
          const s = sub as any;
          await dbQuery(
            "UPDATE users SET subscription_status = ? WHERE id = ?",
            [sub.status, rows[0].id],
          );
          await dbQuery(
            `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_price_id, status,
              trial_start, trial_end, current_period_start, current_period_end)
             VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), FROM_UNIXTIME(?), FROM_UNIXTIME(?))
             ON DUPLICATE KEY UPDATE status = ?, current_period_start = FROM_UNIXTIME(?),
               current_period_end = FROM_UNIXTIME(?)`,
            [
              rows[0].id,
              sub.id,
              sub.items.data[0]?.price?.id ?? "",
              sub.status,
              s.trial_start,
              s.trial_end,
              s.current_period_start,
              s.current_period_end,
              sub.status,
              s.current_period_start,
              s.current_period_end,
            ],
          );
        }
      } else if (event.type === "customer.subscription.deleted") {
        const sub = event.data.object as Stripe.Subscription;
        const subCustomerId =
          typeof sub.customer === "string"
            ? sub.customer
            : (sub.customer as any).id;
        const [rows] = await dbQuery<any[]>(
          "SELECT id, email, locale FROM users WHERE stripe_customer_id = ?",
          [subCustomerId],
        );
        if (rows[0]) {
          await dbQuery(
            "UPDATE users SET subscription_status = 'canceled' WHERE id = ?",
            [rows[0].id],
          );
          await sendSubscriptionCanceled(
            rows[0].email,
            rows[0].id,
            rows[0].locale ?? "en",
          ).catch(() => {});
        }
      } else if (event.type === "invoice.payment_failed") {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceCustomerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : ((invoice.customer as any)?.id ?? "");
        const [rows] = await dbQuery<any[]>(
          "SELECT id, email, locale FROM users WHERE stripe_customer_id = ?",
          [invoiceCustomerId],
        );
        if (rows[0]) {
          await dbQuery(
            "UPDATE users SET subscription_status = 'past_due' WHERE id = ?",
            [rows[0].id],
          );
          await sendPaymentFailed(
            rows[0].email,
            rows[0].id,
            rows[0].locale ?? "en",
          ).catch(() => {});
        }
      }
      res.json({ received: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      res
        .status(500)
        .json({ error: { code: "500", message: "Webhook processing failed" } });
    }
  });

  // ================================================

  return expressApp;
}

function getApp() {
  if (!app) {
    app = createServer();
  }
  return app;
}

// Export createServer for Vite dev server integration
export { createServer };

// Default export for Vercel serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const expressApp = getApp();
    expressApp(req as any, res as any);
  } catch (error) {
    console.error("API Handler Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: {
          code: "500",
          message: "A server error has occurred",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
};
