import DashboardHeader from "./components/DashboardHeader";
import DashboardKPICards from "./components/DashboardKPICards";
import DashboardRecentTransactions from "./components/DashboardRecentTransactions";
import DashboardRecentOrders from "./components/DashboardRecentOrders";

const DashboardRoute = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <DashboardKPICards />
        
        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Transactions - takes 2 columns */}
          <div className="xl:col-span-2">
            <DashboardRecentTransactions />
          </div>
          
          {/* Recent Orders - takes 1 column */}
          <div className="xl:col-span-1">
            <DashboardRecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoute;
