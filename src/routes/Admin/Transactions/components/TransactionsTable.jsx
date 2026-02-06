import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Refunded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Voided: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const TransactionsTable = ({ rows, selectedId, onSelectRow }) => {
  return (
    <div className="overflow-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0">
          <tr className="border-b border-border">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Time</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Transaction #</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Order #</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Channel</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Customer</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Payment</th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className={cn(
                "border-b border-border cursor-pointer transition-colors hover:bg-muted/50",
                selectedId === row.id && "bg-muted"
              )}
            >
              <td className="px-3 py-2 text-foreground">{row.time}</td>
              <td className="px-3 py-2 font-mono text-foreground">{row.transactionNumber}</td>
              <td className="px-3 py-2 font-mono text-foreground">{row.orderNumber}</td>
              <td className="px-3 py-2 text-foreground">{row.channel}</td>
              <td className="px-3 py-2 text-foreground">{row.customer}</td>
              <td className="px-3 py-2 text-foreground">{row.paymentMethod}</td>
              <td className="px-3 py-2 text-right font-medium text-foreground">{row.total}</td>
              <td className="px-3 py-2">
                <Badge className={cn("text-xs", statusStyles[row.status])}>
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
