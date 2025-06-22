"use client";

import Link from "next/link";
import { Menu, Moon, Sun, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchComponent } from "@/components/common/search";
import { Category } from "@/types";

interface HeaderProps {
  sidebarContent?: React.ReactNode;
  categories?: Category[];
}

export function Header({ sidebarContent, categories = [] }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        {/* Left section - Logo and mobile menu */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetTitle className="sr-only">Навигационное меню</SheetTitle>
              {sidebarContent}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              FA
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">
                {process.env.NEXT_PUBLIC_APP_NAME || "KnowledgeDocs"}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
                  "Simple. Structured. Smart."}
              </span>
            </div>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-lg mx-4 min-w-0">
          <SearchComponent categories={categories} />
        </div>

        {/* Right section - GitHub and Theme toggle */}
        <div className="flex items-center gap-0 flex-shrink-0">
          {/* GitHub link */}
          <Button variant="ghost" size="icon" asChild>
            <a
              href={`https://github.com/${
                process.env.NEXT_PUBLIC_GITHUB_OWNER || "FrontendKnowledgeBase"
              }/${
                process.env.NEXT_PUBLIC_GITHUB_REPO || "FrontendCompetencies"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              title="Открыть на GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">Open on GitHub</span>
            </a>
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
