import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/utils/money";

const EditProductPickerModal = ({ open, onOpenChange, products = [], onSelect }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        (p.sku && p.sku.toLowerCase().includes(term))
    );
  }, [products, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Select Product to Edit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search products..."
            className="h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-[480px] overflow-y-auto border border-border rounded-lg divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="text-base text-muted-foreground p-4">No products found.</p>
            ) : (
              filtered.map((product) => (
                <button
                  key={product.id}
                  className="w-full text-left px-4 py-4 hover:bg-muted transition-colors"
                  onClick={() => {
                    onSelect?.(product);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate text-lg">{product.name}</p>
                      {product.sku ? (
                        <p className="text-sm text-muted-foreground truncate">SKU: {product.sku}</p>
                      ) : null}
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      {formatMoney(product.price_cents || 0)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductPickerModal;
