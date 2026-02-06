import React from "react";
import { Search, Volume2, VolumeX, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ActiveOrdersTopBar = ({
  storeName,
  config,
  selectedFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const handleRefresh = () => {
    console.log("Refresh clicked");
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Back + Store + Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/pos")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">{storeName}</p>
            <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
          </div>
          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {config.liveLabel}
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {config.refreshLabel}
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 px-6 pb-4">
        {config.filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default ActiveOrdersTopBar;
