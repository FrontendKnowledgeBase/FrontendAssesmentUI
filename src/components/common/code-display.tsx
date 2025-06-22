"use client";

import { useState } from "react";
import { CodeHighlighter } from "./code-highlighter";
import { MonacoEditor } from "./monaco-editor";
import { Button } from "@/components/ui/button";
import { Code, Edit, Play } from "lucide-react";

interface CodeDisplayProps {
  code: string;
  language?: string;
  interactive?: boolean;
  height?: string;
  showToggle?: boolean;
}

export function CodeDisplay({
  code,
  language = "javascript",
  interactive = false,
  height = "300px",
  showToggle = true,
}: CodeDisplayProps) {
  const [useMonaco, setUseMonaco] = useState(interactive);
  const [currentCode, setCurrentCode] = useState(code);

  const handleRun = (code: string) => {
    // Здесь можно добавить логику выполнения кода
    // Например, для JavaScript можно использовать eval (осторожно!)
    // Или отправить код на сервер для выполнения
    console.log("Running code:", code);

    // Пример для JavaScript
    if (language === "javascript") {
      try {
        // Создаем изолированный контекст
        const result = new Function("console", code)(console);
        console.log("Result:", result);
      } catch (error) {
        console.error("Error running code:", error);
      }
    }
  };

  if (useMonaco) {
    return (
      <div className="space-y-2">
        {showToggle && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseMonaco(false)}
                className="h-7"
              >
                <Code className="h-3 w-3 mr-1" />
                Static View
              </Button>
              <Button variant="default" size="sm" className="h-7">
                <Edit className="h-3 w-3 mr-1" />
                Interactive
              </Button>
            </div>
          </div>
        )}

        <MonacoEditor
          code={currentCode}
          language={language}
          height={height}
          onChange={setCurrentCode}
          onRun={language === "javascript" ? handleRun : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showToggle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="h-7">
              <Code className="h-3 w-3 mr-1" />
              Static View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseMonaco(true)}
              className="h-7"
            >
              <Edit className="h-3 w-3 mr-1" />
              Interactive
            </Button>
          </div>

          {language === "javascript" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRun(code)}
              className="h-7"
            >
              <Play className="h-3 w-3 mr-1" />
              Run
            </Button>
          )}
        </div>
      )}

      <CodeHighlighter>
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-language">{language}</span>
          </div>
          <pre className={`language-${language}`}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      </CodeHighlighter>
    </div>
  );
}

// Компонент для интерактивных примеров в документации
export function InteractiveExample({
  code,
  language = "javascript",
  title,
  description,
}: {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="my-6 p-4 border rounded-lg bg-muted/20">
      {title && <h4 className="text-lg font-semibold mb-2">{title}</h4>}
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      <CodeDisplay
        code={code}
        language={language}
        interactive={true}
        showToggle={true}
      />
    </div>
  );
}
