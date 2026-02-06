import { Receipt, Search, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TransactionsHeader = ({
  title,
  storeName,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  methodFilter,
  onMethodFilterChange,
  methodOptions,
  dateFilter,
  onDateFilterChange,
  dateOptions,
  onClearFilters,
  clearFiltersText,
}) => {
  const navigate = useNavigate();
  
  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "All" ||
    methodFilter !== "All Methods" ||
    dateFilter !== "Today";

  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-background">
      {/* Left: Title and Store Name */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Receipt className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {storeName && (
            <p className="text-sm text-muted-foreground">{storeName}</p>
          )}
        </div>
      </div>

      {/* Right: Search and Filters */}
      <div className="flex items-center gap-3 flex-1">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[160px] h-12 bg-muted/50 text-base">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions?.map((option) => (
              <SelectItem key={option} value={option} className="py-3 text-base">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Method Filter */}
        <Select value={methodFilter} onValueChange={onMethodFilterChange}>
          <SelectTrigger className="w-[170px] h-12 bg-muted/50 text-base">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {methodOptions?.map((option) => (
              <SelectItem key={option} value={option} className="py-3 text-base">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[160px] h-12 bg-muted/50 text-base">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions?.map((option) => (
              <SelectItem key={option} value={option} className="py-3 text-base">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onClearFilters}
            className="h-12 px-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5 mr-1" />
            {clearFiltersText}
          </Button>
        )}

        <button
          className="w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center ml-auto"
          title="Back to POS"
          onClick={() => navigate("/pos")}
        >
          <Home className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TransactionsHeader;
