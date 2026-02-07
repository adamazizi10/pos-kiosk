import { useState, useMemo } from "react";
import CashDrawerHeader from "./components/CashDrawerHeader";
import CashDrawerFiltersBar from "./components/CashDrawerFiltersBar";
import CashDrawerTable from "./components/CashDrawerTable";
import { useCashDrawersQuery } from "@/services/cashDrawers.queries";

const CashDrawerRoute = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const { data: cashDrawers = [], isLoading } = useCashDrawersQuery();

  const handleAddDrawer = () => {
    // UI only - will be implemented with actual functionality
    console.log("Add drawer clicked");
  };

  const handleEditDrawer = (drawer) => {
    // UI only - will be implemented with actual functionality
    console.log("Edit drawer clicked", drawer);
  };

  // Filter drawers based on search and status
  const filteredDrawers = useMemo(() => {
    return cashDrawers.filter((drawer) => {
      const matchesSearch = drawer.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all-status" ||
        (statusFilter === "active" && drawer.current_balance_cents >= 0) ||
        (statusFilter === "inactive" && drawer.current_balance_cents < 0);

      return matchesSearch && matchesStatus;
    });
  }, [cashDrawers, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <CashDrawerHeader onAddDrawer={handleAddDrawer} />
        <CashDrawerFiltersBar
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading cash drawers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <CashDrawerHeader onAddDrawer={handleAddDrawer} />
      <CashDrawerFiltersBar
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />
      <CashDrawerTable rows={filteredDrawers} onEditDrawer={handleEditDrawer} />
    </div>
  );
};

export default CashDrawerRoute;
