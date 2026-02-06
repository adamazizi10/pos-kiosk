import { Button } from "@/components/ui/button";

const TransactionsHeader = ({ onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all POS and kiosk transactions
        </p>
      </div>
      <Button variant="outline" onClick={onExport}>
        Export CSV
      </Button>
    </div>
  );
};

export default TransactionsHeader;
