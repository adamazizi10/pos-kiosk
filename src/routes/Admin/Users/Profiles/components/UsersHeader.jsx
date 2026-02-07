import { Button } from "@/components/ui/button";

const UsersHeader = ({ onAddUser }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage staff access, roles, and passwords
        </p>
      </div>
      <Button onClick={onAddUser}>
        Add User
      </Button>
    </div>
  );
};

export default UsersHeader;
