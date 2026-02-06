import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const transactionRows = [
  { time: "2:45 PM", transaction: "TXN-1234", customer: "John Smith", method: "Card", total: "$45.00", status: "Completed" },
  { time: "2:32 PM", transaction: "TXN-1233", customer: "Jane Doe", method: "Cash", total: "$28.50", status: "Completed" },
  { time: "2:15 PM", transaction: "TXN-1232", customer: "Mike Johnson", method: "Card", total: "$112.00", status: "Completed" },
  { time: "1:58 PM", transaction: "TXN-1231", customer: "Sarah Wilson", method: "Card", total: "$67.25", status: "Refunded" },
  { time: "1:42 PM", transaction: "TXN-1230", customer: "Tom Brown", method: "Cash", total: "$34.00", status: "Completed" },
  { time: "1:28 PM", transaction: "TXN-1229", customer: "Emily Davis", method: "Card", total: "$89.99", status: "Completed" },
];

const statusStyles = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Refunded: "bg-muted text-muted-foreground",
};

const DashboardRecentTransactions = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Transaction</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Method</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactionRows.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{row.time}</td>
                <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">#{row.transaction}</td>
                <td className="px-4 py-4 text-sm text-foreground whitespace-nowrap">{row.customer}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{row.method}</td>
                <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">{row.total}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className={cn("text-xs font-medium", statusStyles[row.status])}>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRecentTransactions;
