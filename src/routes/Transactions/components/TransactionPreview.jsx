import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RotateCcw, 
  Ban, 
  Printer,
  Receipt,
  CreditCard,
  User,
  Monitor,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Refunded: "bg-muted text-muted-foreground",
  Voided: "bg-destructive/10 text-destructive",
};

// Helper to strip currency symbol
const stripCurrency = (value) => value?.replace(/^\$/, "") || value;

const TransactionPreview = ({
  transaction,
  actions,
  onRefund,
  onVoid,
  onReprint,
}) => {
  if (!transaction) {
    return (
      <div className="h-full flex flex-col bg-muted/20">
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <Receipt className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Select a transaction to view details</p>
          </div>
        </div>
        <div className="shrink-0 p-4 border-t border-border bg-background space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" disabled className="h-14 text-base">
              <RotateCcw className="w-5 h-5 mr-2" />
              {actions?.refund || "Refund"}
            </Button>
            <Button variant="outline" size="lg" disabled className="h-14 text-base">
              <Ban className="w-5 h-5 mr-2" />
              {actions?.void || "Void"}
            </Button>
          </div>
          <Button variant="secondary" size="lg" disabled className="w-full h-14 text-base">
            <Printer className="w-5 h-5 mr-2" />
            {actions?.reprint || "Reprint"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/20 overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Transaction #{transaction.transactionNumber}
              </h2>
              <Badge
                variant="secondary"
                className={cn("text-xs font-medium", statusStyles[transaction.status])}
              >
                {transaction.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {transaction.receiptNumber}
            </p>
          </div>

          <Separator />

          {/* Meta Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Customer</span>
              <span className="ml-auto font-medium text-foreground">
                {transaction.customerName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Device</span>
              <span className="ml-auto font-medium text-foreground">
                {transaction.device} • {transaction.terminal}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Payment</span>
              <span className="ml-auto font-medium text-foreground">
                {transaction.paymentSummary}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date</span>
              <span className="ml-auto font-medium text-foreground">
                {transaction.dateLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time</span>
              <span className="ml-auto font-medium text-foreground">
                {transaction.timeLabel}
              </span>
            </div>
            {transaction.cashier !== "—" && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Cashier</span>
                <span className="ml-auto font-medium text-foreground">
                  {transaction.cashier}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Items</h3>
            <div className="space-y-2">
              {transaction.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.qtyLabel} {item.name}
                  </span>
                  <span className="font-medium text-foreground">{stripCurrency(item.priceLabel)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{stripCurrency(transaction.totals.subtotalLabel)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">{stripCurrency(transaction.totals.taxLabel)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{stripCurrency(transaction.totals.totalLabel)}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="shrink-0 p-4 border-t border-border bg-background space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onRefund}
            className="h-14 text-base"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {actions.refund}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onVoid}
            className="h-14 text-base text-destructive hover:text-destructive"
          >
            <Ban className="w-5 h-5 mr-2" />
            {actions.void}
          </Button>
        </div>
        <Button
          variant="secondary"
          size="lg"
          onClick={onReprint}
          className="w-full h-14 text-base"
        >
          <Printer className="w-5 h-5 mr-2" />
          {actions.reprint}
        </Button>
      </div>
    </div>
  );
};

export default TransactionPreview;
