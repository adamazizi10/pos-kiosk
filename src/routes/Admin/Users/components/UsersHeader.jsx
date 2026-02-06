import { Button } from "@/components/ui/button";

const UsersHeader = ({ onAddUser }) => {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-background">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage staff access, roles, and passwords
        </p>
      </div>
      <Button size="lg" onClick={onAddUser}>
        Add User
      </Button>
    </div>
  );
};

export default UsersHeader;
