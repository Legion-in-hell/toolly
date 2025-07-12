"use client";

import React from "react";
import {
  ChevronRight,
  Heart,
  Coffee,
  Star,
  Shield,
  Users,
  Zap,
  Gift,
  Crown,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DonationPage() {
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
            <BreadcrumbLink href="/donation">Soutenir Toolly</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 rounded-full">
            <Heart className="h-12 w-12 text-white animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Soutenez Toolly</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Toolly restera toujours gratuit ! Vos dons nous aident à maintenir les
          serveurs, développer de nouveaux outils et vous offrir la meilleure
          expérience possible.
        </p>
      </div>

      <Alert className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>100% transparent :</strong> Vos dons servent uniquement aux
          frais d&#39;hébergement, APIs premium et développement de nouveaux
          outils. Aucun profit personnel !
        </AlertDescription>
      </Alert>

      {/* Bouton Ko-fi principal */}
      <Card className="p-8 mb-12 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Coffee className="h-16 w-16 text-orange-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Offrez-moi un café ! ☕</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Le développement de Toolly se fait sur mon temps libre, souvent tard
          le soir avec un bon café. Votre soutien me motive énormément et
          m&#39;aide à garder le projet vivant !
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <a
            href="https://ko-fi.com/corentinrouff"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3"
          >
            <Coffee className="h-6 w-6" />
            <span>Soutenir sur Ko-fi</span>
            <Heart className="h-5 w-5 animate-pulse" />
          </a>
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Paiement sécurisé via Ko-fi • PayPal, carte bancaire
        </p>
      </Card>

      {/* Avantages Discord */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Avantages exclusifs Discord
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full inline-block mb-4">
              <Coffee className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">☕ Grade 1 (1€)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Badge &quot;Grade 1&quot; sur Discord</li>
              <li>• Mentions spéciales</li>
              <li>• Remerciements publics</li>
            </ul>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-purple-200 dark:border-purple-800">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full inline-block mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">⭐ Grade 3 (10€)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Badge &quot;Grade 3&quot; sur Discord</li>
              <li>• Vote prioritaire pour nouveaux outils</li>
              <li>• Mentions spéciales</li>
              <li>• Remerciements publics</li>
            </ul>
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-xs text-purple-700 dark:text-purple-300">
              🔥 Le plus populaire !
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full inline-block mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">👑 Grade 5 (50€)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Badge &quot;Grade 5&quot; sur Discord</li>
              <li>• Vote prioritaire pour nouveaux outils</li>
              <li>• Mentions spéciales</li>
              <li>• Remerciements publics</li>
              <li>• Influence directe sur la roadmap</li>
              <li>• Remerciements permanents</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* À quoi servent les dons */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          À quoi servent vos dons ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">
                Hébergement & Infrastructure
              </h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
              <li>• Serveurs rapides et fiables</li>
              <li>• CDN global pour tous les utilisateurs</li>
              <li>• Sauvegardes automatiques</li>
              <li>• Monitoring 24/7</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">APIs & Services Premium</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
              <li>• LanguageTool API premium</li>
              <li>• APIs de conversion avancées</li>
              <li>• Services de géolocalisation</li>
              <li>• Limites de taux étendues</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Développement</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
              <li>• Nouveaux outils chaque mois</li>
              <li>• Améliorations UX/UI</li>
              <li>• Optimisations performance</li>
              <li>• Support technique</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-4">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Communauté</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
              <li>• Serveur Discord premium</li>
              <li>• Événements communauté</li>
              <li>• Concours et récompenses</li>
              <li>• Support utilisateurs</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Autres moyens de soutenir */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Autres façons de nous soutenir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full inline-block mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Partagez Toolly</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Recommandez Toolly à vos amis, collègues et sur les réseaux
              sociaux
            </p>
          </div>

          <div className="p-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full inline-block mb-3">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold mb-2">Donnez votre avis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Vos retours nous aident à améliorer constamment la plateforme
            </p>
          </div>

          <div className="p-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full inline-block mb-3">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">Rejoignez Discord</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Participez à la communauté et influencez le développement
            </p>
          </div>
        </div>
      </Card>

      {/* Merci */}
      <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-4">
          Merci pour votre soutien ! 💚
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Chaque don, même petit, fait une énorme différence. Vous permettez à
          Toolly de rester gratuit, sans pub, et d&#39;évoluer selon vos
          besoins.
          <strong> Vous êtes géniaux !</strong>
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <a
              href="https://ko-fi.com/corentinrouff"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Faire un don Ko-fi
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/contact" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Nous remercier
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
