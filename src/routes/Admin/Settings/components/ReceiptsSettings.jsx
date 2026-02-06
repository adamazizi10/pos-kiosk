import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const ReceiptsSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showLogo">Show Business Logo</Label>
          <Switch id="showLogo" defaultChecked />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerText">Receipt Footer Text</Label>
          <Textarea
            id="footerText"
            placeholder="Enter footer text..."
            defaultValue="Thank you for your purchase! Visit us again soon."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="printOrderNumber">Print Order Number</Label>
          <Switch id="printOrderNumber" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="printCustomerName">Print Customer Name</Label>
          <Switch id="printCustomerName" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptsSettings;
