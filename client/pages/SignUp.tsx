import { Link } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Zap, Gift, CheckCircle, Star } from "lucide-react";
import PageHead from "@/components/PageHead";

const features = [
  { icon: Shield, key: "feature_1" },
  { icon: TrendingUp, key: "feature_2" },
  { icon: Zap, key: "feature_3" },
  { icon: Gift, key: "feature_4" },
];

// Stat callouts for social proof
const stats = [
  { value: "250K+", label: "Members" },
  { value: "94%", label: "See improvement" },
  { value: "$0", label: "Hidden fees" },
];

export default function SignUpPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHead
        title={t("auth.page_signup_title", "Take control of your credit")}
        description={t(
          "auth.page_signup_subtitle",
          "Join over 250,000 people building better credit with MyCreditFICO.",
        )}
        robots="noindex,nofollow"
      />

      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* ── Left panel — brand / social proof ── */}
        <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between overflow-hidden bg-[#080d1a] p-12 xl:p-16">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -top-40 -right-20 w-[450px] h-[450px] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-emerald-600/10 blur-3xl" />
          {/* Grid */}
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
            <p className="text-emerald-400 text-sm font-semibold font-inter uppercase tracking-widest mb-4">
              Start free · Cancel anytime
            </p>
            <h1 className="text-4xl xl:text-5xl font-dm-serif text-white leading-tight mb-6">
              {t("auth.page_signup_title", "Take control of your credit")}
            </h1>
            <p className="text-slate-400 text-lg font-inter leading-relaxed mb-10 max-w-md">
              {t(
                "auth.page_signup_subtitle",
                "Join over 250,000 people building better credit with MyCreditFICO.",
              )}
            </p>

            {/* Feature list */}
            <ul className="space-y-4 mb-12">
              {features.map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-inter text-sm">
                    {t(`auth.${key}`, key)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="flex gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 rounded-2xl border border-[#1e2847] bg-[#0e1228]/80 backdrop-blur p-4 text-center"
                >
                  <div className="text-2xl font-bold font-space-mono text-white mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500 font-inter">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Stars / review blurb */}
            <div className="flex items-center gap-2 mt-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-slate-400 text-xs font-inter">
                4.9 · 12,000+ reviews
              </span>
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
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/onboarding"
              />
            </motion.div>

            {/* Mobile stars */}
            <div className="lg:hidden flex items-center gap-2 mt-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-slate-500 text-xs font-inter">
                4.9 · 12,000+ reviews
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
