import { Search } from "lucide-react";
import appConfig from "@/app.config";

const POSTopBar = ({ searchValue, onSearchChange }) => {
  const { store } = appConfig;
  const { topBar } = appConfig.mockData.pos;

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
      <div className="flex items-center gap-4">
        {/* Store Name */}
        <h1 className="text-lg font-semibold text-foreground whitespace-nowrap">
          {store.name}
        </h1>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={topBar.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-xl bg-muted border-0 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default POSTopBar;
