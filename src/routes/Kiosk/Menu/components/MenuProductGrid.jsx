import MenuProductCard from './MenuProductCard';

const MenuProductGrid = ({ selectedCategory, products = [], loading, onProductTap }) => {
  const filteredProducts =
    selectedCategory === "ALL_ITEMS"
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div className="flex-1 px-6 py-6 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))
          : filteredProducts.map((product) => (
              <MenuProductCard
                key={product.id}
                product={product}
                onTap={onProductTap}
              />
            ))}
      </div>
      
      {!loading && filteredProducts.length === 0 && (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No products in this category</p>
        </div>
      )}
    </div>
  );
};

export default MenuProductGrid;
