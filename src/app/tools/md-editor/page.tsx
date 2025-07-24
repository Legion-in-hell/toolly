"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Copy,
  Check,
  Upload,
  Download,
  Eye,
  Edit3,
} from "lucide-react";

export default function MarkdownEditor() {
  const [inputText, setInputText] =
    useState(`# Bienvenue dans l'éditeur Markdown

## Qu'est-ce que Markdown ?

Markdown est un **langage de balisage léger** qui permet de formater du texte de manière simple et lisible.

### Fonctionnalités supportées :

- **Gras** et *italique*
- [Liens](https://example.com)
- \`Code en ligne\`
- Listes à puces
- Citations

> Ceci est une citation

### Bloc de code :

\`\`\`javascript
function saluer(nom) {
  console.log("Bonjour " + nom + " !");
}
\`\`\`

---

Commencez à taper dans l'éditeur à gauche pour voir la prévisualisation !`);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "editor", "preview", "split"

  // Improved Markdown parser
  const parseMarkdown = (text) => {
    if (!text) return "";

    let html = text;

    // Escape HTML special characters first
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks (must be first to avoid interference)
    html = html.replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4 font-mono text-sm"><code>$2</code></pre>'
    );

    const lines = html.split("\n");
    const result = [];
    let inList = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let processedLine = line;

      if (line.match(/^### /)) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        processedLine = line.replace(
          /^### (.*)/,
          '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>'
        );
      } else if (line.match(/^## /)) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        processedLine = line.replace(
          /^## (.*)/,
          '<h2 class="text-xl font-bold mb-3 mt-6">$1</h2>'
        );
      } else if (line.match(/^# /)) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        processedLine = line.replace(
          /^# (.*)/,
          '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>'
        );
      }
      // Lists
      else if (line.match(/^- /)) {
        if (!inList) {
          inList = true;
        }
        let listContent = line.replace(/^- (.*)/, "$1");
        // Apply inline formatting to list content
        listContent = applyInlineFormatting(listContent);
        listItems.push('<li class="mb-1">' + listContent + "</li>");
        continue; // Skip adding to result now, will be processed when list ends
      }
      // Blockquotes
      else if (line.match(/^> /)) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        let quoteContent = line.replace(/^> (.*)/, "$1");
        quoteContent = applyInlineFormatting(quoteContent);
        processedLine =
          '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 mb-4">' +
          quoteContent +
          "</blockquote>";
      }
      // Horizontal rule
      else if (line.match(/^---$/)) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        processedLine =
          '<hr class="border-t border-gray-300 dark:border-gray-600 my-6" />';
      }
      // Regular paragraphs
      else if (
        line.trim() !== "" &&
        !line.match(/^<(h[1-6]|pre|blockquote|hr)/)
      ) {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        // Apply inline formatting
        processedLine = applyInlineFormatting(line);
        if (processedLine.trim() !== "") {
          processedLine = '<p class="mb-4">' + processedLine + "</p>";
        }
      }
      // Empty lines
      else if (line.trim() === "") {
        if (inList) {
          result.push(
            '<ul class="list-disc list-inside mb-4 space-y-1">' +
              listItems.join("") +
              "</ul>"
          );
          listItems = [];
          inList = false;
        }
        continue; // Skip empty lines
      }

      if (!line.match(/^- /) || !inList) {
        result.push(processedLine);
      }
    }

    // Handle remaining list items
    if (inList && listItems.length > 0) {
      result.push(
        '<ul class="list-disc list-inside mb-4 space-y-1">' +
          listItems.join("") +
          "</ul>"
      );
    }

    return result.join("\n");
  };

  // Helper function for inline formatting
  const applyInlineFormatting = (text) => {
    let formatted = text;

    // Inline code (before other formatting)
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>'
    );

    // Bold (before italic)
    formatted = formatted.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );

    // Italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    // Links
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    formatted = formatted.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md mb-4" />'
    );

    return formatted;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearEditor = () => {
    setInputText("");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([inputText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if ((file && file.type === "text/markdown") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === "string") {
          setInputText(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="hover:text-gray-700">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <a href="/tools" className="hover:text-gray-700">
          Outils
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100">
          Éditeur Markdown
        </span>
      </nav>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Éditeur/Visionneur Markdown</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Créez, éditez et prévisualisez vos documents Markdown en temps réel.
          Supportez la syntaxe complète avec prévisualisation instantanée.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "editor"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            onClick={() => setViewMode("editor")}
          >
            <Edit3 className="h-4 w-4 mr-2 inline" />
            Éditeur
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "split"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            onClick={() => setViewMode("split")}
          >
            Diviser
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-4 w-4 mr-2 inline" />
            Aperçu
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <button
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Upload className="h-4 w-4 mr-2 inline" />
              Importer .md
            </button>
            <button
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              onClick={downloadMarkdown}
              disabled={!inputText}
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Télécharger
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              onClick={copyToClipboard}
              disabled={!inputText}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 inline" />
                  Copié!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2 inline" />
                  Copier
                </>
              )}
            </button>
            <button
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={clearEditor}
            >
              Effacer
            </button>
          </div>
        </div>

        {/* Editor and Preview */}
        <div
          className={`grid gap-6 ${
            viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Editor */}
          {(viewMode === "editor" || viewMode === "split") && (
            <div>
              <label
                htmlFor="markdown-input"
                className="block font-medium mb-2"
              >
                Éditeur Markdown
              </label>
              <textarea
                id="markdown-input"
                placeholder="Tapez votre Markdown ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full min-h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Preview */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div>
              <label className="block font-medium mb-2">Aperçu</label>
              <div
                className="min-h-96 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 overflow-auto prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(inputText) }}
              />
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Guide Markdown</h2>

        <div className="space-y-4">
          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Comment formater du texte en Markdown ?
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <p>
                  <strong>Gras :</strong> <code>**texte en gras**</code>
                </p>
                <p>
                  <strong>Italique :</strong> <code>*texte en italique*</code>
                </p>
                <p>
                  <strong>Code en ligne :</strong> <code>`mon code`</code>
                </p>
                <p>
                  <strong>Liens :</strong>{" "}
                  <code>[Texte du lien](https://example.com)</code>
                </p>
                <p>
                  <strong>Images :</strong>{" "}
                  <code>![Texte alternatif](url-image.jpg)</code>
                </p>
              </div>
            </div>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Comment créer des titres et listes ?
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <p>
                  <strong>Titres :</strong>
                </p>
                <p>
                  <code># Titre principal</code>
                </p>
                <p>
                  <code>## Sous-titre</code>
                </p>
                <p>
                  <code>### Titre de section</code>
                </p>
                <p className="mt-4">
                  <strong>Listes à puces :</strong>
                </p>
                <p>
                  <code>- Premier élément</code>
                </p>
                <p>
                  <code>- Deuxième élément</code>
                </p>
                <p className="mt-4">
                  <strong>Citations :</strong>
                </p>
                <p>
                  <code>&gt; Ceci est une citation</code>
                </p>
              </div>
            </div>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Comment créer des blocs de code ?
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p>
                Pour créer un bloc de code, utilisez trois backticks (```) :
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2">
                {`\`\`\`javascript
function exemple() {
  console.log("Hello World!");
}
\`\`\``}
              </pre>
              <p className="mt-2">
                Vous pouvez spécifier le langage après les premiers backticks
                pour la coloration syntaxique.
              </p>
            </div>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Est-ce que mes documents sont sécurisés ?
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              Absolument. Tout le traitement se fait directement dans votre
              navigateur. Vos documents ne sont jamais envoyés à nos serveurs ni
              stockés, garantissant ainsi une confidentialité totale. Vous
              pouvez importer et exporter vos fichiers .md en toute sécurité.
            </div>
          </details>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Aperçu en temps réel</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Visualisez instantanément le rendu de votre Markdown pendant que
            vous tapez, avec support complet de la syntaxe.
          </p>
        </div>
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Import/Export facile</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Importez vos fichiers .md existants et exportez vos créations pour
            les utiliser dans d&#39;autres applications.
          </p>
        </div>
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Interface adaptative</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Passez facilement entre les modes éditeur, aperçu ou vue divisée
            selon vos préférences de travail.
          </p>
        </div>
      </div>
    </div>
  );
}
