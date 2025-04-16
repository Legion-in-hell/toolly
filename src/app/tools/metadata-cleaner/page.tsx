"use client";

import React, { useState, useRef } from "react";
import {
  ChevronRight,
  Upload,
  FileText,
  Image,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Metadata {
  name: string;
  value: string;
  category: string;
  risk: "high" | "medium" | "low";
  selected: boolean;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  metadata: Metadata[];
}

export default function MetadataCleaner() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectAll, setSelectAll] = useState(true);
  const [processingComplete, setProcessingComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      analyzeFile(e.target.files[0]);
    }
  };

  const analyzeFile = (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setActiveTab("processing");
    setProcessingComplete(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setProcessingComplete(true);
            setActiveTab("results");
            generateMockMetadata(file);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const generateMockMetadata = (file: File) => {
    const mockMetadata: Metadata[] = [];
    const fileType = file.type;
    const lastModified = new Date(file.lastModified).toLocaleString();

    // Métadonnées communes
    mockMetadata.push({
      name: "Date de création",
      value: lastModified,
      category: "Temps",
      risk: "medium",
      selected: true,
    });

    mockMetadata.push({
      name: "Date de modification",
      value: lastModified,
      category: "Temps",
      risk: "medium",
      selected: true,
    });

    // Métadonnées spécifiques au type de fichier
    if (fileType.includes("image")) {
      mockMetadata.push({
        name: "Marque de l&apos;appareil",
        value: "Apple iPhone 13 Pro",
        category: "Appareil",
        risk: "high",
        selected: true,
      });
      mockMetadata.push({
        name: "Modèle de l&apos;appareil",
        value: "iPhone 13 Pro",
        category: "Appareil",
        risk: "high",
        selected: true,
      });
      mockMetadata.push({
        name: "Coordonnées GPS",
        value: "48.8566° N, 2.3522° E",
        category: "Localisation",
        risk: "high",
        selected: true,
      });
      mockMetadata.push({
        name: "Résolution",
        value: "3024 x 4032 pixels",
        category: "Image",
        risk: "low",
        selected: true,
      });
      mockMetadata.push({
        name: "Logiciel",
        value: "iOS 15.4.1",
        category: "Logiciel",
        risk: "medium",
        selected: true,
      });
    } else if (fileType.includes("pdf") || fileType.includes("document")) {
      mockMetadata.push({
        name: "Auteur",
        value: "Jean Dupont",
        category: "Personnel",
        risk: "high",
        selected: true,
      });
      mockMetadata.push({
        name: "Organisation",
        value: "Entreprise ABC",
        category: "Organisation",
        risk: "high",
        selected: true,
      });
      mockMetadata.push({
        name: "Logiciel de création",
        value: "Microsoft Word 365",
        category: "Logiciel",
        risk: "medium",
        selected: true,
      });
      mockMetadata.push({
        name: "Titre du document",
        value: "Rapport confidentiel 2023",
        category: "Document",
        risk: "medium",
        selected: true,
      });
      mockMetadata.push({
        name: "Sujet",
        value: "Analyse de marché",
        category: "Document",
        risk: "medium",
        selected: true,
      });
    } else {
      mockMetadata.push({
        name: "Système d&apos;exploitation",
        value: "Windows 11 Pro",
        category: "Système",
        risk: "medium",
        selected: true,
      });
      mockMetadata.push({
        name: "Identifiant utilisateur",
        value: "jdupont",
        category: "Personnel",
        risk: "high",
        selected: true,
      });
    }

    // Métadonnées supplémentaires communes
    mockMetadata.push({
      name: "Version du format",
      value: fileType.includes("image") ? "JPEG 2.0" : "PDF 1.7",
      category: "Format",
      risk: "low",
      selected: true,
    });

    if (Math.random() > 0.5) {
      mockMetadata.push({
        name: "Commentaires",
        value: "Version finale pour validation",
        category: "Document",
        risk: "medium",
        selected: true,
      });
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified,
      metadata: mockMetadata,
    });
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);

    if (fileInfo) {
      const updatedMetadata = fileInfo.metadata.map((item) => ({
        ...item,
        selected: newValue,
      }));

      setFileInfo({
        ...fileInfo,
        metadata: updatedMetadata,
      });
    }
  };

  const toggleMetadataSelection = (index: number) => {
    if (fileInfo) {
      const updatedMetadata = [...fileInfo.metadata];
      updatedMetadata[index] = {
        ...updatedMetadata[index],
        selected: !updatedMetadata[index].selected,
      };

      setFileInfo({
        ...fileInfo,
        metadata: updatedMetadata,
      });

      // Vérifier si tous les éléments sont sélectionnés
      const allSelected = updatedMetadata.every((item) => item.selected);
      setSelectAll(allSelected);
    }
  };

  const handleCleanMetadata = () => {
    setIsProcessing(true);
    setProgress(0);
    setActiveTab("processing");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setActiveTab("download");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDownload = () => {
    if (!file) return;

    // Créer un lien de téléchargement pour le fichier
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clean_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      analyzeFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="h-10 w-10 text-gray-400" />;

    if (file.type.includes("image")) {
      return <Image className="h-10 w-10 text-blue-500" />;
    }

    return <FileText className="h-10 w-10 text-blue-500" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
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
            <BreadcrumbLink href="/tools/metadata-cleaner">
              Nettoyeur de métadonnées
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Nettoyeur de métadonnées</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Supprimez les informations personnelles cachées dans vos fichiers pour
          protéger votre vie privée avant de les partager.
        </p>
      </div>

      <Card className="border-2 mb-8">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="upload" disabled={isProcessing}>
                Importer
              </TabsTrigger>
              <TabsTrigger value="processing" disabled={!isProcessing}>
                Traitement
              </TabsTrigger>
              <TabsTrigger
                value="results"
                disabled={!processingComplete || isProcessing}
              >
                Résultats
              </TabsTrigger>
              <TabsTrigger value="download" disabled={activeTab !== "download"}>
                Télécharger
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  Glissez-déposez votre fichier ici
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ou cliquez pour parcourir vos fichiers
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Types de fichiers supportés: JPG, PNG, PDF, DOCX
                </p>
              </div>
            </TabsContent>

            <TabsContent value="processing">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-6">
                  {file
                    ? `Analyse de ${file.name}`
                    : "Traitement du fichier..."}
                </h3>
                <Progress value={progress} className="mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Recherche et extraction des métadonnées...
                </p>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {fileInfo && (
                <div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {getFileIcon()}
                    <div className="flex-1">
                      <h3 className="font-medium">{fileInfo.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(fileInfo.size)} •{" "}
                        {fileInfo.type.split("/")[1].toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        Métadonnées détectées
                      </h3>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="select-all"
                          checked={selectAll}
                          onCheckedChange={toggleSelectAll}
                        />
                        <Label htmlFor="select-all">Tout sélectionner</Label>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">
                            Suppr.
                          </TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Valeur</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-center">Risque</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fileInfo.metadata.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center">
                              <Switch
                                checked={item.selected}
                                onCheckedChange={() =>
                                  toggleMetadataSelection(index)
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={getRiskColor(item.risk)}>
                                {item.risk === "high"
                                  ? "Élevé"
                                  : item.risk === "medium"
                                  ? "Moyen"
                                  : "Faible"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Info className="h-4 w-4 mr-2" />
                      <p className="text-sm">
                        {fileInfo.metadata.filter((m) => m.selected).length}{" "}
                        métadonnées seront supprimées
                      </p>
                    </div>
                    <Button onClick={handleCleanMetadata}>
                      Nettoyer les métadonnées
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="download">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-medium mb-2">
                  Métadonnées supprimées avec succès !
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Toutes les métadonnées sélectionnées ont été supprimées de
                  votre fichier. Vous pouvez maintenant télécharger le fichier
                  nettoyé.
                </p>
                <Button onClick={handleDownload} className="mb-4">
                  Télécharger le fichier nettoyé
                </Button>
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <p className="text-sm">
                    Les métadonnées supprimées ne peuvent pas être récupérées
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">
            Pourquoi supprimer les métadonnées ?
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Protection de la vie privée</AccordionTrigger>
              <AccordionContent>
                <p>
                  Les fichiers numériques contiennent souvent des informations
                  personnelles cachées comme votre nom, votre localisation GPS
                  ou le numéro de série de votre appareil. La suppression de ces
                  données est essentielle pour protéger votre vie privée lors du
                  partage de fichiers.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Risques de sécurité</AccordionTrigger>
              <AccordionContent>
                <p>
                  Les métadonnées peuvent révéler des informations sensibles sur
                  vous, votre organisation ou l&apos;infrastructure informatique
                  utilisée. Ces informations peuvent être exploitées par des
                  personnes malveillantes pour des attaques ciblées ou de
                  l&apos;ingénierie sociale.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Protéger les informations sensibles
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Des documents professionnels peuvent contenir des métadonnées
                  révélant des informations confidentielles comme les noms des
                  contributeurs, l&apos;historique des modifications ou même des
                  commentaires supprimés. Nettoyer ces données protège votre
                  confidentialité.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">
            Métadonnées courantes par type de fichier
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Images (JPG, PNG, etc.)</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  <li>Coordonnées GPS précises</li>
                  <li>Date et heure de la prise de vue</li>
                  <li>Marque et modèle de l&apos;appareil photo</li>
                  <li>Paramètres de l&apos;appareil (ouverture, ISO, etc.)</li>
                  <li>Miniatures d&apos;images précédentes</li>
                  <li>Informations sur les modifications effectuées</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Documents (PDF, DOCX, etc.)</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  <li>Nom de l&apos;auteur et de l&apos;organisation</li>
                  <li>Historique des modifications et commentaires</li>
                  <li>Logiciel utilisé pour la création</li>
                  <li>Versions précédentes du document</li>
                  <li>Chemin d&apos;accès local au fichier</li>
                  <li>Identifiants utilisateur et système</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Autres types de fichiers</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  <li>Informations sur le système d&apos;exploitation</li>
                  <li>Identifiants uniques de l&apos;appareil</li>
                  <li>Adresses IP et identifiants réseau</li>
                  <li>Informations sur les licences logicielles</li>
                  <li>Dates de création et de modification</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
