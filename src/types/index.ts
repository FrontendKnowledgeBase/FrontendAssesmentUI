// Types for the knowledge base system

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  isMainPage: boolean;
  order: number;
  editUrl: string;
}

export interface Category {
  id: string;
  name: string;
  title: string;
  path: string;
  mainPage?: Article;
  articles: Article[];
  order: number;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  type: "category" | "article";
  children?: NavigationItem[];
  isMainPage?: boolean;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
}

export interface SearchResult {
  id: string;
  title: string;
  path: string;
  type: "category" | "article";
  category?: string;
}
