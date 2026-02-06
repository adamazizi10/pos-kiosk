import React from "react";
import OrderCard from "./OrderCard";
import { Inbox } from "lucide-react";

const OrderColumn = ({
  column,
  orders,
  onViewOrder,
  onStatusChange,
  onCompleteClick,
  onBumpClick,
}) => {
  const getColumnStyles = () => {
    switch (column.id) {
      case "new":
        return {
          header: "bg-slate-100 text-slate-700 border-slate-200",
          badge: "bg-slate-500",
        };
      case "preparing":
        return {
          header: "bg-amber-50 text-amber-700 border-amber-200",
          badge: "bg-amber-500",
        };
      case "ready":
        return {
          header: "bg-emerald-50 text-emerald-700 border-emerald-200",
          badge: "bg-emerald-500",
        };
      default:
        return {
          header: "bg-muted text-muted-foreground border-border",
          badge: "bg-muted-foreground",
        };
    }
  };

  const styles = getColumnStyles();

  return (
    <div className="flex flex-col bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Column Header */}
      <div className={`px-4 py-3 border-b ${styles.header} flex items-center justify-between`}>
        <h2 className="text-lg font-semibold">{column.label}</h2>
        <span className={`${styles.badge} text-white text-sm font-bold px-2.5 py-0.5 rounded-full`}>
          {orders.length}
        </span>
      </div>

      {/* Column Body */}
      <div className="flex-1 p-3 space-y-3 overflow-auto max-h-[calc(100vh-280px)] bg-muted/20">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Inbox className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">{column.emptyLabel}</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              column={column}
              onView={() => onViewOrder(order)}
              onStatusChange={onStatusChange}
              onComplete={() => onCompleteClick(order)}
              onBump={() => onBumpClick(order)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderColumn;
