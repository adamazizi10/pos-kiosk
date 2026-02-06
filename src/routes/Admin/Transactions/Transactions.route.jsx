import { useState } from "react";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsFiltersBar from "./components/TransactionsFiltersBar";
import TransactionsTable from "./components/TransactionsTable";
import TransactionPreview from "./components/TransactionPreview";
import PaginationBar from "./components/PaginationBar";

const mockTransactions = [
  { id: 1, time: "2:45 PM", transactionNumber: "TXN-001234", orderNumber: "ORD-5001", channel: "POS", customer: "John Smith", paymentMethod: "Card", total: "$45.50", status: "Completed", terminal: "POS-01", location: "Main Store", employee: "Sarah J.", dateTime: "Jan 2, 2026 2:45 PM", items: [{ name: "Latte", quantity: 2, price: "$12.00" }, { name: "Croissant", quantity: 1, price: "$5.50" }, { name: "Sandwich", quantity: 2, price: "$28.00" }] },
  { id: 2, time: "2:32 PM", transactionNumber: "TXN-001233", orderNumber: "ORD-5000", channel: "Kiosk", customer: "Emily Chen", paymentMethod: "Card", total: "$23.00", status: "Completed", terminal: "KIOSK-02", location: "Main Store", employee: "—", dateTime: "Jan 2, 2026 2:32 PM", items: [{ name: "Cappuccino", quantity: 1, price: "$8.00" }, { name: "Muffin", quantity: 2, price: "$15.00" }] },
  { id: 3, time: "2:15 PM", transactionNumber: "TXN-001232", orderNumber: "ORD-4999", channel: "POS", customer: "Michael Brown", paymentMethod: "Cash", total: "$67.25", status: "Refunded", terminal: "POS-02", location: "Main Store", employee: "Tom K.", dateTime: "Jan 2, 2026 2:15 PM", items: [{ name: "Espresso", quantity: 3, price: "$18.00" }, { name: "Bagel", quantity: 2, price: "$9.00" }, { name: "Salad", quantity: 2, price: "$40.25" }] },
  { id: 4, time: "1:58 PM", transactionNumber: "TXN-001231", orderNumber: "ORD-4998", channel: "Kiosk", customer: "Sarah Wilson", paymentMethod: "Wallet", total: "$15.75", status: "Completed", terminal: "KIOSK-01", location: "Main Store", employee: "—", dateTime: "Jan 2, 2026 1:58 PM", items: [{ name: "Green Tea", quantity: 1, price: "$6.00" }, { name: "Cookie", quantity: 3, price: "$9.75" }] },
  { id: 5, time: "1:42 PM", transactionNumber: "TXN-001230", orderNumber: "ORD-4997", channel: "POS", customer: "David Lee", paymentMethod: "Card", total: "$89.00", status: "Completed", terminal: "POS-01", location: "Main Store", employee: "Sarah J.", dateTime: "Jan 2, 2026 1:42 PM", items: [{ name: "Mocha", quantity: 4, price: "$36.00" }, { name: "Cake Slice", quantity: 2, price: "$18.00" }, { name: "Wrap", quantity: 2, price: "$35.00" }] },
  { id: 6, time: "1:28 PM", transactionNumber: "TXN-001229", orderNumber: "ORD-4996", channel: "POS", customer: "Lisa Anderson", paymentMethod: "Cash", total: "$32.50", status: "Voided", terminal: "POS-02", location: "Main Store", employee: "Tom K.", dateTime: "Jan 2, 2026 1:28 PM", items: [{ name: "Americano", quantity: 2, price: "$10.00" }, { name: "Pastry", quantity: 3, price: "$22.50" }] },
  { id: 7, time: "1:10 PM", transactionNumber: "TXN-001228", orderNumber: "ORD-4995", channel: "Kiosk", customer: "James Taylor", paymentMethod: "Card", total: "$19.25", status: "Completed", terminal: "KIOSK-02", location: "Main Store", employee: "—", dateTime: "Jan 2, 2026 1:10 PM", items: [{ name: "Hot Chocolate", quantity: 1, price: "$7.00" }, { name: "Scone", quantity: 2, price: "$12.25" }] },
  { id: 8, time: "12:55 PM", transactionNumber: "TXN-001227", orderNumber: "ORD-4994", channel: "POS", customer: "Amanda Martinez", paymentMethod: "Card", total: "$54.75", status: "Completed", terminal: "POS-01", location: "Main Store", employee: "Sarah J.", dateTime: "Jan 2, 2026 12:55 PM", items: [{ name: "Iced Coffee", quantity: 2, price: "$14.00" }, { name: "Panini", quantity: 2, price: "$40.75" }] },
  { id: 9, time: "12:38 PM", transactionNumber: "TXN-001226", orderNumber: "ORD-4993", channel: "Kiosk", customer: "Robert Johnson", paymentMethod: "Wallet", total: "$28.00", status: "Completed", terminal: "KIOSK-01", location: "Main Store", employee: "—", dateTime: "Jan 2, 2026 12:38 PM", items: [{ name: "Chai Latte", quantity: 2, price: "$16.00" }, { name: "Brownie", quantity: 2, price: "$12.00" }] },
  { id: 10, time: "12:22 PM", transactionNumber: "TXN-001225", orderNumber: "ORD-4992", channel: "POS", customer: "Jennifer Davis", paymentMethod: "Card", total: "$41.50", status: "Refunded", terminal: "POS-02", location: "Main Store", employee: "Tom K.", dateTime: "Jan 2, 2026 12:22 PM", items: [{ name: "Flat White", quantity: 2, price: "$11.00" }, { name: "Quiche", quantity: 2, price: "$30.50" }] },
  { id: 11, time: "12:05 PM", transactionNumber: "TXN-001224", orderNumber: "ORD-4991", channel: "POS", customer: "Chris Miller", paymentMethod: "Cash", total: "$17.25", status: "Completed", terminal: "POS-01", location: "Main Store", employee: "Sarah J.", dateTime: "Jan 2, 2026 12:05 PM", items: [{ name: "Drip Coffee", quantity: 3, price: "$9.00" }, { name: "Donut", quantity: 2, price: "$8.25" }] },
  { id: 12, time: "11:48 AM", transactionNumber: "TXN-001223", orderNumber: "ORD-4990", channel: "Kiosk", customer: "Nicole Garcia", paymentMethod: "Card", total: "$36.00", status: "Completed", terminal: "KIOSK-02", location: "Main Store", employee: "—", dateTime: "Jan 2, 2026 11:48 AM", items: [{ name: "Matcha Latte", quantity: 2, price: "$18.00" }, { name: "Avocado Toast", quantity: 1, price: "$18.00" }] },
];

const TransactionsRoute = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleExport = () => {
    // UI only
  };

  const handleRefund = () => {
    // UI only
  };

  const handleVoid = () => {
    // UI only
  };

  const handleReprint = () => {
    // UI only
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <TransactionsHeader onExport={handleExport} />
      <TransactionsFiltersBar />

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left Panel - Table */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TransactionsTable
            rows={mockTransactions}
            selectedId={selectedTransaction?.id}
            onSelectRow={setSelectedTransaction}
          />
          <PaginationBar
            currentPage={currentPage}
            totalPages={2}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Panel - Details */}
        <div className="w-[360px] shrink-0 rounded-md border border-border bg-card">
          <TransactionPreview
            transaction={selectedTransaction}
            onRefund={handleRefund}
            onVoid={handleVoid}
            onReprint={handleReprint}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsRoute;
