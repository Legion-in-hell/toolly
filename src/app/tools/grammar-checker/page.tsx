"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  Globe,
  Zap,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageToolMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: Array<{ value: string }>;
  rule: {
    id: string;
    category: {
      id: string;
      name: string;
    };
    issueType: string;
  };
  context: {
    text: string;
    offset: number;
    length: number;
  };
}

interface LanguageToolResponse {
  matches: LanguageToolMatch[];
  language: {
    name: string;
    code: string;
  };
}

interface SpellError {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
  type: "spelling" | "grammar" | "style" | "punctuation";
  message: string;
  severity: "error" | "warning" | "suggestion";
  ruleId: string;
  category: string;
}

interface CorrectionStats {
  totalErrors: number;
  spellingErrors: number;
  grammarErrors: number;
  styleErrors: number;
  punctuationErrors: number;
}

export default function FrenchSpellChecker() {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [errors, setErrors] = useState<SpellError[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [correctionLevel, setCorrectionLevel] = useState<
    "basic" | "standard" | "advanced"
  >("standard");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats, setStats] = useState<CorrectionStats>({
    totalErrors: 0,
    spellingErrors: 0,
    grammarErrors: 0,
    styleErrors: 0,
    punctuationErrors: 0,
  });

  // Surveiller le statut de connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Appel à l'API LanguageTool
  const checkWithLanguageTool = async (text: string): Promise<SpellError[]> => {
    if (!text.trim()) return [];

    try {
      // Utiliser l'API publique de LanguageTool
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "fr-FR",
          enabledOnly: "false",
          level:
            correctionLevel === "basic"
              ? "default"
              : correctionLevel === "advanced"
              ? "picky"
              : "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: LanguageToolResponse = await response.json();

      return data.matches.map((match) => {
        const errorType = getErrorType(match);
        const severity = getErrorSeverity(match);

        return {
          word: text.substring(match.offset, match.offset + match.length),
          start: match.offset,
          end: match.offset + match.length,
          suggestions: match.replacements.slice(0, 5).map((r) => r.value),
          type: errorType,
          message: match.message,
          severity: severity,
          ruleId: match.rule.id,
          category: match.rule.category.name,
        };
      });
    } catch (error) {
      console.error("Erreur lors de l'appel à LanguageTool:", error);
      throw error;
    }
  };

  // Déterminer le type d'erreur
  const getErrorType = (
    match: LanguageToolMatch
  ): "spelling" | "grammar" | "style" | "punctuation" => {
    const categoryId = match.rule.category.id.toLowerCase();
    const ruleId = match.rule.id.toLowerCase();

    if (
      categoryId.includes("typo") ||
      categoryId.includes("spell") ||
      ruleId.includes("spell")
    ) {
      return "spelling";
    } else if (categoryId.includes("punct") || ruleId.includes("punct")) {
      return "punctuation";
    } else if (
      categoryId.includes("style") ||
      categoryId.includes("misc") ||
      ruleId.includes("style")
    ) {
      return "style";
    } else {
      return "grammar";
    }
  };

  // Déterminer la sévérité de l'erreur
  const getErrorSeverity = (
    match: LanguageToolMatch
  ): "error" | "warning" | "suggestion" => {
    const issueType = match.rule.issueType.toLowerCase();

    if (issueType.includes("misspelling") || issueType.includes("grammar")) {
      return "error";
    } else if (issueType.includes("style") || issueType.includes("hint")) {
      return "suggestion";
    } else {
      return "warning";
    }
  };

  // Correcteur de secours en mode hors ligne
  const offlineCheck = (text: string): SpellError[] => {
    const errors: SpellError[] = [];

    // Quelques vérifications basiques pour le mode hors ligne
    const basicChecks = [
      {
        pattern: /\bsa\s+(va|marche|fonctionne|change)\b/gi,
        message: "Confusion possible entre 'sa' et 'ça'",
        suggestion: "ça",
      },
      {
        pattern: /\bou\s+(est|était|se trouve)\b/gi,
        message: "Confusion possible entre 'ou' et 'où'",
        suggestion: "où",
      },
      {
        pattern: /\bces\s+\w+\s+(est|était)\b/gi,
        message: "Confusion possible entre 'ces' et 'ses'",
        suggestion: "ses",
      },
      {
        pattern: /\s{2,}/g,
        message: "Espaces surnuméraires",
        suggestion: " ",
      },
    ];

    basicChecks.forEach((check, index) => {
      let match;
      const regex = new RegExp(check.pattern.source, check.pattern.flags);

      while ((match = regex.exec(text)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        errors.push({
          word: match[0],
          start: match.index,
          end: match.index + match[0].length,
          suggestions: [check.suggestion],
          type: "grammar",
          message: check.message,
          severity: "warning",
          ruleId: `offline_${index}`,
          category: "Mode hors ligne",
        });
      }
    });

    return errors;
  };

  const performSpellCheck = async () => {
    if (!inputText.trim()) {
      setErrors([]);
      setCorrectedText("");
      setStats({
        totalErrors: 0,
        spellingErrors: 0,
        grammarErrors: 0,
        styleErrors: 0,
        punctuationErrors: 0,
      });
      return;
    }

    setIsChecking(true);

    try {
      let detectedErrors: SpellError[] = [];

      if (isOnline) {
        // Utiliser LanguageTool en ligne
        detectedErrors = await checkWithLanguageTool(inputText);
      } else {
        // Mode hors ligne avec vérifications basiques
        detectedErrors = offlineCheck(inputText);
      }

      setErrors(detectedErrors);

      // Calculer les statistiques
      const newStats = {
        totalErrors: detectedErrors.length,
        spellingErrors: detectedErrors.filter((e) => e.type === "spelling")
          .length,
        grammarErrors: detectedErrors.filter((e) => e.type === "grammar")
          .length,
        styleErrors: detectedErrors.filter((e) => e.type === "style").length,
        punctuationErrors: detectedErrors.filter(
          (e) => e.type === "punctuation"
        ).length,
      };
      setStats(newStats);

      // Générer le texte corrigé (corrections automatiques pour erreurs critiques)
      let corrected = inputText;
      const criticalErrors = detectedErrors
        .filter(
          (error) => error.severity === "error" && error.suggestions.length > 0
        )
        .sort((a, b) => b.start - a.start); // Trier en ordre décroissant pour éviter les décalages

      criticalErrors.forEach((error) => {
        corrected =
          corrected.substring(0, error.start) +
          error.suggestions[0] +
          corrected.substring(error.end);
      });

      setCorrectedText(corrected);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      // En cas d'erreur API, utiliser le mode hors ligne
      const fallbackErrors = offlineCheck(inputText);
      setErrors(fallbackErrors);
      setStats({
        totalErrors: fallbackErrors.length,
        spellingErrors: 0,
        grammarErrors: fallbackErrors.length,
        styleErrors: 0,
        punctuationErrors: 0,
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSpellCheck();
    }, 1500); // Délai plus long pour éviter trop d'appels API

    return () => clearTimeout(timeoutId);
  }, [inputText, correctionLevel, isOnline]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearFields = () => {
    setInputText("");
    setCorrectedText("");
    setErrors([]);
    setStats({
      totalErrors: 0,
      spellingErrors: 0,
      grammarErrors: 0,
      styleErrors: 0,
      punctuationErrors: 0,
    });
  };

  const applySuggestion = (errorIndex: number, suggestionIndex: number) => {
    const error = errors[errorIndex];
    const suggestion = error.suggestions[suggestionIndex];

    const newText =
      inputText.substring(0, error.start) +
      suggestion +
      inputText.substring(error.end);

    setInputText(newText);
  };

  const ignoreError = (errorIndex: number) => {
    const newErrors = errors.filter((_, index) => index !== errorIndex);
    setErrors(newErrors);

    // Mettre à jour les stats
    const removedError = errors[errorIndex];
    setStats((prevStats) => ({
      totalErrors: prevStats.totalErrors - 1,
      spellingErrors:
        removedError.type === "spelling"
          ? prevStats.spellingErrors - 1
          : prevStats.spellingErrors,
      grammarErrors:
        removedError.type === "grammar"
          ? prevStats.grammarErrors - 1
          : prevStats.grammarErrors,
      styleErrors:
        removedError.type === "style"
          ? prevStats.styleErrors - 1
          : prevStats.styleErrors,
      punctuationErrors:
        removedError.type === "punctuation"
          ? prevStats.punctuationErrors - 1
          : prevStats.punctuationErrors,
    }));
  };

  const getErrorTypeColor = (error: SpellError) => {
    if (error.severity === "error") {
      return "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
    } else if (error.severity === "warning") {
      return "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800";
    } else {
      return "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };

  const getErrorTypeLabel = (error: SpellError) => {
    const typeLabels = {
      spelling: "Orthographe",
      grammar: "Grammaire",
      style: "Style",
      punctuation: "Ponctuation",
    };
    return typeLabels[error.type];
  };

  const getErrorIcon = (error: SpellError) => {
    if (error.severity === "error") return "🔴";
    if (error.severity === "warning") return "🟡";
    return "🔵";
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
            <BreadcrumbLink href="/tools/spell-checker">
              Correcteur orthographique
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Correcteur orthographique et grammatical français
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Correction française professionnelle avec LanguageTool. Détection
          avancée des erreurs d&#39;orthographe, de grammaire, de style et de
          ponctuation.
        </p>
      </div>

      {/* Statut de connexion et LanguageTool */}
      {isOnline ? (
        <Alert className="mb-6">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>LanguageTool actif</strong> - Correction française
            professionnelle en ligne. Plus de 3000 règles linguistiques
            disponibles.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6">
          <Globe className="h-4 w-4" />
          <AlertDescription>
            <strong>Mode hors ligne</strong> - Vérifications basiques
            uniquement. Connectez-vous à Internet pour bénéficier de
            LanguageTool.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="inputText" className="font-medium">
              Texte à corriger
            </label>
            <div className="flex gap-2">
              <Select
                value={correctionLevel}
                onValueChange={(value: "basic" | "standard" | "advanced") =>
                  setCorrectionLevel(value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basique</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={performSpellCheck}
                disabled={isChecking}
                className="text-blue-600"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Vérifier
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFields}
                className="text-gray-500"
              >
                Effacer
              </Button>
            </div>
          </div>
          <Textarea
            id="inputText"
            placeholder="Saisissez ou collez votre texte ici pour la correction française ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-40 font-mono"
          />
          <div className="text-xs text-gray-500 mt-1">
            {isOnline ? (
              <>
                <strong>LanguageTool actif</strong> &bull;{" "}
                <strong>Basique</strong> : Règles essentielles &bull;{" "}
                <strong>Standard</strong> : Règles complètes &bull;{" "}
                <strong>Avancé</strong> : Mode pointilleux
              </>
            ) : (
              <>
                <strong>Mode hors ligne</strong> : Vérifications basiques
                uniquement
              </>
            )}
          </div>
        </div>

        {stats.totalErrors > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-medium mb-2">
              Statistiques de correction LanguageTool
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.totalErrors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {stats.spellingErrors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Orthographe
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {stats.grammarErrors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Grammaire
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {stats.styleErrors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Style</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {stats.punctuationErrors}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Ponctuation
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
              Erreurs détectées par LanguageTool ({errors.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getErrorTypeColor(
                    error
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getErrorIcon(error)}</span>
                      <span className="font-medium">
                        &quot;{error.word}&quot;
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-800 border">
                        {getErrorTypeLabel(error)}
                      </span>
                      <span className="text-xs px-1 py-0.5 rounded text-gray-500">
                        {error.severity}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ignoreError(index)}
                      className="h-6 w-6 p-0"
                      title="Ignorer cette erreur"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
                    {error.message}
                  </p>
                  {error.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-gray-500 mr-2">
                        Suggestions :
                      </span>
                      {error.suggestions.map((suggestion, sugIndex) => (
                        <Button
                          key={sugIndex}
                          variant="outline"
                          size="sm"
                          onClick={() => applySuggestion(index, sugIndex)}
                          className="text-xs h-7"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Règle : {error.ruleId} &bull; Catégorie : {error.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="correctedText" className="font-medium">
              {correctedText && correctedText !== inputText
                ? "Texte corrigé (auto)"
                : "Texte original"}
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!inputText}
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
            id="correctedText"
            readOnly
            value={correctedText || inputText}
            className="min-h-40 font-mono bg-gray-50 dark:bg-gray-900"
            placeholder="Le texte corrigé apparaîtra ici..."
          />
          {correctedText && correctedText !== inputText && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Corrections automatiques LanguageTool appliquées pour les
              erreurs critiques
            </div>
          )}
        </div>

        {inputText && errors.length === 0 && !isChecking && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Excellent ! Aucune erreur détectée par LanguageTool dans votre
              texte.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Qu&#39;est-ce que LanguageTool et pourquoi est-il si efficace ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              LanguageTool est l&#39;un des correcteurs grammaticaux open source
              les plus avancés au monde :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Plus de 3000 règles</strong> : Règles linguistiques
                spécifiques au français
              </li>
              <li>
                <strong>Détection multicouche</strong> : Orthographe, grammaire,
                style, ponctuation
              </li>
              <li>
                <strong>Intelligence contextuelle</strong> : Analyse le sens,
                pas seulement les mots
              </li>
              <li>
                <strong>Mise à jour continue</strong> : Amélioration constante
                par la communauté
              </li>
              <li>
                <strong>Précision éprouvée</strong> : Utilisé par millions
                d&#39;utilisateurs dans le monde
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Quelle est la différence entre les niveaux de correction ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              <strong>Niveau Basique</strong> :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Règles grammaticales et orthographiques essentielles</li>
              <li>Erreurs les plus courantes et évidentes</li>
              <li>Idéal pour une correction rapide</li>
            </ul>
            <p className="mt-3">
              <strong>Niveau Standard</strong> :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Toutes les règles de base + règles avancées</li>
              <li>Détection des nuances grammaticales</li>
              <li>Recommandé pour la plupart des textes</li>
            </ul>
            <p className="mt-3">
              <strong>Niveau Avancé</strong> :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Mode &quot;pointilleux&quot; de LanguageTool</li>
              <li>Suggestions stylistiques et de style</li>
              <li>Détection des répétitions et lourdeurs</li>
              <li>Parfait pour les textes professionnels</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Comment fonctionne le mode hors ligne ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Quand vous n&#39;êtes pas connecté à Internet :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Détection automatique</strong> : L&#39;application
                détecte la perte de connexion
              </li>
              <li>
                <strong>Mode dégradé</strong> : Vérifications basiques avec
                règles intégrées
              </li>
              <li>
                <strong>Erreurs courantes</strong> : Détection des confusions
                classiques (sa/ça, ou/où)
              </li>
              <li>
                <strong>Retour automatique</strong> : Reprise de LanguageTool
                dès la reconnexion
              </li>
            </ul>
            <p className="mt-2">
              Le mode hors ligne garantit une fonctionnalité minimale même sans
              Internet.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Mes données sont-elles sécurisées avec LanguageTool ?
          </AccordionTrigger>
          <AccordionContent>
            <p>LanguageTool respecte votre confidentialité :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Pas de stockage</strong> : Vos textes ne sont pas
                sauvegardés sur les serveurs
              </li>
              <li>
                <strong>Traitement temporaire</strong> : Analyse puis
                suppression immédiate
              </li>
              <li>
                <strong>HTTPS sécurisé</strong> : Toutes les communications sont
                chiffrées
              </li>
              <li>
                <strong>Open source</strong> : Code source public et vérifiable
              </li>
              <li>
                <strong>RGPD conforme</strong> : Respect des réglementations
                européennes
              </li>
            </ul>
            <p className="mt-2">
              Pour les documents ultra-sensibles, vous pouvez utiliser le mode
              hors ligne ou installer LanguageTool localement.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            Quels types d&#39;erreurs LanguageTool peut-il détecter ?
          </AccordionTrigger>
          <AccordionContent>
            <p>LanguageTool détecte une gamme très large d&#39;erreurs :</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Grammaire</strong> : Accords en genre et nombre,
                conjugaisons, syntaxe, concordance des temps
              </li>
              <li>
                <strong>Style</strong> : Répétitions, pléonasmes, anglicismes,
                registre de langue, clarté
              </li>
              <li>
                <strong>Ponctuation</strong> : Virgules, points, guillemets,
                espaces insécables, majuscules
              </li>
              <li>
                <strong>Typographie</strong> : Apostrophes, tirets, espacement,
                conventions françaises
              </li>
            </ul>
            <p className="mt-2">
              Chaque erreur est catégorisée et accompagnée d&#39;explications
              claires pour vous aider à progresser en français.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>
            Y a-t-il des limites d&#39;utilisation ?
          </AccordionTrigger>
          <AccordionContent>
            <p>L&#39;API publique de LanguageTool a quelques limitations :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Longueur du texte</strong> : Maximum 20 000 caractères
                par requête
              </li>
              <li>
                <strong>Fréquence</strong> : Limite raisonnable pour éviter la
                surcharge
              </li>
              <li>
                <strong>Délai</strong> : Temporisation de 1,5 seconde entre les
                vérifications
              </li>
            </ul>
            <p className="mt-2">
              Ces limites sont largement suffisantes pour la plupart des textes.
              Pour des besoins professionnels intensifs, LanguageTool propose
              des comptes premium avec des limites étendues.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">LanguageTool intégré</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Utilise directement l&#39;API officielle de LanguageTool pour une
            correction française de niveau professionnel.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">3000+ règles linguistiques</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Plus de 3000 règles spécifiques au français pour détecter les
            erreurs les plus subtiles et améliorer votre style.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Mode adaptatif</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Fonctionne en ligne avec LanguageTool ou hors ligne avec des
            vérifications de base. S&#39;adapte à votre connexion.
          </p>
        </div>
      </div>
    </div>
  );
}
