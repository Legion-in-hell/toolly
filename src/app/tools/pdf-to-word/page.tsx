"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileType,
  ChevronRight,
  FileText,
  Download,
  Loader2,
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

export default function PdfToWordConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setConvertedFile(null);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setError("Veuillez sélectionner un fichier PDF valide.");
        setFile(null);
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("La taille du fichier ne doit pas dépasser 10 Mo.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
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
    setConvertedFile(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.type !== "application/pdf") {
        setError("Veuillez sélectionner un fichier PDF valide.");
        return;
      }

      if (droppedFile.size > 10 * 1024 * 1024) {
        setError("La taille du fichier ne doit pas dépasser 10 Mo.");
        return;
      }

      setFile(droppedFile);
    }
  };

  const convertToWord = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);

    try {
      // Simule une requête de conversion (dans une app réelle, cela irait vers une API)
      // TODO: Remplacez ceci par la logique de conversion réelle

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockConvertedFile = URL.createObjectURL(
        new Blob(["Contenu simulé"], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      );
      setConvertedFile(mockConvertedFile);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la conversion. Veuillez réessayer."
      );
      console.error("Erreur de conversion:", err);
    } finally {
      setIsConverting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setConvertedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <BreadcrumbLink href="/tools/pdf-to-word">
              PDF vers Word
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Convertisseur PDF vers Word</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transformez vos fichiers PDF en documents Word éditables. Conserve la
          mise en forme, les images et le texte de votre document original.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        {!convertedFile ? (
          <>
            <button
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
                accept=".pdf"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">
                    Cliquez pour sélectionner un fichier ou déposez-le ici
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Format supporté: PDF (max. 10 Mo)
                  </p>
                </div>
              </div>
            </button>

            {file && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={resetForm}>
                  Supprimer
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 flex justify-center">
              <Button
                onClick={convertToWord}
                disabled={!file || isConverting}
                className="w-full md:w-auto"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conversion en cours...
                  </>
                ) : (
                  "Convertir en Word"
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Résultat de la conversion */
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                <FileType className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Conversion réussie !</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Votre fichier PDF a été converti en document Word avec succès.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.open(convertedFile, "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger le fichier Word
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Convertir un autre fichier
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Conversion précise</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Notre outil maintient la mise en page, les polices et les images du
            document original.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">100% Sécurisé</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Vos fichiers sont automatiquement supprimés après la conversion pour
            garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Rapide et Gratuit</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Convertissez des PDF en Word en quelques secondes, sans inscription
            ni frais cachés.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Foire aux questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">
              Comment convertir un PDF en Word ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Téléchargez votre fichier PDF, attendez que la conversion soit
              terminée, puis téléchargez le document Word résultant. C&apos;est
              aussi simple que cela !
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">
              La mise en forme est-elle conservée ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Oui, notre outil s&apos;efforce de conserver la mise en page
              originale, y compris les polices, les images et les tableaux.
              Cependant, les PDF très complexes peuvent présenter de légères
              différences.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">
              Y a-t-il une limite de taille de fichier ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Oui, la taille maximale de fichier acceptée est de 10 Mo. Pour les
              fichiers plus volumineux, vous pouvez les diviser en plusieurs
              parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
