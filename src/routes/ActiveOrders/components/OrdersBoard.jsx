import React from "react";
import OrderColumn from "./OrderColumn";

const OrdersBoard = ({
  orders,
  columns,
  onViewOrder,
  onStatusChange,
  onCompleteClick,
  onBumpClick,
}) => {
  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((column) => (
        <OrderColumn
          key={column.id}
          column={column}
          orders={getOrdersByStatus(column.id)}
          onViewOrder={onViewOrder}
          onStatusChange={onStatusChange}
          onCompleteClick={onCompleteClick}
          onBumpClick={onBumpClick}
        />
      ))}
    </div>
  );
};

export default OrdersBoard;
