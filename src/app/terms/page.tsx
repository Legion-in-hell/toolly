"use client";

import React from "react";
import {
  Home,
  ChevronRight,
  Scale,
  FileText,
  AlertCircle,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function terms() {
  const lastUpdated = "15 janvier 2025";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-500">Conditions d&#39;utilisation</span>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Scale
              className="text-6xl text-blue-600 dark:text-blue-400"
              size={72}
            />
            <FileText
              className="absolute -right-2 -top-2 text-amber-500 dark:text-amber-400"
              size={24}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Conditions d&#39;utilisation
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Bienvenue sur Toolly ! Ces conditions d&#39;utilisation régissent
          votre accès et votre utilisation de notre plateforme d&#39;outils en
          ligne.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Dernière mise à jour</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ces conditions ont été mises à jour le {lastUpdated}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Acceptation des conditions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Toolly est une plateforme gratuite qui propose une collection
            d&#39;outils en ligne pour faciliter diverses tâches numériques,
            notamment la compression d&#39;images, la conversion de fichiers, et
            d&#39;autres utilitaires web.
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Conditions détaillées</h2>

        <div className="space-y-4">
          {/* Section 1 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Utilisation autorisée
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Vous pouvez utiliser Toolly pour :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Traiter vos fichiers personnels et professionnels</li>
                  <li>Utiliser nos outils de conversion et de compression</li>
                  <li>Accéder à nos services de manière raisonnable</li>
                  <li>
                    Partager des liens vers nos outils avec d&#39;autres
                    utilisateurs
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Tous les traitements sont effectués côté client quand
                  c&#39;est possible, garantissant la confidentialité de vos
                  données.
                </p>
              </div>
            </div>
          </details>

          {/* Section 2 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Restrictions d&apos;utilisation
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Il est interdit d&apos;utiliser Toolly pour :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Traiter du contenu illégal, offensant ou malveillant</li>
                  <li>Tenter de compromettre la sécurité du site</li>
                  <li>
                    Utiliser nos services à des fins commerciales sans
                    autorisation
                  </li>
                  <li>Surcharger nos serveurs avec des requêtes excessives</li>
                  <li>
                    Reproduire ou redistribuer notre contenu sans permission
                  </li>
                </ul>
              </div>
            </div>
          </details>

          {/* Section 3 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Propriété intellectuelle
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  Toolly et tous ses éléments (design, code, contenu) sont
                  protégés par les droits d&apos;auteur et autres droits de
                  propriété intellectuelle.
                </p>
                <p>
                  Vous conservez tous les droits sur les fichiers que vous
                  traitez avec nos outils. Nous ne revendiquons aucun droit sur
                  votre contenu.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Le nom &quot;Toolly&quot; et notre logo sont des marques
                  déposées.
                </p>
              </div>
            </div>
          </details>

          {/* Section 4 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Limitation de responsabilité
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  Toolly est fourni &quot;tel quel&quot; sans garantie
                  d&apos;aucune sorte. Nous nous efforçons de maintenir un
                  service fiable, mais nous ne pouvons garantir :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Une disponibilité ininterrompue du service</li>
                  <li>L&apos;absence d&apos;erreurs ou de bugs</li>
                  <li>
                    La compatibilité avec tous les appareils et navigateurs
                  </li>
                  <li>
                    La préservation de vos fichiers en cas de problème technique
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Nous recommandons toujours de conserver des sauvegardes de vos
                  fichiers importants.
                </p>
              </div>
            </div>
          </details>

          {/* Section 5 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Modifications des conditions
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  Nous nous réservons le droit de modifier ces conditions
                  d&apos;utilisation à tout moment. Les modifications prendront
                  effet dès leur publication sur cette page.
                </p>
                <p>
                  Nous vous encourageons à consulter régulièrement cette page
                  pour rester informé des éventuelles modifications.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  La date de dernière mise à jour est indiquée en haut de cette
                  page.
                </p>
              </div>
            </div>
          </details>

          {/* Section 6 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Contact et signalement
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  Pour toute question concernant ces conditions
                  d&apos;utilisation ou pour signaler un problème, vous pouvez
                  nous contacter via notre formulaire de contact.
                </p>
                <p>
                  Nous nous efforçons de répondre dans les plus brefs délais à
                  toutes les demandes légitimes.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2 text-amber-800 dark:text-amber-200">
              Important à retenir
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Ces conditions d&apos;utilisation constituent un accord légal
              entre vous et Toolly. En continuant à utiliser nos services, vous
              confirmez avoir lu, compris et accepté ces conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h3 className="font-bold mb-2">Questions juridiques ?</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Si vous avez des questions spécifiques concernant ces conditions,
            n&apos;hésitez pas à nous contacter.
          </p>
          <button className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
            Nous contacter
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h3 className="font-bold mb-2">Retour à l&apos;accueil</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Découvrez tous nos outils gratuits et commencez à optimiser votre
            productivité.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="h-4 w-4" />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
