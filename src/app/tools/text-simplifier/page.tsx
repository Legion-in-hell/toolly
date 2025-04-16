"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function TextSimplifier() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [simplifyLevel, setSimplifyLevel] = useState([5]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null);
  const [targetAudience, setTargetAudience] = useState("general");
  const [removeTechnicalTerms, setRemoveTechnicalTerms] = useState(true);
  const [shortenSentences, setShortenSentences] = useState(true);
  const [history, setHistory] = useState<
    Array<{ id: string; original: string; simplified: string; date: string }>
  >([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("textSimplifierHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Erreur lors du chargement de l&apos;historique:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("textSimplifierHistory", JSON.stringify(history));
    }
  }, [history]);

  const simplifyText = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      let simplified = inputText;

      const complexWords: Record<string, string> = {
        utiliser: "se servir de",
        cependant: "mais",
        néanmoins: "toutefois",
        approximativement: "environ",
        suffisant: "assez",
        initier: "commencer",
        obtenir: "avoir",
        acquérir: "acheter",
        concept: "idée",
        conceptualiser: "imaginer",
        considérer: "penser à",
        démontrer: "montrer",
        "mettre en œuvre": "faire",
        concernant: "sur",
        "relatif à": "sur",
        "fonction de": "selon",
        "malgré le fait que": "bien que",
        "en dépit du fait que": "même si",
        "en raison de": "à cause de",
        subséquemment: "ensuite",
        antérieurement: "avant",
        ultérieurement: "plus tard",
        présentement: "maintenant",
        actuellement: "maintenant",
        additionnel: "supplémentaire",
        optimal: "meilleur",
        finaliser: "finir",
        "procéder à": "faire",
        élaborer: "faire",
        effectuer: "faire",
        assistance: "aide",
        optimiser: "améliorer",
        potentiellement: "peut-être",
        interagir: "parler",
        communiquer: "parler",
        terminologie: "mot",
        possibilité: "chance",
        complexité: "difficulté",
        individualité: "personne",
        virtualisation: "simulation",
        fonctionnalité: "fonction",
        implémentation: "mise en place",
        ultimement: "enfin",
        optimalement: "au mieux",
        problématique: "problème",
        thématique: "thème",
        authentification: "vérification",
        visualisation: "affichage",
        configuration: "réglage",
        interface: "écran",
        paramètre: "réglage",
        intégrer: "ajouter",
        sélectionner: "choisir",
        élément: "partie",
        composant: "partie",
        spécifier: "dire",
        générer: "créer",
        représentation: "image",
      };

      // Remplacer les mots complexes par des mots simples
      if (simplifyLevel[0] >= 3) {
        Object.entries(complexWords).forEach(([complex, simple]) => {
          const regex = new RegExp(`\\b${complex}\\b`, "gi");
          simplified = simplified.replace(regex, simple);
        });
      }

      // Raccourcir les phrases si l'option est activée
      if (shortenSentences) {
        // Diviser en phrases
        const sentences = simplified.split(/(?<=[.!?])\s+/);
        simplified = sentences
          .map((sentence) => {
            // Supprimer les parties entre parenthèses
            if (simplifyLevel[0] >= 4) {
              sentence = sentence.replace(/\s*\([^)]*\)\s*/g, " ");
            }

            // Supprimer les expressions vides et redondantes
            if (simplifyLevel[0] >= 3) {
              const fillers = [
                "en fait",
                "effectivement",
                "en réalité",
                "à vrai dire",
                "pour ainsi dire",
                "en quelque sorte",
                "dans une certaine mesure",
                "certainement",
                "nécessairement",
                "manifestement",
                "évidemment",
              ];

              fillers.forEach((filler) => {
                const regex = new RegExp(`\\b${filler}\\b,?\\s*`, "gi");
                sentence = sentence.replace(regex, "");
              });
            }

            return sentence;
          })
          .join(" ");
      }

      // Adapter au public cible
      if (targetAudience === "children") {
        // Simplifier davantage pour les enfants
        simplified = simplified.replace(/\b\w{10,}\b/g, () => {
          // Remplacer les mots longs (10+ caractères)
          return "[mot simplifié]";
        });
      } else if (targetAudience === "technical") {
        // Moins de simplification pour un public technique
        // Conserver certains termes techniques
      }

      // Supprimer les termes techniques si l'option est activée
      if (removeTechnicalTerms && simplifyLevel[0] >= 4) {
        const technicalTerms = [
          "algorithme",
          "protocole",
          "infrastructure",
          "paradigme",
          "méthodologie",
          "taxonomie",
          "ontologie",
          "épistémologie",
          "herméneutique",
          "axiomatique",
          "heuristique",
          "syllogisme",
          "apophatique",
          "synchronicité",
          "synergistique",
          "holographique",
          "quantique",
          "relativiste",
          "stochastique",
          "fractal",
        ];

        technicalTerms.forEach((term) => {
          const regex = new RegExp(`\\b${term}s?\\b`, "gi");
          simplified = simplified.replace(regex, "[terme simplifié]");
        });
      }

      // Calculer un score de lisibilité simplifié (pour démonstration)
      const words = simplified.split(/\s+/).filter((word) => word.length > 0);
      const sentences = simplified
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const avgWordsPerSentence = words.length / (sentences.length || 1);
      const longWords = words.filter((word) => word.length > 6).length;
      const longWordsPercentage = (longWords / words.length) * 100;

      // Formule simplifiée basée sur Flesch-Kincaid
      const readability =
        100 - (0.39 * avgWordsPerSentence + 11.8 * (longWordsPercentage / 100));
      setReadabilityScore(Math.round(readability));

      // Ajuster le niveau de simplicité
      if (simplifyLevel[0] >= 7) {
        // Simplification extrême: phrases très courtes
        simplified = simplified.replace(/,\s[^.!?]+[,.]\s/g, ". ");
      }

      setOutputText(simplified);

      // Ajouter à l'historique
      const newHistoryItem = {
        id: Date.now().toString(),
        original: inputText,
        simplified: simplified,
        date: new Date().toISOString(),
      };
      setHistory([newHistoryItem, ...history.slice(0, 9)]);

      setIsProcessing(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const loadFromHistory = (item: { original: string; simplified: string }) => {
    setInputText(item.original);
    setOutputText(item.simplified);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("textSimplifierHistory");
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
            <BreadcrumbLink href="/tools/text-simplifier">
              Simplificateur de texte
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Simplificateur de texte</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transformez un texte complexe en langage simple et accessible. Idéal
          pour les documents pédagogiques, la vulgarisation scientifique ou la
          communication claire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6 border-2">
            <div className="mb-6">
              <Label htmlFor="input-text" className="block font-medium mb-2">
                Texte original
              </Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Collez votre texte complexe ici..."
                className="min-h-40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label
                  htmlFor="simplify-level"
                  className="block font-medium mb-2"
                >
                  Niveau de simplification
                </Label>
                <div className="flex items-center gap-4 mt-1">
                  <Slider
                    id="simplify-level"
                    min={1}
                    max={10}
                    step={1}
                    value={simplifyLevel}
                    onValueChange={setSimplifyLevel}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8 text-right">
                    {simplifyLevel[0]}/10
                  </span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="target-audience"
                  className="block font-medium mb-2"
                >
                  Public cible
                </Label>
                <Select
                  value={targetAudience}
                  onValueChange={setTargetAudience}
                >
                  <SelectTrigger id="target-audience">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Grand public</SelectItem>
                    <SelectItem value="children">Enfants</SelectItem>
                    <SelectItem value="technical">Public technique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-technical"
                  checked={removeTechnicalTerms}
                  onCheckedChange={setRemoveTechnicalTerms}
                />
                <Label htmlFor="remove-technical">
                  Remplacer les termes techniques
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="shorten-sentences"
                  checked={shortenSentences}
                  onCheckedChange={setShortenSentences}
                />
                <Label htmlFor="shorten-sentences">
                  Raccourcir les phrases
                </Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={simplifyText}
                disabled={isProcessing || !inputText.trim()}
                className="w-full sm:w-auto"
              >
                {isProcessing
                  ? "Simplification en cours..."
                  : "Simplifier le texte"}
              </Button>
            </div>

            {outputText && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="output-text" className="font-medium">
                    Texte simplifié
                  </Label>
                  {readabilityScore !== null && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Score de lisibilité: {readabilityScore}/100
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Textarea
                    id="output-text"
                    value={outputText}
                    readOnly
                    className="min-h-40"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border-2">
            <h2 className="text-xl font-bold mb-4">Historique récent</h2>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <p className="text-sm font-medium truncate">
                      {item.original.substring(0, 50)}
                      {item.original.length > 50 ? "..." : ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="w-full mt-4"
                >
                  Effacer l&apos;historique
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucun texte simplifié récent
              </p>
            )}
          </Card>

          <Card className="p-6 border-2 mt-6">
            <h2 className="text-xl font-bold mb-4">
              Conseils d&apos;utilisation
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <p>
                  Utilisez un niveau de simplification plus élevé pour un
                  langage très accessible.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <p>
                  L&apos;option &quot;Enfants&quot; remplace les mots longs et
                  complexes.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <p>
                  Activez &quot;Remplacer les termes techniques&quot; pour un
                  public non-spécialiste.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <p>
                  Pour conserver plus de nuances, baissez le niveau de
                  simplification.
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
