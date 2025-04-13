// app/tools/image-compressor/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  ChevronRight,
  Image,
  Download,
  Loader2,
  Settings2,
  RefreshCw,
  Check,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types pour les formats d'image
type ImageFormat = "jpeg" | "png" | "webp";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCompressedImage(null);
    setOriginalPreview(null);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Vérifier si le fichier est une image
      if (!selectedFile.type.startsWith("image/")) {
        setError(
          "Veuillez sélectionner une image valide (JPEG, PNG, GIF, etc.)."
        );
        setFile(null);
        return;
      }

      // Vérifier la taille du fichier (max 15 MB)
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 15 Mo.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);

      // Créer l'aperçu de l'image originale
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setError(null);
    setCompressedImage(null);
    setOriginalPreview(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Vérifier si le fichier est une image
      if (!droppedFile.type.startsWith("image/")) {
        setError(
          "Veuillez sélectionner une image valide (JPEG, PNG, GIF, etc.)."
        );
        return;
      }

      // Vérifier la taille du fichier (max 15 MB)
      if (droppedFile.size > 15 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 15 Mo.");
        return;
      }

      setFile(droppedFile);
      setOriginalSize(droppedFile.size);

      // Créer l'aperçu de l'image originale
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const compressImage = () => {
    if (!file || !originalPreview) return;

    setIsCompressing(true);
    setError(null);

    // Créer un élément image pour charger l'image originale
    const img = document.createElement("img");
    img.onload = () => {
      // Créer un canvas pour dessiner et compresser l'image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Définir les dimensions du canvas (ici on maintient la taille originale)
      canvas.width = img.width;
      canvas.height = img.height;

      // Dessiner l'image sur le canvas
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convertir le canvas en base64 avec la qualité spécifiée
        try {
          const compressedDataUrl = canvas.toDataURL(
            `image/${format}`,
            quality / 100
          );
          setCompressedImage(compressedDataUrl);

          // Calculer la taille approximative de l'image compressée
          const base64 = compressedDataUrl.split(",")[1];
          const approximateSize = Math.round((base64.length * 3) / 4);
          setCompressedSize(approximateSize);
        } catch (err) {
          setError(
            "Une erreur s'est produite lors de la compression. Veuillez réessayer."
          );
          console.error("Erreur de compression:", err);
        }
      }

      setIsCompressing(false);
    };

    img.onerror = () => {
      setError(
        "Impossible de charger l'image. Veuillez vérifier qu'il s'agit d'une image valide."
      );
      setIsCompressing(false);
    };

    img.src = originalPreview;
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    // Créer un lien de téléchargement pour l'image compressée
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed_${
      file?.name.split(".")[0] || "image"
    }.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFile(null);
    setCompressedImage(null);
    setOriginalPreview(null);
    setError(null);
    setQuality(80);
    setFormat("jpeg");
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Formater la taille en KB ou MB
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculer le pourcentage de réduction de taille
  const calculateReduction = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - compressedSize / originalSize) * 100);
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
            <BreadcrumbLink href="/tools">Outils</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools/image-compressor">
              Compresseur d'images
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête de l'outil */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Compresseur d'images</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Réduisez la taille de vos images sans perte visible de qualité. Idéal
          pour optimiser les images pour le web ou l'envoi par email.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        {/* Zone de dépôt de fichier (affichée seulement si aucune image n'est sélectionnée) */}
        {!file && (
          <div
            className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">
                  Cliquez pour sélectionner une image ou déposez-la ici
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Formats supportés: JPEG, PNG, GIF, etc. (max. 15 Mo)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Affichage de l'image et options de compression */}
        {file && originalPreview && (
          <div>
            {/* Aperçu des images (originale/compressée) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Image originale */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Image originale ({formatSize(originalSize)})
                </h3>
                <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={originalPreview}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Image compressée (ou placeholder) */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  {compressedImage
                    ? `Image compressée (${formatSize(compressedSize)})`
                    : "Image compressée (en attente)"}
                </h3>
                <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {compressedImage ? (
                    <img
                      src={compressedImage}
                      alt="Compressée"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Settings2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Ajustez les paramètres et cliquez sur "Compresser"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options de compression */}
            <div className="mb-6 border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Options de compression
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Qualité */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="quality" className="text-sm font-medium">
                      Qualité : {quality}%
                    </label>
                    <span className="text-xs text-gray-500">
                      {quality < 50
                        ? "Basse"
                        : quality < 80
                        ? "Moyenne"
                        : "Haute"}
                    </span>
                  </div>
                  <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    className="mb-6"
                  />
                </div>

                {/* Format */}
                <div>
                  <label
                    htmlFor="format"
                    className="text-sm font-medium block mb-2"
                  >
                    Format de sortie
                  </label>
                  <Select
                    value={format}
                    onValueChange={(value) => setFormat(value as ImageFormat)}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">
                        JPEG (recommandé pour photos)
                      </SelectItem>
                      <SelectItem value="png">
                        PNG (pour images avec transparence)
                      </SelectItem>
                      <SelectItem value="webp">
                        WebP (meilleure compression, support limité)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Résultats de compression */}
            {compressedImage && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  Compression réussie !
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Taille originale
                    </p>
                    <p className="font-medium">{formatSize(originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Taille compressée
                    </p>
                    <p className="font-medium">{formatSize(compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Réduction
                    </p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {calculateReduction()}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'actions */}
            <div className="flex flex-col gap-3 mt-6">
              {!compressedImage ? (
                <Button
                  onClick={compressImage}
                  disabled={isCompressing}
                  className="w-full"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Compression en cours...
                    </>
                  ) : (
                    <>
                      <Settings2 className="mr-2 h-4 w-4" />
                      Compresser l'image
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger l'image compressée
                  </Button>

                  <Button
                    variant="outline"
                    onClick={compressImage}
                    disabled={isCompressing}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recompresser avec les options actuelles
                  </Button>
                </>
              )}

              <Button variant="ghost" onClick={resetForm} className="w-full">
                Choisir une autre image
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Section FAQ */}
      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Comment fonctionne la compression d'images ?
          </AccordionTrigger>
          <AccordionContent>
            Notre compresseur d'images utilise des algorithmes avancés pour
            réduire la taille des fichiers tout en préservant la qualité
            visuelle. Le processus implique l'optimisation de l'encodage des
            pixels et la réduction des métadonnées inutiles. Vous pouvez ajuster
            le niveau de qualité selon vos besoins.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Quel format d'image choisir ?</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>JPEG</strong> : Idéal pour les photographies et les
                images avec beaucoup de couleurs et de détails.
              </li>
              <li>
                <strong>PNG</strong> : Meilleur pour les graphiques, logos et
                images nécessitant une transparence.
              </li>
              <li>
                <strong>WebP</strong> : Offre une meilleure compression que JPEG
                et PNG tout en maintenant une bonne qualité, mais n'est pas
                supporté par tous les navigateurs et applications.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Mes images sont-elles sécurisées ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Toutes les opérations de compression sont effectuées
            directement dans votre navigateur. Vos images ne sont jamais
            téléchargées sur nos serveurs, ce qui garantit une confidentialité
            totale. Après avoir quitté cette page, aucune trace de vos images ne
            subsiste.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Pourquoi compresser mes images ?</AccordionTrigger>
          <AccordionContent>
            La compression d'images est essentielle pour :
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Accélérer le chargement de votre site web</li>
              <li>
                Réduire l'utilisation des données sur les appareils mobiles
              </li>
              <li>Économiser de l'espace de stockage</li>
              <li>Faciliter le partage par email ou messagerie</li>
              <li>
                Améliorer le référencement (SEO) en optimisant la vitesse de
                votre site
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Section Informations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Compression locale</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Toutes les images sont compressées directement dans votre navigateur
            pour garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Options flexibles</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Ajustez la qualité et le format de sortie selon vos besoins
            spécifiques.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Rapide et gratuit</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Aucune limitation de nombre d'images, aucune inscription requise,
            100% gratuit.
          </p>
        </div>
      </div>
    </div>
  );
}
