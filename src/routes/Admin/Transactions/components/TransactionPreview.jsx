import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const statusStyles = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Refunded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Voided: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const TransactionPreview = ({ transaction, onRefund, onVoid, onReprint }) => {
  if (!transaction) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a transaction to view details
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        {/* Transaction Summary */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Transaction Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction #</span>
              <span className="text-sm font-mono text-foreground">{transaction.transactionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Order #</span>
              <span className="text-sm font-mono text-foreground">{transaction.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Channel</span>
              <span className="text-sm text-foreground">{transaction.channel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={cn("text-xs", statusStyles[transaction.status])}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment Details */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Payment Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Method</span>
              <span className="text-sm text-foreground">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-medium text-foreground">{transaction.total}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Line Items */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Line Items
          </h3>
          <div className="space-y-2">
            {transaction.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-sm text-foreground">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Metadata */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Metadata
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Terminal</span>
              <span className="text-sm text-foreground">{transaction.terminal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm text-foreground">{transaction.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Employee</span>
              <span className="text-sm text-foreground">{transaction.employee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="text-sm text-foreground">{transaction.dateTime}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="border-t border-border p-4 space-y-2">
        <Button variant="outline" className="w-full" onClick={onRefund}>
          Refund
        </Button>
        <Button variant="outline" className="w-full" onClick={onVoid}>
          Void
        </Button>
        <Button variant="outline" className="w-full" onClick={onReprint}>
          Reprint Receipt
        </Button>
      </div>
    </div>
  );
};

export default TransactionPreview;
