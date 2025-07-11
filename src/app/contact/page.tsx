"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Gamepad,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const isFormValid =
    formData.name && formData.email && formData.subject && formData.message;

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
            <BreadcrumbLink href="/contact">Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Une question, une suggestion, un bug à signaler ? Nous sommes là pour
          vous écouter et améliorer continuellement nos outils de correction
          française.
        </p>
      </div>

      {submitStatus === "success" && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Message envoyé avec succès !</strong> Nous vous répondrons
            dans les plus brefs délais.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erreur lors de l&#39;envoi.</strong> Veuillez réessayer ou
            nous contacter directement par email.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold">Envoyez-nous un message</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                >
                  Catégorie
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Signaler un bug</SelectItem>
                    <SelectItem value="feature">
                      Demande de fonctionnalité
                    </SelectItem>
                    <SelectItem value="feedback">
                      Retour d&#39;expérience
                    </SelectItem>
                    <SelectItem value="help">Aide / Support</SelectItem>
                    <SelectItem value="partnership">Partenariat</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Sujet *
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Résumé de votre message"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre demande, question ou suggestion en détail..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="min-h-32"
                  required
                />
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Informations de contact */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/Legion-in-hell/toolly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Github className="h-5 w-5 mr-3" />
                GitHub - Code source
              </a>
              <a
                href="https://discord.gg/4R5zUpvUGZ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Gamepad className="h-5 w-5 mr-3" />
                Discord - Communauté
              </a>
              <a
                href="https://www.linkedin.com/in/rouff/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5 mr-3" />
                LinkedIn - Professionnel
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Questions fréquentes</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Temps de réponse ?
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Nous répondons généralement sous 24-48h.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Signaler un bug ?
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Utilisez la catégorie &quot;Signaler un bug&quot; avec un
                  maximum de détails.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Nouvelle fonctionnalité ?
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Nous adorons les suggestions ! Décrivez votre idée en détail.
                </p>
              </div>
            </div>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Confidentialité :</strong> Vos messages ne sont utilisés
              que pour vous répondre. Aucune donnée n&#39;est partagée avec des
              tiers.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Section FAQ rapide */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Avant de nous écrire...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-4">
            <h3 className="font-bold mb-2">🐛 Vous avez trouvé un bug ?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Indiquez-nous le navigateur utilisé, le texte qui pose problème et
              les étapes pour reproduire l&#39;erreur.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2">💡 Une idée d&#39;amélioration ?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Expliquez-nous votre cas d&#39;usage et pourquoi cette
              fonctionnalité vous serait utile.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2">❓ Besoin d&#39;aide ?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Consultez d&#39;abord nos FAQ sur chaque outil. Si ça ne répond
              pas à votre question, écrivez-nous !
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
