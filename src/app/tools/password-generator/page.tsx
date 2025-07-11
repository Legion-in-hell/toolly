/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Key,
  ChevronRight,
  Copy,
  RefreshCw,
  Check,
  Eye,
  EyeOff,
  Shield,
  Settings2,
  AlertTriangle,
} from "lucide-react";

import Link from "next/link";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = "il1Lo0O";
const AMBIGUOUS_CHARS = "{}[]()/\\'\"`~,;.<>";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

  const generatePassword = useCallback(() => {
    let charset = "";

    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    if (options.excludeSimilar) {
      charset = charset
        .split("")
        .filter((char) => !SIMILAR_CHARS.includes(char))
        .join("");
    }

    if (options.excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((char) => !AMBIGUOUS_CHARS.includes(char))
        .join("");
    }

    if (charset.length === 0) {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
  }, [options]);

  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) {
      setStrength({ score: 0, label: "Aucun", color: "text-gray-500" });
      return;
    }

    let score = 0;

    // Longueur
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Complexité
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    // Diversité
    const uniqueChars = new Set(pwd).size;
    if (uniqueChars >= pwd.length * 0.7) score += 1;

    let label = "";
    let color = "";

    if (score <= 2) {
      label = "Très faible";
      color = "text-red-600 dark:text-red-400";
    } else if (score <= 4) {
      label = "Faible";
      color = "text-orange-600 dark:text-orange-400";
    } else if (score <= 6) {
      label = "Moyen";
      color = "text-yellow-600 dark:text-yellow-400";
    } else if (score <= 7) {
      label = "Fort";
      color = "text-blue-600 dark:text-blue-400";
    } else {
      label = "Très fort";
      color = "text-green-600 dark:text-green-400";
    }

    setStrength({ score, label, color });
  }, []);

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const updateOptions = (key: keyof PasswordOptions, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const hasAtLeastOneOption = () => {
    return (
      options.includeUppercase ||
      options.includeLowercase ||
      options.includeNumbers ||
      options.includeSymbols
    );
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    calculateStrength(password);
  }, [password, calculateStrength]);

  const getStrengthWidth = () => {
    return `${(strength.score / 8) * 100}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <a href="/tools" className="text-gray-600 hover:text-gray-800">
            Outils
          </a>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Générateur de mot de passe</span>
        </div>
      </nav>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Générateur de mot de passe fort
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Créez des mots de passe sécurisés et uniques pour protéger vos
          comptes. Tous les mots de passe sont générés localement dans votre
          navigateur.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Mot de passe généré
          </h3>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 font-mono text-lg break-all">
                {password ? (
                  showPassword ? (
                    password
                  ) : (
                    "•".repeat(password.length)
                  )
                ) : (
                  <span className="text-gray-500">
                    Aucun mot de passe généré
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {password && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Force:</span>
                    <span className={`text-sm font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: getStrengthWidth() }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!hasAtLeastOneOption() && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Attention
                </h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Vous devez sélectionner au moins un type de caractère pour
                  générer un mot de passe.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 border rounded-lg p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Options de génération
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="length" className="text-sm font-medium">
                  Longueur : {options.length} caractères
                </label>
                <span className="text-xs text-gray-500">
                  {options.length < 8
                    ? "Trop court"
                    : options.length < 12
                    ? "Correct"
                    : "Recommandé"}
                </span>
              </div>
              <input
                type="range"
                id="length"
                min="4"
                max="50"
                value={options.length}
                onChange={(e) =>
                  updateOptions("length", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={options.includeUppercase}
                    onChange={(e) =>
                      updateOptions("includeUppercase", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="uppercase" className="text-sm font-medium">
                    Majuscules (A-Z)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="lowercase"
                    checked={options.includeLowercase}
                    onChange={(e) =>
                      updateOptions("includeLowercase", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="lowercase" className="text-sm font-medium">
                    Minuscules (a-z)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="numbers"
                    checked={options.includeNumbers}
                    onChange={(e) =>
                      updateOptions("includeNumbers", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="numbers" className="text-sm font-medium">
                    Chiffres (0-9)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="symbols"
                    checked={options.includeSymbols}
                    onChange={(e) =>
                      updateOptions("includeSymbols", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="symbols" className="text-sm font-medium">
                    Symboles (!@#$%^&*)
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="excludeSimilar"
                    checked={options.excludeSimilar}
                    onChange={(e) =>
                      updateOptions("excludeSimilar", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="excludeSimilar"
                    className="text-sm font-medium"
                  >
                    Exclure les caractères similaires (il1Lo0O)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="excludeAmbiguous"
                    checked={options.excludeAmbiguous}
                    onChange={(e) =>
                      updateOptions("excludeAmbiguous", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="excludeAmbiguous"
                    className="text-sm font-medium"
                  >
                    Exclure les caractères ambigus ({}[]()...)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={generatePassword}
            disabled={!hasAtLeastOneOption()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Générer un nouveau mot de passe
          </button>

          {password && (
            <button
              onClick={copyToClipboard}
              className="w-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier le mot de passe
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              Comment créer un mot de passe vraiment sécurisé ?
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
              Un mot de passe sécurisé doit combiner plusieurs éléments : une
              longueur d&#39;au moins 12 caractères, un mélange de majuscules,
              minuscules, chiffres et symboles, et être unique pour chaque
              compte. Évitez les mots du dictionnaire, les informations
              personnelles et les séquences prévisibles.
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              Mes mots de passe sont-ils stockés quelque part ?
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
              Non, absolument pas. Tous les mots de passe sont générés
              localement dans votre navigateur à l&#39;aide de l&#39;API
              cryptographique sécurisée. Aucune donnée n&#39;est envoyée vers
              nos serveurs. Dès que vous fermez cette page, le mot de passe
              disparaît définitivement.
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              Que signifient les options d&#39;exclusion ?
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Caractères similaires</strong> : Exclut les caractères
                  qui se ressemblent visuellement (comme i, l, 1, L, o, 0, O)
                  pour éviter les erreurs de saisie.
                </li>
                <li>
                  <strong>Caractères ambigus</strong> : Exclut les caractères
                  qui peuvent être mal interprétés selon le contexte (crochets,
                  parenthèses, guillemets...).
                </li>
              </ul>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              Comment bien gérer mes mots de passe ?
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
              Voici les meilleures pratiques :
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Utilisez un gestionnaire de mots de passe pour les stocker de
                  manière sécurisée
                </li>
                <li>Créez un mot de passe unique pour chaque compte</li>
                <li>
                  Activez l&#39;authentification à deux facteurs quand c&#39;est
                  possible
                </li>
                <li>Changez immédiatement les mots de passe par défaut</li>
                <li>Ne partagez jamais vos mots de passe</li>
                <li>
                  Changez vos mots de passe si vous soupçonnez une compromission
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Génération locale</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Tous les mots de passe sont générés directement dans votre
            navigateur pour une sécurité maximale.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Hautement configurable</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Personnalisez la longueur, les types de caractères et les options
            d&#39;exclusion selon vos besoins.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Cryptographiquement sûr</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Utilise l&#39;API Web Crypto pour une génération vraiment aléatoire
            et imprévisible.
          </p>
        </div>
      </div>
    </div>
  );
}
