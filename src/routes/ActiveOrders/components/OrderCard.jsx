import React from "react";
import { ChevronRight, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderCard = ({
  order,
  column,
  onView,
  onStatusChange,
  onComplete,
  onBump,
}) => {
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

  const getPrimaryAction = () => {
    switch (order.status) {
      case "new":
        return {
          label: "Start",
          onClick: () => onStatusChange(order.id, "preparing"),
        };
      case "preparing":
        return {
          label: "Mark Ready",
          onClick: () => onStatusChange(order.id, "ready"),
        };
      case "ready":
        return {
          label: "Complete",
          onClick: onComplete,
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();

  return (
    <div 
      className="bg-background rounded-lg border border-border shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-foreground">#{order.orderNumber}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeStyles()}`}>
            {order.type}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBump(); }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Customer + Time */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{order.customerLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{order.placedTimeLabel}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-1">
        {order.items.slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="bg-primary/10 text-primary text-xs font-semibold px-1.5 py-0.5 rounded">
              {item.qtyLabel}
            </span>
            <span className="text-foreground">{item.name}</span>
          </div>
        ))}
        {order.items.length > 4 && (
          <p className="text-xs text-muted-foreground">+{order.items.length - 4} more items</p>
        )}
      </div>

      {/* Tags */}
      {order.tags && order.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {order.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-xs font-medium ${
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
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className="flex-1" />
        {primaryAction && (
          <Button 
            size="lg" 
            onClick={(e) => { e.stopPropagation(); primaryAction.onClick(); }} 
            className="h-14 px-6 text-lg font-semibold gap-2 rounded-xl"
          >
            {primaryAction.label}
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
