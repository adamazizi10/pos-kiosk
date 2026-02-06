import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { voidPayment } from "@/services/payments.service";

const VoidDialog = ({
  isOpen,
  onClose,
  payment,
  title = "Void payment?",
  confirmText = "Confirm Void",
  cancelText = "Cancel",
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setReason("");
    setError("");
    setSubmitting(false);
  }, [isOpen]);

  if (!payment) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await voidPayment({
        paymentId: payment.id,
        reason,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.message || "Void failed.");
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
        <div className="space-y-4">
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
            <Button type="button" onClick={handleConfirm} disabled={submitting}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoidDialog;
