import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutItemRow from "./components/CheckoutItemRow";
import CheckoutEmptyState from "./components/CheckoutEmptyState";
import CheckoutSummaryPanel from "./components/CheckoutSummaryPanel";
import CheckoutBottomBar from "./components/CheckoutBottomBar";
import useKioskCart from "@/context/useKioskCart";
import { toast } from "@/components/ui/use-toast";

const CheckoutRoute = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotalCents,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    customerName,
    setCustomerName,
    specialInstructions,
    setSpecialInstructions,
  } = useKioskCart();

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [draftInstructions, setDraftInstructions] = useState(specialInstructions || "");

  const TAX_RATE = 0.13;
  const taxCents = useMemo(() => Math.round(subtotalCents * TAX_RATE), [subtotalCents, TAX_RATE]);
  const totalCents = subtotalCents + taxCents;

  const handleIncrement = (item) => incrementItem(item.key);
  const handleDecrement = (item) => decrementItem(item.key);
  const handleRemove = (item) => removeItem(item.key);

  const handleBack = () => {
    navigate("/kiosk/menu");
  };

  const handleBrowseMenu = () => {
    navigate("/kiosk/menu");
  };

  const handlePayment = () => {
    if (!canContinue) return;
    navigate("/kiosk/checkout/select-payment-method");
  };

  const handleAddMore = () => {
    setDraftInstructions(specialInstructions || "");
    setIsInstructionsOpen(true);
  };

  const handleSaveInstructions = () => {
    setSpecialInstructions(draftInstructions);
    setIsInstructionsOpen(false);
    toast({
      title: (
        <div className="flex items-center gap-2">
          <span>Special Instructions Updated</span>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
      ),
    });
  };

  const isEmpty = items.length === 0;
  const nameTrimmed = (customerName || "").trim();
  const canContinue = !isEmpty && nameTrimmed.length > 0;
  const ctaLabel = canContinue
    ? "Continue to Payment"
    : "Enter your Name to Continue";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CheckoutHeader onBack={handleBack} title="Your Cart" />

      {isEmpty ? (
        <CheckoutEmptyState onBrowseMenu={handleBrowseMenu} />
      ) : (
        <div className="flex-1 px-6 lg:px-16 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Two-column grid layout on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

              {/* Left Column - Cart Items */}
              <div className="min-w-0">

                {/* Cart Items */}
                <div className="space-y-6">
                  {items.map((item) => (
                    <CheckoutItemRow
                      key={item.productId}
                      item={item}
                      quantity={item.qty}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="space-y-5">
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-16 rounded-2xl border border-border bg-card px-4 text-2xl font-semibold
             placeholder:text-xl placeholder:font-medium placeholder:text-muted-foreground
             focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <CheckoutSummaryPanel
                    subtotalCents={subtotalCents}
                    taxCents={taxCents}
                    totalCents={totalCents}
                  />
                  <CheckoutBottomBar
                    onCheckout={handlePayment}
                    onAddMore={handleAddMore}
                    disabled={!canContinue}
                    ctaLabel={ctaLabel}
                    specialInstructions={specialInstructions}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <DialogContent className="max-w-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Special Instructions</DialogTitle>
          </DialogHeader>
          <textarea
            value={draftInstructions}
            onChange={(e) => setDraftInstructions(e.target.value)}
            className="w-full min-h-[280px] rounded-2xl border border-border bg-background p-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Add any preferences or allergies..."
          />
          <DialogFooter className="flex flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsInstructionsOpen(false)}
              className="px-6 py-3 rounded-xl border border-border text-lg font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveInstructions}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutRoute;
