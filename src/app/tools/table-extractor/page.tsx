/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef } from "react";
import {
  ChevronRight,
  Upload,
  Download,
  Copy,
  Table as TableIcon,
  CheckCircle,
  AlertTriangle,
  Filter,
  PanelLeft,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

interface ExtractedTable {
  id: string;
  name: string;
  rows: string[][];
  pageNumber: number;
  position: string;
}

export default function TableExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  const [extractedTables, setExtractedTables] = useState<ExtractedTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [filterHeaderRow, setFilterHeaderRow] = useState(true);
  const [autoDetectTypes, setAutoDetectTypes] = useState(true);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type.includes("image/") ||
        selectedFile.type.includes("excel") ||
        selectedFile.type.includes("spreadsheet")
      ) {
        setFile(selectedFile);
        extractTablesFromFile(selectedFile);
      } else {
        alert(
          "Veuillez sélectionner un fichier PDF, image ou un document contenant des tableaux."
        );
      }
    }
  };

  const extractTablesFromFile = (file: File) => {
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
            generateMockTables(file);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const generateMockTables = (_file: File) => {
    const mockTables: ExtractedTable[] = [
      {
        id: "table1",
        name: "Tableau 1",
        rows: [
          ["Produit", "Quantité", "Prix unitaire", "Total"],
          ["Ordinateur portable", "2", "899.99", "1799.98"],
          ['Écran 24"', "3", "249.50", "748.50"],
          ["Clavier sans fil", "5", "59.99", "299.95"],
          ["Souris ergonomique", "5", "45.00", "225.00"],
          ["Casque audio", "2", "129.99", "259.98"],
        ],
        pageNumber: 1,
        position: "Haut",
      },
      {
        id: "table2",
        name: "Tableau 2",
        rows: [
          ["Mois", "Revenus", "Dépenses", "Bénéfice"],
          ["Janvier", "12500", "8750", "3750"],
          ["Février", "14200", "9100", "5100"],
          ["Mars", "15800", "10200", "5600"],
          ["Avril", "13900", "9300", "4600"],
          ["Mai", "16700", "9900", "6800"],
          ["Juin", "18500", "11200", "7300"],
        ],
        pageNumber: 2,
        position: "Milieu",
      },
      {
        id: "table3",
        name: "Tableau 3",
        rows: [
          ["Pays", "Population", "Superficie (km²)", "Densité (hab/km²)"],
          ["France", "67390000", "551695", "122.15"],
          ["Allemagne", "83240000", "357588", "232.78"],
          ["Espagne", "47350000", "505990", "93.58"],
          ["Italie", "60360000", "301338", "200.31"],
          ["Royaume-Uni", "66650000", "243610", "273.59"],
        ],
        pageNumber: 3,
        position: "Bas",
      },
    ];

    setExtractedTables(mockTables);
    setSelectedTable(mockTables[0].id);
  };

  const getCurrentTable = (): ExtractedTable | undefined => {
    return extractedTables.find((table) => table.id === selectedTable);
  };

  const convertTableToFormat = (
    table: ExtractedTable,
    format: string
  ): string => {
    if (!table) return "";

    switch (format) {
      case "csv":
        return table.rows.map((row) => row.join(",")).join("\n");

      case "json":
        if (filterHeaderRow && table.rows.length > 1) {
          const headers = table.rows[0];
          const data = table.rows.slice(1).map((row) => {
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || "";
            });
            return obj;
          });
          return JSON.stringify(data, null, 2);
        }
        return JSON.stringify(table.rows, null, 2);

      case "excel":
        return "Format Excel non disponible en prévisualisation";

      case "html":
        let html = '<table border="1" cellpadding="5" cellspacing="0">\n';
        if (filterHeaderRow && table.rows.length > 1) {
          html += "  <thead>\n    <tr>\n";
          table.rows[0].forEach((cell) => {
            html += `      <th>${cell}</th>\n`;
          });
          html += "    </tr>\n  </thead>\n  <tbody>\n";

          table.rows.slice(1).forEach((row) => {
            html += "    <tr>\n";
            row.forEach((cell) => {
              html += `      <td>${cell}</td>\n`;
            });
            html += "    </tr>\n";
          });
          html += "  </tbody>\n";
        } else {
          table.rows.forEach((row) => {
            html += "    <tr>\n";
            row.forEach((cell) => {
              html += `      <td>${cell}</td>\n`;
            });
            html += "    </tr>\n";
          });
        }
        html += "</table>";
        return html;

      case "markdown":
        let md = "";
        if (table.rows.length > 0) {
          // Entêtes
          md += "| " + table.rows[0].join(" | ") + " |\n";
          // Séparateurs
          md += "| " + table.rows[0].map(() => "---").join(" | ") + " |\n";
          // Données
          table.rows.slice(1).forEach((row) => {
            md += "| " + row.join(" | ") + " |\n";
          });
        }
        return md;

      default:
        return table.rows.map((row) => row.join("\t")).join("\n");
    }
  };

  const handleCopyToClipboard = () => {
    const table = getCurrentTable();
    if (!table) return;

    const formattedData = convertTableToFormat(table, selectedFormat);
    navigator.clipboard.writeText(formattedData);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const table = getCurrentTable();
    if (!table) return;

    const formattedData = convertTableToFormat(table, selectedFormat);

    let mimeType = "text/plain";
    let extension = "txt";

    switch (selectedFormat) {
      case "csv":
        mimeType = "text/csv";
        extension = "csv";
        break;
      case "json":
        mimeType = "application/json";
        extension = "json";
        break;
      case "html":
        mimeType = "text/html";
        extension = "html";
        break;
      case "markdown":
        mimeType = "text/markdown";
        extension = "md";
        break;
      case "excel":
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = "xlsx";
        break;
    }

    const blob = new Blob([formattedData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table.name.replace(/\s+/g, "_")}.${extension}`;
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
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type.includes("image/") ||
        droppedFile.type.includes("excel") ||
        droppedFile.type.includes("spreadsheet")
      ) {
        setFile(droppedFile);
        extractTablesFromFile(droppedFile);
      } else {
        alert(
          "Veuillez sélectionner un fichier PDF, image ou un document contenant des tableaux."
        );
      }
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
            <BreadcrumbLink href="/tools/table-extractor">
              Extracteur de tableaux
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Extracteur de tableaux</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Extrayez facilement des tableaux depuis des PDF ou des images et
          exportez-les dans différents formats pour analyse.
        </p>
      </div>

      <Card className="border-2 mb-8">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
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
                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
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
                  Types de fichiers supportés: PDF, JPG, PNG, Excel
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Fonctionnalités</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TableIcon className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Extraction précise</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Détection intelligente des structures de tableaux dans vos
                      documents.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Filter className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Nettoyage automatique</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Correction des erreurs de reconnaissance et nettoyage des
                      données.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Download className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Multiples formats</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Exportez en CSV, Excel, JSON, HTML ou Markdown selon vos
                      besoins.
                    </p>
                  </div>
                </div>
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
                  Détection et extraction des tableaux en cours...
                </p>

                {progress > 30 && progress < 80 && (
                  <div className="mt-6 text-left max-w-md mx-auto">
                    <p className="text-sm mb-2 font-medium">
                      Étapes de traitement:
                    </p>
                    <ul className="text-sm space-y-1 text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Préparation du document
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Détection des zones de tableaux
                      </li>
                      {progress > 50 && (
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Reconnaissance des cellules
                        </li>
                      )}
                      {progress > 70 && (
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Extraction du texte
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results">
              {extractedTables.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 border-r pr-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Tableaux détectés</h3>
                      <Badge>{extractedTables.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {extractedTables.map((table) => (
                        <div
                          key={table.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedTable === table.id
                              ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setSelectedTable(table.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{table.name}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {table.rows.length} lignes
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Page {table.position} - {table.pageNumber}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="export-format"
                          className="block font-medium mb-2"
                        >
                          Format d&apos;export
                        </Label>
                        <Select
                          value={selectedFormat}
                          onValueChange={setSelectedFormat}
                        >
                          <SelectTrigger id="export-format">
                            <SelectValue placeholder="Choisir un format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="markdown">Markdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="filter-header"
                            checked={filterHeaderRow}
                            onCheckedChange={setFilterHeaderRow}
                          />
                          <Label htmlFor="filter-header">
                            Traiter la première ligne comme en-tête
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="auto-detect"
                            checked={autoDetectTypes}
                            onCheckedChange={setAutoDetectTypes}
                          />
                          <Label htmlFor="auto-detect">
                            Détecter automatiquement les types de données
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show-preview"
                            checked={showPreview}
                            onCheckedChange={setShowPreview}
                          />
                          <Label htmlFor="show-preview">
                            Afficher l&apos;aperçu
                          </Label>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button className="w-full" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleCopyToClipboard}
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copier
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {getCurrentTable() && (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-medium">
                            {getCurrentTable()?.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              {showPreview ? (
                                <>
                                  <PanelLeft className="h-4 w-4 mr-2" />
                                  Masquer l&apos;aperçu
                                </>
                              ) : (
                                <>
                                  <TableIcon className="h-4 w-4 mr-2" />
                                  Afficher le tableau
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {showPreview ? (
                          <div className="border rounded-lg overflow-auto">
                            <Table>
                              <TableHeader>
                                {getCurrentTable()?.rows[0] && (
                                  <TableRow>
                                    {getCurrentTable()?.rows[0].map(
                                      (cell, cellIndex) => (
                                        <TableHead key={cellIndex}>
                                          {cell}
                                        </TableHead>
                                      )
                                    )}
                                  </TableRow>
                                )}
                              </TableHeader>
                              <TableBody>
                                {getCurrentTable()
                                  ?.rows.slice(1)
                                  .map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                          {cell}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-auto bg-gray-50 dark:bg-gray-800 h-96">
                            {getCurrentTable() &&
                              convertTableToFormat(
                                getCurrentTable()!,
                                selectedFormat
                              )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucun tableau détecté
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Nous n&apos;avons pas pu détecter de tableaux dans ce
                    document. Essayez un autre fichier ou assurez-vous que le
                    document contient des tableaux bien structurés.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setActiveTab("upload");
                    }}
                  >
                    Essayer un autre fichier
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">
            Types de fichiers pris en charge
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Documents PDF</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Les fichiers PDF peuvent contenir des tableaux sous forme
                  structurée ou en tant qu&apos;images. Notre outil peut
                  extraire les deux types.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Extraction de tableaux sur plusieurs pages</li>
                  <li>Détection de l&apos;orientation des tableaux</li>
                  <li>Reconnaissance des cellules fusionnées</li>
                  <li>
                    Prise en charge des tableaux avec bordures partielles ou
                    sans bordures
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Images (JPG, PNG)</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Notre outil peut extraire des tableaux à partir d&apos;images
                  scannées ou de captures d&apos;écran.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Reconnaissance optique de caractères (OCR) intégrée</li>
                  <li>
                    Détection de tableaux même avec une qualité d&apos;image
                    moyenne
                  </li>
                  <li>
                    Correction automatique de la perspective et de la rotation
                  </li>
                  <li>
                    Optimisation pour les captures d&apos;écran de tableaux web
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Fichiers Excel/Spreadsheet</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Vous pouvez également importer des fichiers Excel pour les
                  convertir vers d&apos;autres formats.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Prise en charge des formats XLSX, XLS, ODS</li>
                  <li>Extraction des feuilles multiples</li>
                  <li>
                    Préservation des formules lors de l&apos;export vers des
                    formats compatibles
                  </li>
                  <li>Gestion des styles et formatages conditionnels</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">Formats d&apos;export</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>CSV</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Format le plus universel pour l&apos;échange de données
                  tabulaires.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Compatible avec tous les logiciels de tableur</li>
                  <li>
                    Idéal pour l&apos;importation dans des bases de données
                  </li>
                  <li>Structure légère et facile à manipuler</li>
                  <li>
                    Options de personnalisation du délimiteur (virgule,
                    point-virgule)
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Excel</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Format natif Microsoft Excel pour une édition avancée.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>
                    Préservation des types de données (nombres, dates, texte)
                  </li>
                  <li>Support des formules et fonctions</li>
                  <li>Possibilité d&apos;ajouter plusieurs feuilles</li>
                  <li>Formatage conditionnel et styles visuels</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>JSON</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Format idéal pour l&apos;intégration avec des applications web
                  et API.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Structure de données hiérarchique</li>
                  <li>Parfait pour le développement web et les API REST</li>
                  <li>Options pour array simple ou objets avec clés</li>
                  <li>Support des types de données avancés</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>HTML</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Pour intégration directe dans des pages web.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Tableau HTML standard avec balises &lt;table&gt;</li>
                  <li>Options pour personnaliser le style CSS</li>
                  <li>Distinction entre entêtes et données</li>
                  <li>
                    Facilement intégrable dans n&apos;importe quel site web
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Markdown</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Format léger pour documentation et fichiers README.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                  <li>Compatible avec GitHub, GitLab et autres plateformes</li>
                  <li>Format lisible même sous forme de texte brut</li>
                  <li>Idéal pour la documentation technique</li>
                  <li>Conversion facile vers d&apos;autres formats</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
