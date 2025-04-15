"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  ArrowDownUp,
  FileJson,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-sql";

type CodeLanguage =
  | "json"
  | "html"
  | "css"
  | "javascript"
  | "xml"
  | "sql"
  | "auto";

const prismLanguageMap: Record<string, string> = {
  json: "json",
  html: "markup",
  css: "css",
  javascript: "javascript",
  xml: "markup",
  sql: "sql",
};

export default function CodeIndenter() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [language, setLanguage] = useState<CodeLanguage>("auto");
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [highlightedInputCode, setHighlightedInputCode] = useState("");
  const [activeTab, setActiveTab] = useState("input");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const indentCode = () => {
    if (!inputCode) {
      setOutputCode("");
      setError(null);
      return;
    }

    try {
      setError(null);
      let formattedCode = "";
      let detectedLanguage = language;

      if (language === "auto") {
        detectedLanguage = detectLanguage(inputCode);
      }

      switch (detectedLanguage) {
        case "json":
          formattedCode = formatJSON(inputCode);
          break;
        case "html":
          formattedCode = formatHTML(inputCode);
          break;
        case "css":
          formattedCode = formatCSS(inputCode);
          break;
        case "javascript":
          formattedCode = formatJavaScript(inputCode);
          break;
        case "xml":
          formattedCode = formatXML(inputCode);
          break;
        case "sql":
          formattedCode = formatSQL(inputCode);
          break;
        default:
          try {
            formattedCode = formatJSON(inputCode);
          } catch {
            formattedCode = inputCode;
          }
      }

      setOutputCode(formattedCode);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Erreur de formatage : ${e.message}`);
      } else {
        setError("Une erreur inconnue s'est produite lors du formatage.");
      }
      setOutputCode(inputCode);
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const codeContainer = document.querySelector(".input-code-container");
    if (codeContainer) {
      codeContainer.addEventListener("click", focusInput);
      return () => {
        codeContainer.removeEventListener("click", focusInput);
      };
    }
  }, []);

  const indentAndShowResult = () => {
    indentCode();
    setActiveTab("output");
  };

  const detectLanguage = (code: string): CodeLanguage => {
    try {
      JSON.parse(code);
      return "json";
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
    }

    if (
      /<html|<!DOCTYPE html|<body|<div|<span|<p|<a|<img|<table|<form/i.test(
        code
      )
    ) {
      return "html";
    }

    if (
      /{[\s\S]*}|@media|@keyframes|@font-face/.test(code) &&
      /:\s*.*;|margin:|padding:|color:|background:|font-size:/.test(code)
    ) {
      return "css";
    }

    if (
      /function\s+\w+\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|if\s*\(|for\s*\(|while\s*\(/.test(
        code
      )
    ) {
      return "javascript";
    }

    if (/<\?xml|<[a-zA-Z]+>[^<]*<\/[a-zA-Z]+>/.test(code)) {
      return "xml";
    }

    if (
      /SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE/i.test(code)
    ) {
      return "sql";
    }

    return "javascript";
  };

  const formatJSON = (code: string): string => {
    try {
      const parsedJSON = JSON.parse(code);
      return JSON.stringify(parsedJSON, null, indentSize);
    } catch {
      throw new Error("JSON invalide. Vérifiez la syntaxe.");
    }
  };

  const formatHTML = (code: string): string => {
    try {
      let formatted = "";
      let indent = 0;
      const lines = code.split(/>\s*</);

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (i === 0) {
          formatted += line.trim() + ">";
          continue;
        }
        if (i === lines.length - 1) {
          formatted +=
            "\n" + " ".repeat(indent * indentSize) + "<" + line.trim();
          continue;
        }

        if (line.indexOf("/") === 0 && indent > 0) {
          indent--;
        }

        formatted +=
          "\n" + " ".repeat(indent * indentSize) + "<" + line.trim() + ">";

        if (
          line.indexOf("/") === -1 &&
          line.indexOf("input") === -1 &&
          line.indexOf("img") === -1 &&
          line.indexOf("br") === -1 &&
          line.indexOf("hr") === -1
        ) {
          indent++;
        }
      }

      return formatted;
    } catch {
      throw new Error("Erreur lors du formatage HTML.");
    }
  };

  const formatCSS = (code: string): string => {
    try {
      let formatted = code.replace(/\s+/g, " ");

      formatted = formatted.replace(/}/g, "}\n");
      formatted = formatted.replace(/;/g, ";\n");
      formatted = formatted.replace(/{/g, "{\n");

      const lines = formatted.split("\n");
      let indent = 0;
      let result = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.includes("}")) indent--;
        result += " ".repeat(indent * indentSize) + line + "\n";
        if (line.includes("{")) indent++;
      }

      return result.trim();
    } catch {
      throw new Error("Erreur lors du formatage HTML.");
    }
  };

  const formatJavaScript = (code: string): string => {
    try {
      if (code.trim().startsWith("{") && code.trim().endsWith("}")) {
        try {
          const obj = Function(`"use strict"; return (${code})`)();
          return JSON.stringify(obj, null, indentSize);
        } catch {
          throw new Error("Erreur lors du formatage JavaScript.");
        }
      }

      let formatted = "";
      let indent = 0;
      let inString = false;
      let stringChar = "";

      for (let i = 0; i < code.length; i++) {
        const char = code[i];

        if (
          (char === '"' || char === "'" || char === "`") &&
          (i === 0 || code[i - 1] !== "\\")
        ) {
          if (inString && stringChar === char) {
            inString = false;
          } else if (!inString) {
            inString = true;
            stringChar = char;
          }
        }

        if (inString) {
          formatted += char;
          continue;
        }

        if (char === "{" || char === "[") {
          formatted += char + "\n" + " ".repeat((indent + 1) * indentSize);
          indent++;
        } else if (char === "}" || char === "]") {
          indent--;
          formatted =
            formatted.trimEnd() + "\n" + " ".repeat(indent * indentSize) + char;
        } else if (char === ";") {
          formatted += char + "\n" + " ".repeat(indent * indentSize);
        } else if (char === "\n") {
          formatted += "\n" + " ".repeat(indent * indentSize);
        } else {
          formatted += char;
        }
      }

      return formatted;
    } catch {
      throw new Error("Erreur lors du formatage HTML.");
    }
  };

  const formatXML = (code: string): string => {
    return formatHTML(code);
  };

  const formatSQL = (code: string): string => {
    try {
      let formatted = code.replace(/\s+/g, " ").trim();

      const keywords = [
        "SELECT",
        "FROM",
        "WHERE",
        "GROUP BY",
        "ORDER BY",
        "HAVING",
        "JOIN",
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "OUTER JOIN",
        "UNION",
        "INSERT INTO",
        "VALUES",
        "UPDATE",
        "SET",
        "DELETE FROM",
      ];

      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        formatted = formatted.replace(regex, `\n${keyword}`);
      }

      formatted = formatted.replace(/,/g, ",\n  ");

      const lines = formatted.split("\n");
      let result = "";
      let indent = 0;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        if (/\b(FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN)\b/i.test(line)) {
          indent = 1;
        } else if (/\bSELECT\b/i.test(line)) {
          indent = 0;
        }

        result += " ".repeat(indent * indentSize) + line + "\n";
      }

      return result.trim();
    } catch (e) {
      throw new Error("Erreur lors du formatage SQL.", e);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputCode) {
        indentCode();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputCode, language, indentSize]);

  useEffect(() => {
    if (outputCode) {
      let langToUse = language;

      if (language === "auto") {
        langToUse = detectLanguage(inputCode);
      }

      const prismLang = prismLanguageMap[langToUse] || "javascript";

      try {
        const highlighted = Prism.highlight(
          outputCode,
          Prism.languages[prismLang],
          prismLang
        );
        setHighlightedCode(highlighted);
      } catch (e) {
        console.error("Erreur lors de la coloration syntaxique:", e);
        setHighlightedCode(outputCode);
      }
    } else {
      setHighlightedCode("");
    }
  }, [outputCode, language, inputCode]);

  useEffect(() => {
    if (inputCode) {
      let langToUse = language;

      if (language === "auto") {
        langToUse = detectLanguage(inputCode);
      }

      const prismLang = prismLanguageMap[langToUse] || "javascript";

      try {
        const highlighted = Prism.highlight(
          inputCode,
          Prism.languages[prismLang],
          prismLang
        );
        setHighlightedInputCode(highlighted);
      } catch (e) {
        console.error("Erreur lors de la coloration syntaxique:", e);
        setHighlightedInputCode(inputCode);
      }
    } else {
      setHighlightedInputCode("");
    }
  }, [inputCode, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapCodes = () => {
    setInputCode(outputCode);
    setOutputCode(inputCode);
  };

  const clearFields = () => {
    setInputCode("");
    setOutputCode("");
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools">Outils</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools/code-indenter">
              Indenteur de code
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Indenteur de code</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Formatez et indentez automatiquement votre code pour le rendre plus
          lisible. Prend en charge plusieurs langages dont JSON, HTML, CSS,
          JavaScript et SQL.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="language" className="block font-medium mb-2">
              Langage de programmation
            </label>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as CodeLanguage)}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Sélectionner un langage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Détection automatique</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Taille de l&#39;indentation : {indentSize} espaces
            </label>
            <Slider
              min={1}
              max={8}
              step={1}
              value={[indentSize]}
              onValueChange={(values) => setIndentSize(values[0])}
              className="my-4"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          Le code est mis en forme avec coloration syntaxique pour une meilleure
          lisibilité. Cliquez n&#39;importe où dans la zone de code pour éditer.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="input">Code à formater</TabsTrigger>
            <TabsTrigger value="output">Résultat formaté</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Code d&#39;entrée</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFields}
                className="text-gray-500"
              >
                Effacer
              </Button>
            </div>
            <div className="relative">
              <pre className="min-h-64 rounded-md overflow-auto p-4 text-sm bg-gray-50 dark:bg-gray-800 font-mono input-code-container">
                {!inputCode ? (
                  <div className="text-gray-400">
                    Collez votre code ici pour le formater...
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: highlightedInputCode }}
                    className="code-highlight"
                  />
                )}
              </pre>
              <Textarea
                ref={inputRef}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 resize-none font-mono"
                placeholder="Collez votre code ici pour le formater..."
              />
            </div>
          </TabsContent>

          <TabsContent value="output">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Code formaté</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!outputCode}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            {error ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-3 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            ) : null}
            {outputCode ? (
              <div className="relative">
                <pre className="min-h-64 rounded-md overflow-auto p-4 text-sm bg-gray-50 dark:bg-gray-900 font-mono">
                  <div
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    className="code-highlight"
                  />
                </pre>
                <Textarea
                  readOnly
                  value={outputCode}
                  className="absolute top-0 left-0 opacity-0 w-full h-full"
                  tabIndex={-1}
                />
              </div>
            ) : (
              <div className="min-h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                  Le code formaté apparaîtra ici...
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={swapCodes}
            className="w-full md:w-auto"
            disabled={!outputCode}
          >
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Inverser entrée/sortie
          </Button>

          <Button
            variant="outline"
            onClick={indentAndShowResult}
            className="w-full md:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reformater
          </Button>
        </div>
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Comment fonctionne la détection automatique de langage ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              La détection automatique analyse votre code pour identifier des
              patterns caractéristiques de chaque langage :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Pour le JSON, nous vérifions si le code peut être parsé comme un
                objet JSON valide
              </li>
              <li>Pour HTML, nous recherchons des balises HTML courantes</li>
              <li>
                Pour CSS, nous recherchons des propriétés et sélecteurs CSS
              </li>
              <li>
                Pour JavaScript, nous recherchons des mots-clés et structures
                spécifiques
              </li>
              <li>
                Pour SQL, nous recherchons des mots-clés comme SELECT, INSERT,
                UPDATE, etc.
              </li>
            </ul>
            <p className="mt-2">
              Si le langage ne peut pas être détecté avec certitude, JavaScript
              est utilisé par défaut.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Pourquoi mon code ne s&#39;indente pas correctement ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Plusieurs raisons peuvent expliquer un formatage incorrect :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Le langage sélectionné ne correspond pas au code fourni</li>
              <li>
                Le code contient des erreurs de syntaxe qui empêchent
                l&#39;analyse correcte
              </li>
              <li>
                Le code est trop complexe pour notre formateur simplifié (par
                exemple, du JavaScript avec des structures imbriquées complexes)
              </li>
            </ul>
            <p className="mt-2">
              Pour les meilleurs résultats avec du code complexe, essayez de
              sélectionner manuellement le langage approprié au lieu
              d&#39;utiliser la détection automatique.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Mes données sont-elles sécurisées avec cet outil ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Tout le traitement du code se fait directement dans
            votre navigateur. Votre code n&#39;est jamais envoyé à nos serveurs
            ni stocké, garantissant ainsi une confidentialité totale. Cette
            approche vous permet de formater en toute sécurité même du code
            propriétaire ou sensible.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Quelles sont les limites de cet outil ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Bien que notre outil soit pratique pour le formatage de base, il
              présente quelques limitations :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Le formatage est simplifié et peut ne pas respecter toutes les
                conventions de style spécifiques à chaque langage
              </li>
              <li>Il ne corrige pas les erreurs de syntaxe dans votre code</li>
              <li>
                Les langages très spécifiques ou les frameworks personnalisés
                peuvent ne pas être correctement détectés ou formatés
              </li>
              <li>
                Pour les projets professionnels, des outils dédiés comme
                Prettier, ESLint ou les formateurs intégrés aux IDE peuvent
                offrir des options plus avancées
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Formatage local</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Votre code est formaté directement dans votre navigateur pour
            garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Langages multiples</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Prend en charge JSON, HTML, CSS, JavaScript, XML et SQL avec
            détection automatique.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Personnalisation facile</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Ajustez la taille d&#39;indentation selon vos préférences, de 1 à 8
            espaces.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Coloration syntaxique</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Code plus lisible grâce à la mise en couleur adaptée à chaque
            langage.
          </p>
        </div>
      </div>
    </div>
  );
}
