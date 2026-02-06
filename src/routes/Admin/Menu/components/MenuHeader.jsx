import { Button } from "@/components/ui/button";

const MenuHeader = ({ onAddProduct, onAddCategory }) => {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-background">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Menu</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage categories and products
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="lg" onClick={onAddCategory}>
          Add Category
        </Button>
        <Button size="lg" onClick={onAddProduct}>
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default MenuHeader;
