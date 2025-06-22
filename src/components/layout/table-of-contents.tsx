"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableOfContentsItem } from "@/types";

interface TableOfContentsSidebarProps {
  items: TableOfContentsItem[];
  className?: string;
}

interface TocItemProps {
  item: TableOfContentsItem;
  onClick: (anchor: string) => void;
}

function TocItem({ item, onClick }: TocItemProps) {
  // Truncate text manually with ellipsis
  // Different max lengths based on indentation level
  const getMaxLength = (level: number) => {
    switch (level) {
      case 1:
        return 32; // H1 - no indentation
      case 2:
        return 32; // H2 - no indentation
      case 3:
        return 28; // H3 - pl-4 (16px padding)
      case 4:
        return 24; // H4 - pl-8 (32px padding)
      case 5:
        return 20; // H5 - pl-12 (48px padding)
      case 6:
        return 16; // H6 - pl-16 (64px padding)
      default:
        return 28;
    }
  };

  const maxLength = getMaxLength(item.level);
  const truncatedTitle =
    item.title.length > maxLength
      ? item.title.substring(0, maxLength) + "..."
      : item.title;
  const isTextTruncated = item.title.length > maxLength;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(item.anchor);
  };

  const linkElement = (
    <a
      href={`#${item.anchor}`}
      onClick={handleClick}
      className={cn(
        "block py-1 text-sm transition-colors hover:text-foreground text-muted-foreground",
        item.level === 1 && "font-semibold",
        item.level === 2 && "pl-0",
        item.level === 3 && "pl-4",
        item.level === 4 && "pl-8",
        item.level === 5 && "pl-12",
        item.level === 6 && "pl-16"
      )}
      data-full-title={isTextTruncated ? item.title : undefined}
    >
      {truncatedTitle}
    </a>
  );

  // Only show tooltip if text is truncated
  if (isTextTruncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkElement;
}

export function TableOfContentsSidebar({
  items,
  className,
}: TableOfContentsSidebarProps) {
  const scrollToHeading = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-hidden",
          className
        )}
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Содержание
          </h4>
          <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id}>
                  <TocItem item={item} onClick={scrollToHeading} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}
