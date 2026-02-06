import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBar = ({
  currentPage,
  totalPages,
  onPageChange,
  prevText,
  nextText,
}) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-background">
      {/* Prev Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="h-12 px-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        {prevText}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 text-muted-foreground text-lg">
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="lg"
              onClick={() => onPageChange(page)}
              className="h-12 w-12 p-0 text-base"
            >
              {page}
            </Button>
          )
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="h-12 px-6"
      >
        {nextText}
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
};

export default PaginationBar;
