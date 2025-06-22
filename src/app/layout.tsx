import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "KnowledgeDocs",
    template: "%s | KnowledgeDocs",
  },
  description: "Simple. Structured. Smart. - A modern documentation system powered by GitHub.",
  keywords: ["documentation", "knowledge base", "github", "nextjs", "react"],
  authors: [{ name: "KnowledgeDocs" }],
  creator: "KnowledgeDocs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://knowledgedocs.dev",
    title: "KnowledgeDocs",
    description: "Simple. Structured. Smart. - A modern documentation system powered by GitHub.",
    siteName: "KnowledgeDocs",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnowledgeDocs",
    description: "Simple. Structured. Smart. - A modern documentation system powered by GitHub.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}

