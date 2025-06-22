"use client";

import { useState, memo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Article } from "@/types";

interface NavigationSidebarProps {
  categories: Category[];
  className?: string;
}

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ArticleItemProps {
  article: Article;
  isActive: boolean;
  categoryId: string;
}

const ArticleItem = memo(function ArticleItem({
  article,
  isActive,
  categoryId,
}: ArticleItemProps) {
  const href = `/${categoryId}/${article.id}`;

  return (
    <Link href={href} className="block min-w-0" prefetch={true}>
      <div
        className={cn(
          "flex items-start gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground min-w-0",
          isActive && "bg-accent text-accent-foreground font-medium"
        )}
      >
        <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span className="break-words overflow-wrap-anywhere leading-tight">
          {article.title}
        </span>
      </div>
    </Link>
  );
});

const CategoryItem = memo(function CategoryItem({
  category,
  isExpanded,
  onToggle,
}: CategoryItemProps) {
  const pathname = usePathname();
  const categoryPath = `/${category.id}`;
  const isCategoryActive = pathname.startsWith(categoryPath);

  return (
    <div className="space-y-1">
      {/* Category header */}
      <div className="flex items-start gap-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-accent flex-shrink-0 mt-0.5"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <Link href={categoryPath} className="flex-1 min-w-0" prefetch={true}>
          <div
            className={cn(
              "flex items-start gap-2 px-2 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground min-w-0",
              isCategoryActive && "bg-accent text-accent-foreground font-medium"
            )}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 mt-0.5" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 mt-0.5" />
            )}
            <span className="break-words overflow-wrap-anywhere leading-tight">
              {category.title}
            </span>
          </div>
        </Link>
      </div>

      {/* Category articles */}
      {isExpanded && (
        <div className="ml-6 space-y-1 min-w-0">
          {/* Show only regular articles (NOT the main page with 0_ prefix) */}
          {category.articles.map((article) => (
            <ArticleItem
              key={article.id}
              article={article}
              isActive={pathname === `/${category.id}/${article.id}`}
              categoryId={category.id}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export function NavigationSidebar({
  categories,
  className,
}: NavigationSidebarProps) {
  const pathname = usePathname();

  // Find current category based on pathname
  const getCurrentCategory = () => {
    // Remove leading slash and get first segment
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return null;

    // Find category that matches the first path segment
    const currentCategoryId = pathSegments[0];
    return categories.find((cat) => cat.id === currentCategoryId)?.id || null;
  };

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => {
      const currentCategory = getCurrentCategory();
      return currentCategory ? new Set([currentCategory]) : new Set();
    }
  );

  // Auto-expand current category when pathname changes
  useEffect(() => {
    const currentCategory = getCurrentCategory();
    if (currentCategory) {
      setExpandedCategories((prev) => {
        const newExpanded = new Set(prev);
        newExpanded.add(currentCategory);
        return newExpanded;
      });
    }
  }, [pathname, categories, getCurrentCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        // If clicking on expanded category, just collapse it
        newExpanded.delete(categoryId);
      } else {
        // If expanding a new category, optionally collapse others
        // For now, we'll keep all expanded categories and just add the new one
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  };

  return (
    <ScrollArea
      className={cn("h-full w-full min-w-0 navigation-sidebar", className)}
    >
      <div className="px-4 py-4 space-y-2 min-w-0">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
