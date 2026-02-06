const MenuProductCard = ({ product, onTap }) => {
  return (
    <div 
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onTap?.(product)}
    >
      <div className="aspect-square bg-muted relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground text-lg truncate">{product.name}</h3>
          <span className="text-lg font-bold text-foreground">
            ${(product.price_cents ? product.price_cents / 100 : 0).toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
};

export default MenuProductCard;
