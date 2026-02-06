import React, { useState } from "react";
import appConfig from "@/app.config";
import ActiveOrdersTopBar from "./components/ActiveOrdersTopBar";
import OrdersBoard from "./components/OrdersBoard";
import OrderDetailsSheet from "./components/OrderDetailsSheet";
import ConfirmCompleteDialog from "./components/ConfirmCompleteDialog";

const ActiveOrdersRoute = () => {
  const { store } = appConfig;
  const { activeOrders } = appConfig.mockData;

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [orders, setOrders] = useState(activeOrders.orders);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    console.log(`Order ${orderId} status changed to ${newStatus}`);
  };

  const handleCompleteClick = (order) => {
    setSelectedOrder(order);
    setConfirmAction("complete");
    setConfirmOpen(true);
  };

  const handleBumpClick = (order) => {
    setSelectedOrder(order);
    setConfirmAction("bump");
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedOrder) {
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      console.log(`Order ${selectedOrder.id} ${confirmAction}d`);
    }
    setConfirmOpen(false);
    setSelectedOrder(null);
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <ActiveOrdersTopBar
        storeName={store.name}
        config={activeOrders.topBar}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 p-6 overflow-auto">
        <OrdersBoard
          orders={orders}
          columns={activeOrders.columns}
          onViewOrder={handleViewOrder}
          onStatusChange={handleStatusChange}
          onCompleteClick={handleCompleteClick}
          onBumpClick={handleBumpClick}
        />
      </main>

      <OrderDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        order={selectedOrder}
        onClose={handleCloseDetails}
        onStatusChange={handleStatusChange}
        onComplete={handleCompleteClick}
      />

      <ConfirmCompleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        order={selectedOrder}
        action={confirmAction}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
};

export default ActiveOrdersRoute;
