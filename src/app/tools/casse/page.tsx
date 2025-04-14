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

type CaseTransformation =
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "titlecase"
  | "alternating"
  | "reverse";

export default function CaseConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [transformation, setTransformation] =
    useState<CaseTransformation>("uppercase");
  const [copied, setCopied] = useState(false);

  const transformText = React.useCallback(() => {
    if (!inputText) {
      setOutputText("");
      return;
    }

    let result = "";

    switch (transformation) {
      case "uppercase":
        result = inputText.toUpperCase();
        break;
      case "lowercase":
        result = inputText.toLowerCase();
        break;
      case "capitalize":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "titlecase":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => {
            const minorWords = [
              "a",
              "an",
              "the",
              "and",
              "but",
              "or",
              "for",
              "nor",
              "on",
              "at",
              "to",
              "from",
              "by",
              "in",
              "of",
            ];
            return minorWords.includes(word)
              ? word
              : word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ");
        if (result.length > 0) {
          result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        break;
      case "alternating":
        result = inputText
          .split("")
          .map((char, index) =>
            index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
          )
          .join("");
        break;
      case "reverse":
        result = inputText
          .split("")
          .map((char) => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          })
          .join("");
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
  }, [inputText, transformation]);

  useEffect(() => {
    transformText();
  }, [inputText, transformation, transformText]);

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
            <BreadcrumbLink href="/tools/case-converter">
              Convertisseur de casse
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Convertisseur de casse</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Convertissez facilement votre texte entre majuscules, minuscules, et
          plusieurs autres formats de casse.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="inputText" className="font-medium">
              Texte à convertir
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
            placeholder="Saisissez ou collez votre texte ici..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32 font-mono"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="transformation" className="block font-medium mb-2">
            Type de conversion
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              value={transformation}
              onValueChange={(value) =>
                setTransformation(value as CaseTransformation)
              }
            >
              <SelectTrigger id="transformation" className="w-full md:w-72">
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uppercase">MAJUSCULES</SelectItem>
                <SelectItem value="lowercase">minuscules</SelectItem>
                <SelectItem value="capitalize">
                  Première Lettre En Majuscule
                </SelectItem>
                <SelectItem value="titlecase">
                  Format Titre (Style Livre)
                </SelectItem>
                <SelectItem value="alternating">
                  AlTeRnAnCe MaJuScUlEs/MiNuScUlEs
                </SelectItem>
                <SelectItem value="reverse">iNVERSION dE cASSE</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
              Le texte est automatiquement converti lorsque vous tapez ou
              changez le format
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
            Quels sont les différents types de casse disponibles ?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>MAJUSCULES</strong> : Convertit tout le texte en
                majuscules.
              </li>
              <li>
                <strong>minuscules</strong> : Convertit tout le texte en
                minuscules.
              </li>
              <li>
                <strong>Première Lettre En Majuscule</strong> : Met en majuscule
                la première lettre de chaque mot.
              </li>
              <li>
                <strong>Format Titre</strong> : Similaire au précédent, mais
                respecte les conventions typographiques des titres (certains
                petits mots restent en minuscules).
              </li>
              <li>
                <strong>AlTeRnAnCe</strong> : Alterne entre majuscules et
                minuscules pour chaque caractère.
              </li>
              <li>
                <strong>iNVERSION</strong> : Inverse la casse de chaque
                caractère (les majuscules deviennent minuscules et vice versa).
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Quelle est la différence entre &quot;Première Lettre&quot; et
            &quot;Format Titre&quot; ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              La conversion <strong>Première Lettre En Majuscule</strong> met
              simplement en majuscule la première lettre de chaque mot, sans
              exception.
            </p>
            <p className="mt-2">
              Le <strong>Format Titre</strong> suit les conventions
              typographiques des titres en anglais/français, où certains petits
              mots comme &quot;a&quot;, &quot;the&quot;, &quot;and&quot;,
              &quot;de&quot;, &quot;et&quot;, etc. restent en minuscules (sauf
              s&apos;ils sont en début de phrase). Cette option est idéale pour
              formater correctement des titres de livres, d&apos;articles ou de
              films.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Est-ce que mes données sont sécurisées ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Tout le traitement des textes se fait directement dans
            votre navigateur. Vos données ne sont jamais envoyées à nos serveurs
            ni stockées, garantissant ainsi une confidentialité totale.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Y a-t-il une limite de taille pour le texte ?
          </AccordionTrigger>
          <AccordionContent>
            La limite dépend principalement de la mémoire disponible dans votre
            navigateur. Dans la plupart des cas, vous pouvez convertir des
            textes de plusieurs milliers de caractères sans problème. Pour des
            documents très volumineux, nous recommandons de les traiter par
            morceaux.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Traitement local</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Votre texte est converti directement dans votre navigateur pour
            garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Formats multiples</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Plusieurs options de conversion pour répondre à tous vos besoins de
            formatage de texte.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Simple et efficace</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Interface intuitive pour convertir votre texte en quelques clics,
            sans aucune inscription requise.
          </p>
        </div>
      </div>
    </div>
  );
}
