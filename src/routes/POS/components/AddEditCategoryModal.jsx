import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/services/categories.queries";

const AddEditCategoryModal = ({ open, onOpenChange, mode = "create", initialCategory }) => {
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialCategory) {
        setName(initialCategory.name || "");
        setSortOrder(String(initialCategory.sort_order ?? 0));
        setIsActive(initialCategory.is_active ?? true);
      } else {
        setName("");
        setSortOrder("0");
        setIsActive(true);
      }
    }
  }, [open, mode, initialCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    const payload = {
      name: name.trim(),
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };

    const action = mode === "edit"
      ? updateCategory.mutateAsync({ id: initialCategory.id, payload })
      : createCategory.mutateAsync(payload);

    action
      .then(() => {
        toast({ title: mode === "edit" ? "Category updated" : "Category created" });
        onOpenChange(false);
      })
      .catch((err) => {
        toast({
          title: mode === "edit" ? "Update failed" : "Create failed",
          description: err?.message || "Unable to save category",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              className="h-12 text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Beverages"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort-order">Sort Order</Label>
            <Input
              id="sort-order"
              type="number"
              className="h-12 text-base"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Show this category in POS</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="h-12 px-6 text-base">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCategory.isLoading || updateCategory.isLoading}
              className="h-12 px-6 text-base"
            >
              {createCategory.isLoading || updateCategory.isLoading
                ? "Saving..."
                : mode === "edit"
                ? "Save Changes"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryModal;
