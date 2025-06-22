import { Suspense } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { githubService } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { BookOpen, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

async function HomeContent() {
  try {
    // Get categories for navigation
    const categories = await githubService.getAllCategories();

    return (
      <MainLayout categories={categories} tableOfContents={[]}>
        <div className="space-y-8">
          {/* Hero section */}
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "KnowledgeDocs"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
                "Simple. Structured. Smart."}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern documentation system powered by GitHub, built with
              Next.js and TypeScript.
            </p>
          </div>

          {/* Quick navigation */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/${category.id}`}>
                <div className="group p-6 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.articles.length} article
                    {category.articles.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">О проекте</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Это интерактивная база знаний, созданная для систематизации и
                упрощения доступа к учебным материалам по фронтенд-разработке.
                Цель — предоставить удобный интерфейс со структурированной
                информацией для подготовке к ассесменту по фронтенд-разработке,
                а также смежным дисциплинам.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <h3 className="text-xl font-semibold mb-2">Базовые темы</h3>
                <p className="text-muted-foreground">
                  Фундаментальные знания по HTML, CSS, JavaScript, сетям и
                  алгоритмам, необходимые каждому разработчику.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <h3 className="text-xl font-semibold mb-2">
                  Фреймворки и инструменты
                </h3>
                <p className="text-muted-foreground">
                  Углубленные материалы по React, TypeScript, сборщикам проектов
                  и другим технологиям из нашего стека.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card text-card-foreground lg:col-span-1 md:col-span-2">
                <h3 className="text-xl font-semibold mb-2">
                  Архитектура и Soft Skills
                </h3>
                <p className="text-muted-foreground">
                  Вопросы по проектированию систем, паттернам, а также развитию
                  гибких навыков для успешной работы в команде.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-center">
                Как это работает?
              </h2>
              <ul className="mt-6 list-disc list-inside space-y-2 text-lg text-muted-foreground max-w-3xl mx-auto">
                <li>
                  Материалы сгруппированы по категориям и уровню сложности.
                </li>
                <li>
                  Каждая статья содержит теорию, примеры кода и ссылки на доп.
                  ресурсы.
                </li>
                <li>
                  Вы можете использовать поиск для быстрого доступа к нужной
                  теме.
                </li>
              </ul>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center py-8 space-y-4">
            <h2 className="text-2xl font-semibold">
              Готовы навести ревизию компетенций?
            </h2>
            <p className="text-muted-foreground">
              Добро пожаловать в подробную документацию подготовки к ассесменту
              по frontend
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={categories[0] ? `/${categories[0].id}` : "#"}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Открыть первую главу
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Исходный код на GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error("Error loading home page:", error);

    return (
      <MainLayout categories={[]}>
        <div className="text-center py-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || "KnowledgeDocs"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
              "Simple. Structured. Smart."}
          </p>
          <p className="text-muted-foreground">Не удалось загрузить контент.</p>
        </div>
      </MainLayout>
    );
  }
}

function LoadingSkeleton() {
  return (
    <MainLayout categories={[]}>
      <div className="space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-muted animate-pulse" />
          </div>
          <div className="h-10 bg-muted rounded animate-pulse max-w-md mx-auto" />
          <div className="h-6 bg-muted rounded animate-pulse max-w-2xl mx-auto" />
          <div className="h-4 bg-muted rounded animate-pulse max-w-xl mx-auto" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="h-6 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
