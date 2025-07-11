"use client";

import React from "react";
import {
  Home,
  ChevronRight,
  Shield,
  Eye,
  Lock,
  AlertCircle,
  Database,
  Clock,
  Cookie,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function privacy() {
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
          <span className="text-gray-500">Politique de confidentialité</span>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Shield
              className="text-6xl text-blue-600 dark:text-blue-400"
              size={72}
            />
            <Eye
              className="absolute -right-2 -top-2 text-amber-500 dark:text-amber-400"
              size={24}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Votre vie privée est importante pour nous. Cette politique explique
          comment nous collectons, utilisons et protégeons vos données
          personnelles.
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
            Cette politique a été mise à jour le {lastUpdated}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Notre engagement
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Toolly respecte votre vie privée et s&#39;engage à protéger vos
            données personnelles. Nous ne collectons que les informations
            nécessaires au fonctionnement de nos services et ne les partageons
            jamais avec des tiers à des fins commerciales.
          </p>

          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Traitement local des données
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            La plupart de nos outils traitent vos fichiers directement dans
            votre navigateur, sans les envoyer sur nos serveurs. Cela garantit
            que vos documents restent privés et sécurisés.
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Informations détaillées</h2>

        <div className="space-y-4">
          {/* Section 1 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Données que nous collectons
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Nous collectons uniquement les données suivantes :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Données de navigation :</strong> Adresse IP, type de
                    navigateur, pages visitées
                  </li>
                  <li>
                    <strong>Données d&#39;utilisation :</strong> Outils
                    utilisés, fréquence d&#39;utilisation (anonymisées)
                  </li>
                  <li>
                    <strong>Cookies techniques :</strong> Préférences de thème,
                    langue
                  </li>
                  <li>
                    <strong>Données de contact :</strong> Uniquement si vous
                    nous contactez volontairement
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  <strong>Important :</strong> Nous ne collectons jamais vos
                  fichiers personnels traités par nos outils.
                </p>
              </div>
            </div>
          </details>

          {/* Section 2 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Comment nous utilisons vos données
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Améliorer la performance et la fiabilité de nos services
                  </li>
                  <li>
                    Comprendre quels outils sont les plus utiles (statistiques
                    anonymes)
                  </li>
                  <li>Mémoriser vos préférences (thème, langue)</li>
                  <li>Répondre à vos questions et demandes de support</li>
                  <li>
                    Détecter et prévenir les abus ou utilisations malveillantes
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Nous n&#39;utilisons jamais vos données à des fins
                  publicitaires ou commerciales.
                </p>
              </div>
            </div>
          </details>

          {/* Section 3 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Partage de données
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  <strong>
                    Nous ne vendons jamais vos données personnelles.
                  </strong>{" "}
                  Nous pouvons partager des données uniquement dans les cas
                  suivants :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour répondre à une obligation légale</li>
                  <li>Pour protéger nos droits ou ceux d&#39;autrui</li>
                  <li>
                    Avec des prestataires techniques (hébergement) sous contrat
                    de confidentialité
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Les données partagées sont toujours minimales et anonymisées
                  quand c&#39;est possible.
                </p>
              </div>
            </div>
          </details>

          {/* Section 4 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Cookies et technologies similaires
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Nous utilisons des cookies pour :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cookies essentiels :</strong> Fonctionnement du site
                    (ne peuvent pas être désactivés)
                  </li>
                  <li>
                    <strong>Cookies de préférences :</strong> Mémoriser votre
                    thème et langue préférés
                  </li>
                  <li>
                    <strong>Cookies analytiques :</strong> Statistiques
                    d&#39;utilisation anonymes (Google Analytics)
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Vous pouvez configurer votre navigateur pour bloquer les
                  cookies, mais cela peut affecter certaines fonctionnalités.
                </p>
              </div>
            </div>
          </details>

          {/* Section 5 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Sécurité des données
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Nous protégeons vos données grâce à :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Chiffrement HTTPS pour toutes les communications</li>
                  <li>
                    Traitement local des fichiers (pas d&#39;envoi sur nos
                    serveurs)
                  </li>
                  <li>Serveurs sécurisés avec accès restreint</li>
                  <li>Sauvegardes régulières et sécurisées</li>
                  <li>Surveillance continue des menaces</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Malgré nos efforts, aucun système n&#39;est 100% sécurisé.
                  Nous nous engageons à vous informer rapidement en cas
                  d&#39;incident.
                </p>
              </div>
            </div>
          </details>

          {/* Section 6 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Vos droits (RGPD)
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Conformément au RGPD, vous avez le droit de :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Accès :</strong> Demander quelles données nous avons
                    sur vous
                  </li>
                  <li>
                    <strong>Rectification :</strong> Corriger des données
                    inexactes
                  </li>
                  <li>
                    <strong>Suppression :</strong> Demander la suppression de
                    vos données
                  </li>
                  <li>
                    <strong>Portabilité :</strong> Recevoir vos données dans un
                    format exploitable
                  </li>
                  <li>
                    <strong>Opposition :</strong> Vous opposer au traitement de
                    vos données
                  </li>
                  <li>
                    <strong>Limitation :</strong> Demander la limitation du
                    traitement
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Pour exercer ces droits, contactez-nous via notre formulaire
                  de contact.
                </p>
              </div>
            </div>
          </details>

          {/* Section 7 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Conservation des données
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>Nous conservons vos données selon les durées suivantes :</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Données de navigation :</strong> 24 mois maximum
                  </li>
                  <li>
                    <strong>Statistiques anonymisées :</strong> 36 mois maximum
                  </li>
                  <li>
                    <strong>Messages de contact :</strong> 12 mois après
                    résolution
                  </li>
                  <li>
                    <strong>Cookies techniques :</strong> Durée de session ou
                    selon configuration
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Les données sont automatiquement supprimées à l&#39;expiration
                  de ces délais.
                </p>
              </div>
            </div>
          </details>

          {/* Section 8 */}
          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
              Modifications de cette politique
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p>
                  Nous pouvons modifier cette politique de confidentialité pour
                  refléter des changements dans nos pratiques ou pour des
                  raisons légales.
                </p>
                <p>
                  Les modifications importantes vous seront signalées par un
                  avis visible sur le site. Nous vous encourageons à consulter
                  régulièrement cette page.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  L&#39;utilisation continue de nos services après modification
                  constitue votre acceptation des nouvelles conditions.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2 text-green-800 dark:text-green-200">
              Traitement local privilégié
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              La plupart de nos outils fonctionnent directement dans votre
              navigateur sans envoyer vos fichiers sur nos serveurs. Cela
              garantit un maximum de confidentialité pour vos données
              personnelles.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2 text-amber-800 dark:text-amber-200">
              Utilisateurs mineurs
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Nos services ne sont pas destinés aux enfants de moins de 13 ans.
              Nous ne collectons pas sciemment de données personnelles
              d&#39;enfants sans le consentement parental.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Gérer les cookies
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Configurez vos préférences de cookies et consultez les détails de
            leur utilisation.
          </p>
          <button className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
            Paramètres des cookies
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h3 className="font-bold mb-2">Questions sur vos données ?</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Exercez vos droits RGPD ou posez-nous vos questions sur la
            confidentialité.
          </p>
          <button className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
            Nous contacter
          </button>
        </div>
      </div>

      {/* Return Home */}
      <div className="text-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mx-auto"
        >
          <Home className="h-4 w-4" />
          Retour à l&#39;accueil
        </button>
      </div>
    </div>
  );
}
