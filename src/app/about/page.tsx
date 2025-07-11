"use client";

import React from "react";
import {
  ChevronRight,
  BookOpen,
  Users,
  Heart,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">À propos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">À propos de Toolly</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Toolly est votre boîte à outils numérique tout-en-un. Convertisseurs,
          générateurs, correcteurs, calculateurs... Tous les outils essentiels
          du quotidien, gratuits et respectueux de votre vie privée.
        </p>
      </div>

      <Alert className="mb-8">
        <Heart className="h-4 w-4" />
        <AlertDescription>
          <strong>Notre mission :</strong> Centraliser tous les outils
          numériques utiles au quotidien dans une seule plateforme gratuite,
          simple et respectueuse de votre confidentialité.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold">Notre vision</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Nous croyons que les outils numériques essentiels ne devraient pas
            être éparpillés sur des dizaines de sites différents. Toolly
            rassemble dans une interface cohérente tous les utilitaires dont
            vous avez besoin : correction de texte, conversion d&#39;unités,
            génération de mots de passe, fuseaux horaires, et bien plus encore.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold">Pour qui ?</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Développeurs, étudiants, professionnels, créateurs de contenu, ou
            simplement toute personne qui utilise un ordinateur au quotidien.
            Toolly s&#39;adapte à tous les besoins avec des outils simples,
            efficaces et accessibles en quelques clics, sans inscription ni
            limitation.
          </p>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nos catégories d&#39;outils
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-3">Écriture & Texte</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Correcteurs orthographiques, convertisseurs de casse, compteurs de
              mots, générateurs de texte, analyseurs de lisibilité.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-3">Convertisseurs</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Unités de mesure, devises, couleurs (HEX/RGB), formats de
              fichiers, bases numériques, encodages.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-3">Sécurité & Crypto</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Générateurs de mots de passe, hashage, chiffrement, générateurs
              UUID, vérificateurs de force de mot de passe.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-3">Temps & Localisation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Fuseaux horaires, calendriers, calculateurs de dates,
              convertisseurs d&#39;époques Unix, horloges mondiales.
            </p>
          </div>
        </div>
      </div>

      <Card className="p-8 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <Zap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Pourquoi Toolly ?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Parce que chercher le bon outil sur 20 sites différents fait perdre
            du temps. Parce que vos données personnelles ne devraient pas être
            le prix à payer pour des outils basiques. Parce que la simplicité et
            l&#39;efficacité ne devraient pas être un luxe. Toolly rassemble
            l&#39;essentiel en un seul endroit, gratuitement.
          </p>
        </div>
      </Card>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Notre approche technique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Technologies utilisées</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                <strong>React & TypeScript</strong> - Interface moderne et
                robuste
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                <strong>Next.js</strong> - Performance et optimisation SEO
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                <strong>Tailwind CSS</strong> - Design responsive et accessible
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                <strong>APIs externes</strong> - LanguageTool, services de
                conversion
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                <strong>WebAssembly</strong> - Calculs complexes côté client
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              Principes de développement
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                <strong>Privacy by design</strong> - Confidentialité intégrée
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                <strong>Mobile-first</strong> - Pensé pour tous les écrans
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                <strong>Performance</strong> - Résultats instantanés
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                <strong>Accessibilité</strong> - Utilisable par tous
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                <strong>Progressive Web App</strong> - Fonctionne hors ligne
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Rejoignez la communauté Toolly
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Une idée d&#39;outil manquant ? Un bug à signaler ? Une suggestion
          d&#39;amélioration ? Toolly grandit grâce à sa communauté
          d&#39;utilisateurs actifs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Proposer un outil
          </a>
          <a
            href="https://discord.gg/4R5zUpvUGZ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Rejoindre notre communauté Discord
          </a>
          <a
            href="https://github.com/Legion-in-hell/toolly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Voir le code source
          </a>
        </div>
      </Card>
    </div>
  );
}
