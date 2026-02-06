import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EditCategoryPickerModal = ({ open, onOpenChange, categories = [], onSelect }) => {
  const [search, setSearch] = useState("");

  const list = useMemo(
    () => categories.filter((c) => c.id !== "all"),
    [categories]
  );

  const filtered = useMemo(() => {
    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter((c) => c.name?.toLowerCase().includes(term));
  }, [list, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Select Category to Edit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search categories..."
            className="h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-[480px] overflow-y-auto border border-border rounded-lg divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="text-base text-muted-foreground p-4">No categories found.</p>
            ) : (
              filtered.map((cat) => (
                <button
                  key={cat.id}
                  className="w-full text-left px-4 py-4 hover:bg-muted transition-colors"
                  onClick={() => {
                    onSelect?.(cat);
                    onOpenChange(false);
                  }}
                >
                  <p className="font-semibold text-foreground text-lg">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">Sort: {cat.sort_order ?? 0}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryPickerModal;
