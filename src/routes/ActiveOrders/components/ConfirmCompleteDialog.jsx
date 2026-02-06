import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from "lucide-react";

const ConfirmCompleteDialog = ({
  open,
  onOpenChange,
  order,
  action,
  onConfirm,
  onCancel,
}) => {
  if (!order) return null;

  const isComplete = action === "complete";
  const isBump = action === "bump";

  const getTitle = () => {
    if (isComplete) return "Complete Order?";
    if (isBump) return "Remove Order?";
    return "Confirm Action";
  };

  const getDescription = () => {
    if (isComplete) {
      return `Mark order #${order.orderNumber} as completed? This will remove it from the active orders board.`;
    }
    if (isBump) {
      return `Remove order #${order.orderNumber} from the board? This action is for UI demonstration only.`;
    }
    return "Are you sure you want to proceed?";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isComplete && (
              <div className="p-2 rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            )}
            {isBump && (
              <div className="p-2 rounded-full bg-destructive/10">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
            )}
            <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Order #{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{order.customerLabel} • {order.type}</p>
            </div>
            <p className="text-sm text-muted-foreground">{order.items.length} items</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={isBump ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {isComplete ? "Complete" : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCompleteDialog;
