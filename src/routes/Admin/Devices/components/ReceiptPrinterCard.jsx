import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ReceiptPrinterCard = () => {
  const [feedback, setFeedback] = useState("");

  const handleTestPrint = () => {
    setFeedback("Test receipt sent to printer");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleReconnect = () => {
    setFeedback("Reconnecting...");
    setTimeout(() => setFeedback(""), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Receipt Printer</CardTitle>
        <Badge className={cn("bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300")}>
          Connected
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Printer Name</span>
              <p className="font-medium text-foreground">Epson TM-T88VI</p>
            </div>
            <div>
              <span className="text-muted-foreground">Model</span>
              <p className="font-medium text-foreground">TM-T88VI</p>
            </div>
            <div>
              <span className="text-muted-foreground">Location</span>
              <p className="font-medium text-foreground">POS Station 1</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-green-600 dark:text-green-400 min-h-[20px]">
              {feedback}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReconnect}>
                Reconnect
              </Button>
              <Button size="sm" onClick={handleTestPrint}>
                Test Print
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptPrinterCard;
