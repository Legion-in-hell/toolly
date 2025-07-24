"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Copy,
  Check,
  ArrowDownUp,
  AlertCircle,
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

type JsonFormatting = "format" | "minify" | "validate";

export default function JsonFormatter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [formatting, setFormatting] = useState<JsonFormatting>("format");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const formatJson = React.useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      setError("");
      setIsValid(false);
      return;
    }

    try {
      // Parse le JSON pour vérifier sa validité
      const parsed = JSON.parse(inputText);
      setIsValid(true);
      setError("");

      let result = "";

      switch (formatting) {
        case "format":
          result = JSON.stringify(parsed, null, 2);
          break;
        case "minify":
          result = JSON.stringify(parsed);
          break;
        case "validate":
          result = "✅ JSON valide";
          break;
        default:
          result = inputText;
      }

      setOutputText(result);
    } catch (err) {
      setIsValid(false);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(`❌ JSON invalide: ${errorMessage}`);

      if (formatting === "validate") {
        setOutputText(`❌ JSON invalide: ${errorMessage}`);
      } else {
        setOutputText("");
      }
    }
  }, [inputText, formatting]);

  useEffect(() => {
    formatJson();
  }, [inputText, formatting, formatJson]);

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
    setError("");
    setIsValid(false);
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
            <BreadcrumbLink href="/tools/json-formatter">
              Formatteur JSON
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Formatteur JSON</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Formatez, minifiez et validez vos données JSON facilement. Outil
          gratuit pour développeurs et intégrateurs.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="inputText" className="font-medium">
              JSON à traiter
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
            placeholder='Saisissez ou collez votre JSON ici... Ex: {"nom": "Jean", "age": 30}'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32 font-mono"
          />
          {error && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          {isValid && inputText.trim() && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center text-green-700 dark:text-green-300">
                <Check className="h-4 w-4 mr-2" />
                <span className="text-sm">JSON valide</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="formatting" className="block font-medium mb-2">
            Type de formatage
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              value={formatting}
              onValueChange={(value) => setFormatting(value as JsonFormatting)}
            >
              <SelectTrigger id="formatting" className="w-full md:w-72">
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="format">Formater (Pretty Print)</SelectItem>
                <SelectItem value="minify">Minifier (Compact)</SelectItem>
                <SelectItem value="validate">Valider uniquement</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
              Le JSON est automatiquement traité lorsque vous tapez ou changez
              le format
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="outline"
            onClick={swapTexts}
            className="w-full md:w-auto"
            disabled={!outputText || formatting === "validate"}
          >
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Inverser l&apos;entrée et la sortie
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
            placeholder="Le résultat apparaîtra ici..."
          />
        </div>
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Quels sont les différents types de formatage disponibles ?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Formater (Pretty Print)</strong> : Indente et structure
                le JSON pour le rendre plus lisible avec des retours à la ligne
                et des espaces.
              </li>
              <li>
                <strong>Minifier (Compact)</strong> : Supprime tous les espaces
                et retours à la ligne inutiles pour réduire la taille du
                fichier.
              </li>
              <li>
                <strong>Valider uniquement</strong> : Vérifie simplement si le
                JSON est syntaxiquement correct sans le modifier.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Qu&apos;est-ce que le JSON et pourquoi le formater ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              JSON (JavaScript Object Notation) est un format d&apos;échange de
              données léger et facile à lire. Il est largement utilisé dans les
              APIs web et les applications.
            </p>
            <p className="mt-2">
              <strong>Formater le JSON</strong> améliore sa lisibilité en
              ajoutant des indentations et des retours à la ligne, ce qui
              facilite le débogage et la compréhension des données.
            </p>
            <p className="mt-2">
              <strong>Minifier le JSON</strong> réduit sa taille en supprimant
              les espaces inutiles, ce qui est idéal pour optimiser les
              transferts réseau en production.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Est-ce que mes données sont sécurisées ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Tout le traitement du JSON se fait directement dans
            votre navigateur. Vos données ne sont jamais envoyées à nos serveurs
            ni stockées, garantissant ainsi une confidentialité totale de vos
            informations sensibles.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Comment corriger les erreurs JSON communes ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Les erreurs JSON les plus fréquentes incluent :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Virgules manquantes</strong> : Assurez-vous de séparer
                les propriétés par des virgules
              </li>
              <li>
                <strong>Guillemets manquants</strong> : Les clés et valeurs
                texte doivent être entre guillemets doubles (&quot;)
              </li>
              <li>
                <strong>Virgule finale</strong> : Évitez les virgules après le
                dernier élément d&apos;un objet ou tableau
              </li>
              <li>
                <strong>Accolades/crochets mal fermés</strong> : Vérifiez que
                chaque {} et [ ] est correctement fermé
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            Y a-t-il une limite de taille pour le JSON ?
          </AccordionTrigger>
          <AccordionContent>
            La limite dépend principalement de la mémoire disponible dans votre
            navigateur. Dans la plupart des cas, vous pouvez traiter des
            fichiers JSON de plusieurs mégaoctets sans problème. Pour des
            fichiers très volumineux, nous recommandons de les traiter par
            sections plus petites.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Traitement local</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Vos données JSON sont traitées directement dans votre navigateur
            pour garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Validation en temps réel</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Détection automatique des erreurs de syntaxe avec messages
            d&apos;erreur détaillés pour vous aider.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Formats multiples</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Formatage, minification et validation pour tous vos besoins de
            développement et d&apos;intégration.
          </p>
        </div>
      </div>
    </div>
  );
}
