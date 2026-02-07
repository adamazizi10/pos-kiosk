import { useState, useMemo } from "react";
import CashDrawerEventsHeader from "./components/CashDrawerEventsHeader";
import CashDrawerEventsFiltersBar from "./components/CashDrawerEventsFiltersBar";
import CashDrawerEventsTable from "./components/CashDrawerEventsTable";
import { useCashDrawerEventsQuery } from "@/services/cashDrawerEvents.queries";

const CashDrawerEventsRoute = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
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

  const { data: cashDrawerEvents = [], isLoading } = useCashDrawerEventsQuery({
    type: typeFilter !== "all-types" ? typeFilter : undefined,
    ...dateRange,
  });

  const handleExport = () => {
    // UI only - will be implemented with actual functionality
    console.log("Export events clicked");
  };

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    return cashDrawerEvents.filter((event) => {
      const matchesSearch =
        event.drawer_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.user_name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [cashDrawerEvents, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <CashDrawerEventsHeader onExport={handleExport} />
        <CashDrawerEventsFiltersBar
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onDateChange={setDateFilter}
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <CashDrawerEventsHeader onExport={handleExport} />
      <CashDrawerEventsFiltersBar
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onDateChange={setDateFilter}
      />
      <CashDrawerEventsTable rows={filteredEvents} />
    </div>
  );
};

export default CashDrawerEventsRoute;
