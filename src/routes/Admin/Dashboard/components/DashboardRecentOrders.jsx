import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orderRows = [
  { order: "ORD-5678", channel: "POS", status: "Preparing", time: "2:45 PM" },
  { order: "ORD-5677", channel: "Kiosk", status: "Ready", time: "2:38 PM" },
  { order: "ORD-5676", channel: "POS", status: "Completed", time: "2:32 PM" },
  { order: "ORD-5675", channel: "Kiosk", status: "Preparing", time: "2:28 PM" },
  { order: "ORD-5674", channel: "POS", status: "Completed", time: "2:15 PM" },
];

const statusStyles = {
  Preparing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Ready: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const channelStyles = {
  POS: "bg-muted text-foreground",
  Kiosk: "bg-muted text-foreground",
};

const DashboardRecentOrders = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Channel</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orderRows.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">#{row.order}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className={cn("text-xs font-medium", channelStyles[row.channel])}>
                    {row.channel}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className={cn("text-xs font-medium", statusStyles[row.status])}>
                    {row.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRecentOrders;
