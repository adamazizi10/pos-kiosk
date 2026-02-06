import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/products.queries";

const AddEditProductModal = ({
  open,
  onOpenChange,
  categories,
  mode = "create",
  initialProduct,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("none");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialProduct) {
        setName(initialProduct.name || "");
        setSku(initialProduct.sku || "");
        setCategoryId(initialProduct.category_id || "none");
        setPrice((initialProduct.price_cents ?? 0) / 100);
        setImageUrl(initialProduct.image_url || "");
        setIsActive(initialProduct.is_active ?? true);
      } else {
        setName("");
        setSku("");
        setCategoryId("none");
        setPrice("");
        setImageUrl("");
        setIsActive(true);
      }
    }
  }, [open, mode, initialProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }
    if (!price && price !== 0) {
      toast({ title: "Price is required", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        sku: sku.trim() || null,
        category_id: categoryId === "none" ? null : categoryId,
        price,
        image_url: imageUrl.trim() || null,
        is_active: isActive,
      };

      let saved;
      if (mode === "edit" && initialProduct?.id) {
        saved = await updateProduct.mutateAsync({ id: initialProduct.id, payload });
        toast({ title: "Product updated" });
      } else {
        saved = await createProduct.mutateAsync(payload);
        toast({ title: "Product created" });
      }
      onSave?.(saved);
      onOpenChange(false);
    } catch (err) {
      toast({
        title: mode === "edit" ? "Update failed" : "Create failed",
        description: err?.message || "Unable to save product",
        variant: "destructive",
      });
    }
  };

  const categoryOptions = useMemo(
    () => categories?.filter((c) => c.id !== "all") || [],
    [categories]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Product" : "New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              className="h-12 text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Latte"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-sku">SKU (optional)</Label>
            <Input
              id="product-sku"
              className="h-12 text-base"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU-123"
            />
          </div>

          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-price">Price (CAD)</Label>
            <Input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              className="h-12 text-base"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4.50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Image URL (optional)</Label>
            <Input
              id="product-image"
              className="h-12 text-base"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Show this product in POS</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="h-12 px-6 text-base">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProduct.isLoading || updateProduct.isLoading}
              className="h-12 px-6 text-base"
            >
              {createProduct.isLoading || updateProduct.isLoading
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

export default AddEditProductModal;
