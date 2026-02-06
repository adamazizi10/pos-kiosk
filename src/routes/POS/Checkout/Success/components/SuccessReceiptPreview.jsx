import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  Printer,
} from "lucide-react";

const mockItems = [
  { name: "Espresso", qtyLabel: "2×", priceLabel: "$6.00" },
  { name: "Croissant", qtyLabel: "1×", priceLabel: "$4.50" },
  { name: "Latte Grande", qtyLabel: "1×", priceLabel: "$5.50" },
  { name: "Blueberry Muffin", qtyLabel: "2×", priceLabel: "$7.00" },
];

const SuccessReceiptPreview = ({ data, onBackToMain, onPrint }) => {
  if (!data) return null;

  const items = data.items?.length > 0 ? data.items : mockItems;

  return (
    <div className="h-full w-full flex flex-col bg-muted/20 rounded-2xl overflow-hidden border border-border">
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Payment Approved for {data.customerName}
                </h2>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-base text-muted-foreground">
                {data.dateLabel} • {data.timeLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">
                Transaction #{data.transactionNumber}
              </p>
              <p className="text-base text-muted-foreground">
                {data.device} • {data.terminal}
              </p>
            </div>
            <p className="text-base text-muted-foreground">
              {data.paymentSummary}
            </p>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Items</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-base">
                  <span className="text-muted-foreground">
                    {item.qtyLabel} {item.name}
                  </span>
                  <span className="font-medium text-foreground text-lg">{item.priceLabel?.replace(/^\$/, "")}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground text-lg">{data.totals.subtotalLabel?.replace(/^\$/, "")}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground text-lg">{data.totals.taxLabel?.replace(/^\$/, "")}</span>
            </div>
            <div className="flex items-center justify-between text-xl font-bold pt-2">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{data.totals.totalLabel?.replace(/^\$/, "")}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-6 border-t border-border">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full h-20 text-base gap-2 rounded-xl"
          onClick={onPrint}
        >
          <Printer className="h-5 w-5" />
          {data.printLabel}
        </Button>
      </div>
    </div>
  );
};

export default SuccessReceiptPreview;
