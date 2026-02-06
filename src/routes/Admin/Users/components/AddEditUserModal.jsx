import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "@/services/users.queries";

const AddEditUserModal = ({ isOpen, onClose, user }) => {
  const isEditing = !!user;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [status, setStatus] = useState("Active");

  const createProfileMutation = useCreateProfileMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPassword("");
      setRole(user.role || "EMPLOYEE");
      setStatus(user.is_active === false ? "Disabled" : "Active");
    } else if (isOpen) {
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYEE");
      setStatus("Active");
    }
  }, [user, isOpen]);

  const isSaving = useMemo(
    () => createProfileMutation.isLoading || updateProfileMutation.isLoading,
    [createProfileMutation.isLoading, updateProfileMutation.isLoading]
  );

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    if (!email.trim()) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    if (!isEditing && !password.trim()) {
      toast({ title: "Password is required", variant: "destructive" });
      return;
    }

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      role,
      is_active: status === "Active",
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    try {
      if (isEditing) {
        await updateProfileMutation.mutateAsync({ id: user.id, patch: payload });
        toast({ title: "User updated" });
      } else {
        await createProfileMutation.mutateAsync(payload);
        toast({ title: "User created" });
      }
      onClose();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err?.message || "Unable to save user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              {isEditing ? "New Password (optional)" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                <SelectItem value="KIOSK_ROLE">KIOSK_ROLE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditUserModal;
