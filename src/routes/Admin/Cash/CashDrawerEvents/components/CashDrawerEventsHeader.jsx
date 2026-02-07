import { Button } from "@/components/ui/button";

const CashDrawerEventsHeader = ({ onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Cash Drawer Events</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View all cash drawer transactions and events
        </p>
      </div>
      <Button variant="outline" onClick={onExport}>
        Export Events
      </Button>
    </div>
  );
};

export default CashDrawerEventsHeader;
