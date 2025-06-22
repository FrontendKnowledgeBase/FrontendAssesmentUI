"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type * as Monaco from "monaco-editor";

// Расширяем глобальный тип Window
declare global {
  interface Window {
    MonacoEnvironment?: Monaco.Environment;
  }
}

interface MonacoEditorProps {
  code: string;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRun?: (code: string) => void;
}

export function MonacoEditor({
  code,
  language = "javascript",
  height = "300px",
  readOnly = false,
  onChange,
  onRun,
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] =
    useState<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [monaco, setMonaco] = useState<typeof Monaco | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Динамически загружаем Monaco Editor только на клиенте
    const loadMonaco = async () => {
      try {
        // Используем динамический импорт для избежания SSR проблем
        const monacoModule = await import("monaco-editor");

        // Настраиваем Monaco для работы с webpack
        const monaco = monacoModule.default;

        // Настраиваем воркеры
        window.MonacoEnvironment = {
          getWorkerUrl: function (_workerId: string, _label: string) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
              self.MonacoEnvironment = {
                baseUrl: '${window.location.origin}/_next/static/chunks/'
              };
              importScripts('${window.location.origin}/_next/static/chunks/monaco-editor-worker.js');
            `)}`;
          },
        };

        setMonaco(monaco);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load Monaco Editor:", error);
        setIsLoading(false);
      }
    };

    loadMonaco();
  }, []);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    // Создаем редактор
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: code,
      language: language,
      theme: theme === "dark" ? "vs-dark" : "vs",
      readOnly: readOnly,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily:
        "JetBrains Mono, Fira Code, SF Mono, Monaco, Consolas, monospace",
      lineNumbers: "on",
      renderLineHighlight: "line",
      selectOnLineNumbers: true,
      automaticLayout: true,
    });

    // Обработчик изменений
    if (onChange) {
      editorInstance.onDidChangeModelContent(() => {
        onChange(editorInstance.getValue());
      });
    }

    setEditor(editorInstance);

    // Cleanup
    return () => {
      editorInstance.dispose();
    };
  }, [monaco, code, language, readOnly, onChange, theme]);

  // Обновляем тему при изменении
  useEffect(() => {
    if (editor && monaco) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
    }
  }, [theme, editor, monaco]);

  // Обновляем код при изменении пропса
  useEffect(() => {
    if (editor && editor.getValue() !== code) {
      editor.setValue(code);
    }
  }, [code, editor]);

  const handleRun = () => {
    if (editor && onRun) {
      onRun(editor.getValue());
    }
  };

  if (isLoading) {
    return (
      <div
        className="border rounded-lg bg-muted/50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Заголовок с кнопками */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {language}
          </span>
          {!readOnly && (
            <span className="text-xs text-muted-foreground">• Editable</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={handleRun}
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Run
            </button>
          )}
          <button
            onClick={() =>
              navigator.clipboard.writeText(editor?.getValue() || code)
            }
            className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Редактор */}
      <div ref={editorRef} style={{ height }} className="w-full" />
    </div>
  );
}

// Компонент для простого отображения кода (без редактирования)
export function MonacoCodeBlock({
  code,
  language = "javascript",
  height = "200px",
}: {
  code: string;
  language?: string;
  height?: string;
}) {
  return (
    <MonacoEditor
      code={code}
      language={language}
      height={height}
      readOnly={true}
    />
  );
}
