"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Coffee,
  ChevronRight,
  ArrowLeft,
  Search,
  MapPin,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NotFoundPage() {
  const [randomTip, setRandomTip] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const funnyTips = [
    "Essayez de rafraîchir la page. Ça ne marchera pas, mais c'est toujours amusant d'espérer.",
    "Cette page a pris un jour de congé. On ne peut pas lui en vouloir.",
    "Notre page a été kidnappée par des extraterrestres. Négociations en cours.",
    "Notre développeur a renversé du café sur cette URL. Nettoyage en cours.",
    "404 : Page en vacances. Elle reviendra bronzée et reposée.",
    "Vous avez trouvé notre porte secrète ! Malheureusement, elle ne mène nulle part.",
  ];

  useEffect(() => {
    // Choisir un conseil aléatoire
    setRandomTip(funnyTips[Math.floor(Math.random() * funnyTips.length)]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Rediriger vers la recherche
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Fil d'Ariane */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">404 - Page non trouvée</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête de la page */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          La page que vous recherchez semble avoir disparu dans l&apos;abîme
          numérique.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className={`text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600`}
            >
              404
            </div>
            <Coffee
              className="absolute -right-6 -top-2 text-amber-500 dark:text-amber-400"
              size={32}
            />
          </div>
        </div>

        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
          <h3 className="font-medium mb-3 flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Vous êtes perdu ?</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{randomTip}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Button
              onClick={() => (window.location.href = "/")}
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Retourner à l&apos;accueil
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Page précédente
            </Button>
          </div>
        </div>

        {/* Recherche */}
        <div className="border rounded-lg p-6 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Rechercher sur le site
          </h3>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Que recherchez-vous ?"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>

        {/* Suggestions */}
        <div className="mb-6">
          <h3 className="font-medium mb-4">
            Vous pourriez être intéressé par :
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/tools/image-compressor"
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h4 className="font-medium mb-1">Compresseur d&apos;images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Réduisez la taille de vos images sans perte visible de qualité
              </p>
            </a>

            <a
              href="/tools/conversion"
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h4 className="font-medium mb-1">Outils de conversion</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Convertissez facilement divers formats de fichiers
              </p>
            </a>

            <a
              href="/tools"
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h4 className="font-medium mb-1">Tous nos outils</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Découvrez notre collection complète d&apos;outils en ligne
              </p>
            </a>
          </div>
        </div>
      </Card>

      {/* Section FAQ */}
      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Pourquoi je vois cette page d&apos;erreur 404 ?
          </AccordionTrigger>
          <AccordionContent>
            Une erreur 404 signifie que la page que vous avez essayé de visiter
            n&apos;existe pas ou a été déplacée. Cela peut se produire si vous
            avez cliqué sur un lien périmé, si l&apos;URL a été mal saisie, ou
            si le contenu a été supprimé ou déplacé vers une nouvelle adresse.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Comment puis-je trouver ce que je cherche ?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Utilisez la barre de recherche ci-dessus pour trouver du contenu
                spécifique
              </li>
              <li>
                Consultez notre menu principal pour naviguer vers les
                principales sections du site
              </li>
              <li>
                Visitez notre page d&apos;accueil pour découvrir nos outils et
                ressources les plus populaires
              </li>
              <li>
                Vérifiez l&apos;orthographe de l&apos;URL que vous avez saisie
                manuellement
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Je recherche une fonctionnalité spécifique
          </AccordionTrigger>
          <AccordionContent>
            Si vous recherchez un outil ou une fonctionnalité spécifique, vous
            pouvez consulter notre page d&apos;outils complète où toutes nos
            ressources sont catégorisées et facilement accessibles. Si vous ne
            trouvez toujours pas ce que vous cherchez, n&apos;hésitez pas à nous
            contacter via notre formulaire de contact et nous serons ravis de
            vous aider.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Section Informations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Besoin d&apos;aide ?</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Notre équipe de support est disponible pour répondre à toutes vos
            questions.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Signaler un problème</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur de notre
            part, faites-nous-en part.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Explorer nos outils</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Découvrez notre collection d&apos;outils gratuits conçus pour
            simplifier votre travail quotidien.
          </p>
        </div>
      </div>
    </div>
  );
}
