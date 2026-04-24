import { useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CreditCard, AlertCircle, Zap, CheckCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { confirmSubscription } from "@/store/slices/billingSlice";
import { logger } from "@/utils/logger";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
);

// ── Stripe element style shared across all card fields ───────────────────────
const ELEMENT_OPTS = {
  style: {
    base: {
      color: "#f1f5f9",
      fontFamily: "Inter, ui-sans-serif, sans-serif",
      fontSize: "15px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#475569" },
      iconColor: "#6366f1",
    },
    invalid: { color: "#f87171", iconColor: "#f87171" },
  },
};

// ── Inner form (needs to be inside Elements) ─────────────────────────────────
interface InnerProps {
  setupIntentSecret: string;
  onSuccess: () => void;
}

function CardForm({ setupIntentSecret, onSuccess }: InnerProps) {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Track focus state for custom ring effect
  const [focused, setFocused] = useState<
    "number" | "expiry" | "cvc" | "name" | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || loading) return;

    setLoading(true);
    setError(null);

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      setLoading(false);
      return;
    }

    // Step 1 — Confirm the SetupIntent (saves card to customer)
    const { setupIntent, error: setupErr } = await stripe.confirmCardSetup(
      setupIntentSecret,
      {
        payment_method: {
          card: cardNumber,
          billing_details: { name: name.trim() || undefined },
        },
      },
    );

    if (setupErr) {
      setError(setupErr.message ?? t("billing.card_error_generic"));
      setLoading(false);
      return;
    }

    const paymentMethodId = setupIntent?.payment_method as string;

    // Step 2 — Create subscription via Redux thunk
    const result = await dispatch(confirmSubscription({ paymentMethodId }));

    if (confirmSubscription.rejected.match(result)) {
      setError((result.payload as string) ?? t("billing.card_error_generic"));
      setLoading(false);
      return;
    }

    const data = result.payload;

    // Step 3 — Handle 3DS on the $7 charge if required
    if (data?.requiresAction && data.clientSecret) {
      const { error: confirmErr } = await stripe.confirmCardPayment(
        data.clientSecret,
      );
      if (confirmErr) {
        setError(confirmErr.message ?? t("billing.card_error_generic"));
        setLoading(false);
        return;
      }
    }

    logger.info("Subscription created", {
      subscriptionId: data?.subscriptionId,
    });
    setDone(true);
    setTimeout(() => onSuccess(), 900);
  };

  const fieldCls = (field: typeof focused) =>
    `relative rounded-xl border bg-[#0d1123] px-4 py-3.5 transition-all duration-150 ${
      focused === field
        ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
        : "border-[#1e2847]"
    }`;

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-3"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <p className="text-foreground font-inter font-semibold text-lg">
          {t("billing.payment_success")}
        </p>
        <p className="text-muted-foreground text-sm font-inter">
          {t("billing.redirecting", "Taking you to your dashboard…")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Card number */}
      <div className="space-y-1.5">
        <label className="text-xs font-inter font-medium text-slate-400 uppercase tracking-wider">
          {t("billing.card_number", "Card number")}
        </label>
        <div className={fieldCls("number")}>
          <CardNumberElement
            options={{ ...ELEMENT_OPTS, showIcon: true }}
            onFocus={() => setFocused("number")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </div>

      {/* Expiry + CVC row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-inter font-medium text-slate-400 uppercase tracking-wider">
            {t("billing.expiry", "Expiration")}
          </label>
          <div className={fieldCls("expiry")}>
            <CardExpiryElement
              options={ELEMENT_OPTS}
              onFocus={() => setFocused("expiry")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-inter font-medium text-slate-400 uppercase tracking-wider">
            {t("billing.cvc", "Security code")}
          </label>
          <div className={fieldCls("cvc")}>
            <CardCvcElement
              options={ELEMENT_OPTS}
              onFocus={() => setFocused("cvc")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>
      </div>

      {/* Cardholder name */}
      <div className="space-y-1.5">
        <label className="text-xs font-inter font-medium text-slate-400 uppercase tracking-wider">
          {t("billing.cardholder", "Name on card")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("billing.cardholder_placeholder", "Full name")}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          className={`w-full bg-[#0d1123] rounded-xl px-4 py-3.5 text-[15px] font-inter text-slate-100 placeholder:text-slate-600 border outline-none transition-all duration-150 ${
            focused === "name"
              ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
              : "border-[#1e2847]"
          }`}
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-inter text-red-300 leading-snug">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price summary */}
      <div className="flex items-center justify-between text-xs font-inter text-muted-foreground pt-1 pb-0.5">
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          {t("billing.trial", "Start 7-day trial for $7")}
        </span>
        <span>{t("billing.then", "Then $25/month")}</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-inter font-bold text-[15px] transition-all active:scale-[0.98] shadow-lg shadow-indigo-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            {t("common.loading", "Processing…")}
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            {t("billing.pay_cta", "Pay $7 · Start 7-Day Trial")}
          </>
        )}
      </button>

      {/* Security footer */}
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-inter pt-0.5">
        <Lock className="w-3 h-3" />
        {t("billing.checkout_subtitle", "Secure payment powered by Stripe")}
        <span className="mx-1 opacity-40">·</span>
        {t("billing.cancel", "Cancel anytime")}
      </p>
    </form>
  );
}

// ── Public wrapper — provides Elements context ────────────────────────────────
interface CardPaymentFormProps {
  setupIntentSecret: string;
  onSuccess: () => void;
}

export default function CardPaymentForm({
  setupIntentSecret,
  onSuccess,
}: CardPaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm setupIntentSecret={setupIntentSecret} onSuccess={onSuccess} />
    </Elements>
  );
}
