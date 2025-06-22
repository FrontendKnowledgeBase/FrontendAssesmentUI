"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// Import Prism.js core and languages
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-git";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-nginx";
import "prismjs/components/prism-markup-templating";

// Ensure basic languages are available
if (!Prism.languages.text) {
  Prism.languages.text = {};
}

if (!Prism.languages.plain) {
  Prism.languages.plain = {};
}

// Add common aliases
if (!Prism.languages.shell) {
  Prism.languages.shell = Prism.languages.bash;
}

if (!Prism.languages.sh) {
  Prism.languages.sh = Prism.languages.bash;
}

if (!Prism.languages.console) {
  Prism.languages.console = Prism.languages.bash;
}

if (!Prism.languages.terminal) {
  Prism.languages.terminal = Prism.languages.bash;
}

if (!Prism.languages.cmd) {
  Prism.languages.cmd = Prism.languages.bash;
}

if (!Prism.languages.powershell) {
  Prism.languages.powershell = Prism.languages.bash;
}

if (!Prism.languages.apache) {
  Prism.languages.apache = {};
}

if (!Prism.languages.xml) {
  Prism.languages.xml = Prism.languages.markup || {};
}

if (!Prism.languages.html) {
  Prism.languages.html = Prism.languages.markup || {};
}

interface CodeHighlighterProps {
  children: React.ReactNode;
}

export function CodeHighlighter({ children }: CodeHighlighterProps) {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme class to body for CSS targeting
    const body = document.body;

    // Remove existing theme classes
    body.classList.remove("light-theme", "dark-theme");

    // Add current theme class
    if (theme === "light") {
      body.classList.add("light-theme");
    } else {
      body.classList.add("dark-theme");
    }
  }, [theme]);

  useEffect(() => {
    // Highlight code blocks after component mounts or updates
    try {
      // Get all code blocks
      const codeBlocks = document.querySelectorAll('pre[class*="language-"]');

      codeBlocks.forEach((block) => {
        const codeElement = block.querySelector("code");
        if (codeElement) {
          // Extract language from class name
          const classList = Array.from(block.classList);
          const languageClass = classList.find((cls) =>
            cls.startsWith("language-")
          );

          if (languageClass) {
            const language = languageClass.replace("language-", "");

            // Check if the language is supported by Prism
            if (Prism.languages[language]) {
              Prism.highlightElement(codeElement);
            } else {
              // Fallback to plain text highlighting
              console.warn(
                `Language "${language}" not supported by Prism.js, using plain text`
              );
              codeElement.className = "language-text";
              if (Prism.languages.text) {
                Prism.highlightElement(codeElement);
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("Error highlighting code:", error);
      // Fallback to standard highlighting
      try {
        Prism.highlightAll();
      } catch (fallbackError) {
        console.error("Fallback highlighting also failed:", fallbackError);
      }
    }
  });

  return <>{children}</>;
}
