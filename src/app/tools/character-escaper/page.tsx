"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Copy, Check, ArrowDownUp } from "lucide-react";
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

type EscapeMode = "html" | "javascript" | "json" | "csv" | "url" | "xml";

export default function CharacterEscaper() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [escapeMode, setEscapeMode] = useState<EscapeMode>("html");
  const [copied, setCopied] = useState(false);

  const escapeText = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }

    let result = "";

    switch (escapeMode) {
      case "html":
        result = escapeHTML(inputText);
        break;
      case "javascript":
        result = escapeJavaScript(inputText);
        break;
      case "json":
        result = escapeJSON(inputText);
        break;
      case "csv":
        result = escapeCSV(inputText);
        break;
      case "url":
        result = encodeURIComponent(inputText);
        break;
      case "xml":
        result = escapeXML(inputText);
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
  };

  const escapeHTML = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const escapeJavaScript = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\b/g, "\\b")
      .replace(/\f/g, "\\f");
  };

  const escapeJSON = (text: string): string => {
    const escaped = JSON.stringify(text);
    return escaped.substring(1, escaped.length - 1);
  };

  const escapeCSV = (text: string): string => {
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  };

  const escapeXML = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  useEffect(() => {
    escapeText();
  }, [inputText, escapeMode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  const clearFields = () => {
    setInputText("");
    setOutputText("");
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
            <BreadcrumbLink href="/tools/character-escaper">
              Échappeur de caractères
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Échappeur de caractères spéciaux
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Échappez les caractères spéciaux pour différents langages de
          programmation et formats. Idéal pour préparer du texte à utiliser dans
          HTML, JavaScript, JSON, URL et plus.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="inputText" className="font-medium">
              Texte à échapper
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFields}
              className="text-gray-500"
            >
              Effacer
            </Button>
          </div>
          <Textarea
            id="inputText"
            placeholder="Saisissez ou collez votre texte contenant des caractères spéciaux..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32 font-mono"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="escapeMode" className="block font-medium mb-2">
            Format d&#39;échappement
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              value={escapeMode}
              onValueChange={(value) => setEscapeMode(value as EscapeMode)}
            >
              <SelectTrigger id="escapeMode" className="w-full md:w-72">
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
              Le texte est automatiquement échappé lorsque vous tapez ou changez
              le format
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="outline"
            onClick={swapTexts}
            className="w-full md:w-auto"
            disabled={!outputText}
          >
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Inverser l&#39;entrée et la sortie
          </Button>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="outputText" className="font-medium">
              Résultat
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!outputText}
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
          <Textarea
            id="outputText"
            readOnly
            value={outputText}
            className="min-h-32 font-mono bg-gray-50 dark:bg-gray-900"
            placeholder="Le texte échappé apparaîtra ici..."
          />
        </div>
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Qu&#39;est-ce que l&#39;échappement de caractères ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              L&#39;échappement de caractères est le processus qui consiste à
              ajouter des marqueurs spéciaux (séquences d&#39;échappement) à
              certains caractères pour qu&#39;ils soient interprétés
              correctement dans un contexte particulier.
            </p>
            <p className="mt-2">
              Par exemple, en HTML, le caractère &quot; &lt; &quot; est
              interprété comme le début d&#39;une balise. Si vous voulez
              afficher &quot; &lt; &quot; comme texte, vous devez l&#39;échapper
              en &quot; & l t ; &quot;.
            </p>
            <p className="mt-2">
              L&#39;échappement est essentiel pour éviter les erreurs de syntaxe
              et les failles de sécurité comme les injections XSS ou SQL.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Quels sont les différents formats d&#39;échappement disponibles ?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>HTML</strong> : Échappe les caractères spéciaux pour une
                utilisation dans du code HTML (&lt;, &gt;, &amp;, &quot;,
                &#39;).
              </li>
              <li>
                <strong>JavaScript</strong> : Échappe les caractères spéciaux
                pour les chaînes de caractères JavaScript (\, &#39;, &quot;, \n,
                \r, \t, etc.).
              </li>
              <li>
                <strong>JSON</strong> : Échappe les caractères pour une
                utilisation dans des chaînes JSON.
              </li>
              <li>
                <strong>CSV</strong> : Formate le texte pour une utilisation
                dans des fichiers CSV (mise entre guillemets et doublement des
                guillemets internes).
              </li>
              <li>
                <strong>URL</strong> : Encode les caractères pour une
                utilisation dans des URL (espaces, caractères accentués,
                symboles).
              </li>
              <li>
                <strong>XML</strong> : Échappe les caractères spéciaux pour une
                utilisation dans des documents XML.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Quand dois-je utiliser l&#39;échappement de caractères ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Vous devriez utiliser l&#39;échappement de caractères dans les
              situations suivantes :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Lorsque vous intégrez du contenu dynamique dans du HTML (pour
                éviter les injections XSS)
              </li>
              <li>
                Lorsque vous créez des chaînes de caractères dans du code
                JavaScript ou JSON
              </li>
              <li>
                Lorsque vous construisez des URL avec des paramètres contenant
                des caractères spéciaux
              </li>
              <li>
                Lorsque vous manipulez des données destinées à être utilisées
                dans des fichiers CSV
              </li>
              <li>Lorsque vous générez du contenu XML</li>
              <li>
                Lorsque vous travaillez avec des bases de données (pour éviter
                les injections SQL)
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Mes données sont-elles sécurisées avec cet outil ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Tout le traitement des textes se fait directement dans
            votre navigateur. Vos données ne sont jamais envoyées à nos serveurs
            ni stockées, garantissant ainsi une confidentialité totale. Cette
            approche vous permet d&#39;échapper en toute sécurité même des
            informations sensibles.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Exemples d&#39;utilisation</h2>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">JavaScript</h3>
          <p className="text-sm mb-2">Entrée :</p>
          <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mb-3 font-mono">
            Elle a dit: &quot;C&#39;est super!&quot;
          </code>
          <p className="text-sm mb-2">Sortie :</p>
          <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
            Elle a dit: \&quot;C\&#39;est super!\&quot;
          </code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Traitement local</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Votre texte est transformé directement dans votre navigateur pour
            garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Formats multiples</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Plusieurs options d&#39;échappement pour différents langages et
            formats.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Outil pour développeurs</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Idéal pour préparer du texte à intégrer dans du code ou des fichiers
            de données.
          </p>
        </div>
      </div>
    </div>
  );
}
