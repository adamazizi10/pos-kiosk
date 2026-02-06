import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const BarcodeScannerCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedValue, setScannedValue] = useState("");

  const handleStartTest = () => {
    setIsModalOpen(true);
    setScannedValue("");
    setTimeout(() => {
      setScannedValue("978020137962");
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setScannedValue("");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Barcode Scanner</CardTitle>
          <Badge className={cn("bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300")}>
            Disconnected
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Scanner Name</span>
                <p className="font-medium text-foreground">Honeywell Voyager</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium text-foreground">Not Detected</p>
              </div>
              <div>
                <span className="text-muted-foreground">Input Mode</span>
                <p className="font-medium text-foreground">Keyboard</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-border">
              <Button size="sm" onClick={handleStartTest}>
                Start Scan Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Barcode Scan Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Scan a barcode now
            </p>
            <Input
              type="text"
              value={scannedValue}
              readOnly
              placeholder="Waiting for scan..."
              className="text-center font-mono text-lg"
            />
            {scannedValue && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                Barcode detected successfully
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BarcodeScannerCard;
