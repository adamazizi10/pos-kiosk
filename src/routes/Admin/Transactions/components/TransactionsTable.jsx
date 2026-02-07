import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TransactionsTable = ({ rows, selectedId, onSelectRow, isLoading }) => {
  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default";
      case "CREATED":
        return "secondary";
      case "REFUNDED":
      case "VOIDED":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Dining</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedId === row.id && "bg-muted"
                )}
                onClick={() => onSelectRow(row)}
              >
                <TableCell className="font-medium">#{row.order_number}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(row.created_at)}
                </TableCell>
                <TableCell>{row.customer_name || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{row.source}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.dining_option?.replace("_", " ")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(row.total_cents)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
