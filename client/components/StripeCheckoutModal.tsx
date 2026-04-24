import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";
import CardPaymentForm from "@/components/CardPaymentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StripeCheckoutModalProps {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StripeCheckoutModal({
  open,
  clientSecret,
  onClose,
  onSuccess,
}: StripeCheckoutModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md w-full p-0 border border-[#1e2847] bg-[#0a0f1e] overflow-hidden gap-0">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-4 pr-14 border-b border-[#1e2847] space-y-0">
          <DialogTitle className="text-white font-semibold text-lg leading-tight">
            {t("billing.checkout_title", "Complete Your Subscription")}
          </DialogTitle>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            {t("billing.checkout_subtitle", "Secure payment powered by Stripe")}
          </p>
        </DialogHeader>

        {/* ── Card form ── */}
        <div className="px-6 py-5">
          <CardPaymentForm
            setupIntentSecret={clientSecret}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
