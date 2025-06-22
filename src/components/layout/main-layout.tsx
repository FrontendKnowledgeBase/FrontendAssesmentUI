"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { NavigationSidebar } from "./navigation-sidebar";
import { TableOfContentsSidebar } from "./table-of-contents";
import { Category, TableOfContentsItem } from "@/types";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  categories: Category[];
  tableOfContents?: TableOfContentsItem[];
  className?: string;
}

export function MainLayout({
  children,
  categories,
  tableOfContents = [],
  className,
}: MainLayoutProps) {
  const sidebarContent = (
    <NavigationSidebar categories={categories} className="h-full" />
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header categories={categories} sidebarContent={sidebarContent} />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Navigation (hidden on mobile) */}
        <aside className="hidden md:flex w-80 border-r bg-background/50 flex-col overflow-hidden">
          {sidebarContent}
        </aside>

        {/* Center content area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Article content */}
          <div className="flex-1 min-w-0 overflow-auto">
            <div
              className={cn("container max-w-4xl mx-auto px-4 py-8", className)}
            >
              {children}
            </div>
          </div>

          {/* Right sidebar - Table of Contents (hidden on mobile and tablet) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-80 border-l bg-background/50 overflow-auto flex-shrink-0">
              <div className="p-6 w-full max-w-full overflow-hidden">
                <TableOfContentsSidebar items={tableOfContents} />
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
