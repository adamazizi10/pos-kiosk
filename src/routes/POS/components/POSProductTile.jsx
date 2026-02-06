import usePosCart from "@/context/usePosCart";
import { formatMoney } from "@/utils/money";

const POSProductTile = ({ product, onSelectProduct, selectedProductId }) => {
  const { addItem } = usePosCart();
  const priceLabel = formatMoney(product.price_cents || 0);
  const imageSrc =
    product.image_url ||
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=60";
  const handleClick = () => {
    onSelectProduct?.(product);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98] text-left"
    >
      {/* Product Image */}
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-foreground text-sm leading-tight">
          {product.name}
        </h3>
        <p className="text-primary font-semibold mt-1">
          {priceLabel}
        </p>
      </div>
    </button>
  );
};

export default POSProductTile;
