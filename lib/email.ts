import { Resend } from "resend";
import { dbQuery } from "./db";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@creditiq.app";
const APP_URL = process.env.APP_URL ?? "https://creditiq.app";

export type EmailLocale = "en" | "es-MX" | "fr";

interface SendEmailOptions {
  to: string;
  userId: number;
  type: string;
  locale?: EmailLocale;
  subject: string;
  html: string;
}

// ─── Base layout ─────────────────────────────────────────────────────────────

function baseLayout(content: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>MyCreditFICO</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#070B18;font-family:'Inter',Arial,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#070B18;min-height:100vh;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#4F46E5,#10B981);border-radius:12px;padding:10px 18px;">
                    <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">MyCreditFICO</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#111827;border-radius:20px;border:1px solid #1F2937;overflow:hidden;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 8px;">
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.6;">
                © ${new Date().getFullYear()} MyCreditFICO. All rights reserved.<br/>
                <a href="${APP_URL}" style="color:#4F46E5;text-decoration:none;">creditiq.app</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/privacy" style="color:#6B7280;text-decoration:none;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/terms" style="color:#6B7280;text-decoration:none;">Terms</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heroSection(
  iconEmoji: string,
  accentColor: string,
  title: string,
  subtitle: string,
): string {
  return `
  <div style="background:linear-gradient(160deg,${accentColor}22 0%,transparent 60%);padding:40px 36px 32px;border-bottom:1px solid #1F2937;">
    <div style="font-size:40px;margin-bottom:16px;">${iconEmoji}</div>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#F9FAFB;line-height:1.3;">${title}</h1>
    <p style="margin:0;font-size:15px;color:#9CA3AF;line-height:1.6;">${subtitle}</p>
  </div>`;
}

function bodySection(content: string): string {
  return `<div style="padding:32px 36px;">${content}</div>`;
}

function ctaButton(text: string, href: string, color = "#4F46E5"): string {
  return `
  <table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
    <tr>
      <td style="background-color:${color};border-radius:10px;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #1F2937;">
      <span style="font-size:13px;color:#6B7280;">${label}</span>
      <span style="float:right;font-size:13px;font-weight:600;color:#F9FAFB;">${value}</span>
    </td>
  </tr>`;
}

