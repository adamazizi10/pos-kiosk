import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POSSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>POS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="cashPayments">Enable Cash Payments</Label>
          <Switch id="cashPayments" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="cardPayments">Enable Card Payments</Label>
          <Switch id="cardPayments" defaultChecked />
        </div>

        <div className="space-y-2">
          <Label htmlFor="receiptPrinter">Default Receipt Printer</Label>
          <Select defaultValue="printer1">
            <SelectTrigger id="receiptPrinter">
              <SelectValue placeholder="Select printer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="printer1">Receipt Printer 1</SelectItem>
              <SelectItem value="printer2">Receipt Printer 2</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pinRefunds">Require PIN for Refunds</Label>
          <Switch id="pinRefunds" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default POSSettings;
