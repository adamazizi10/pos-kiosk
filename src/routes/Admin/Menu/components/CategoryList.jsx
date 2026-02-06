import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/services/categories.queries";

const CategoryList = ({ categories, selectedCategoryId, onSelectCategory, onEditCategory, loading }) => {
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = (category) => {
    deleteMutation.mutate(category.id);
  };

  const list = categories || [];
  const availabilityLabel = (value) => {
    switch (value) {
      case "ALL_DEVICES_CATEGORY":
        return "Availability: All devices";
      case "KIOSK_CATEGORY":
        return "Availability: Kiosk";
      case "POS_CATEGORY":
        return "Availability: POS";
      default:
        return value || "Availability: —";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-fit">
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Categories
        </h2>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
        ) : list.length === 0 ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">No categories</div>
        ) : (
          list.map((category) => (
            <div
              key={category.id}
              className={cn(
                "px-4 py-3 cursor-pointer transition-colors",
                selectedCategoryId === category.id ? "bg-primary/10" : "hover:bg-muted/50"
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      selectedCategoryId === category.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {availabilityLabel(category.availability)}
                  </p>
                </div>
                {!category.isSystem && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(category);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryList;
