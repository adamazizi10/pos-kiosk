import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, X, Clock, User, MapPin, FileText } from "lucide-react";

const OrderDetailsSheet = ({
  open,
  onOpenChange,
  order,
  onClose,
  onStatusChange,
  onComplete,
}) => {
  if (!order) return null;

  const getTypeBadgeStyles = () => {
    switch (order.type) {
      case "Dine-in":
        return "bg-blue-100 text-blue-700";
      case "Takeout":
        return "bg-purple-100 text-purple-700";
      case "Delivery":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeStyles = () => {
    switch (order.status) {
      case "new":
        return "bg-slate-100 text-slate-700";
      case "preparing":
        return "bg-amber-100 text-amber-700";
      case "ready":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = () => {
    switch (order.status) {
      case "new":
        return "New";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      default:
        return order.status;
    }
  };

  const handlePrint = () => {
    console.log("Print ticket for order:", order.id);
  };

  const handleMarkReady = () => {
    if (order.status === "new") {
      onStatusChange(order.id, "preparing");
    } else if (order.status === "preparing") {
      onStatusChange(order.id, "ready");
    }
    onClose();
  };

  const handleComplete = () => {
    onComplete(order);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-auto">
        <SheetHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-3xl font-bold">
                Order #{order.orderNumber}
              </SheetTitle>
              <SheetDescription className="mt-1">
                View and manage order details
              </SheetDescription>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyles()}`}>
              {getStatusLabel()}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{order.customerLabel}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeStyles()}`}>
              {order.type}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{order.placedTimeLabel}</span>
            </div>
          </div>
        </SheetHeader>

        {/* Items List */}
        <div className="py-6 border-b border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary text-sm font-bold px-2 py-1 rounded min-w-[2.5rem] text-center">
                  {item.qtyLabel}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.modifiersLabel && (
                    <p className="text-sm text-muted-foreground">{item.modifiersLabel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {order.tags && order.tags.length > 0 && (
          <div className="py-6 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {order.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tag === "Rush"
                      ? "bg-red-100 text-red-700"
                      : tag === "Allergy"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="py-6 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Special Instructions
            </h3>
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm text-foreground">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="py-6 space-y-4">
          <Button variant="outline" className="w-full h-16 text-lg font-semibold gap-3 rounded-xl" onClick={handlePrint}>
            <Printer className="h-6 w-6" />
            Print Ticket
          </Button>

          {order.status !== "ready" && (
            <Button className="w-full h-16 text-lg font-semibold gap-3 rounded-xl" onClick={handleMarkReady}>
              <CheckCircle className="h-6 w-6" />
              {order.status === "new" ? "Start Preparing" : "Mark Ready"}
            </Button>
          )}

          {order.status === "ready" && (
            <Button className="w-full h-16 text-lg font-semibold gap-3 rounded-xl" onClick={handleComplete}>
              <CheckCircle className="h-6 w-6" />
              Complete Order
            </Button>
          )}

          <Button variant="ghost" className="w-full h-14 text-base font-medium rounded-xl" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
