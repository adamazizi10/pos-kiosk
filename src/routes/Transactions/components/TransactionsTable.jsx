import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Monitor, Tablet } from "lucide-react";

const statusStyles = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Refunded: "bg-muted text-muted-foreground",
  Voided: "bg-destructive/10 text-destructive",
};

// Helper to strip currency symbol
const stripCurrency = (value) => value?.replace(/^\$/, "") || value;

const TransactionsTable = ({
  rows,
  headers,
  selectedId,
  onSelectRow,
  emptyState,
}) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-medium text-foreground">{emptyState.title}</p>
        <p className="text-sm text-muted-foreground mt-1">{emptyState.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm border-b border-border z-10">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className={cn(
                "cursor-pointer transition-colors",
                selectedId === row.id
                  ? "bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <td className="px-4 py-5 text-base text-muted-foreground whitespace-nowrap">
                {row.timeLabel}
              </td>
              <td className="px-4 py-5 text-base font-medium text-foreground whitespace-nowrap">
                #{row.transactionNumber}
              </td>
              <td className="px-4 py-5 text-base text-muted-foreground whitespace-nowrap">
                {row.receiptNumber}
              </td>
              <td className="px-4 py-5 text-base text-foreground whitespace-nowrap">
                {row.customerName}
              </td>
              <td className="px-4 py-5 text-base text-muted-foreground whitespace-nowrap">
                {row.paymentMethod}
              </td>
              <td className="px-4 py-5 text-base font-medium text-foreground whitespace-nowrap">
                {stripCurrency(row.totalLabel)}
              </td>
              <td className="px-4 py-5 whitespace-nowrap">
                <Badge
                  variant="secondary"
                  className={cn("text-sm font-medium", statusStyles[row.status])}
                >
                  {row.status}
                </Badge>
              </td>
              <td className="px-4 py-5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-base text-muted-foreground">
                  {row.device === "POS" ? (
                    <Monitor className="w-5 h-5" />
                  ) : (
                    <Tablet className="w-5 h-5" />
                  )}
                  <span>{row.device}</span>
                </div>
              </td>
              <td className="px-4 py-5 text-base text-muted-foreground whitespace-nowrap">
                {row.cashier}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
