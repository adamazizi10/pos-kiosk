import { useState, useMemo } from "react";
import UserSessionsHeader from "./components/UserSessionsHeader";
import UserSessionsFiltersBar from "./components/UserSessionsFiltersBar";
import UserSessionsTable from "./components/UserSessionsTable";
import { useUserSessionsQuery } from "@/services/userSessions.queries";

const UserSessionsRoute = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all-status");

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

  const { data: userSessions = [], isLoading } = useUserSessionsQuery(dateRange);

  const handleExport = () => {
    // UI only - will be implemented with actual functionality
    console.log("Export sessions clicked");
  };

  // Filter sessions based on search and status
  const filteredSessions = useMemo(() => {
    return userSessions.filter((session) => {
      const matchesSearch =
        session.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.user_email?.toLowerCase().includes(searchQuery.toLowerCase());

      const isActive = !session.logged_out_at;
      const matchesStatus =
        statusFilter === "all-status" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "ended" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [userSessions, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <UserSessionsHeader onExport={handleExport} />
        <UserSessionsFiltersBar
          onSearchChange={setSearchQuery}
          onDateChange={setDateFilter}
          onStatusChange={setStatusFilter}
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <UserSessionsHeader onExport={handleExport} />
      <UserSessionsFiltersBar
        onSearchChange={setSearchQuery}
        onDateChange={setDateFilter}
        onStatusChange={setStatusFilter}
      />
      <UserSessionsTable rows={filteredSessions} />
    </div>
  );
};

export default UserSessionsRoute;
