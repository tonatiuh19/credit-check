import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHead from "@/components/PageHead";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Loader2,
  BadgeCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/store/slices/authSlice";
import {
  fetchBillingStatus,
  openBillingPortal,
  cancelSubscription,
  resetCancel,
} from "@/store/slices/billingSlice";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CONFIRM_PHRASE = "CANCEL MY PLAN";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  active: {
    label: "Active",
    color: "text-accent border-accent bg-accent/10",
    icon: CheckCircle,
  },
  trialing: {
    label: "Trial",
    color: "text-primary border-primary bg-primary/10",
    icon: Clock,
  },
  past_due: {
    label: "Past Due",
    color: "text-destructive border-destructive bg-destructive/10",
    icon: AlertTriangle,
  },
  canceled: {
    label: "Canceled",
    color: "text-muted-foreground border-muted bg-muted/10",
    icon: XCircle,
  },
  inactive: {
    label: "Inactive",
    color: "text-muted-foreground border-muted bg-muted/10",
    icon: XCircle,
  },
};

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signOut } = useClerk();
  const { user } = useAppSelector((s) => s.auth);
  const {
    status: billingStatus,
    loading: billingLoading,
    canceling,
    canceledAt,
    portalUrl,
    error: billingError,
  } = useAppSelector((s) => s.billing);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchBillingStatus());
  }, [dispatch]);

  // Redirect to portal when URL is ready
  useEffect(() => {
    if (portalUrl) window.location.href = portalUrl;
  }, [portalUrl]);

  // Handle successful cancellation
  useEffect(() => {
    if (canceledAt) {
      setCancelSuccess(true);
      setShowCancelModal(false);
    }
  }, [canceledAt]);

  const handleOpenCancelModal = () => {
    dispatch(resetCancel());
    setConfirmInput("");
    setCancelSuccess(false);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setConfirmInput("");
  };

  const handleConfirmCancel = async () => {
    if (confirmInput !== CONFIRM_PHRASE) return;
    await dispatch(cancelSubscription());
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const currentStatus =
    billingStatus?.status ?? user?.subscriptionStatus ?? "inactive";
  const cfg = statusConfig[currentStatus] ?? statusConfig.inactive;
  const StatusIcon = cfg.icon;

  const periodEnd = billingStatus?.currentPeriodEnd
    ? new Date(billingStatus.currentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isSubscribed = ["active", "trialing"].includes(currentStatus);

  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title={t("profile.seo_title", "My Profile")}
        description={t(
          "profile.seo_description",
          "Manage your MyCreditFICO account, billing, and subscription.",
        )}
        robots="noindex,nofollow"
      />
      {/* Top nav */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-inter">
                {t("profile.back_to_dashboard")}
              </span>
            </Link>
          </div>
          <span className="font-dm-serif text-lg text-foreground">
            {t("profile.title")}
          </span>
          <div className="w-32" />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold font-space-mono text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-dm-serif text-foreground">
              {user?.name ?? "—"}
            </h1>
            <p className="text-muted-foreground font-inter mt-1">
              {user?.email ?? "—"}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-inter",
                  cfg.color,
                )}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {t(`profile.billing.status.${currentStatus}`)}
              </span>
              {billingStatus?.cancelAtPeriodEnd && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold font-inter">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t("profile.billing.cancels_at_end")}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold font-inter text-foreground">
                  {t("profile.personal.title")}
                </h2>
                <p className="text-xs text-muted-foreground font-inter">
                  {t("profile.personal.subtitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            <InfoRow
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              label={t("profile.personal.name")}
              value={user?.name ?? "—"}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
              label={t("profile.personal.email")}
              value={user?.email ?? "—"}
            />
            <InfoRow
              icon={<BadgeCheck className="w-4 h-4 text-muted-foreground" />}
              label={t("profile.personal.identity")}
              value={user?.identityType ?? "—"}
            />
          </div>
        </motion.div>

        {/* Billing & Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h2 className="text-base font-semibold font-inter text-foreground">
                  {t("profile.billing.title")}
                </h2>
                <p className="text-xs text-muted-foreground font-inter">
                  {t("profile.billing.subtitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Plan summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
              <div>
                <p className="text-sm font-semibold font-inter text-foreground">
                  {t("profile.billing.plan")}
                </p>
                <p className="text-xs text-muted-foreground font-inter mt-0.5">
                  {billingStatus?.cancelAtPeriodEnd && periodEnd
                    ? t("profile.billing.cancels_on", { date: periodEnd })
                    : periodEnd
                      ? t("profile.billing.renews_on", { date: periodEnd })
                      : t("profile.billing.no_active")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-space-mono text-foreground">
                  $25
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </p>
                <p className="text-xs text-muted-foreground font-inter">
                  {t("profile.billing.after_trial")}
                </p>
              </div>
            </div>

            {/* Cancel success banner */}
            <AnimatePresence>
              {cancelSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent"
                >
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold font-inter">
                      {t("profile.cancel.success")}
                    </p>
                    {canceledAt && (
                      <p className="text-xs font-inter mt-0.5">
                        {t("profile.cancel.period_note", {
                          date: new Date(canceledAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" },
                          ),
                        })}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2 border-border/50 hover:border-primary/50 hover:text-primary transition-all"
                onClick={() => dispatch(openBillingPortal())}
                disabled={billingLoading}
              >
                {billingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                {t("profile.billing.update_payment")}
              </Button>
            </div>

            {/* Danger zone */}
            {isSubscribed &&
              !billingStatus?.cancelAtPeriodEnd &&
              !cancelSuccess && (
                <div className="mt-4 pt-5 border-t border-border/30">
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold font-inter text-red-400">
                        {t("profile.billing.danger_zone")}
                      </p>
                      <p className="text-xs text-muted-foreground font-inter mt-0.5">
                        {t("profile.billing.danger_desc")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all text-sm"
                    onClick={handleOpenCancelModal}
                  >
                    {t("profile.billing.cancel_btn")}
                  </Button>
                </div>
              )}
          </div>
        </motion.div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseCancelModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-card border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold font-inter text-foreground">
                    {t("profile.cancel.title")}
                  </h3>
                  <p className="text-xs text-red-400 font-inter mt-0.5">
                    {t("profile.cancel.warning")}
                  </p>
                </div>
              </div>

              {/* Consequences */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-muted-foreground font-inter">
                  {t("profile.cancel.lose_access")}
                </p>
                <ul className="space-y-2">
                  {(["scores", "monitoring", "advisor", "data"] as const).map(
                    (key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2.5 text-sm font-inter text-foreground"
                      >
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        {t(`profile.cancel.consequences.${key}`)}
                      </li>
                    ),
                  )}
                </ul>

                {/* Confirmation input */}
                <div className="pt-2">
                  <p className="text-sm font-inter text-muted-foreground mb-2">
                    {t("profile.cancel.confirm_label", {
                      phrase: CONFIRM_PHRASE,
                    })}
                  </p>
                  <Input
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder={CONFIRM_PHRASE}
                    className={cn(
                      "font-space-mono text-sm tracking-widest transition-colors",
                      confirmInput.length > 0 &&
                        confirmInput !== CONFIRM_PHRASE &&
                        "border-red-500/60 focus-visible:ring-red-500/30",
                      confirmInput === CONFIRM_PHRASE &&
                        "border-accent/60 focus-visible:ring-accent/30",
                    )}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {confirmInput.length > 0 &&
                    confirmInput !== CONFIRM_PHRASE && (
                      <p className="text-xs text-red-400 font-inter mt-1.5">
                        {t("profile.cancel.type_exact")}
                      </p>
                    )}
                </div>

                {billingError && (
                  <p className="text-xs text-red-400 font-inter">
                    {billingError}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex flex-col gap-2">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-inter disabled:opacity-40 gap-2"
                  disabled={confirmInput !== CONFIRM_PHRASE || canceling}
                  onClick={handleConfirmCancel}
                >
                  {canceling && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("profile.cancel.confirm_btn")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground font-inter"
                  onClick={handleCloseCancelModal}
                  disabled={canceling}
                >
                  {t("profile.cancel.back_btn")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-8 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-inter">{label}</p>
        <p className="text-sm font-medium font-inter text-foreground truncate mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
