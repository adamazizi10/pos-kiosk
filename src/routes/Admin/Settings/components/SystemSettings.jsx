import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SystemSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
          <Switch id="maintenanceMode" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="debugMode">Debug Mode</Label>
          <Switch id="debugMode" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="environment">Environment</Label>
          <Input id="environment" value="Production" readOnly className="bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
