import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Plus, Minus, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const normalizeOptionsSchema = (schema) => {
  if (!schema || typeof schema !== "object") return {};
  const result = {};
  Object.entries(schema).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      result[key] = { values: val, required: false };
    } else if (val && typeof val === "object") {
      const values = Array.isArray(val.values) ? val.values : [];
      result[key] = { values, required: !!val.required };
    }
  });
  return result;
};

const POSProductModal = ({ product, open, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const optionsSchema = useMemo(
    () => normalizeOptionsSchema(product?.options_schema || product?.optionsschema),
    [product]
  );

  useEffect(() => {
    setQty(1);
    setSelectedOptions({});
  }, [product, open]);

  if (!product) return null;

  const hasOptions = optionsSchema && Object.keys(optionsSchema).length > 0;

  const handleSelect = (optKey, value) => {
    setSelectedOptions((prev) => ({ ...prev, [optKey]: value }));
  };

  const missingRequired = hasOptions
    ? Object.entries(optionsSchema).some(([key, val]) => val.required && !selectedOptions[key])
    : false;
  const allRequiredSelected = hasOptions
    ? !Object.entries(optionsSchema).some(([key, val]) => val.required && !selectedOptions[key])
    : true;

  const handleAdd = () => {
    if (missingRequired) return;
    onAdd?.({ product, qty, selectedOptions });
    toast({
      title: (
        <div className="flex items-center gap-2">
          <span>
            {qty === 1
              ? `${product.name} added to cart`
              : `${qty} ${product.name}s added to cart`}
          </span>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
      ),
      bottomLeft: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (val ? null : onClose?.())}>
      <DialogContent
        className={`${hasOptions ? "w-[80vw]" : "w-[50vw]"
          } max-w-5xl bg-background p-0 max-h-[90vh] overflow-hidden`}
      >
        <div
          className={`relative grid h-full ${hasOptions ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-background transition-colors flex items-center justify-center"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col max-h-[90vh] px-6 pt-6 pb-6">
            <div className="shrink-0 space-y-2">
              <DialogTitle className="text-3xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
              <p className="text-3xl font-bold text-foreground">
                ${((product.price_cents || 0) / 100).toFixed(2)}
              </p>
              {product.description && (
                <p className="text-lg text-muted-foreground">{product.description}</p>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-muted rounded-xl flex items-center justify-center w-full py-4 mt-3">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-[40vh] w-auto object-contain"
                  />
                ) : (
                  <div className="w-full h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 space-y-4 pt-4">
              <div className="space-y-3 flex flex-col items-center">
                <p className="text-lg font-semibold text-foreground">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center text-2xl"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={28} />
                  </button>
                  <span className="text-3xl font-bold">{qty}</span>
                  <button
                    className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center text-2xl"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus size={28} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!allRequiredSelected}
                className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 min-h-[72px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allRequiredSelected
                  ? "Add to Cart"
                  : "Select Required Options"}
              </button>
            </div>
          </div>

          {hasOptions && (
            <div className="max-h-[90vh] overflow-y-auto px-6 pt-6 pb-6 space-y-6 border-t lg:border-t-0 lg:border-l">
              <div className="space-y-4">
                {Object.entries(optionsSchema).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground capitalize">{key}</p>
                      {val.required && (
                        <span className="text-sm text-red-600 font-semibold">Required</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {val.values.map((v) => {
                        const selected = selectedOptions[key] === v;
                        return (
                          <button
                            key={v}
                            onClick={() => handleSelect(key, v)}
                            className={`px-4 py-3 rounded-xl border text-lg font-semibold min-w-[120px] ${selected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-foreground hover:border-primary"
                              }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POSProductModal;
