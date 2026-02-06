import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const PaymentTerminalCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState("");
  const [amount, setAmount] = useState("1.00");

  const handleStartTest = () => {
    setTestStatus("Waiting for card…");
    setTimeout(() => {
      setTestStatus("Payment approved");
    }, 2000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTestStatus("");
    setAmount("1.00");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Payment Terminal</CardTitle>
          <Badge className={cn("bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300")}>
            Connected
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Terminal Name</span>
                <p className="font-medium text-foreground">Stripe Reader S700</p>
              </div>
              <div>
                <span className="text-muted-foreground">Provider</span>
                <p className="font-medium text-foreground">Stripe Terminal</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium text-foreground">Online</p>
              </div>
              <div>
                <span className="text-muted-foreground">Mode</span>
                <p className="font-medium text-foreground">Test</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-border gap-2">
              <Button variant="outline" size="sm">
                Reconnect Terminal
              </Button>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                Test Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="testAmount">Amount ($)</Label>
              <Input
                id="testAmount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {testStatus && (
              <div className="p-3 rounded-md bg-muted text-center">
                <p className="text-sm font-medium text-foreground">{testStatus}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleStartTest} disabled={!!testStatus}>
              Start Test Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentTerminalCard;
