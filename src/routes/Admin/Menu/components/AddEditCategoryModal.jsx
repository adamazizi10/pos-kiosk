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
import { useEffect, useState } from "react";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/categories.queries";

const AddEditCategoryModal = ({ isOpen, onClose, category }) => {
  const isEditing = !!category;
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [availability, setAvailability] = useState("ALL_DEVICES_CATEGORY");
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  useEffect(() => {
    setName(category?.name || "");
    setIsActive(category?.is_active ?? true);
    setAvailability(category?.availability || "ALL_DEVICES_CATEGORY");
  }, [category]);

  const handleSave = async () => {
    const payload = {
      name,
      is_active: isActive,
      availability,
    };
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: category.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      console.error("Save category failed", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm font-medium text-foreground">
              Category Name
            </Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Status</Label>
            <Select
              value={isActive ? "Active" : "Inactive"}
              onValueChange={(val) => setIsActive(val === "Active")}
            >
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Availability</Label>
            <Select
              value={availability}
              onValueChange={setAvailability}
            >
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="POS_CATEGORY">POS Category</SelectItem>
                <SelectItem value="KIOSK_CATEGORY">Kiosk Category</SelectItem>
                <SelectItem value="ALL_DEVICES_CATEGORY">All devices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryModal;
