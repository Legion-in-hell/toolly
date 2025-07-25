"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronDown,
  FileText,
  Image,
  Shield,
  Type,
  Table,
  QrCode,
  CheckCircle,
  Code,
  CaseSensitive,
  Key,
  Clock,
  Calculator,
  Braces,
  Globe,
  DollarSign,
  Link as LinkIcon,
  Quote,
  GitMerge,
  GitCompare,
  Headphones,
  Music,
  UserX,
  Hash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "Tous les outils" },
  { id: "conversion", name: "Conversion" },
  { id: "compression", name: "Compression" },
  { id: "extraction", name: "Extraction" },
  { id: "privacy", name: "Confidentialité" },
  { id: "text", name: "Texte" },
  { id: "misc", name: "Divers" },
];

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  popular: boolean;
  comingSoon: boolean;
  demo: boolean;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tools: Tool[] = [
  {
    id: "pdf-to-word",
    name: "PDF vers Word",
    description: "Convertissez vos fichiers PDF en documents Word éditables",
    category: "conversion",
    popular: true,
    comingSoon: false,
    demo: true,
    path: "/tools/pdf-to-word",
    icon: FileText,
  },
  {
    id: "image-compressor",
    name: "Compresseur d'images",
    description:
      "Réduisez la taille de vos images sans perte visible de qualité",
    category: "compression",
    popular: true,
    comingSoon: false,
    demo: false,
    path: "/tools/image-compressor",
    icon: Image,
  },
  {
    id: "metadata-cleaner",
    name: "Nettoyeur de métadonnées",
    description:
      "Supprimez les informations personnelles cachées dans vos fichiers",
    category: "privacy",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/metadata-cleaner",
    icon: Shield,
  },
  {
    id: "text-simplifier",
    name: "Simplificateur de texte",
    description: "Transformez un texte complexe en langage accessible",
    category: "text",
    popular: false,
    comingSoon: false,
    demo: true,
    path: "/tools/text-simplifier",
    icon: Type,
  },
  {
    id: "table-extractor",
    name: "Extracteur de tableaux",
    description: "Extrayez des tableaux depuis des PDFs ou des images",
    category: "extraction",
    popular: true,
    comingSoon: false,
    demo: true,
    path: "/tools/table-extractor",
    icon: Table,
  },
  {
    id: "file-merger",
    name: "Fusionneur de fichiers",
    description: "Combinez plusieurs fichiers en un seul document",
    category: "misc",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/file-merger",
    icon: GitMerge,
  },
  {
    id: "audio-converter",
    name: "Convertisseur audio",
    description:
      "Convertissez entre différents formats audio avec options avancées",
    category: "conversion",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/audio-converter",
    icon: Music,
  },
  {
    id: "doc-anonymizer",
    name: "Anonymiseur de documents",
    description:
      "Masquez automatiquement les informations personnelles dans vos documents",
    category: "privacy",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/doc-anonymizer",
    icon: UserX,
  },
  {
    id: "qr-generator",
    name: "Générateur de QR codes",
    description: "Créez des QR codes personnalisés avec suivi d'utilisation",
    category: "misc",
    popular: true,
    comingSoon: false,
    demo: false, // ✨ Plus une démo !
    path: "/tools/qr-generator",
    icon: QrCode,
  },
  {
    id: "file-comparator",
    name: "Comparateur de fichiers",
    description: "Comparez visuellement deux versions de fichiers",
    category: "misc",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/file-comparator",
    icon: GitCompare,
  },
  {
    id: "audio-enhancer",
    name: "Améliorateur audio",
    description:
      "Supprimez les bruits parasites et améliorez la qualité sonore",
    category: "misc",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/audio-enhancer",
    icon: Headphones,
  },
  {
    id: "grammar-checker",
    name: "Correcteur grammatical",
    description:
      "Corrigez les fautes d'orthographe et de grammaire dans vos textes",
    category: "text",
    popular: true,
    comingSoon: false,
    demo: false,
    path: "/tools/grammar-checker",
    icon: CheckCircle,
  },
  {
    id: "translator",
    name: "Traducteur multilingue",
    description: "Traduisez du texte dans plusieurs langues instantanément",
    category: "text",
    popular: true,
    comingSoon: true,
    demo: false,
    path: "/tools/translator",
    icon: Globe,
  },
  {
    id: "code-indenter",
    name: "Indenteur de code",
    description: "Formatez et indentez automatiquement votre code source",
    category: "text",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/code-indenter",
    icon: Code,
  },
  {
    id: "case-converter",
    name: "Convertisseur de casse",
    description:
      "Convertissez du texte entre majuscules, minuscules et autres formats",
    category: "text",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/casse",
    icon: CaseSensitive,
  },
  {
    id: "character-escaper",
    name: "Échappeur de caractères",
    description:
      "Échappez les caractères spéciaux pour différents langages de programmation",
    category: "text",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/character-escaper",
    icon: Quote, // ✨ Remplace Backslash qui n'existe pas
  },
  {
    id: "password-generator",
    name: "Générateur de mots de passe",
    description: "Créer des mots de passe complexes et aléatoires",
    category: "text",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/password-generator",
    icon: Key,
  },
  {
    id: "world-clock",
    name: "Horloge mondiale",
    description: "Consultez l'heure actuelle dans différents fuseaux horaires",
    category: "misc",
    popular: false,
    comingSoon: false,
    demo: false,
    path: "/tools/world-clock",
    icon: Clock,
  },
  {
    id: "unit-converter",
    name: "Convertisseur d'unités",
    description: "Convertissez entre différentes unités de mesure",
    category: "conversion",
    popular: true,
    comingSoon: false,
    demo: false,
    path: "/tools/unit-converter",
    icon: Calculator,
  },
  {
    id: "json-formatter",
    name: "Formateur JSON",
    description: "Formatez et validez vos fichiers JSON facilement",
    category: "text",
    popular: true,
    comingSoon: false,
    demo: false,
    path: "/tools/json-formatter",
    icon: Braces,
  },
  {
    id: "markdown-editor",
    name: "Éditeur Markdown",
    description: "Éditez et prévisualisez vos fichiers Markdown en temps réel",
    category: "text",
    popular: true,
    comingSoon: false,
    demo: false,
    path: "/tools/md-editor",
    icon: Hash,
  },
  {
    id: "currency-converter",
    name: "Convertisseur de monnaies",
    description: "Convertissez entre différentes devises et cryptomonnaies",
    category: "conversion",
    popular: true,
    comingSoon: true,
    demo: false,
    path: "/tools/currency-converter",
    icon: DollarSign,
  },
  {
    id: "url-shortener",
    name: "Raccourcisseur d'URL",
    description: "Créez des liens courts et faciles à partager",
    category: "misc",
    popular: false,
    comingSoon: false,
    demo: true,
    path: "/tools/url-shortener",
    icon: LinkIcon,
  },
];

