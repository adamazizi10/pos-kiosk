import { useState } from "react";
import appConfig from "@/app.config";
import TransactionsHeader from "./components/TransactionsHeader";

import TransactionsTable from "./components/TransactionsTable";
import TransactionPreview from "./components/TransactionPreview";
import PaginationBar from "./components/PaginationBar";
import ConfirmDialog from "./components/ConfirmDialog";

const TransactionsRoute = () => {
  const { transactions: txnConfig } = appConfig.mockData;
  const rows = txnConfig.rows || [];
  const rowsPerPage = txnConfig.pagination?.rowsPerPage || 10;

  // Filter state (UI-only)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [dateFilter, setDateFilter] = useState("Today");

  // Selection state
  const [selectedTransaction, setSelectedTransaction] = useState(rows[0] || null);

  // Pagination state (UI-only)
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleRows = rows.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All Methods");
    setDateFilter("Today");
  };

  const handleRefund = () => {
    console.log("Refund confirmed for", selectedTransaction?.transactionNumber);
    setRefundDialogOpen(false);
  };

  const handleVoid = () => {
    console.log("Void confirmed for", selectedTransaction?.transactionNumber);
    setVoidDialogOpen(false);
  };

  const handleReprint = () => {
    console.log("Reprint clicked for", selectedTransaction?.transactionNumber);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header with Filters */}
      <TransactionsHeader 
        title={txnConfig.pageTitle} 
        storeName={appConfig.store.name}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={txnConfig.searchPlaceholder}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={txnConfig.filters.statusOptions}
        methodFilter={methodFilter}
        onMethodFilterChange={setMethodFilter}
        methodOptions={txnConfig.filters.methodOptions}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        dateOptions={txnConfig.filters.dateOptions}
        onClearFilters={handleClearFilters}
        clearFiltersText={txnConfig.clearFiltersText}
      />

      {/* Main Content: Table + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Table (70%) */}
        <div className="w-[70%] flex flex-col border-r border-border">
          <div className="flex-1 overflow-hidden">
            <TransactionsTable
              rows={visibleRows}
              headers={txnConfig.tableHeaders}
              selectedId={selectedTransaction?.id}
              onSelectRow={setSelectedTransaction}
              emptyState={txnConfig.emptyState}
            />
          </div>
          
          <div className="shrink-0">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              prevText={txnConfig.pagination.prevText}
              nextText={txnConfig.pagination.nextText}
            />
          </div>
        </div>

        {/* Right Panel: Preview (30%) */}
        <div className="w-[30%] h-full">
          <TransactionPreview
            transaction={selectedTransaction}
            actions={txnConfig.previewActions}
            onRefund={() => setRefundDialogOpen(true)}
            onVoid={() => setVoidDialogOpen(true)}
            onReprint={handleReprint}
          />
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        onConfirm={handleRefund}
        title={txnConfig.refundModal.title}
        message={txnConfig.refundModal.message}
        cancelText={txnConfig.refundModal.cancelButton}
        confirmText={txnConfig.refundModal.confirmButton}
      />
      <ConfirmDialog
        isOpen={voidDialogOpen}
        onClose={() => setVoidDialogOpen(false)}
        onConfirm={handleVoid}
        title={txnConfig.voidModal.title}
        message={txnConfig.voidModal.message}
        cancelText={txnConfig.voidModal.cancelButton}
        confirmText={txnConfig.voidModal.confirmButton}
      />
    </div>
  );
};

export default TransactionsRoute;
