import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Section Logo et Description - Colonne 1 */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Toolly
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Outils en ligne gratuits et sans installation pour faciliter votre
              travail quotidien.
            </p>
          </div>

          {/* Colonne vide 2 pour espacement */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Section Outils - Colonne 3 */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">Me retrouver</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/Legion-in-hell"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mon Github
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/rouff"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mon LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.coredev.fr"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mon Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.malt.fr/profile/corentinrouff1"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mon profil Malt
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne vide 4 pour espacement */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Section Légal - Colonne 5 */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-3">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne vide 6 pour espacement */}
          <div className="hidden md:block md:col-span-1"></div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t text-sm text-center text-gray-600 dark:text-gray-300">
          <p>© {currentYear} Toolly. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
