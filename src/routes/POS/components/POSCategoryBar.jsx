const POSCategoryBar = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  isLoading,
}) => {
  return (
    <div className="px-4 py-4 border-b border-border">
      <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
        Categories
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-24 h-14 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex-shrink-0 px-6 py-4 rounded-xl text-base font-semibold transition-colors min-h-[56px] ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default POSCategoryBar;
