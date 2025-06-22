import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { CodeHighlighter } from "@/components/common/code-highlighter";
import { githubService } from "@/lib/github";
import { processMarkdownContent } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    article: string;
  }>;
}

async function ArticleContent({ params }: ArticlePageProps) {
  // Await params in Next.js 15
  const { category, article } = await params;

  console.log(
    `[ArticlePage] Looking for article: category="${category}", article="${article}"`
  );

  // Get all categories for navigation
  const categories = await githubService.getAllCategories();

  // Find the current category
  const currentCategory = categories.find((cat) => cat.id === category);

  if (!currentCategory) {
    console.log(`[ArticlePage] Category "${category}" not found`);
    console.log(
      `[ArticlePage] Available categories:`,
      categories.map((c) => c.id)
    );
    notFound();
  }

  console.log(`[ArticlePage] Found category: ${currentCategory.title}`);
  console.log(
    `[ArticlePage] Regular articles:`,
    currentCategory.articles.map((a) => a.id)
  );
  console.log(`[ArticlePage] Main page:`, currentCategory.mainPage?.id);

  // Find the current article (check both regular articles and main page)
  let currentArticle = currentCategory.articles.find(
    (art) => art.id === article
  );

  // If not found in articles, check if it's the main page
  if (
    !currentArticle &&
    currentCategory.mainPage &&
    currentCategory.mainPage.id === article
  ) {
    currentArticle = currentCategory.mainPage;
    console.log(
      `[ArticlePage] Found article in main page: ${currentArticle.title}`
    );
  }

  if (!currentArticle) {
    console.log(
      `[ArticlePage] Article "${article}" not found in category "${category}"`
    );
    console.log(
      `[ArticlePage] Available articles:`,
      currentCategory.articles.map((a) => a.id)
    );
    console.log(`[ArticlePage] Main page:`, currentCategory.mainPage?.id);
    notFound();
  }

  console.log(`[ArticlePage] Found article: ${currentArticle.title}`);
  console.log(
    `[ArticlePage] Article content length: ${currentArticle.content.length}`
  );
  console.log(`[ArticlePage] Article path: ${currentArticle.path}`);

  // Process article content
  let processedContent;
  try {
    processedContent = await processMarkdownContent(currentArticle.content);
    console.log(`[ArticlePage] Content processed successfully`);
  } catch (error) {
    console.error("Error processing markdown content:", error);
    throw error;
  }

  // Find previous and next articles
  // Use only regular articles for navigation (NOT main page with 0_ prefix)
  const sortedArticles = currentCategory.articles.sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = sortedArticles.findIndex((art) => art.id === article);
  const previousArticle =
    currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < sortedArticles.length - 1
      ? sortedArticles[currentIndex + 1]
      : null;

  return (
    <MainLayout categories={categories} tableOfContents={processedContent.toc}>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-start space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href={`/${category}`}
            className="hover:text-foreground transition-colors"
          >
            {currentCategory.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">{currentArticle.title}</span>
        </nav>

        {/* Article header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">
              {currentArticle.title}
            </h1>
            <Button variant="outline" size="sm" asChild>
              <a
                href={currentArticle.editUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Раздел: {currentCategory.title}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Article content */}
        <CodeHighlighter>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: processedContent.html }}
            />
          </div>
        </CodeHighlighter>

        <Separator />

        {/* Navigation */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          {/* Previous Article */}
          <div className="flex-1 md:max-w-[350px]">
            {previousArticle && (
              <Link
                href={`/${category}/${previousArticle.id}`}
                className="block w-full"
              >
                <Button
                  variant="ghost"
                  className="group w-full justify-start p-4 h-auto text-left whitespace-normal border-0 bg-transparent hover:bg-muted/50"
                >
                  <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform flex-shrink-0 self-start mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Предыдущая статья
                    </div>
                    <div className="font-medium text-sm leading-relaxed break-words hyphens-auto">
                      {previousArticle.title}
                    </div>
                  </div>
                </Button>
              </Link>
            )}
          </div>

          {/* Next Article */}
          <div className="flex-1 md:max-w-[350px] md:flex md:justify-end">
            {nextArticle && (
              <Link
                href={`/${category}/${nextArticle.id}`}
                className="block w-full md:max-w-[350px]"
              >
                <Button
                  variant="ghost"
                  className="group w-full justify-end p-4 h-auto text-right whitespace-normal border-0 bg-transparent hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Следующая статья
                    </div>
                    <div className="font-medium text-sm leading-relaxed break-words hyphens-auto">
                      {nextArticle.title}
                    </div>
                  </div>
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform flex-shrink-0 self-start mt-0.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function LoadingSkeleton() {
  return (
    <MainLayout categories={[]}>
      <div className="space-y-8">
        <div className="flex items-start space-x-2 text-sm">
          <div className="h-4 bg-muted rounded animate-pulse w-12" />
          <span>/</span>
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 bg-muted rounded animate-pulse w-96" />
            <div className="h-9 bg-muted rounded animate-pulse w-32" />
          </div>
          <div className="h-4 bg-muted rounded animate-pulse w-48" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-muted rounded animate-pulse"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
