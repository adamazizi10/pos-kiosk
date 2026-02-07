import { useState, useMemo, useEffect } from "react";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsFiltersBar from "./components/TransactionsFiltersBar";
import TransactionsTable from "./components/TransactionsTable";
import TransactionPreview from "./components/TransactionPreview";
import PaginationBar from "./components/PaginationBar";
import { useOrdersQuery } from "@/services/orders.queries";

const TransactionsRoute = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [sourceFilter, setSourceFilter] = useState("all-source");
  const [dateFilter, setDateFilter] = useState("all");

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case "today":
        return { startDate: today.toISOString() };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday.toISOString(),
          endDate: today.toISOString(),
        };
      case "last7":
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        return { startDate: last7.toISOString() };
      case "last30":
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        return { startDate: last30.toISOString() };
      case "all":
      default:
        return {};
    }
  }, [dateFilter]);

  const { data, isLoading } = useOrdersQuery({
    status: statusFilter !== "all-status" ? statusFilter : undefined,
    source: sourceFilter !== "all-source" ? sourceFilter : undefined,
    ...dateRange,
    page: currentPage,
    limit: 10,
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  // Client-side search filtering
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;

    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.order_number?.toString().includes(searchLower) ||
        order.customer_name?.toLowerCase().includes(searchLower) ||
        order.notes?.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchQuery]);

  // Select first order by default
  useEffect(() => {
    if (filteredOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [filteredOrders, selectedOrder]);

  const handleExport = () => {
    // UI only - will be implemented with actual functionality
    console.log("Export clicked");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="p-6 space-y-4">
          <TransactionsHeader />
          <TransactionsFiltersBar
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSourceChange={setSourceFilter}
            onDateChange={setDateFilter}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden px-6 gap-2">
          <TransactionsTable
            rows={filteredOrders}
            selectedId={selectedOrder?.id}
            onSelectRow={setSelectedOrder}
            isLoading={isLoading}
          />
          {!isLoading && totalPages > 1 && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar - Details */}
      <div className="w-[400px] shrink-0 border-l border-border bg-card">
        <TransactionPreview order={selectedOrder} onExport={handleExport} />
      </div>
    </div>
  );
};

export default TransactionsRoute;
