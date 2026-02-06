import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, ShoppingBag, CreditCard, Banknote, ClipboardEdit } from "lucide-react";
import usePosCart from "@/context/usePosCart";
import useStartCardPayment from "./useStartCardPayment";
import BlockingLoadingModal from "@/components/BlockingLoadingModal";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";

const CheckoutRoute = () => {
  const {
    customerName,
    setCustomerName,
    specialInstructions,
    setSpecialInstructions,
    pickupTime,
    setPickupTime,
    orderType,
    setOrderType,
  } = usePosCart();
  const navigate = useNavigate();
  const handlePayWithCard = useStartCardPayment();
  const [startingPayment, setStartingPayment] = useState(false);
  const [startingCashPayment, setStartingCashPayment] = useState(false);
  const isStarting = startingPayment || startingCashPayment;

  const handlePayWithCardClick = async () => {
    if (isStarting) return;
    setStartingPayment(true);
    try {
      await handlePayWithCard();
    } catch (err) {
      setStartingPayment(false);
    }
  };

  const handlePayWithCash = () => {
    if (isStarting) return;
    setStartingCashPayment(true);
    navigate("/pos/cash-payment");
  };

  const cartPanelConfig = useMemo(
    () => ({
      topActions: {
        showSideButton: false,
        showOpenDrawerButton: false,
      },
      itemControls: {
        showIncrement: false,
        showDecrement: false,
        showClearItem: false,
      },
      checkoutAction: {
        visible: true,
        label: "Edit Order",
        to: "/pos",
        requireItems: false,
        icon: ClipboardEdit,
      },
    }),
    []
  );

  usePOSCartPanelConfig(cartPanelConfig);

  return (
    <div className="flex flex-col h-full bg-background p-4">
      <BlockingLoadingModal open={isStarting} text="Starting payment..." />
      {/* Single unified container */}
      <div className="flex-1 bg-card rounded-xl border border-border p-6 flex flex-col gap-6 overflow-auto">
        <h2 className="text-2xl font-bold text-foreground">Order Details</h2>
        
        {/* Customer Name - Full width, larger */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-muted-foreground">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter name..."
            className="w-full h-16 px-5 rounded-xl border border-border bg-background text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Notes - Full width, larger */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-muted-foreground">Notes</label>
          <input
            type="text"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Special instructions..."
            className="w-full h-16 px-5 rounded-xl border border-border bg-background text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Pickup Time - Full width, larger */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-muted-foreground">Pickup Time</label>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full h-16 px-5 rounded-xl border border-border bg-background text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
          >
            <option value="asap" className="py-4 text-lg">ASAP</option>
            <option value="10min" className="py-4 text-lg">10 min</option>
            <option value="20min" className="py-4 text-lg">20 min</option>
            <option value="30min" className="py-4 text-lg">30 min</option>
          </select>
        </div>

        {/* Order Type Buttons - Copied from Kiosk */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-muted-foreground">Order Type</label>
          <div className="flex gap-4">
            <button
              onClick={() => setOrderType("dine-in")}
              className={`flex-1 flex items-center justify-center gap-4 h-32 rounded-xl border-2 transition-all duration-200 ${
                orderType === "dine-in"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                orderType === "dine-in" ? "bg-primary/10" : "bg-secondary"
              }`}>
                <UtensilsCrossed size={28} className="text-foreground" />
              </div>
              <span className="text-2xl font-semibold text-foreground">Dine-in</span>
            </button>
            
            <button
              onClick={() => setOrderType("takeout")}
              className={`flex-1 flex items-center justify-center gap-4 h-32 rounded-xl border-2 transition-all duration-200 ${
                orderType === "takeout"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                orderType === "takeout" ? "bg-primary/10" : "bg-secondary"
              }`}>
                <ShoppingBag size={28} className="text-foreground" />
              </div>
              <span className="text-2xl font-semibold text-foreground">Takeout</span>
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-auto">
          <div className="flex gap-4">
            <button
              onClick={handlePayWithCardClick}
              disabled={isStarting}
              className="flex-1 flex items-center justify-center gap-4 h-24 rounded-xl border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Pay with Card</span>
            </button>
            <button
              onClick={handlePayWithCash}
              disabled={isStarting}
              className="flex-1 flex items-center justify-center gap-4 h-24 rounded-xl border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Banknote className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Pay with Cash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutRoute;
