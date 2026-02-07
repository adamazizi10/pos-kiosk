import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusStyles = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Disabled: "bg-muted text-muted-foreground",
};

const formatLastLogin = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const UsersTable = ({
  users = [],
  isLoading,
  onEditUser,
  onResetPassword,
  onToggleActive,
  onDeleteUser,
}) => {
  const hasUsers = users && users.length > 0;

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Loading users...
                </td>
              </tr>
            ) : !hasUsers ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = user.is_active ? "Active" : "Disabled";

                return (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                      {user.full_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {user.email || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {user.role || "—"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className={cn("text-xs font-medium", statusStyles[status])}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatLastLogin(user.last_login_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUser(user)}
                          className="text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResetPassword(user)}
                          className="text-sm"
                        >
                          Reset Password
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm"
                          onClick={() => onToggleActive(user)}
                        >
                          {status === "Active" ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-destructive hover:text-destructive"
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
