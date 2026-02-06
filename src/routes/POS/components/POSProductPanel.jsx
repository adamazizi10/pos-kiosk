import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import POSTopBar from "./POSTopBar";
import POSCategoryBar from "./POSCategoryBar";
import POSProductGrid from "./POSProductGrid";
import { useCategoriesQuery } from "@/services/categories.queries";
import { useProductsQuery } from "@/services/products.queries";
import { toast } from "@/components/ui/use-toast";
import POSProductModal from "./POSProductModal";
import usePosCart from "@/context/usePosCart";
import usePOSCartPanelConfig from "@/routes/POS/hooks/usePOSCartPanelConfig";

const POSProductPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = usePosCart();

  const categoriesQuery = useCategoriesQuery();

  const categories = useMemo(() => {
    const base = (categoriesQuery.data || []).filter(
      (c) => c.availability === "POS_CATEGORY" || c.availability === "ALL_DEVICES_CATEGORY"
    );
    return [{ id: "all", name: "All Items" }, ...base];
  }, [categoriesQuery.data]);

  const productsQuery = useProductsQuery({
    categoryId: selectedCategory === "all" ? null : selectedCategory,
    search: searchValue || null,
  });

  const selectedCategoryObj =
    categories.find((cat) => cat.id === selectedCategory) || null;

  useEffect(() => {
    if (categoriesQuery.error) {
      toast({
        title: "Failed to load categories",
        description: categoriesQuery.error.message,
        variant: "destructive",
      });
    }
  }, [categoriesQuery.error]);

  useEffect(() => {
    if (productsQuery.error) {
      toast({
        title: "Failed to load products",
        description: productsQuery.error.message,
        variant: "destructive",
      });
    }
  }, [productsQuery.error]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = ({ product, qty, selectedOptions }) => {
    addItem({ product, qty, selectedOptions });
    handleCloseModal();
  };

  const cartPanelConfig = useMemo(
    () => ({
      topActions: {
        showSideButton: true,
        showOpenDrawerButton: true,
      },
      itemControls: {
        showIncrement: true,
        showDecrement: true,
        showClearItem: true,
      },
      checkoutAction: {
        visible: true,
        label: "Checkout",
        to: "/pos/checkout",
        requireItems: true,
        icon: ShoppingCart,
      },
    }),
    []
  );

  usePOSCartPanelConfig(cartPanelConfig);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <POSTopBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <POSCategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={categoriesQuery.isLoading}
      />
      <POSProductGrid
        products={(productsQuery.data || []).filter(
          (p) => p.availability === "POS_PRODUCT" || p.availability === "ALL_DEVICES_PRODUCT"
        )}
        isLoading={productsQuery.isLoading}
        selectedCategory={selectedCategory}
        searchValue={searchValue}
        onSelectProduct={handleProductSelect}
        selectedProductId={selectedProduct?.id}
      />
      <POSProductModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default POSProductPanel;
