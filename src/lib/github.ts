import { Octokit } from "@octokit/rest";
import { GitHubFile, GitHubContent, Article, Category } from "@/types";
import matter from "gray-matter";

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.owner = process.env.GITHUB_OWNER || "FrontendKnowledgeBase";
    this.repo = process.env.GITHUB_REPO || "FrontendCompetencies";
    this.branch = process.env.GITHUB_BRANCH || "main";
  }

  /**
   * Get cached data or fetch from API
   */
  private async getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for ${key}`);
      return cached.data as T;
    }

    try {
      const data = await fetchFn();
      cache.set(key, { data, timestamp: now });
      console.log(`Cache miss for ${key}, data fetched and cached`);
      return data;
    } catch (error) {
      // If API fails but we have stale cache, use it
      if (cached) {
        console.log(`API failed for ${key}, using stale cache`);
        return cached.data as T;
      }
      throw error;
    }
  }

  /**
   * Get the repository structure (directories and files)
   */
  async getRepositoryStructure(
    path: string = "articles"
  ): Promise<GitHubFile[]> {
    const cacheKey = `repo-structure-${path}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        return response.data as GitHubFile[];
      } else {
        return [response.data as GitHubFile];
      }
    }).catch((error: any) => {
      console.error("Error fetching repository structure:", error);

      // Handle rate limiting gracefully
      if (error.status === 403 && error.message?.includes("rate limit")) {
        console.warn(
          "GitHub API rate limit exceeded. Returning fallback structure."
        );
        return this.getFallbackStructure();
      }

      throw new Error("Failed to fetch repository structure");
    });
  }

  /**
   * Provide fallback structure when GitHub API is unavailable
   */
  private getFallbackStructure(): GitHubFile[] {
    return [
      {
        name: "1_html_css",
        path: "articles/1_html_css",
        type: "dir",
        size: 0,
        sha: "fallback",
        url: "",
        html_url: "",
        git_url: "",
        download_url: null,
        _links: { self: "", git: "", html: "" },
      },
      {
        name: "2_javascript",
        path: "articles/2_javascript",
        type: "dir",
        size: 0,
        sha: "fallback",
        url: "",
        html_url: "",
        git_url: "",
        download_url: null,
        _links: { self: "", git: "", html: "" },
      },
      {
        name: "3_react",
        path: "articles/3_react",
        type: "dir",
        size: 0,
        sha: "fallback",
        url: "",
        html_url: "",
        git_url: "",
        download_url: null,
        _links: { self: "", git: "", html: "" },
      },
    ];
  }

  /**
   * Get the content of a specific file
   */
  async getFileContent(path: string): Promise<string> {
    const cacheKey = `file-content-${path}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      });

      const content = response.data as GitHubContent;

      if (content.type === "file") {
        if (content.content) {
          // Decode base64 content
          return Buffer.from(content.content, "base64").toString("utf-8");
        } else {
          // Handle empty files
          console.warn(`File ${path} is empty, returning default content`);
          return this.getDefaultContentForEmptyFile(path);
        }
      } else {
        throw new Error("File content not found");
      }
    }).catch((error: any) => {
      console.error(`Error fetching file content for ${path}:`, error);

      // Handle rate limiting gracefully
      if (error.status === 403 && error.message?.includes("rate limit")) {
        console.warn(
          `GitHub API rate limit exceeded. Returning fallback content for ${path}`
        );
        return this.getFallbackContent(path);
      }

      throw new Error(`Failed to fetch file content: ${path}`);
    });
  }

  /**
   * Generate default content for empty files
   */
  private getDefaultContentForEmptyFile(path: string): string {
    const fileName = path.split("/").pop()?.replace(".md", "") || "Article";

    // Check if this is a main category file (starts with 0_)
    if (fileName.startsWith("0_")) {
      const categoryName = fileName.replace(/^0_/, "").replace(/_/g, " ");
      const capitalizedName = categoryName.replace(/\b\w/g, (l) =>
        l.toUpperCase()
      );

      return `# ${capitalizedName}

## Обзор

Добро пожаловать в раздел **${capitalizedName}**! Этот раздел содержит материалы и ресурсы по данной теме.

## Содержание раздела

В этом разделе вы найдете:

- Основные концепции и принципы
- Практические примеры и руководства  
- Лучшие практики и рекомендации
- Полезные ресурсы и ссылки

## Начало работы

Для изучения материалов этого раздела рекомендуется:

1. Ознакомиться с основными концепциями
2. Изучить практические примеры
3. Применить полученные знания на практике

---

*Содержимое этого файла будет дополнено в ближайшее время.*`;
    }

    // For regular articles
    const articleName = fileName
      .replace(/^\d+_/, "")
      .replace(/\s+copy$/i, "") // Remove " copy" suffix
      .replace(/\s+\(\d+\)$/, "") // Remove " (1)" style suffixes
      .replace(/_/g, " ")
      .trim();
    const capitalizedArticleName = articleName.replace(/\b\w/g, (l) =>
      l.toUpperCase()
    );

    return `# ${capitalizedArticleName}

## Введение

Эта статья посвящена теме: **${capitalizedArticleName}**.

## Основные понятия

*Содержимое будет добавлено в ближайшее время.*

## Практические примеры

*Примеры и код будут добавлены позже.*

## Заключение

*Выводы и рекомендации будут представлены после написания основного содержимого.*

---

*Статья находится в разработке и будет дополнена.*`;
  }

  /**
   * Provide fallback content when GitHub API is unavailable
   */
  private getFallbackContent(path: string): string {
    if (path === "README.md") {
      return `# Frontend Knowledge Base

Welcome to the Frontend Knowledge Base - a comprehensive collection of frontend development resources and best practices.

## About

This knowledge base covers essential topics in frontend development, including:

- **HTML & CSS**: Fundamentals, advanced techniques, and modern approaches
- **JavaScript**: Core concepts, ES6+, and advanced patterns  
- **React**: Components, hooks, state management, and optimization
- **Backend**: Database integration, caching, and server-side concepts
- **Quality Management**: Testing strategies and automation
- **State Management**: Redux, Context API, and modern alternatives

## Note

*Content is temporarily unavailable due to API limitations. Please try again later for full content.*`;
    }

    // Return a generic fallback for other files
    const fileName = path.split("/").pop()?.replace(".md", "") || "Article";
    return `# ${fileName}

This article is temporarily unavailable due to API limitations. Please try again later.

## Overview

This section would normally contain detailed information about ${fileName.toLowerCase()}.

## Key Points

- Content is being fetched from GitHub repository
- Full content will be available when API limits reset
- Please check back in a few minutes

*We apologize for the inconvenience.*`;
  }

  /**
   * Parse markdown content and extract frontmatter
   */
  private parseMarkdownContent(content: string) {
    const { data, content: markdownContent } = matter(content);

    // Extract H1 title from markdown content
    const h1Match = markdownContent.match(/^#\s+(.+)$/m);
    const title = h1Match ? h1Match[1].trim() : data.title || "Untitled";

    return {
      title,
      content: markdownContent,
      frontmatter: data,
    };
  }

  /**
   * Get article data from a markdown file
   */
  async getArticle(filePath: string): Promise<Article> {
    try {
      const content = await this.getFileContent(filePath);
      const { title, content: markdownContent } =
        this.parseMarkdownContent(content);

      // Extract category and article info from path
      const pathParts = filePath.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const categoryPath = pathParts[pathParts.length - 2];

      // Check if this is a main page (starts with 0_)
      const isMainPage = fileName.startsWith("0_");

      // Extract order number from filename
      const orderMatch = fileName.match(/^(\d+)_/);
      const order = orderMatch ? parseInt(orderMatch[1]) : 999;

      // Generate article ID
      const articleId = fileName
        .replace(/^\d+_/, "")
        .replace(/\.md$/, "")
        .replace(/\s+copy$/i, "") // Remove " copy" suffix (case insensitive)
        .replace(/\s+\(\d+\)$/, "") // Remove " (1)" style suffixes
        .trim();

      // Generate edit URL
      const editUrl = `https://github.com/${this.owner}/${this.repo}/edit/${this.branch}/${filePath}`;

      return {
        id: articleId,
        title,
        content: markdownContent,
        path: filePath,
        category: categoryPath,
        isMainPage,
        order,
        editUrl,
      };
    } catch (error) {
      console.error(`Error getting article ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get all articles in a category
   */
  async getCategoryArticles(categoryPath: string): Promise<Article[]> {
    try {
      const files = await this.getRepositoryStructure(
        `articles/${categoryPath}`
      );
      const markdownFiles = files.filter(
        (file) => file.type === "file" && file.name.endsWith(".md")
      );

      const articles: Article[] = [];

      for (const file of markdownFiles) {
        try {
          const article = await this.getArticle(file.path);
          articles.push(article);
        } catch (error) {
          console.error(`Error processing article ${file.path}:`, error);
          // Continue processing other articles even if one fails
        }
      }

      // Sort articles by order
      return articles.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error(
        `Error getting category articles for ${categoryPath}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all categories and their articles
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const structure = await this.getRepositoryStructure("articles");
      const directories = structure.filter((item) => item.type === "dir");

      const categories: Category[] = [];

      for (const dir of directories) {
        try {
          const articles = await this.getCategoryArticles(dir.name);

          // Find main page article
          const mainPage = articles.find((article) => article.isMainPage);
          // Only include regular articles (NOT main page) in the articles list
          const regularArticles = articles.filter(
            (article) => !article.isMainPage
          );

          // Extract category order from directory name
          const orderMatch = dir.name.match(/^(\d+)_/);
          const order = orderMatch ? parseInt(orderMatch[1]) : 999;

          // Generate category ID and title
          const categoryId = dir.name.replace(/^\d+_/, "");

          // Special handling for incorrect titles in GitHub content
          let categoryTitle = mainPage?.title;
          if (categoryId === "networking" && categoryTitle === "Браузер") {
            categoryTitle = "Сетевые технологии";
          }

          // Fallback to generated title if no main page or title
          if (!categoryTitle) {
            categoryTitle = categoryId
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
          }

          categories.push({
            id: categoryId,
            name: dir.name,
            title: categoryTitle,
            path: dir.path,
            mainPage,
            articles: regularArticles,
            order,
          });
        } catch (error) {
          console.error(`Error processing category ${dir.name}:`, error);
          // Continue processing other categories
        }
      }

      // Sort categories by order
      return categories.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw error;
    }
  }

  /**
   * Get the main README content
   */
  async getMainReadme(): Promise<Article | null> {
    try {
      const content = await this.getFileContent("README.md");
      const { title, content: markdownContent } =
        this.parseMarkdownContent(content);

      return {
        id: "readme",
        title,
        content: markdownContent,
        path: "README.md",
        category: "",
        isMainPage: true,
        order: 0,
        editUrl: `https://github.com/${this.owner}/${this.repo}/edit/${this.branch}/README.md`,
      };
    } catch (error) {
      console.error("Error getting main README:", error);
      return null;
    }
  }
}

export const githubService = new GitHubService();
