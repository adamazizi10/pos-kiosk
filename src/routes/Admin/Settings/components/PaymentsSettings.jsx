import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const PaymentsSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paymentProvider">Payment Provider</Label>
          <Input id="paymentProvider" value="Stripe" readOnly className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label>Accepted Methods</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="methodCard" defaultChecked />
              <Label htmlFor="methodCard" className="font-normal">Card</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="methodCash" defaultChecked />
              <Label htmlFor="methodCash" className="font-normal">Cash</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="methodWallet" />
              <Label htmlFor="methodWallet" className="font-normal">Wallet</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tip Options</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="tip10" defaultChecked />
              <Label htmlFor="tip10" className="font-normal">10%</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tip15" defaultChecked />
              <Label htmlFor="tip15" className="font-normal">15%</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tip20" defaultChecked />
              <Label htmlFor="tip20" className="font-normal">20%</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tipCustom" defaultChecked />
              <Label htmlFor="tipCustom" className="font-normal">Custom</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsSettings;
