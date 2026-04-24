import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Lock,
  Zap,
  BarChart3,
  TrendingUp,
  Bell,
  Gift,
  Shield,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  User,
} from "lucide-react";

interface Props {
  onSubscribe: () => void;
  loading: boolean;
  userName?: string;
}

const features = [
  {
    icon: BarChart3,
    titleKey: "billing.paywall_f1_title",
    descKey: "billing.paywall_f1_desc",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Sparkles,
    titleKey: "billing.paywall_f2_title",
    descKey: "billing.paywall_f2_desc",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: TrendingUp,
    titleKey: "billing.paywall_f3_title",
    descKey: "billing.paywall_f3_desc",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Bell,
    titleKey: "billing.paywall_f4_title",
    descKey: "billing.paywall_f4_desc",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Gift,
    titleKey: "billing.paywall_f5_title",
    descKey: "billing.paywall_f5_desc",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: Shield,
    titleKey: "billing.paywall_f6_title",
    descKey: "billing.paywall_f6_desc",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

const mockScores = [
  { bureau: "Experian", score: 748, color: "#4F46E5" },
  { bureau: "TransUnion", score: 731, color: "#7C3AED" },
  { bureau: "Equifax", score: 756, color: "#0891B2" },
];

const perks = [
  "billing.perk_1",
  "billing.perk_2",
  "billing.perk_3",
  "billing.perk_4",
];

export default function SubscriptionGate({
  onSubscribe,
  loading,
  userName,
}: Props) {
  const { t } = useTranslation("common");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-64 h-64 bg-emerald-600/6 rounded-full blur-3xl" />

      {/* Greeting */}
      {userName && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground font-inter mb-2"
        >
          {t("billing.paywall_greeting", "Welcome back,")}{" "}
          <span className="text-foreground font-semibold">{userName}</span> 👋
        </motion.p>
      )}

      {/* Lock badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-inter font-semibold tracking-wide"
      >
        <Lock className="w-3.5 h-3.5" />
        {t("billing.paywall_badge", "SUBSCRIPTION REQUIRED")}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif text-foreground text-center max-w-2xl leading-tight"
      >
        {t("billing.paywall_headline", "Unlock Your Credit Intelligence")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 text-base text-muted-foreground font-inter text-center max-w-xl"
      >
        {t(
          "billing.paywall_sub",
          "Real-time 3-bureau scores, AI-powered insights, and personalized credit offers — all in one dashboard.",
        )}
      </motion.p>

      {/* Blurred mock score preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mt-8 w-full max-w-2xl"
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md bg-background/60">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-primary" />
            <span className="font-inter font-semibold text-foreground text-sm">
              {t("billing.paywall_preview_locked", "Your scores are locked")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-inter">
            {t(
              "billing.paywall_preview_sub",
              "Subscribe to see your live scores",
            )}
          </p>
        </div>

        {/* Score cards (behind blur) */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-border bg-card/50 select-none">
          {mockScores.map(({ bureau, score, color }) => (
            <div
              key={bureau}
              className="flex flex-col items-center p-4 rounded-xl bg-background/60 border border-border"
            >
              <div
                className="text-3xl font-space-mono font-bold"
                style={{ color }}
              >
                {score}
              </div>
              <div className="text-xs text-muted-foreground font-inter mt-1">
                {bureau}
              </div>
              <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${((score - 300) / 550) * 100}%`,
                    background: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feature grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {features.map(
          ({ icon: Icon, titleKey, descKey, color, bg, border }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.04 }}
              className={`relative flex items-start gap-3 p-4 rounded-xl border ${border} bg-card/60`}
            >
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${color}`}
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-inter font-semibold text-foreground leading-snug">
                  {t(titleKey)}
                </p>
                <p className="text-xs text-muted-foreground font-inter mt-0.5 leading-snug">
                  {t(descKey)}
                </p>
              </div>
              <Lock className="absolute top-3 right-3 w-3.5 h-3.5 text-muted-foreground/40" />
            </motion.div>
          ),
        )}
      </motion.div>

      {/* Pricing card + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-2xl shadow-primary/10">
          {/* Top gradient stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />

          <div className="p-6">
            {/* Trial badge row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    IQ
                  </span>
                </div>
                <div>
                  <p className="text-sm font-inter font-bold text-foreground">
                    MyCreditFICO Pro
                  </p>
                  <p className="text-xs text-muted-foreground font-inter">
                    {t(
                      "billing.paywall_plan_sub",
                      "Full access, cancel anytime",
                    )}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-inter font-semibold">
                <Star className="w-3 h-3 fill-current" />
                {t("billing.paywall_trial_label", "7-Day Trial")}
              </span>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-4xl font-space-mono font-bold text-foreground">
                $7
              </span>
              <span className="text-sm text-muted-foreground font-inter">
                {t("billing.paywall_trial_desc", "to unlock")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-inter mb-5">
              {t("billing.paywall_then", "Then $25/month — cancel anytime")}
            </p>

            {/* Perks list */}
            <ul className="space-y-2 mb-6">
              {perks.map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 text-sm font-inter text-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={onSubscribe}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-inter font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  {t("common.loading", "Loading…")}
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {t("billing.paywall_cta", "Start My Trial — $7")}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>

            {/* Profile link */}
            <div className="mt-4 text-center">
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-inter hover:text-primary transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                {t(
                  "billing.paywall_profile_link",
                  "Manage your account & data in Profile",
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="mt-6 flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground font-inter"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {t(
              "billing.paywall_social",
              "Join 250,000+ members improving their credit",
            )}
          </span>
        </div>
        <span className="hidden sm:block">·</span>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
            />
          ))}
          <span className="ml-1">4.9 / 5 · 12,000+ reviews</span>
        </div>
      </motion.div>
    </div>
  );
}
