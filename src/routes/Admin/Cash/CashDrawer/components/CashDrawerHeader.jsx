import { Button } from "@/components/ui/button";

const CashDrawerHeader = ({ onAddDrawer }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Cash Drawers</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage cash drawer balances and settings
        </p>
      </div>
      <Button onClick={onAddDrawer}>Add Cash Drawer</Button>
    </div>
  );
};

export default CashDrawerHeader;