// ─── Send helper ─────────────────────────────────────────────────────────────

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  let status: "sent" | "failed" = "sent";
  try {
    await getResend().emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch {
    status = "failed";
  } finally {
    await dbQuery(
      `INSERT INTO notifications_log (user_id, type, channel, status, metadata)
       VALUES (?, ?, 'email', ?, ?)`,
      [
        opts.userId,
        opts.type,
        status,
        JSON.stringify({ subject: opts.subject }),
      ],
    );
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

const copy = {
  en: {
    welcome: {
      subject: "Welcome to MyCreditFICO — You're in! 🎉",
      preview: "Your credit journey starts now.",
      title: "Welcome to MyCreditFICO!",
      subtitle: "You've taken the first step toward total credit mastery.",
      body: "We're excited to have you on board. MyCreditFICO gives you real-time access to all 3 bureau scores, AI-powered insights, and a personalized roadmap to financial excellence.",
      next: "Here's what to do next:",
      step1: "Complete your identity verification",
      step2: "View your 3-bureau credit scores",
      step3: "Chat with your AI Credit Advisor",
      cta: "Get Started",
      footer: "Questions? Reply to this email — we're happy to help.",
    },
    trialStarted: {
      subject: "Your 7-day MyCreditFICO trial has started ✨",
      preview: "Full access is yours for 7 days.",
      title: "Your trial is live!",
      subtitle: "7 days of full access starts now.",
      body: "Your $7 trial access fee has been processed and you now have full access to every MyCreditFICO feature. After 7 days, your subscription continues at $25/month — cancel anytime from your profile.",
      planLabel: "Plan",
      planValue: "MyCreditFICO Pro",
      trialLabel: "Trial period",
      trialValue: "7 days",
      renewsLabel: "Then",
      renewsValue: "$25 / month",
      cta: "Go to Dashboard",
      footer: "Manage your subscription anytime from your Profile page.",
    },
    canceled: {
      subject: "Your MyCreditFICO subscription has been canceled",
      preview: "We're sorry to see you go.",
      title: "Subscription canceled",
      subtitle: "Your access continues until your billing period ends.",
      body: "Your MyCreditFICO Pro subscription has been set to cancel at the end of your current billing period. You'll continue to have full access until then.",
      cta: "Reactivate My Plan",
      feedback:
        "We'd love to know what we could have done better. Reply to this email anytime.",
    },
    paymentFailed: {
      subject: "Action needed: Payment failed for MyCreditFICO",
      preview: "Please update your payment method.",
      title: "Payment failed",
      subtitle: "We couldn't process your subscription payment.",
      body: "Your recent payment for MyCreditFICO Pro didn't go through. Please update your payment method to avoid losing access to your credit scores and insights.",
      cta: "Update Payment Method",
      note: "If you believe this is an error, reply to this email and we'll sort it out.",
    },
    reportReady: {
      subject: "Your new credit report is ready 📊",
      preview: "See how your score changed.",
      title: "Credit report ready",
      subtitle: "Your latest 3-bureau report has been generated.",
      scoreLabel: "Current Score",
      cta: "View Full Report",
      tip: "Pro tip: Check your score factors to see exactly what's helping or hurting your score.",
    },
  },
  "es-MX": {
    welcome: {
      subject: "Bienvenido a MyCreditFICO — ¡Ya estás dentro! 🎉",
      preview: "Tu camino al crédito perfecto empieza ahora.",
      title: "¡Bienvenido a MyCreditFICO!",
      subtitle: "Diste el primer paso hacia el dominio total de tu crédito.",
      body: "Estamos muy contentos de tenerte. MyCreditFICO te da acceso en tiempo real a los 3 bureaus de crédito, análisis con IA y un plan personalizado para tu excelencia financiera.",
      next: "¿Qué hacer a continuación?",
      step1: "Completa tu verificación de identidad",
      step2: "Consulta tus puntuaciones de los 3 bureaus",
      step3: "Habla con tu Asesor de Crédito IA",
      cta: "Comenzar",
      footer: "¿Dudas? Responde este correo — con gusto te ayudamos.",
    },
    trialStarted: {
      subject: "Tu prueba de 7 días de MyCreditFICO ha comenzado ✨",
      preview: "Acceso completo por 7 días.",
      title: "¡Tu prueba está activa!",
      subtitle: "7 días de acceso completo empiezan ahora.",
      body: "Tu cargo de acceso a prueba de $7 fue procesado y ahora tienes acceso completo a todas las funciones de MyCreditFICO. Después de 7 días, tu suscripción continúa a $25/mes — cancela cuando quieras desde tu perfil.",
      planLabel: "Plan",
      planValue: "MyCreditFICO Pro",
      trialLabel: "Período de prueba",
      trialValue: "7 días",
      renewsLabel: "Luego",
      renewsValue: "$25 / mes",
      cta: "Ir al panel",
      footer: "Administra tu suscripción desde tu página de perfil.",
    },
    canceled: {
      subject: "Tu suscripción a MyCreditFICO ha sido cancelada",
      preview: "Lamentamos que te vayas.",
      title: "Suscripción cancelada",
      subtitle: "Tu acceso continúa hasta el final del período de facturación.",
      body: "Tu suscripción a MyCreditFICO Pro ha sido programada para cancelarse al final del período de facturación actual. Seguirás teniendo acceso completo hasta entonces.",
      cta: "Reactivar mi plan",
      feedback:
        "Nos encantaría saber qué podríamos haber hecho mejor. Responde este correo cuando quieras.",
    },
    paymentFailed: {
      subject: "Acción requerida: Fallo de pago en MyCreditFICO",
      preview: "Por favor actualiza tu método de pago.",
      title: "Fallo de pago",
      subtitle: "No pudimos procesar el pago de tu suscripción.",
      body: "Tu pago reciente de MyCreditFICO Pro no fue procesado. Actualiza tu método de pago para no perder el acceso a tus puntuaciones e información crediticia.",
      cta: "Actualizar método de pago",
      note: "Si crees que es un error, responde este correo y lo resolveremos.",
    },
    reportReady: {
      subject: "Tu nuevo reporte de crédito está listo 📊",
      preview: "Descubre cómo cambió tu puntuación.",
      title: "Reporte de crédito listo",
      subtitle: "Tu reporte más reciente de los 3 bureaus ha sido generado.",
      scoreLabel: "Puntuación actual",
      cta: "Ver reporte completo",
      tip: "Pro tip: Revisa los factores de tu puntuación para saber exactamente qué la ayuda o la perjudica.",
    },
  },
  fr: {
    welcome: {
      subject: "Bienvenue sur MyCreditFICO — Vous êtes prêt ! 🎉",
      preview: "Votre parcours crédit commence maintenant.",
      title: "Bienvenue sur MyCreditFICO !",
      subtitle:
        "Vous avez fait le premier pas vers la maîtrise totale de votre crédit.",
      body: "Nous sommes ravis de vous compter parmi nous. MyCreditFICO vous donne un accès en temps réel aux 3 bureaux de crédit, des analyses alimentées par IA et une feuille de route personnalisée vers l'excellence financière.",
      next: "Que faire ensuite ?",
      step1: "Complétez votre vérification d'identité",
      step2: "Consultez vos scores des 3 bureaux",
      step3: "Discutez avec votre Conseiller Crédit IA",
      cta: "Commencer",
      footer:
        "Des questions ? Répondez à cet email — nous serons ravis de vous aider.",
    },
    trialStarted: {
      subject: "Votre essai MyCreditFICO de 7 jours a commencé ✨",
      preview: "Accès complet pendant 7 jours.",
      title: "Votre essai est actif !",
      subtitle: "7 jours d'accès complet commencent maintenant.",
      body: "Vos frais d'accès à l'essai de 7$ ont été traités et vous avez maintenant un accès complet à toutes les fonctionnalités de MyCreditFICO. Après 7 jours, votre abonnement continue à 25$/mois — annulez à tout moment depuis votre profil.",
      planLabel: "Plan",
      planValue: "MyCreditFICO Pro",
      trialLabel: "Période d'essai",
      trialValue: "7 jours",
      renewsLabel: "Ensuite",
      renewsValue: "25$ / mois",
      cta: "Aller au tableau de bord",
      footer: "Gérez votre abonnement depuis votre page de profil.",
    },
    canceled: {
      subject: "Votre abonnement MyCreditFICO a été annulé",
      preview: "Nous sommes désolés de vous voir partir.",
      title: "Abonnement annulé",
      subtitle:
        "Votre accès continue jusqu'à la fin de votre période de facturation.",
      body: "Votre abonnement MyCreditFICO Pro a été programmé pour s'annuler à la fin de votre période de facturation actuelle. Vous continuerez à avoir un accès complet jusque-là.",
      cta: "Réactiver mon plan",
      feedback:
        "Nous aimerions savoir ce que nous aurions pu faire mieux. Répondez à cet email à tout moment.",
    },
    paymentFailed: {
      subject: "Action requise : Échec de paiement MyCreditFICO",
      preview: "Veuillez mettre à jour votre moyen de paiement.",
      title: "Échec de paiement",
      subtitle: "Nous n'avons pas pu traiter votre paiement d'abonnement.",
      body: "Votre récent paiement pour MyCreditFICO Pro n'a pas abouti. Veuillez mettre à jour votre moyen de paiement pour ne pas perdre l'accès à vos scores et analyses de crédit.",
      cta: "Mettre à jour le paiement",
      note: "Si vous pensez qu'il s'agit d'une erreur, répondez à cet email et nous réglerons cela.",
    },
    reportReady: {
      subject: "Votre nouveau rapport de crédit est prêt 📊",
      preview: "Découvrez comment votre score a évolué.",
      title: "Rapport de crédit prêt",
      subtitle: "Votre dernier rapport des 3 bureaux a été généré.",
      scoreLabel: "Score actuel",
      cta: "Voir le rapport complet",
      tip: "Astuce : Vérifiez vos facteurs de score pour savoir exactement ce qui aide ou nuit à votre score.",
    },
  },
} as const;

// ─── Exported functions ───────────────────────────────────────────────────────

export async function sendWelcome(
  to: string,
  userId: number,
  name: string,
  locale: EmailLocale = "en",
) {
  const c = copy[locale].welcome;
  const firstName = name.split(" ")[0] || name;
  const html = baseLayout(
    heroSection(
      "👋",
      "#4F46E5",
      `${c.title.replace("!", `, ${firstName}!`)}`,
      c.subtitle,
    ) +
      bodySection(`
      <p style="margin:0 0 20px;font-size:15px;color:#D1D5DB;line-height:1.7;">${c.body}</p>
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#F9FAFB;">${c.next}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:8px;">
        <tr><td style="padding:8px 0;display:flex;align-items:center;gap:8px;">
          <span style="display:inline-block;width:24px;height:24px;background:#4F46E522;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#4F46E5;margin-right:10px;">1</span>
          <span style="font-size:14px;color:#D1D5DB;">${c.step1}</span>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <span style="display:inline-block;width:24px;height:24px;background:#4F46E522;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#4F46E5;margin-right:10px;">2</span>
          <span style="font-size:14px;color:#D1D5DB;">${c.step2}</span>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <span style="display:inline-block;width:24px;height:24px;background:#4F46E522;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#4F46E5;margin-right:10px;">3</span>
          <span style="font-size:14px;color:#D1D5DB;">${c.step3}</span>
        </td></tr>
      </table>
      ${ctaButton(c.cta, `${APP_URL}/onboarding`)}
      <p style="margin:16px 0 0;font-size:13px;color:#6B7280;">${c.footer}</p>
    `),
    c.preview,
  );
  await sendEmail({
    to,
    userId,
    type: "welcome",
    locale,
    subject: c.subject,
    html,
  });
}

export async function sendTrialStarted(
  to: string,
  userId: number,
  locale: EmailLocale = "en",
) {
  const c = copy[locale].trialStarted;
  const html = baseLayout(
    heroSection("✨", "#10B981", c.title, c.subtitle) +
      bodySection(`
      <p style="margin:0 0 24px;font-size:15px;color:#D1D5DB;line-height:1.7;">${c.body}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#0F172A;border-radius:12px;padding:4px 16px;margin-bottom:8px;">
        ${infoRow(c.planLabel, c.planValue)}
        ${infoRow(c.trialLabel, c.trialValue)}
        ${infoRow(c.renewsLabel, c.renewsValue)}
      </table>
      ${ctaButton(c.cta, `${APP_URL}/dashboard`, "#10B981")}
      <p style="margin:16px 0 0;font-size:13px;color:#6B7280;">${c.footer}</p>
    `),
    c.preview,
  );
  await sendEmail({
    to,
    userId,
    type: "trial_started",
    locale,
    subject: c.subject,
    html,
  });
}

export async function sendSubscriptionCanceled(
  to: string,
  userId: number,
  locale: EmailLocale = "en",
) {
  const c = copy[locale].canceled;
  const html = baseLayout(
    heroSection("😔", "#6B7280", c.title, c.subtitle) +
      bodySection(`
      <p style="margin:0 0 24px;font-size:15px;color:#D1D5DB;line-height:1.7;">${c.body}</p>
      ${ctaButton(c.cta, `${APP_URL}/profile`, "#4F46E5")}
      <p style="margin:16px 0 0;font-size:13px;color:#6B7280;">${c.feedback}</p>
    `),
    c.preview,
  );
  await sendEmail({
    to,
    userId,
    type: "subscription_canceled",
    locale,
    subject: c.subject,
    html,
  });
}

export async function sendPaymentFailed(
  to: string,
  userId: number,
  locale: EmailLocale = "en",
) {
  const c = copy[locale].paymentFailed;
  const html = baseLayout(
    heroSection("⚠️", "#EF4444", c.title, c.subtitle) +
      bodySection(`
      <p style="margin:0 0 24px;font-size:15px;color:#D1D5DB;line-height:1.7;">${c.body}</p>
      ${ctaButton(c.cta, `${APP_URL}/profile`, "#EF4444")}
      <p style="margin:16px 0 0;font-size:13px;color:#6B7280;">${c.note}</p>
    `),
    c.preview,
  );
  await sendEmail({
    to,
    userId,
    type: "payment_failed",
    locale,
    subject: c.subject,
    html,
  });
}

export async function sendCreditReportReady(
  to: string,
  userId: number,
  score: number,
  locale: EmailLocale = "en",
) {
  const c = copy[locale].reportReady;
  const scoreColor =
    score >= 740
      ? "#10B981"
      : score >= 670
        ? "#4F46E5"
        : score >= 580
          ? "#F59E0B"
          : "#EF4444";
  const html = baseLayout(
    heroSection("📊", "#4F46E5", c.title, c.subtitle) +
      bodySection(`
      <div style="text-align:center;margin:0 0 24px;padding:24px;background:#0F172A;border-radius:16px;border:1px solid #1F2937;">
        <p style="margin:0 0 4px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;">${c.scoreLabel}</p>
        <p style="margin:0;font-size:56px;font-weight:800;color:${scoreColor};font-family:monospace;line-height:1.1;">${score}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">/ 850</p>
      </div>
      ${ctaButton(c.cta, `${APP_URL}/dashboard`, "#4F46E5")}
      <div style="background:#0F172A;border-radius:10px;padding:14px 16px;margin-top:8px;border-left:3px solid #4F46E5;">
        <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">${c.tip}</p>
      </div>
    `),
    c.preview,
  );
  await sendEmail({
    to,
    userId,
    type: "credit_report_ready",
    locale,
    subject: c.subject,
    html,
  });
}
