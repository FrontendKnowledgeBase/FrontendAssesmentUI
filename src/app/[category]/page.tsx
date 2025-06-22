import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { githubService } from "@/lib/github";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

// Function to get correct plural form for Russian "статья"
function getArticleCountText(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  // Special cases for 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} статей`;
  }

  // Regular cases
  if (lastDigit === 1) {
    return `${count} статья`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} статьи`;
  } else {
    return `${count} статей`;
  }
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function CategoryContent({ params }: CategoryPageProps) {
  try {
    // Await params in Next.js 15
    const { category } = await params;

    // Get all categories for navigation
    const categories = await githubService.getAllCategories();

    // Find the current category
    const currentCategory = categories.find((cat) => cat.id === category);

    if (!currentCategory) {
      notFound();
    }

    return (
      <MainLayout categories={categories} tableOfContents={[]}>
        <div className="space-y-8">
          {/* Category header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {currentCategory.title}
            </h1>

            {currentCategory.articles.length > 0 && (
              <p className="text-muted-foreground">
                {getArticleCountText(currentCategory.articles.length)} в этом
                разделе
              </p>
            )}
          </div>

          {/* Articles list */}
          {currentCategory.articles.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Содержание раздела:</h2>
              <div className="grid gap-4">
                {/* Show only regular articles (NOT the main page with 0_ prefix) */}
                {currentCategory.articles.map((article) => (
                  <Link key={article.id} href={`/${category}/${article.id}`}>
                    <div className="group p-6 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!currentCategory.mainPage &&
            currentCategory.articles.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Контент недоступен</h2>
                <p className="text-muted-foreground">
                  Похоже, что в этом разделе еще нет статей.
                </p>
              </div>
            )}
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
}

function LoadingSkeleton() {
  return (
    <MainLayout categories={[]}>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 bg-muted rounded animate-pulse w-64" />
            <div className="h-9 bg-muted rounded animate-pulse w-32" />
          </div>
          <div className="h-4 bg-muted rounded animate-pulse w-48" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse w-48" />
                </div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
