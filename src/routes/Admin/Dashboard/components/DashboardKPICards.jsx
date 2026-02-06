const kpiData = [
  { title: "Today's Sales", value: "$12,345" },
  { title: "Total Orders", value: "128" },
  { title: "Average Order Value", value: "$96.45" },
  { title: "Refunds", value: "$234" },
];

const DashboardKPICards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground">{kpi.title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardKPICards;
