import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TransactionPreview = ({ order, onExport }) => {
  if (!order) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-muted-foreground text-center">
            Select an order to view details
          </p>
        </div>

        {/* Bottom Actions - Always visible */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" onClick={onExport}>
            Export CSV
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default";
      case "CREATED":
        return "secondary";
      case "REFUNDED":
      case "VOIDED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formatDateTime(order.created_at)}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Order Info - 2x2 Grid */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3">Order Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs mb-1">Customer</span>
              <span className="font-medium">{order.customer_name || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-1">Notes</span>
              <span className="font-medium">{order.notes || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-1">Dining</span>
              <span className="font-medium">{order.dining_option?.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs mb-1">Source</span>
              <span className="font-medium">{order.source}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items */}
        <div>
          <h4 className="text-sm font-medium mb-3">Items</h4>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="text-sm">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <span className="font-medium">{item.qty}x</span>{" "}
                    <span>{item.name_snapshot}</span>
                  </div>
                  <span className="font-mono ml-2">
                    {formatCurrency(item.line_total_cents)}
                  </span>
                </div>
                {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                  <div className="text-xs text-muted-foreground ml-6">
                    {Object.entries(item.selected_options).map(([key, value]) => (
                      <div key={key}>
                        {key}: {value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-mono">{formatCurrency(order.subtotal_cents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax:</span>
            <span className="font-mono">{formatCurrency(order.tax_cents)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total:</span>
            <span className="font-mono">{formatCurrency(order.total_cents)}</span>
          </div>
        </div>

        {order.paid_at && (
          <>
            <Separator className="my-4" />
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid At:</span>
                <span>{formatDateTime(order.paid_at)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            Print Receipt
          </Button>
          {order.status === "PAID" && (
            <Button variant="outline" size="sm">
              Refund Order
            </Button>
          )}
        </div>
        <Button variant="outline" className="w-full" onClick={onExport}>
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default TransactionPreview;
