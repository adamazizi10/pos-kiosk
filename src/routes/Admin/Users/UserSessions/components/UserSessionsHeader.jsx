import { Button } from "@/components/ui/button";

const UserSessionsHeader = ({ onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground">User Sessions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View user login and logout activity
        </p>
      </div>
      <Button variant="outline" onClick={onExport}>
        Export Sessions
      </Button>
    </div>
  );
};

export default UserSessionsHeader;
