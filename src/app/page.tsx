"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "conversion", name: "Conversion" },
  { id: "compression", name: "Compression" },
  { id: "extraction", name: "Extraction" },
  { id: "privacy", name: "Confidentialité" },
  { id: "text", name: "Texte" },
  { id: "misc", name: "Divers" },
];

const tools = [
  {
    id: "pdf-to-word",
    name: "PDF vers Word",
    description: "Convertissez vos fichiers PDF en documents Word éditables",
    category: "conversion",
    popular: true,
    comingSoon: false,
    demo: true,
    path: "/tools/pdf-to-word",
    icon: "📄",
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
    icon: "🖼️",
  },
  {
    id: "metadata-cleaner",
    name: "Nettoyeur de métadonnées",
    description:
      "Supprimez les informations personnelles cachées dans vos fichiers",
    category: "privacy",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/metadata-cleaner",
    icon: "🔒",
  },
  {
    id: "text-simplifier",
    name: "Simplificateur de texte",
    description: "Transformez un texte complexe en langage accessible",
    category: "text",
    popular: false,
    comingSoon: true,
    demo: false,
    path: "/tools/text-simplifier",
    icon: "📝",
  },
  {
    id: "table-extractor",
    name: "Extracteur de tableaux",
    description: "Extrayez des tableaux depuis des PDFs ou des images",
    category: "extraction",
    popular: true,
    comingSoon: true,
    demo: false,
    path: "/tools/table-extractor",
    icon: "📊",
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
    icon: "🔄",
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
    icon: "🎵",
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
    icon: "👤",
  },
  {
    id: "qr-generator",
    name: "Générateur de QR codes",
    description: "Créez des QR codes personnalisés avec suivi d'utilisation",
    category: "misc",
    popular: true,
    comingSoon: false,
    demo: true,
    path: "/tools/qr-generator",
    icon: "📱",
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
    icon: "🔍",
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
    icon: "🎧",
  },
  {
    id: "grammar-checker",
    name: "Correcteur grammatical",
    description:
      "Corrigez les fautes d'orthographe et de grammaire dans vos textes",
    category: "text",
    popular: true,
    comingSoon: true,
    demo: false,
    path: "/tools/grammar-checker",
    icon: "✓",
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
    icon: "🌐",
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
    icon: "⌨️",
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
    icon: "Aa",
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
    icon: "\\",
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
    icon: "A*#",
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
    icon: "🕒",
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
    icon: "🔢",
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
    icon: "💱",
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
    icon: "🔗",
  },
];

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

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Toolly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Une boîte à outils complète pour tous vos besoins numériques, gratuit
          et sans installation
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

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Outils Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools
            .filter((tool) => tool.popular && !tool.comingSoon)
            .map((tool) => (
              <Link href={tool.path} key={tool.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tool.icon}</span>
                        <CardTitle>{tool.name}</CardTitle>
                      </div>
                      {tool.demo && (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        >
                          Démo
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Tous nos outils</h2>

        <Tabs
          defaultValue="all"
          onValueChange={setActiveCategory}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
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
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tool.icon}</span>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {tool.comingSoon && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            Bientôt
                          </Badge>
                        )}
                        {tool.demo && !tool.comingSoon && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          >
                            Démo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))
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
