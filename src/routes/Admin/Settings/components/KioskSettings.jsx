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

const KioskSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiosk</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="kioskOrdering">Enable Kiosk Ordering</Label>
          <Switch id="kioskOrdering" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoReset">Auto-reset After Order</Label>
          <Switch id="autoReset" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showPrices">Show Prices on Menu</Label>
          <Switch id="showPrices" defaultChecked />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inactivityTimeout">Inactivity Timeout</Label>
          <Select defaultValue="60">
            <SelectTrigger id="inactivityTimeout">
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default KioskSettings;
