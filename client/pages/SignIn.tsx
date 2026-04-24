import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Zap,
  Gift,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import PageHead from "@/components/PageHead";

const features = [
  { icon: Shield, key: "feature_1" },
  { icon: TrendingUp, key: "feature_2" },
  { icon: Zap, key: "feature_3" },
  { icon: Gift, key: "feature_4" },
];

// Fake live score cards for visual interest
const scoreCards = [
  { bureau: "Experian", score: 748, color: "#4F46E5" },
  { bureau: "TransUnion", score: 731, color: "#10B981" },
  { bureau: "Equifax", score: 756, color: "#6366F1" },
];

export default function SignInPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHead
        title={t("auth.page_signin_title", "Welcome back")}
        description={t(
          "auth.page_signin_subtitle",
          "Sign in to access your full credit picture.",
        )}
        robots="noindex,nofollow"
      />

      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* ── Left panel — brand / features ── */}
        <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between overflow-hidden bg-[#080d1a] p-12 xl:p-16">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-600/10 blur-3xl" />
          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Logo */}
          <Link to="/" className="relative flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <span className="text-sm font-bold text-white">IQ</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight font-inter">
              MyCreditFICO
            </span>
          </Link>

          {/* Main copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex-1 flex flex-col justify-center py-12"
          >
            <p className="text-indigo-400 text-sm font-semibold font-inter uppercase tracking-widest mb-4">
              Your credit, your power
            </p>
            <h1 className="text-4xl xl:text-5xl font-dm-serif text-white leading-tight mb-6">
              {t("auth.page_signin_title", "Welcome back")}
            </h1>
            <p className="text-slate-400 text-lg font-inter leading-relaxed mb-10 max-w-md">
              {t(
                "auth.page_signin_subtitle",
                "Sign in to access your full credit picture.",
              )}
            </p>

            {/* Feature list */}
            <ul className="space-y-4 mb-12">
              {features.map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-slate-300 font-inter text-sm">
                    {t(`auth.${key}`, key)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Live score preview cards */}
            <div className="flex gap-3">
              {scoreCards.map((card, i) => (
                <motion.div
                  key={card.bureau}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex-1 rounded-2xl border border-[#1e2847] bg-[#0e1228]/80 backdrop-blur p-4 text-center"
                >
                  <div
                    className="text-2xl font-bold font-space-mono mb-0.5"
                    style={{ color: card.color }}
                  >
                    {card.score}
                  </div>
                  <div className="text-[11px] text-slate-500 font-inter">
                    {card.bureau}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom trust line */}
          <div className="relative flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-500 text-xs font-inter">
              SOC 2 Type II · 256-bit encryption · FCRA compliant
            </span>
          </div>
        </div>

        {/* ── Right panel — Clerk form ── */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
          {/* Mobile-only header */}
          <div className="lg:hidden flex items-center gap-2.5 px-6 pt-6 pb-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">IQ</span>
              </div>
              <span className="text-white font-bold text-lg font-inter">
                MyCreditFICO
              </span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8">
            {/* Ambient glow — mobile */}
            <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl lg:hidden" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative w-full max-w-md"
            >
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
              />
            </motion.div>

            {/* Mobile trust line */}
            <div className="lg:hidden flex items-center gap-2 mt-6">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 text-xs font-inter">
                SOC 2 · 256-bit encryption · FCRA compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
