import { useEffect, useMemo, useState } from 'react';
import MenuHeader from './components/MenuHeader';
import MenuCategories from './components/MenuCategories';
import MenuProductGrid from './components/MenuProductGrid';
import MenuProductModal from './components/MenuProductModal';
import MenuBottomBar from './components/MenuBottomBar';
import { useCategoriesQuery } from '@/services/categories.queries';
import { useProductsQuery } from '@/services/products.queries';
import { toast } from '@/components/ui/use-toast';
import useKioskCart from '@/context/useKioskCart';

const ALL_ITEMS_CATEGORY = { id: "ALL_ITEMS", name: "All Items" };

const MenuRouteInner = () => {
  const { addItem } = useKioskCart();
  const categoriesQuery = useCategoriesQuery();
  const productsQuery = useProductsQuery();

  const categories = useMemo(() => {
    const base = (categoriesQuery.data || []).filter(
      (c) =>
        c.availability === 'KIOSK_CATEGORY' || c.availability === 'ALL_DEVICES_CATEGORY'
    );
    return [ALL_ITEMS_CATEGORY, ...base];
  }, [categoriesQuery.data]);

  const products = useMemo(() => {
    const base = (productsQuery.data || []).filter(
      (p) =>
        p.availability === 'KIOSK_PRODUCT' || p.availability === 'ALL_DEVICES_PRODUCT'
    );
    return base;
  }, [productsQuery.data]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(ALL_ITEMS_CATEGORY.id);
    }
  }, [categories, selectedCategory]);

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

  const handleProductTap = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MenuHeader />
      <MenuCategories 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
        categories={categories}
        loading={categoriesQuery.isLoading}
      />
      <MenuProductGrid 
        selectedCategory={selectedCategory}
        products={products}
        loading={productsQuery.isLoading}
        onProductTap={handleProductTap}
      />
      <MenuBottomBar />
      <MenuProductModal 
        product={selectedProduct}
        open={isModalOpen}
        onClose={handleModalClose}
        onAdd={(payload) => addItem(payload)}
      />
    </div>
  );
};

const MenuRoute = () => <MenuRouteInner />;

export default MenuRoute;
