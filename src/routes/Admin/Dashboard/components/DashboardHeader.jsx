const DashboardHeader = () => {
  return (
    <div className="px-8 py-6 border-b border-border bg-background">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Overview of today's activity
      </p>
    </div>
  );
};

export default DashboardHeader;
