import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/money";
import { useDeleteProductMutation } from "@/services/products.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";

const statusStyles = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 15;

const ProductsTable = ({ products = [], loading, onEditProduct }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [page, setPage] = useState(1);
  const deleteMutation = useDeleteProductMutation();

  const handleDelete = (product) => {
    deleteMutation.mutate(product.id);
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [page, products]);

  useEffect(() => {
    setPage(1);
  }, [products]);

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Products
          </h2>
        </div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Options
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-sm text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-sm text-muted-foreground">
                    No products
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {formatMoney(product.price_cents || 0)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs font-medium", product.is_active ? statusStyles.Active : statusStyles.Inactive)}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {product.categoryName || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {product.availability === "ALL_DEVICES_PRODUCT"
                        ? "All Devices"
                        : product.availability === "KIOSK_PRODUCT"
                          ? "Kiosk Product"
                          : product.availability === "POS_PRODUCT"
                            ? "POS Product"
                            : product.availability || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {product.image_url ? (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setSelectedImageUrl(product.image_url);
                            setDialogOpen(true);
                          }}
                        >
                          View Image
                        </button>
                      ) : (
                        "No Image Url"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {(() => {
                        const opts = product?.options_schema || product?.optionsschema;
                        return opts && typeof opts === "object" && Object.keys(opts).length > 0;
                      })() ? (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setSelectedOptions(product.options_schema || product.optionsschema);
                            setOptionsDialogOpen(true);
                          }}
                        >
                          View Options
                        </button>
                      ) : (
                        <span className="text-muted-foreground">No Options</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => onEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Image</DialogTitle>
          </DialogHeader>
          {selectedImageUrl ? (
            <div className="space-y-3">
              <p className="text-sm break-all text-foreground">{selectedImageUrl}</p>
              <div className="max-h-[400px] overflow-auto">
                <img
                  src={selectedImageUrl}
                  alt="Product"
                  className="w-full max-h-[360px] object-contain rounded"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No image available</p>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={optionsDialogOpen} onOpenChange={setOptionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Options Schema</DialogTitle>
          </DialogHeader>
          {selectedOptions ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {selectedOptions && Object.keys(selectedOptions).length > 0 ? (
                  Object.entries(selectedOptions).map(([key, val]) => {
                    const isObj = val && typeof val === "object" && !Array.isArray(val);
                    const values = isObj ? val.values : val;
                    const required = isObj ? !!val.required : false;
                    return (
                      <div key={key} className="border border-border rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground capitalize">{key}</p>
                          {required && <span className="text-xs font-semibold text-red-600">(Required)</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(values) ? values.join(", ") : ""}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No options available</p>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setShowJson((v) => !v)}
              >
                {showJson ? "Hide JSON" : "Show JSON"}
              </button>
              {showJson && (
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[400px]">
                  {JSON.stringify(selectedOptions, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No options available</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTable;
