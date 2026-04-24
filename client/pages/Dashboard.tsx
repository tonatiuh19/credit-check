import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Shield,
  Star,
  Zap,
  FileText,
  Gift,
  Eye,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Globe,
  ExternalLink,
  Lock,
  User,
  PartyPopper,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PageHead from "@/components/PageHead";
import SubscriptionGate from "@/components/SubscriptionGate";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCreditReport,
  fetchPullUsage,
  fetchScoreHistory,
  triggerCreditPull,
} from "@/store/slices/creditSlice";
import { fetchMe } from "@/store/slices/authSlice";
import {
  openBillingPortal,
  fetchBillingStatus,
} from "@/store/slices/billingSlice";
import { useClerk } from "@clerk/clerk-react";
import { logger } from "@/utils/logger";

// ── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max((score - 300) / (850 - 300), 0), 1);
  const offset = circumference - pct * circumference;
  const color =
    score >= 740
      ? "#10B981"
      : score >= 670
        ? "#4F46E5"
        : score >= 580
          ? "#F59E0B"
          : "#EF4444";

  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-space-mono font-bold text-foreground">
          {score}
        </div>
        <div className="text-xs text-muted-foreground font-inter mt-1">
          / 850
        </div>
      </div>
    </div>
  );
}

// ── Grade Badge ──────────────────────────────────────────────────────────────
function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    "A+": "text-accent border-accent bg-accent/10",
    A: "text-accent border-accent bg-accent/10",
    B: "text-primary border-primary bg-primary/10",
    C: "text-yellow-400 border-yellow-400 bg-yellow-400/10",
    D: "text-orange-400 border-orange-400 bg-orange-400/10",
    F: "text-destructive border-destructive bg-destructive/10",
  };
  return (
    <div
      className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl font-bold font-space-mono ${colors[grade] ?? colors["B"]}`}
    >
      {grade}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signOut } = useClerk();
  const { report, pullUsage, scoreHistory, loading, pulling, error } =
    useAppSelector((s) => s.credit);
  const { user } = useAppSelector((s) => s.auth);
  const {
    loading: billingLoading,
    portalUrl,
    status: billingStatus,
  } = useAppSelector((s) => s.billing);
  const [itinConfirm, setItinConfirm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "overview" | "builder" | "boost" | "report" | "3b" | "offers" | "privacy"
  >("overview");

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchCreditReport());
    dispatch(fetchPullUsage());
    dispatch(fetchScoreHistory());
    dispatch(fetchBillingStatus());
    // Handle return from Stripe embedded checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get("billing") === "complete") {
      setPaymentSuccess(true);
      dispatch(fetchBillingStatus());
      // Clean URL without reloading
      window.history.replaceState({}, "", "/dashboard");
      setTimeout(() => setPaymentSuccess(false), 6000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (portalUrl) {
      window.location.href = portalUrl;
    }
  }, [portalUrl]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handlePull = async () => {
    if (user?.identityType === "ITIN" && !itinConfirm) {
      setItinConfirm(true);
      return;
    }
    setItinConfirm(false);
    const result = await dispatch(
      triggerCreditPull(user?.identityType === "ITIN"),
    );
    if (triggerCreditPull.rejected.match(result)) {
      logger.error("Pull failed", result.payload);
    }
  };

  // Open modal when clientSecret is ready — removed (subscription lives in Onboarding)

  const handleStartSubscription = () => {
    navigate("/onboarding");
  };

  const hasActiveSubscription =
    billingStatus?.status === "active" || billingStatus?.status === "trialing";

  const pullsLeft = pullUsage ? pullUsage.maxPulls - pullUsage.pullsUsed : 0;
  const atLimit = pullUsage ? pullUsage.pullsUsed >= pullUsage.maxPulls : false;

  const navItems = [
    { id: "overview", label: t("nav.scores.tracker"), icon: TrendingUp },
    { id: "builder", label: t("nav.scores.builder"), icon: Star },
    { id: "boost", label: t("nav.scores.boost"), icon: Zap },
    { id: "report", label: t("nav.reports.smart"), icon: FileText },
    { id: "3b", label: t("nav.reports.3b"), icon: BarChart3 },
    { id: "offers", label: "myLONA®", icon: Gift },
    { id: "privacy", label: "PrivacyMaster®", icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Payment success toast */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 shadow-2xl shadow-emerald-900/40 text-white"
          >
            <PartyPopper className="w-5 h-5 flex-shrink-0" />
            <span className="font-inter font-semibold text-sm">
              {t(
                "billing.payment_success",
                "Subscription activated! Welcome to MyCreditFICO Pro.",
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHead
        title={t("dashboard.seo_title", "Dashboard")}
        description={t(
          "dashboard.seo_description",
          "Your real-time credit score dashboard — 3-bureau scores, score history, and personalized insights.",
        )}
        robots="noindex,nofollow"
      />
      {/* Top nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                IQ
              </span>
            </div>
            <span className="text-xl font-dm-serif text-foreground">
              MyCreditFICO
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <User className="w-4 h-4" />
              {t("profile.nav_link")}
            </Link>
            <button
              onClick={() => dispatch(openBillingPortal())}
              disabled={billingLoading}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <ExternalLink className="w-4 h-4" />
              {t("billing.manage")}
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:opacity-90 transition"
            >
              {t("nav.signout")}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 fixed h-full top-16 pt-6 pb-4 px-3">
          <div className="mb-6 px-2">
            <p className="text-xs text-muted-foreground font-inter uppercase tracking-widest mb-1">
              Welcome
            </p>
            <p className="text-sm font-semibold text-foreground font-inter truncate">
              {user?.name ?? user?.email}
            </p>
            <div
              className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-inter font-semibold ${
                user?.subscriptionStatus === "active" ||
                user?.subscriptionStatus === "trialing"
                  ? "bg-accent/20 text-accent"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              {user?.subscriptionStatus ?? "inactive"}
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  hasActiveSubscription &&
                  setActiveSection(id as typeof activeSection)
                }
                disabled={!hasActiveSubscription}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter transition-all ${
                  !hasActiveSubscription
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : activeSection === id
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {!hasActiveSubscription && (
                  <Lock className="w-3 h-3 ml-auto text-muted-foreground/30" />
                )}
              </button>
            ))}
          </nav>

          {/* Pull counter */}
          <div className="mt-4 p-3 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground font-inter mb-2">
              {t("dashboard.pulls.available", {
                n: pullUsage?.pullsUsed ?? 0,
                max: pullUsage?.maxPulls ?? 2,
              })}
            </p>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: pullUsage
                    ? `${(pullUsage.pullsUsed / pullUsage.maxPulls) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64">
          {/* ── No subscription gate ── */}
          {billingStatus !== null && !hasActiveSubscription && (
            <SubscriptionGate
              onSubscribe={handleStartSubscription}
              loading={billingLoading}
              userName={user?.name ?? user?.email}
            />
          )}

          {(billingStatus === null || hasActiveSubscription) && loading && (
            <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {hasActiveSubscription && !loading && !report && (
            <div className="p-4 sm:p-6 lg:p-8 text-center py-20">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-dm-serif text-foreground mb-3">
                No Credit Report Yet
              </h2>
              <p className="text-muted-foreground font-inter mb-6">
                Pull your first credit report to get started.
              </p>
              <button
                onClick={handlePull}
                disabled={pulling || atLimit}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {pulling ? t("common.loading") : t("dashboard.pulls.refresh")}
              </button>
            </div>
          )}

          {hasActiveSubscription && !loading && report && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* ITIN confirmation modal */}
              {itinConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full"
                  >
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-dm-serif text-foreground text-center mb-2">
                      {t("itin.confirm")}
                    </h3>
                    <p className="text-sm text-muted-foreground font-inter text-center mb-6">
                      {t("itin.confirm_desc")}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setItinConfirm(false)}
                        className="flex-1 py-3 rounded-xl bg-muted text-foreground font-inter font-medium"
                      >
                        {t("common.cancel")}
                      </button>
                      <button
                        onClick={handlePull}
                        disabled={pulling}
                        className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-inter font-semibold"
                      >
                        {pulling ? t("common.loading") : t("common.confirm")}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* ── OVERVIEW: ScoreTracker ── */}
              {activeSection === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score card */}
                    <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-dm-serif text-foreground">
                            {t("dashboard.score.title")}
                          </h2>
                          <p className="text-xs text-muted-foreground font-inter">
                            {t("dashboard.score.as_of", {
                              date: new Date(
                                report.lastPullDate,
                              ).toLocaleDateString(),
                            })}
                          </p>
                        </div>
                        <button
                          onClick={handlePull}
                          disabled={pulling || atLimit}
                          title={
                            atLimit
                              ? t("dashboard.pulls.limit_reached")
                              : t("dashboard.pulls.refresh")
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-inter font-medium hover:bg-primary/30 transition disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${pulling ? "animate-spin" : ""}`}
                          />
                          <span className="hidden sm:inline">
                            {t("dashboard.pulls.refresh")}
                          </span>
                        </button>
                      </div>
                      <ScoreGauge score={report.score} />
                      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-muted rounded-xl p-3">
                          <div className="text-xs text-muted-foreground font-inter mb-1">
                            {t("dashboard.score.starting", { score: "" })}
                          </div>
                          <div className="text-2xl font-space-mono font-bold text-foreground">
                            {report.startingScore}
                          </div>
                        </div>
                        <div className="bg-accent/10 border border-accent/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground font-inter mb-1">
                            {t("dashboard.score.gained", { pts: "" })}
                          </div>
                          <div className="text-2xl font-space-mono font-bold text-accent">
                            +{report.score - report.startingScore}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grade & Future Score */}
                    <div className="space-y-6">
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <p className="text-sm text-muted-foreground font-inter mb-3">
                          {t("dashboard.report.grade")}
                        </p>
                        <div className="flex justify-center">
                          <GradeBadge grade={report.grade} />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 rounded-2xl p-6 text-center">
                        <p className="text-sm text-muted-foreground font-inter mb-2">
                          {t("dashboard.future_score")}
                        </p>
                        <div className="text-4xl font-space-mono font-bold text-primary">
                          {Math.min(report.score + 83 + 20, 850)}
                        </div>
                        <p className="text-xs text-accent font-inter mt-1">
                          projected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Score History Chart */}
                  {scoreHistory.length > 1 && (
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="text-base font-dm-serif text-foreground mb-4">
                        Score History
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={scoreHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 11, fontFamily: "Inter" }}
                          />
                          <YAxis
                            domain={[500, 850]}
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 11, fontFamily: "Inter" }}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 8,
                            }}
                            labelStyle={{
                              color: "hsl(var(--foreground))",
                              fontFamily: "Inter",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── SCOREBUILDER ── */}
              {activeSection === "builder" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-dm-serif text-foreground">
                    {t("dashboard.scorebuilder.title")}
                  </h2>
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
                    <Star className="w-12 h-12 text-primary mx-auto mb-3" />
                    <div className="text-5xl font-space-mono font-bold text-accent mb-2">
                      +83
                    </div>
                    <p className="text-muted-foreground font-inter">
                      {t("dashboard.scorebuilder.potential", { pts: 83 })}
                    </p>
                  </div>
                  <div className="grid gap-4">
                    {report.scoreFactors.map((factor, i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-xl p-5 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-semibold text-foreground font-inter">
                            {factor.factor}
                          </h4>
                          <p className="text-sm text-muted-foreground font-inter mt-0.5">
                            {factor.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-accent font-space-mono">
                              +{Math.round((factor.impact / 100) * 83)} pts
                            </div>
                            <div className="text-xs text-muted-foreground font-inter">
                              {factor.impact}% weight
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-inter font-bold text-lg hover:opacity-90 transition">
                    {t("dashboard.scorebuilder.cta")}
                  </button>
                </motion.div>
              )}

              {/* ── SCOREBOOST ── */}
              {activeSection === "boost" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-dm-serif text-foreground">
                    {t("dashboard.scoreboost.title")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
                      <TrendingUp className="w-10 h-10 text-accent mx-auto mb-3" />
                      <div className="text-4xl font-space-mono font-bold text-accent">
                        +20
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mt-2">
                        {t("dashboard.scoreboost.boost", { pts: 20 })}
                      </p>
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center">
                      <TrendingDown className="w-10 h-10 text-destructive mx-auto mb-3" />
                      <div className="text-4xl font-space-mono font-bold text-destructive">
                        -148
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mt-2">
                        {t("dashboard.scoreboost.risk", { pts: 148 })}
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-inter font-bold text-lg hover:opacity-90 transition">
                    {t("dashboard.scoreboost.cta")}
                  </button>
                </motion.div>
              )}

              {/* ── SMART CREDIT REPORT ── */}
              {activeSection === "report" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-dm-serif text-foreground">
                      {t("dashboard.report.title")}
                    </h2>
                    <GradeBadge grade={report.grade} />
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-inter">
                          {t("dashboard.report.last_update")}
                        </p>
                        <p className="text-sm font-inter text-foreground">
                          {new Date(report.lastPullDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-inter">
                          Provider
                        </p>
                        <p className="text-sm font-semibold text-primary font-inter">
                          {report.provider}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {report.scoreFactors.map((factor, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground font-inter">
                              {factor.factor}
                            </p>
                            <p className="text-xs text-muted-foreground font-inter">
                              {factor.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${factor.impact}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground font-inter">
                              {factor.impact}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── 3-BUREAU REPORT ── */}
              {activeSection === "3b" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-dm-serif text-foreground">
                    {t("dashboard.3b.title")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {report.bureauScores.map((b) => (
                      <div
                        key={b.bureau}
                        className="bg-card border border-border rounded-2xl p-6 text-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground font-inter mb-2">
                          {b.bureau}
                        </p>
                        <div className="text-4xl font-space-mono font-bold text-foreground">
                          {b.score}
                        </div>
                        <p className="text-xs text-muted-foreground font-inter mt-2">
                          {t("dashboard.report.last_update")}:{" "}
                          {new Date(b.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── OFFERS ── */}
              {activeSection === "offers" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-dm-serif text-foreground">
                    {t("dashboard.offers.title")}
                  </h2>
                  <p className="text-muted-foreground font-inter">
                    {t("dashboard.offers.subtitle")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Chase Freedom Unlimited",
                        rate: "1.5%",
                        limit: "$5,000",
                        type: "Credit Card",
                      },
                      {
                        name: "Capital One Quicksilver",
                        rate: "1.5%",
                        limit: "$3,000",
                        type: "Credit Card",
                      },
                      {
                        name: "SoFi Personal Loan",
                        rate: "8.99%",
                        limit: "$25,000",
                        type: "Personal Loan",
                      },
                      {
                        name: "Discover it Cash Back",
                        rate: "5%",
                        limit: "$4,000",
                        type: "Credit Card",
                      },
                    ].map((offer) => (
                      <div
                        key={offer.name}
                        className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-inter font-semibold">
                            {offer.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground font-inter mb-1">
                          {offer.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter">
                          <span>Rate: {offer.rate}</span>
                          <span>Limit: {offer.limit}</span>
                        </div>
                        <button className="mt-3 w-full py-2 rounded-lg bg-primary/20 text-primary text-sm font-inter font-semibold hover:bg-primary/30 transition">
                          {t("dashboard.offers.cta")}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── PRIVACY MASTER ── */}
              {activeSection === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-dm-serif text-foreground">
                    {t("dashboard.privacy.title")}
                  </h2>
                  <div className="bg-card border border-border rounded-2xl p-8 text-center">
                    <Eye className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground font-inter mb-2">
                      {t("dashboard.privacy.label")}
                    </p>
                    <div className="text-5xl font-space-mono font-bold text-destructive mb-3">
                      44
                    </div>
                    <p className="text-base text-foreground font-inter font-semibold">
                      {t("dashboard.privacy.found", { n: 44 })}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground font-inter">
                        {t("dashboard.privacy.next_scan")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
