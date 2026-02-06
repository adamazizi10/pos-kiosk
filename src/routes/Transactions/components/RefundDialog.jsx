import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { centsToDollars, dollarsToCents, formatMoney } from "@/utils/money";
import { refundPayment } from "@/services/payments.service";
import { getRemainingRefundableCents } from "@/services/payments.service";

const RefundDialog = ({
  isOpen,
  onClose,
  payment,
  title = "Refund payment?",
  confirmText = "Confirm Refund",
  cancelText = "Cancel",
  onSuccess,
}) => {
  const [amountInput, setAmountInput] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState("entry");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const remainingCents = useMemo(
    () => getRemainingRefundableCents(payment),
    [payment]
  );

  useEffect(() => {
    if (!isOpen) return;
    setAmountInput("");
    setReason("");
    setStep("entry");
    setError("");
    setSubmitting(false);
    setIdempotencyKey(crypto.randomUUID());
  }, [isOpen]);

  if (!payment) return null;

  const amountCents = dollarsToCents(amountInput);

  const handleFullRefund = () => {
    setAmountInput(centsToDollars(remainingCents));
    setError("");
  };

  const handleContinue = () => {
    if (!amountInput || amountCents <= 0) {
      setError("Enter a valid refund amount.");
      return;
    }
    if (amountCents > remainingCents) {
      setError("Amount exceeds remaining refundable balance.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await refundPayment({
        paymentId: payment.id,
        amountCents,
        reason,
        idempotencyKey,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.message || "Refund failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {step === "entry" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Refund amount</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder={centsToDollars(remainingCents)}
                  className="h-11"
                />
                <Button type="button" variant="outline" onClick={handleFullRefund}>
                  Full refund
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining refundable: {formatMoney(remainingCents)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reason (optional)</label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-11"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                {cancelText}
              </Button>
              <Button type="button" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Refund amount</p>
              <p className="text-lg font-semibold text-foreground">
                {formatMoney(amountCents)}
              </p>
            </div>
            {reason ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="text-sm text-foreground">{reason}</p>
              </div>
            ) : null}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep("entry")}>
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button type="button" onClick={handleConfirm} disabled={submitting}>
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
