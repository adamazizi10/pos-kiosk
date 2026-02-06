import { useMemo, useState } from "react";
import MenuHeader from "./components/MenuHeader";
import CategoryList from "./components/CategoryList";
import ProductsTable from "./components/ProductsTable";
import AddEditCategoryModal from "./components/AddEditCategoryModal";
import AddEditProductModal from "./components/AddEditProductModal";
import { useCategoriesQuery } from "@/services/categories.queries";
import { useProductsQuery } from "@/services/products.queries";

const ALL_CATEGORY_ID = "all";

const MenuRoute = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY_ID);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data: categories = [], isLoading: loadingCategories } = useCategoriesQuery();
  const { data: products = [], isLoading: loadingProducts } = useProductsQuery({
    categoryId: selectedCategoryId === ALL_CATEGORY_ID ? null : selectedCategoryId,
  });

  const categoriesWithAll = useMemo(
    () => [
      {
        id: ALL_CATEGORY_ID,
        name: "All Categories",
        availability: null,
        isSystem: true,
      },
      ...categories,
    ],
    [categories]
  );

  const productsWithCategory = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return products.map((p) => ({
      ...p,
      categoryName: map.get(p.category_id) || "Unassigned",
    }));
  }, [products, categories]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <MenuHeader onAddProduct={handleAddProduct} onAddCategory={handleAddCategory} />

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Categories */}
          <div className="lg:col-span-1">
            <CategoryList
              categories={categoriesWithAll}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onEditCategory={handleEditCategory}
              loading={loadingCategories}
            />
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-3">
            <ProductsTable
              products={productsWithCategory}
              loading={loadingProducts}
              onEditProduct={handleEditProduct}
            />
          </div>
        </div>
      </div>

      <AddEditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={selectedCategory}
      />

      <AddEditProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  );
};

export default MenuRoute;
