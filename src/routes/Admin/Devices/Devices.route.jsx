import DevicesHeader from "./components/DevicesHeader";
import ReceiptPrinterCard from "./components/ReceiptPrinterCard";
import PaymentTerminalCard from "./components/PaymentTerminalCard";
import CashDrawerCard from "./components/CashDrawerCard";
import BarcodeScannerCard from "./components/BarcodeScannerCard";

const DevicesRoute = () => {
  return (
    <div className="flex h-full flex-col gap-6 p-6 overflow-auto">
      <DevicesHeader />
      <div className="space-y-4">
        <ReceiptPrinterCard />
        <PaymentTerminalCard />
        <CashDrawerCard />
        <BarcodeScannerCard />
      </div>
    </div>
  );
};

export default DevicesRoute;
