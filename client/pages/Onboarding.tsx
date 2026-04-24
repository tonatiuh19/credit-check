import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHead from "@/components/PageHead";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Shield,
  CheckCircle,
  Sparkles,
  User,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Lock,
  FlaskConical,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createCheckoutSession,
  clearCheckout,
} from "@/store/slices/billingSlice";
import CardPaymentForm from "@/components/CardPaymentForm";
import api from "@/lib/api";
import { logger } from "@/utils/logger";

type Step = "personal" | "identity" | "consent" | "billing";

const STEPS: Step[] = ["personal", "identity", "consent", "billing"];

const stepIcons: Record<Step, React.ComponentType<any>> = {
  personal: FileText,
  identity: User,
  consent: Shield,
  billing: CreditCard,
};

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading: billingLoading, checkoutClientSecret } = useAppSelector(
    (s) => s.billing,
  );

  // Auto-fetch clientSecret when the billing step is entered
  const [billingFetched, setBillingFetched] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [identityType, setIdentityType] = useState<"SSN" | "ITIN" | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(currentStep);

  // Account form — REMOVED (Clerk handles sign-up)

  // Personal info form
  const personalForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      ssnOrItin: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      dob: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zip: Yup.string().required("Required"),
      ssnOrItin: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      // Detect ITIN (starts with 9)
      const detected = values.ssnOrItin.replace(/\D/g, "").startsWith("9")
        ? "ITIN"
        : "SSN";
      setIdentityType(detected);
      setCurrentStep("identity");
    },
  });

  const handleIdentitySubmit = async () => {
    if (!identityType) return;
    setServerError(null);
    try {
      await api.post("/api/onboarding/identity", { identityType });
      setCurrentStep("consent");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ?? "Failed to save identity type",
      );
      logger.error("Identity step error", err);
    }
  };

  const handleConsentSubmit = async () => {
    if (!consentAgreed) return;
    setServerError(null);
    try {
      await api.post("/api/onboarding/consent", {
        consentType: "FCRA",
        agreed: true,
      });
      setCurrentStep("billing");
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? "Failed to record consent");
      logger.error("Consent step error", err);
    }
  };

  const handleStartBilling = async () => {
    if (!billingFetched) {
      setBillingFetched(true);
      dispatch(createCheckoutSession());
    }
  };

  // Trigger fetch as soon as consent step completes and billing step mounts
  useEffect(() => {
    if (currentStep === "billing" && !billingFetched && !checkoutClientSecret) {
      setBillingFetched(true);
      dispatch(createCheckoutSession());
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFillTestData = () => {
    personalForm.setValues({
      firstName: "Lionel",
      lastName: "Messi",
      dob: "1990-06-15",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      ssnOrItin: "123-45-6789",
    });
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Stripe embedded checkout modal */}
      <PageHead
        title="Get Started"
        description="Complete your identity verification to unlock your 3-bureau credit scores and personalized insights."
        robots="noindex,nofollow"
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
          <Link
            to="/"
            className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {t("common.back")}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((step, i) => {
                const Icon = stepIcons[step];
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div key={step} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        done
                          ? "bg-accent border-accent text-accent-foreground"
                          : active
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-inter hidden sm:block ${active ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {t(`onboarding.steps.${step}`)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{
                  width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Error banner */}
          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {/* Step panels */}
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Personal Info ── */}
            {currentStep === "personal" && (
              <motion.div
                key="personal"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-dm-serif text-foreground">
                        {t("onboarding.steps.personal")}
                      </h2>
                    </div>
                    {import.meta.env.DEV && (
                      <button
                        type="button"
                        onClick={handleFillTestData}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition"
                        title="Fill with test data (dev only)"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        Test data
                      </button>
                    )}
                  </div>
                  <form
                    onSubmit={personalForm.handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {(["firstName", "lastName"] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-inter text-foreground mb-1">
                            {t(
                              `onboarding.personal.${field === "firstName" ? "firstname" : "lastname"}`,
                            )}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={personalForm.values[field]}
                            onChange={personalForm.handleChange}
                            onBlur={personalForm.handleBlur}
                            className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          {personalForm.touched[field] &&
                            personalForm.errors[field] && (
                              <p className="text-xs text-destructive mt-1">
                                {personalForm.errors[field]}
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                    {(
                      [
                        "dob",
                        "address",
                        "city",
                        "state",
                        "zip",
                        "ssnOrItin",
                      ] as const
                    ).map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-inter text-foreground mb-1">
                          {t(
                            `onboarding.personal.${field === "ssnOrItin" ? "ssn_itin" : field}`,
                          )}
                        </label>
                        <input
                          type={
                            field === "dob"
                              ? "date"
                              : field === "ssnOrItin"
                                ? "password"
                                : "text"
                          }
                          name={field}
                          value={personalForm.values[field]}
                          onChange={personalForm.handleChange}
                          onBlur={personalForm.handleBlur}
                          className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {personalForm.touched[field] &&
                          personalForm.errors[field] && (
                            <p className="text-xs text-destructive mt-1">
                              {personalForm.errors[field]}
                            </p>
                          )}
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <Link
                        to="/"
                        className="flex-1 py-3 rounded-xl bg-muted text-foreground font-inter font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" /> {t("common.back")}
                      </Link>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        {t("common.next")} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Identity Type ── */}
            {currentStep === "identity" && (
              <motion.div
                key="identity"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-dm-serif text-foreground">
                      {t("onboarding.identity_type.title")}
                    </h2>
                  </div>
                  <div className="space-y-3 mb-6">
                    {(["SSN", "ITIN"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setIdentityType(type)}
                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                          identityType === type
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground font-inter">
                          {t(`onboarding.identity_type.${type.toLowerCase()}`)}
                        </div>
                        <div className="text-sm text-muted-foreground font-inter mt-1">
                          {t(
                            `onboarding.identity_type.${type.toLowerCase()}_desc`,
                          )}
                        </div>
                        {type === "ITIN" && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="w-3 h-3" />
                            {t("onboarding.identity_type.itin_warning")}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep("personal")}
                      className="flex-1 py-3 rounded-xl bg-muted text-foreground font-inter font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> {t("common.back")}
                    </button>
                    <button
                      onClick={handleIdentitySubmit}
                      disabled={!identityType}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {t("common.next")} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Consent ── */}
            {currentStep === "consent" && (
              <motion.div
                key="consent"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-dm-serif text-foreground">
                      {t("onboarding.consent.title")}
                    </h2>
                  </div>
                  <div className="bg-muted rounded-xl p-5 mb-6 border border-border">
                    <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                      {t("onboarding.consent.fcra")}
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-inter text-foreground">
                      {t("onboarding.consent.agree")}
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep("identity")}
                      className="flex-1 py-3 rounded-xl bg-muted text-foreground font-inter font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> {t("common.back")}
                    </button>
                    <button
                      onClick={handleConsentSubmit}
                      disabled={!consentAgreed}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {t("common.next")} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Billing ── */}
            {currentStep === "billing" && (
              <motion.div
                key="billing"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Header — always visible */}
                  <div className="p-6 pb-4 flex items-center gap-4 border-b border-border">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-dm-serif text-foreground leading-tight">
                        {t("onboarding.steps.billing")}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30">
                          <CheckCircle className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-inter text-accent font-semibold">
                            {t("billing.trial_badge")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-inter">
                          · {t("billing.then")} · {t("billing.cancel")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card payment form */}
                  {billingLoading && !checkoutClientSecret && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <RefreshCw className="w-7 h-7 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground font-inter">
                        {t("common.loading")}
                      </p>
                    </div>
                  )}
                  {checkoutClientSecret && (
                    <div className="px-6 pb-6">
                      <CardPaymentForm
                        setupIntentSecret={checkoutClientSecret}
                        onSuccess={() =>
                          navigate("/dashboard?billing=complete")
                        }
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