tools.sort((a, b) => {
  if (!a.comingSoon && !a.demo && (b.comingSoon || b.demo)) {
    return -1;
  }
  if (!a.demo && b.demo && !a.comingSoon) {
    return -1;
  }
  if (a.demo && !a.comingSoon && !b.demo && !b.comingSoon) {
    return 1;
  }
  if (a.demo && !a.comingSoon && b.comingSoon) {
    return -1;
  }
  if (a.comingSoon && !b.comingSoon) {
    return 1;
  }
  if (!a.comingSoon && b.comingSoon) {
    return -1;
  }
  return 0;
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Tous les outils";
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent p-4">
          Toolly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Une boîte à outils complète pour tous vos besoins numériques, gratuit
          et sans installation.
        </p>

        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher un outil..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {searchQuery.trim() === "" && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Outils Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter((tool) => tool.popular && !tool.comingSoon)
              .map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link href={tool.path} key={tool.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <CardTitle>{tool.name}</CardTitle>
                          </div>
                          {tool.demo && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 cursor-help"
                                  >
                                    Démo
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Version de démonstration uniquement
                                    visuelle, sans fonctionnalités complètes.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">Tous nos outils</h2>

        {/* Version pour tablette/desktop : onglets */}
        <div className="hidden md:block mb-6">
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <TabsList className="grid grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Version mobile : menu déroulant */}
        <div className="md:hidden mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{getCategoryName(activeCategory)}</span>
                <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={
                    activeCategory === category.id
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link href={tool.comingSoon ? "#" : tool.path} key={tool.id}>
                  <Card
                    className={`h-full transition-all ${
                      tool.comingSoon
                        ? "opacity-60"
                        : "hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent
                            className={`h-6 w-6 ${
                              tool.comingSoon
                                ? "text-gray-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          {tool.comingSoon && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 cursor-help"
                                  >
                                    Bientôt
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Outil en cours de développement, disponible
                                    prochainement.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {tool.demo && !tool.comingSoon && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 cursor-help"
                                  >
                                    Démo
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Version de démonstration uniquement
                                    visuelle, sans fonctionnalités complètes.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun outil ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
