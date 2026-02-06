const MenuCategories = ({ selectedCategory, onSelectCategory, categories = [], loading }) => {
  return (
    <div className="sticky top-[73px] z-40 bg-background border-b border-border">
      <div className="flex gap-4 px-6 py-5 overflow-x-auto scrollbar-hide">
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="w-24 h-16 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex-shrink-0 px-10 py-5 rounded-full font-semibold text-xl transition-all min-h-[72px] ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuCategories;
