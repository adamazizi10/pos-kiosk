import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const UserSessionsTable = ({ rows }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (loggedIn, loggedOut) => {
    if (!loggedIn) return "—";
    const start = new Date(loggedIn);
    const end = loggedOut ? new Date(loggedOut) : new Date();
    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Logged In</TableHead>
            <TableHead>Logged Out</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No sessions found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isActive = !row.logged_out_at;

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.user_name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.user_email || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.user_role || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(row.logged_in_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(row.logged_out_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {calculateDuration(row.logged_in_at, row.logged_out_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Active" : "Ended"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserSessionsTable;
