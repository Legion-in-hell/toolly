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

// Définir les catégories d'outils
const categories = [
  { id: "all", name: "Tous les outils" },
  { id: "conversion", name: "Conversion" },
  { id: "compression", name: "Compression" },
  { id: "extraction", name: "Extraction" },
  { id: "privacy", name: "Confidentialité" },
  { id: "text", name: "Texte" },
  { id: "misc", name: "Divers" },
];

// Définir la liste des outils
const tools = [
  {
    id: "pdf-to-word",
    name: "PDF vers Word",
    description: "Convertissez vos fichiers PDF en documents Word éditables",
    category: "conversion",
    popular: true,
    comingSoon: true,
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
    path: "/tools/doc-anonymizer",
    icon: "👤",
  },
  {
    id: "qr-generator",
    name: "Générateur de QR codes",
    description: "Créez des QR codes personnalisés avec suivi d'utilisation",
    category: "misc",
    popular: true,
    comingSoon: true,
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
    path: "/tools/file-comparator",
    icon: "🔍",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filtrer les outils en fonction de la recherche et de la catégorie
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
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Toolly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Une boîte à outils complète pour tous vos besoins numériques, gratuit
          et sans installation
        </p>

        {/* Barre de recherche */}
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

      {/* Section Outils Populaires */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Outils Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools
            .filter((tool) => tool.popular && !tool.comingSoon)
            .map((tool) => (
              <Link href={tool.path} key={tool.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <CardTitle>{tool.name}</CardTitle>
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

      {/* Section Tous les Outils */}
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
                      {tool.comingSoon && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        >
                          Bientôt
                        </Badge>
                      )}
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
