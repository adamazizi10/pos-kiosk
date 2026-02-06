import POSProductTile from "./POSProductTile";

const POSProductGrid = ({
  products = [],
  isLoading,
  searchValue,
  onSelectProduct,
  selectedProductId,
}) => {
  const hasProducts = products && products.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : hasProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <POSProductTile
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              selectedProductId={selectedProductId}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          No products found{searchValue ? ` for "${searchValue}"` : ""}.
        </div>
      )}
    </div>
  );
};

export default POSProductGrid;
