import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import appConfig from "@/app.config";

const TransactionsFiltersBar = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
}) => {
  const { transactions } = appConfig.mockData.pos;
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  return (
    <div className="px-4 py-3 border-b border-border bg-muted/30 space-y-3">
      {/* Search and Dropdowns Row */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={transactions.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full !pl-10 pr-3 h-10 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            {transactions.dateRangeOptions.find((d) => d.id === dateRange)?.label || "Today"}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {dateDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-background border border-border rounded-lg shadow-lg z-10">
              {transactions.dateRangeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onDateRangeChange(option.id);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    dateRange === option.id ? "bg-muted font-medium" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payment Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            {transactions.paymentFilters.find((p) => p.id === paymentFilter)?.label || "All Methods"}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {paymentDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-background border border-border rounded-lg shadow-lg z-10">
              {transactions.paymentFilters.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onPaymentFilterChange(option.id);
                    setPaymentDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    paymentFilter === option.id ? "bg-muted font-medium" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1">
        {transactions.statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onStatusFilterChange(filter.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionsFiltersBar;
