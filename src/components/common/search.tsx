"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, SearchResult } from "@/types";
import { cn } from "@/lib/utils";

interface SearchComponentProps {
  categories: Category[];
  onClose?: () => void;
  className?: string;
}

export function SearchComponent({
  categories,
  onClose,
  className,
}: SearchComponentProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Create searchable items from categories and articles
  const searchableItems = useMemo(() => {
    const items: SearchResult[] = [];

    categories.forEach((category) => {
      // Add category as searchable item
      items.push({
        id: category.id,
        title: category.title,
        path: `/${category.id}`,
        type: "category",
      });

      // Add main page if exists
      if (category.mainPage) {
        items.push({
          id: `${category.id}-main`,
          title: category.mainPage.title,
          path: `/${category.id}`,
          type: "article",
          category: category.title,
        });
      }

      // Add all articles
      category.articles.forEach((article) => {
        items.push({
          id: `${category.id}-${article.id}`,
          title: article.title,
          path: `/${category.id}/${article.id}`,
          type: "article",
          category: category.title,
        });
      });
    });

    return items;
  }, [categories]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return searchableItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          (item.category &&
            item.category.toLowerCase().includes(lowercaseQuery))
      )
      .slice(0, 10); // Limit to 10 results
  }, [query, searchableItems]);

  // Handle search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredItems.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleItemSelect(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setQuery("");
        break;
    }
  };

  // Handle item selection
  const handleItemSelect = (item: SearchResult) => {
    router.push(item.path);
    setIsOpen(false);
    setQuery("");
    onClose?.();
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-search-container]")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} data-search-container>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-popover border rounded-md shadow-lg">
          <ScrollArea className="max-h-80">
            <div className="p-2">
              {filteredItems.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 text-left",
                    index === selectedIndex && "bg-accent"
                  )}
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="flex items-center gap-3 w-full">
                    {item.type === "category" ? (
                      <Folder className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.category && (
                        <div className="text-xs text-muted-foreground truncate">
                          in {item.category}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-popover border rounded-md shadow-lg p-4 text-center text-muted-foreground">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
