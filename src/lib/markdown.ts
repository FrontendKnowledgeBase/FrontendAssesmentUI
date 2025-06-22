import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { TableOfContentsItem } from "@/types";

/**
 * Convert markdown to HTML with heading IDs
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Pre-process markdown to add IDs to headings
  const processedMarkdown = markdown.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (match, hashes, title) => {
      const level = hashes.length;
      const cleanTitle = title.trim();
      const id = generateAnchor(cleanTitle);

      // Convert to HTML heading with ID
      return `<h${level} id="${id}">${cleanTitle}</h${level}>`;
    }
  );

  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkHtml, { sanitize: false })
    .process(processedMarkdown);

  return result.toString();
}

/**
 * Generate anchor from text
 */
function generateAnchor(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .toLowerCase()
    .replace(/[^\w\s\u0400-\u04FF-]/g, "") // Allow Cyrillic characters
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
    .trim();
}

/**
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(
  markdown: string
): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const anchor = generateAnchor(title);

    toc.push({
      id: `heading-${toc.length + 1}`,
      title,
      level,
      anchor,
    });
  }

  return toc;
}

/**
 * Add anchor IDs to headings in HTML content
 */
export function addAnchorIds(html: string): string {
  // More robust regex that handles various heading formats
  return html.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attributes, content) => {
      // Clean content for anchor generation
      const cleanContent = content.replace(/<[^>]*>/g, "").trim();
      const anchor = generateAnchor(cleanContent);

      // Remove any existing id attribute and add our new one
      const cleanAttributes = attributes.replace(
        /\s*id\s*=\s*["'][^"']*["']/gi,
        ""
      );

      return `<h${level} id="${anchor}"${cleanAttributes}>${content}</h${level}>`;
    }
  );
}

/**
 * Remove the first H1 heading from markdown content to avoid duplication
 */
export function removeFirstH1(markdown: string): string {
  // Remove the first H1 heading (# Title) from the beginning of the content
  return markdown.replace(/^#\s+.+$/m, "").trim();
}

/**
 * Process markdown content for display
 */
export async function processMarkdownContent(markdown: string) {
  // Remove the first H1 to avoid duplication with page title
  const contentWithoutH1 = removeFirstH1(markdown);

  const toc = extractTableOfContents(contentWithoutH1);
  let html = await markdownToHtml(contentWithoutH1);

  // Enhanced code block processing with language detection
  html = html.replace(
    /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      const lang = language || "text";

      return `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-block-language">${lang}</span>
        </div>
        <pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>
      </div>`;
    }
  );

  return {
    html,
    toc,
  };
}
