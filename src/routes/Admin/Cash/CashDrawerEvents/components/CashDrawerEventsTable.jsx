import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const CashDrawerEventsTable = ({ rows }) => {
  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case "OPEN":
      case "ADD":
      case "SALE":
        return "default";
      case "CLOSE":
        return "secondary";
      case "REMOVE":
      case "REFUND":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDelta = (deltaCents) => {
    const sign = deltaCents >= 0 ? "+" : "";
    return `${sign}${formatCurrency(deltaCents)}`;
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Cash Drawer</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No events found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(row.created_at)}
                </TableCell>
                <TableCell className="font-medium">{row.drawer_label}</TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(row.type)}>{row.type}</Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-mono ${
                      row.delta_cents >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatDelta(row.delta_cents)}
                  </span>
                </TableCell>
                <TableCell>{row.user_name || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{row.reason || "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CashDrawerEventsTable;
