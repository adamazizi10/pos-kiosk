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
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/products.queries";
import { toast } from "@/components/ui/use-toast";

const normalizeOptions = (schema) => {
  if (!schema || typeof schema !== "object") return [];
  // New shape: { key: { values: [], required: bool } }
  return Object.entries(schema).map(([key, val]) => {
    if (Array.isArray(val)) {
      return { key, valuesText: val.join(", "), required: false };
    }
    if (val && typeof val === "object") {
      const values = Array.isArray(val.values) ? val.values : [];
      return { key, valuesText: values.join(", "), required: !!val.required };
    }
    return { key, valuesText: "", required: false };
  });
};

const buildOptionsMap = (options, setError) => {
  const map = {};
  const seen = new Set();
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const key = (opt.key || "").trim();
    if (!key) {
      setError("Please fix options fields");
      toast({ title: "Options error", description: "Option name required", variant: "destructive" });
      return null;
    }
    const lowerKey = key.toLowerCase();
    if (seen.has(lowerKey)) {
      setError("Please fix options fields");
      toast({ title: "Options error", description: "Option names must be unique", variant: "destructive" });
      return null;
    }
    seen.add(lowerKey);
    const values = (opt.valuesText || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) {
      setError("Please fix options fields");
      toast({ title: "Options error", description: "Each option needs at least one value", variant: "destructive" });
      return null;
    }
    map[key] = { values, required: !!opt.required };
  }
  setError("");
  return map;
};

const AddEditProductModal = ({ isOpen, onClose, product, categories = [] }) => {
  const isEditing = !!product;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [availability, setAvailability] = useState("ALL_DEVICES_PRODUCT");
  const [imageUrl, setImageUrl] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  useEffect(() => {
    setName(product?.name || "");
    setPrice(product?.price_cents ? (product.price_cents / 100).toFixed(2) : "");
    setCategoryId(product?.category_id || "");
    setIsActive(product?.is_active ?? true);
    setAvailability(product?.availability || "ALL_DEVICES_PRODUCT");
    setImageUrl(product?.image_url || "");
    setOptions(normalizeOptions(product?.options_schema || product?.optionsschema));
    setError("");
  }, [product]);

  const handleAddOption = () => {
    setOptions([...options, { key: "", valuesText: "", required: false }]);
  };

  const handleRemoveOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOptionField = (idx, field, value) => {
    setOptions(options.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt)));
  };

  const handleSave = async () => {
    const optionsMap = buildOptionsMap(options, setError);
    if (optionsMap === null) return;

    const payload = {
      name,
      price,
      category_id: categoryId || null,
      is_active: isActive,
      availability,
      sku: product?.sku || null,
      image_url: imageUrl || null,
      options_schema: Object.keys(optionsMap).length ? optionsMap : {},
    };
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      console.error("Save product failed", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-medium text-foreground">
              Product Name
            </Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-foreground">
              Price
            </Label>
            <Input
              id="price"
              placeholder="$0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Category</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Status</Label>
            <Select value={isActive ? "Active" : "Inactive"} onValueChange={(val) => setIsActive(val === "Active")}>
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
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="POS_PRODUCT">POS Product</SelectItem>
                <SelectItem value="KIOSK_PRODUCT">Kiosk Product</SelectItem>
                <SelectItem value="ALL_DEVICES_PRODUCT">All Devices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
              Image Url
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Options simple map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Options</Label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-sm font-semibold text-primary hover:underline"
              >
                + Add Option
              </button>
            </div>
            {options.length === 0 && <p className="text-sm text-muted-foreground">No options.</p>}
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center border border-border rounded-lg p-3"
                >
                  <Input
                    value={opt.key}
                    onChange={(e) => updateOptionField(idx, "key", e.target.value)}
                    placeholder="size, sugar, cream"
                  />
                  <Input
                    value={opt.valuesText}
                    onChange={(e) => updateOptionField(idx, "valuesText", e.target.value)}
                    placeholder="S, M, L"
                  />
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={!!opt.required}
                      onChange={(e) => updateOptionField(idx, "required", e.target.checked)}
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    className="text-sm text-destructive hover:underline justify-self-end"
                    onClick={() => handleRemoveOption(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProductModal;
