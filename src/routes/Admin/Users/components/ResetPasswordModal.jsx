import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useResetProfilePasswordMutation } from "@/services/users.queries";

const ResetPasswordModal = ({ isOpen, onClose, user }) => {
  const resetPasswordMutation = useResetProfilePasswordMutation();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  const handleReset = async () => {
    if (!user?.id) {
      onClose();
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Enter a new password to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ id: user.id, newPassword: password.trim() });
      toast({ title: "Password reset", description: "The user password has been updated." });
      onClose();
    } catch (err) {
      toast({
        title: "Reset failed",
        description: err?.message || "Unable to reset password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            Reset password for {user?.full_name || "this user"}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <Label htmlFor="reset-password" className="text-sm font-medium text-foreground">
            New Password
          </Label>
          <Input
            id="reset-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReset} disabled={resetPasswordMutation.isLoading}>
            {resetPasswordMutation.isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
