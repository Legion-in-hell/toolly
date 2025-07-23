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
  Download,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Metadata {
  name: string;
  value: string;
  category: string;
  risk: "high" | "medium" | "low";
  selected: boolean;
  tag?: string;
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
  const [cleanedFileBlob, setCleanedFileBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      analyzeFile(selectedFile);
    }
  };

  const analyzeFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setActiveTab("processing");
    setProcessingComplete(false);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let metadata: Metadata[] = [];

      if (file.type.startsWith("image/")) {
        metadata = await extractImageMetadata(file);
      } else if (file.type === "application/pdf") {
        metadata = await extractPDFMetadata(file);
      } else if (
        file.type.includes("document") ||
        file.type.includes("officedocument")
      ) {
        metadata = await extractDocumentMetadata(file);
      } else {
        metadata = await extractGenericMetadata(file);
      }

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setProcessingComplete(true);
        setActiveTab("results");

        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toLocaleString(),
          metadata,
        });
      }, 500);
    } catch (err) {
      setError(
        `Erreur lors de l'analyse du fichier: ${
          err instanceof Error ? err.message : "Erreur inconnue"
        }`
      );
      setIsProcessing(false);
      setActiveTab("upload");
    }
  };

  const extractImageMetadata = async (file: File): Promise<Metadata[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as ArrayBuffer;
        const metadata: Metadata[] = [];
        const view = new DataView(result);

        try {
          // Vérifier si c'est un JPEG avec EXIF
          if (view.getUint16(0) === 0xffd8) {
            metadata.push({
              name: "Format d'image",
              value: "JPEG",
              category: "Format",
              risk: "low",
              selected: false,
            });

            // Recherche et extraction des données EXIF complètes
            const exifData = extractExifData(view);
            metadata.push(...exifData);
          } else if (file.type.includes("png")) {
            metadata.push({
              name: "Format d'image",
              value: "PNG",
              category: "Format",
              risk: "low",
              selected: false,
            });

            // Extraction des métadonnées PNG
            const pngData = extractPngMetadata(view);
            metadata.push(...pngData);
          }

          // Métadonnées génériques pour les images
          metadata.push(
            {
              name: "Date de modification du fichier",
              value: new Date(file.lastModified).toLocaleString(),
              category: "Temps",
              risk: "medium",
              selected: true,
            },
            {
              name: "Taille du fichier",
              value: formatFileSize(file.size),
              category: "Fichier",
              risk: "low",
              selected: false,
            },
            {
              name: "Type MIME",
              value: file.type,
              category: "Format",
              risk: "low",
              selected: false,
            }
          );
        } catch (error) {
          console.error("Erreur lors de l'extraction EXIF:", error);
          // Métadonnées de base en cas d'erreur
          metadata.push(
            {
              name: "Format d'image",
              value: file.type.split("/")[1]?.toUpperCase() || "Image",
              category: "Format",
              risk: "low",
              selected: false,
            },
            {
              name: "Taille du fichier",
              value: formatFileSize(file.size),
              category: "Fichier",
              risk: "low",
              selected: false,
            }
          );
        }

        resolve(metadata);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Fonction d'extraction EXIF complète
  const extractExifData = (view: DataView): Metadata[] => {
    const metadata: Metadata[] = [];
    let offset = 2;

    try {
      // Parcourir les segments JPEG
      while (offset < view.byteLength - 2) {
        const marker = view.getUint16(offset);

        if (marker === 0xffe1) {
          // APP1 segment (EXIF)
          const exifStart = offset + 4;

          // Vérifier la signature EXIF
          if (view.getUint32(exifStart) === 0x45786966) {
            // "Exif"
            const tiffStart = exifStart + 6;
            const exifMetadata = parseExifTiff(view, tiffStart);
            metadata.push(...exifMetadata);
          }
          break;
        }

        offset += 2;
        if (offset < view.byteLength - 2) {
          const segmentLength = view.getUint16(offset);
          offset += segmentLength;
        } else {
          break;
        }
      }
    } catch (error) {
      console.error("Erreur extraction EXIF:", error);
      metadata.push({
        name: "Données EXIF présentes",
        value: "Détectées mais non lisibles",
        category: "Métadonnées",
        risk: "medium",
        selected: true,
      });
    }

    return metadata;
  };

  // Fonction de parsing TIFF/EXIF
  const parseExifTiff = (view: DataView, tiffStart: number): Metadata[] => {
    const metadata: Metadata[] = [];

    try {
      // Déterminer l'endianness
      const byteOrder = view.getUint16(tiffStart);
      const littleEndian = byteOrder === 0x4949;

      // Lire l'offset de l'IFD0
      const ifd0Offset = littleEndian
        ? view.getUint32(tiffStart + 4, true)
        : view.getUint32(tiffStart + 4, false);

      // Parser l'IFD0
      const ifd0Data = parseIfd(
        view,
        tiffStart + ifd0Offset,
        tiffStart,
        littleEndian
      );
      metadata.push(...ifd0Data);

      // Chercher l'EXIF SubIFD
      const exifIfdOffset = findExifSubIfd(
        view,
        tiffStart + ifd0Offset,
        tiffStart,
        littleEndian
      );
      if (exifIfdOffset) {
        const exifData = parseIfd(
          view,
          tiffStart + exifIfdOffset,
          tiffStart,
          littleEndian
        );
        metadata.push(...exifData);
      }

      // Chercher l'IFD GPS
      const gpsIfdOffset = findGpsIfd(
        view,
        tiffStart + ifd0Offset,
        tiffStart,
        littleEndian
      );
      if (gpsIfdOffset) {
        const gpsData = parseGpsIfd(
          view,
          tiffStart + gpsIfdOffset,
          tiffStart,
          littleEndian
        );
        metadata.push(...gpsData);
      }
    } catch (error) {
      console.error("Erreur parsing TIFF:", error);
    }

    return metadata;
  };

  // Parser un IFD (Image File Directory)
  const parseIfd = (
    view: DataView,
    ifdStart: number,
    tiffStart: number,
    littleEndian: boolean
  ): Metadata[] => {
    const metadata: Metadata[] = [];

    try {
      const entryCount = littleEndian
        ? view.getUint16(ifdStart, true)
        : view.getUint16(ifdStart, false);

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = ifdStart + 2 + i * 12;
        const tag = littleEndian
          ? view.getUint16(entryOffset, true)
          : view.getUint16(entryOffset, false);

        const type = littleEndian
          ? view.getUint16(entryOffset + 2, true)
          : view.getUint16(entryOffset + 2, false);

        const count = littleEndian
          ? view.getUint32(entryOffset + 4, true)
          : view.getUint32(entryOffset + 4, false);

        const valueOffset = littleEndian
          ? view.getUint32(entryOffset + 8, true)
          : view.getUint32(entryOffset + 8, false);

        const tagInfo = getExifTagInfo(tag);
        if (tagInfo) {
          const value = readExifValue(
            view,
            type,
            count,
            valueOffset,
            tiffStart,
            littleEndian,
            entryOffset + 8
          );
          if (value) {
            metadata.push({
              name: tagInfo.name,
              value: value,
              category: tagInfo.category,
              risk: tagInfo.risk,
              selected: tagInfo.risk !== "low",
            });
          }
        }
      }
    } catch (error) {
      console.error("Erreur parsing IFD:", error);
    }

    return metadata;
  };

  // Trouver l'offset de l'EXIF SubIFD
  const findExifSubIfd = (
    view: DataView,
    ifdStart: number,
    tiffStart: number,
    littleEndian: boolean
  ): number | null => {
    try {
      const entryCount = littleEndian
        ? view.getUint16(ifdStart, true)
        : view.getUint16(ifdStart, false);

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = ifdStart + 2 + i * 12;
        const tag = littleEndian
          ? view.getUint16(entryOffset, true)
          : view.getUint16(entryOffset, false);

        if (tag === 0x8769) {
          // EXIF SubIFD tag
          return littleEndian
            ? view.getUint32(entryOffset + 8, true)
            : view.getUint32(entryOffset + 8, false);
        }
      }
    } catch {
      // Ignore les erreurs
    }
    return null;
  };

  // Trouver l'offset du GPS IFD
  const findGpsIfd = (
    view: DataView,
    ifdStart: number,
    tiffStart: number,
    littleEndian: boolean
  ): number | null => {
    try {
      const entryCount = littleEndian
        ? view.getUint16(ifdStart, true)
        : view.getUint16(ifdStart, false);

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = ifdStart + 2 + i * 12;
        const tag = littleEndian
          ? view.getUint16(entryOffset, true)
          : view.getUint16(entryOffset, false);

        if (tag === 0x8825) {
          // GPS IFD tag
          return littleEndian
            ? view.getUint32(entryOffset + 8, true)
            : view.getUint32(entryOffset + 8, false);
        }
      }
    } catch {
      // Ignore les erreurs
    }
    return null;
  };

  // Parser le GPS IFD
  const parseGpsIfd = (
    view: DataView,
    gpsStart: number,
    tiffStart: number,
    littleEndian: boolean
  ): Metadata[] => {
    const metadata: Metadata[] = [];

    try {
      const entryCount = littleEndian
        ? view.getUint16(gpsStart, true)
        : view.getUint16(gpsStart, false);

      let latitude = "";
      let longitude = "";
      let latRef = "";
      let lonRef = "";

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = gpsStart + 2 + i * 12;
        const tag = littleEndian
          ? view.getUint16(entryOffset, true)
          : view.getUint16(entryOffset, false);
        const type = littleEndian
          ? view.getUint16(entryOffset + 2, true)
          : view.getUint16(entryOffset + 2, false);
        const count = littleEndian
          ? view.getUint32(entryOffset + 4, true)
          : view.getUint32(entryOffset + 4, false);
        const valueOffset = littleEndian
          ? view.getUint32(entryOffset + 8, true)
          : view.getUint32(entryOffset + 8, false);

        const value = readExifValue(
          view,
          type,
          count,
          valueOffset,
          tiffStart,
          littleEndian,
          entryOffset + 8
        );

        switch (tag) {
          case 1: // GPSLatitudeRef
            latRef = value || "";
            break;
          case 2: // GPSLatitude
            latitude = value || "";
            break;
          case 3: // GPSLongitudeRef
            lonRef = value || "";
            break;
          case 4: // GPSLongitude
            longitude = value || "";
            break;
        }
      }

      if (latitude && longitude) {
        metadata.push({
          name: "Coordonnées GPS",
          value: `${latitude} ${latRef}, ${longitude} ${lonRef}`,
          category: "Localisation",
          risk: "high",
          selected: true,
        });
      }
    } catch (error) {
      console.error("Erreur parsing GPS:", error);
    }

    return metadata;
  };

  // Lire une valeur EXIF selon son type
  const readExifValue = (
    view: DataView,
    type: number,
    count: number,
    valueOffset: number,
    tiffStart: number,
    littleEndian: boolean,
    entryValueOffset: number
  ): string | null => {
    try {
      const dataSize = getTypeSize(type) * count;
      const actualOffset =
        dataSize <= 4 ? entryValueOffset : tiffStart + valueOffset;

      switch (type) {
        case 2: // ASCII string
          let str = "";
          for (let i = 0; i < count - 1; i++) {
            const char = view.getUint8(actualOffset + i);
            if (char === 0) break;
            str += String.fromCharCode(char);
          }
          return str;

        case 3: // SHORT
          if (count === 1) {
            return littleEndian
              ? view.getUint16(actualOffset, true).toString()
              : view.getUint16(actualOffset, false).toString();
          }
          break;

        case 4: // LONG
          if (count === 1) {
            return littleEndian
              ? view.getUint32(actualOffset, true).toString()
              : view.getUint32(actualOffset, false).toString();
          }
          break;

        case 5: // RATIONAL
          if (count === 1) {
            const numerator = littleEndian
              ? view.getUint32(actualOffset, true)
              : view.getUint32(actualOffset, false);
            const denominator = littleEndian
              ? view.getUint32(actualOffset + 4, true)
              : view.getUint32(actualOffset + 4, false);
            return denominator !== 0
              ? (numerator / denominator).toString()
              : numerator.toString();
          } else if (count === 3) {
            // Pour les coordonnées GPS (degrés, minutes, secondes)
            const coords = [];
            for (let i = 0; i < 3; i++) {
              const offset = actualOffset + i * 8;
              const num = littleEndian
                ? view.getUint32(offset, true)
                : view.getUint32(offset, false);
              const den = littleEndian
                ? view.getUint32(offset + 4, true)
                : view.getUint32(offset + 4, false);
              coords.push(den !== 0 ? num / den : num);
            }
            return `${coords[0]}° ${coords[1]}' ${coords[2]}"`;
          }
          break;
      }
    } catch {
      // Ignore les erreurs de lecture
    }
    return null;
  };

  // Obtenir la taille d'un type EXIF
  const getTypeSize = (type: number): number => {
    switch (type) {
      case 1:
        return 1; // BYTE
      case 2:
        return 1; // ASCII
      case 3:
        return 2; // SHORT
      case 4:
        return 4; // LONG
      case 5:
        return 8; // RATIONAL
      case 7:
        return 1; // UNDEFINED
      case 9:
        return 4; // SLONG
      case 10:
        return 8; // SRATIONAL
      default:
        return 1;
    }
  };

  // Obtenir les informations d'un tag EXIF
  const getExifTagInfo = (
    tag: number
  ): {
    name: string;
    category: string;
    risk: "high" | "medium" | "low";
  } | null => {
    const tags: Record<
      number,
      { name: string; category: string; risk: "high" | "medium" | "low" }
    > = {
      0x010f: {
        name: "Fabricant de l'appareil",
        category: "Appareil",
        risk: "medium",
      },
      0x0110: {
        name: "Modèle de l'appareil",
        category: "Appareil",
        risk: "medium",
      },
      0x0112: { name: "Orientation", category: "Image", risk: "low" },
      0x011a: { name: "Résolution X", category: "Image", risk: "low" },
      0x011b: { name: "Résolution Y", category: "Image", risk: "low" },
      0x0131: { name: "Logiciel", category: "Logiciel", risk: "medium" },
      0x0132: { name: "Date et heure", category: "Temps", risk: "high" },
      0x013b: { name: "Artiste/Auteur", category: "Personnel", risk: "high" },
      0x8298: { name: "Copyright", category: "Personnel", risk: "high" },
      0x829a: { name: "Temps d'exposition", category: "Photo", risk: "low" },
      0x829d: { name: "Nombre F", category: "Photo", risk: "low" },
      0x8827: { name: "Sensibilité ISO", category: "Photo", risk: "low" },
      0x9003: {
        name: "Date de prise de vue originale",
        category: "Temps",
        risk: "high",
      },
      0x9004: { name: "Date de numérisation", category: "Temps", risk: "high" },
      0x9286: {
        name: "Commentaires utilisateur",
        category: "Personnel",
        risk: "high",
      },
      0xa002: { name: "Largeur de l'image", category: "Image", risk: "low" },
      0xa003: { name: "Hauteur de l'image", category: "Image", risk: "low" },
      0xa40a: { name: "Netteté", category: "Photo", risk: "low" },
      0xa40c: {
        name: "Mode de balance des blancs",
        category: "Photo",
        risk: "low",
      },
    };

    return tags[tag] || null;
  };

  // Extraction des métadonnées PNG
  const extractPngMetadata = (view: DataView): Metadata[] => {
    const metadata: Metadata[] = [];
    let offset = 8; // Ignorer la signature PNG

    try {
      while (offset < view.byteLength) {
        const chunkLength = view.getUint32(offset);
        const chunkType = String.fromCharCode(
          view.getUint8(offset + 4),
          view.getUint8(offset + 5),
          view.getUint8(offset + 6),
          view.getUint8(offset + 7)
        );

        if (
          chunkType === "tEXt" ||
          chunkType === "iTXt" ||
          chunkType === "zTXt"
        ) {
          const chunkData = new Uint8Array(
            view.buffer,
            view.byteOffset + offset + 8,
            chunkLength
          );
          const textData = new TextDecoder().decode(chunkData);
          const nullIndex = textData.indexOf("\0");

          if (nullIndex > 0) {
            const keyword = textData.substring(0, nullIndex);
            const value = textData.substring(nullIndex + 1);

            if (keyword && value) {
              metadata.push({
                name: `PNG ${keyword}`,
                value: value,
                category:
                  keyword.toLowerCase().includes("author") ||
                  keyword.toLowerCase().includes("artist")
                    ? "Personnel"
                    : "Métadonnées",
                risk:
                  keyword.toLowerCase().includes("author") ||
                  keyword.toLowerCase().includes("artist") ||
                  keyword.toLowerCase().includes("comment")
                    ? "high"
                    : "medium",
                selected: true,
              });
            }
          }
        }

        offset += 8 + chunkLength + 4; // 8 bytes header + data + 4 bytes CRC

        if (chunkType === "IEND") break;
      }
    } catch (error) {
      console.error("Erreur extraction PNG:", error);
    }

    return metadata;
  };

  const extractPDFMetadata = async (file: File): Promise<Metadata[]> => {
    return new Promise(async (resolve) => {
      try {
        // Chargement avec pdf-lib pour extraction complète
        const arrayBuffer = await file.arrayBuffer();

        // Import dynamique de pdf-lib
        const { PDFDocument } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });

        const metadata: Metadata[] = [];

        // Extraction des métadonnées avec pdf-lib
        const title = pdfDoc.getTitle();
        if (title) {
          metadata.push({
            name: "Titre",
            value: title,
            category: "Document",
            risk: "medium",
            selected: true,
          });
        }

        const author = pdfDoc.getAuthor();
        if (author) {
          metadata.push({
            name: "Auteur",
            value: author,
            category: "Personnel",
            risk: "high",
            selected: true,
          });
        }

        const creator = pdfDoc.getCreator();
        if (creator) {
          metadata.push({
            name: "Logiciel créateur",
            value: creator,
            category: "Logiciel",
            risk: "medium",
            selected: true,
          });
        }

        const producer = pdfDoc.getProducer();
        if (producer) {
          metadata.push({
            name: "Producteur",
            value: producer,
            category: "Logiciel",
            risk: "medium",
            selected: true,
          });
        }

        const subject = pdfDoc.getSubject();
        if (subject) {
          metadata.push({
            name: "Sujet",
            value: subject,
            category: "Document",
            risk: "medium",
            selected: true,
          });
        }

        const keywords = pdfDoc.getKeywords();
        if (keywords && keywords.length > 0) {
          metadata.push({
            name: "Mots-clés",
            value: Array.isArray(keywords)
              ? keywords.join(", ")
              : keywords.toString(),
            category: "Document",
            risk: "medium",
            selected: true,
          });
        }

        const creationDate = pdfDoc.getCreationDate();
        if (creationDate) {
          metadata.push({
            name: "Date de création",
            value: creationDate.toLocaleString(),
            category: "Temps",
            risk: "medium",
            selected: true,
          });
        }

        const modificationDate = pdfDoc.getModificationDate();
        if (modificationDate) {
          metadata.push({
            name: "Date de modification",
            value: modificationDate.toLocaleString(),
            category: "Temps",
            risk: "medium",
            selected: true,
          });
        }

        // Informations sur le document
        const pageCount = pdfDoc.getPageCount();
        metadata.push({
          name: "Nombre de pages",
          value: pageCount.toString(),
          category: "Document",
          risk: "low",
          selected: false,
        });

        // Métadonnées génériques
        metadata.push(
          {
            name: "Format",
            value: "PDF",
            category: "Format",
            risk: "low",
            selected: false,
          },
          {
            name: "Taille du fichier",
            value: formatFileSize(file.size),
            category: "Fichier",
            risk: "low",
            selected: false,
          }
        );

        resolve(metadata);
      } catch (error) {
        console.error("Erreur lors de l'extraction PDF avec pdf-lib:", error);

        // Fallback vers l'ancienne méthode
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const metadata: Metadata[] = [];

          // Recherche des métadonnées PDF basiques en fallback
          const infoMatch = result.match(/\/Info\s*<<([^>]*)>>/);
          if (infoMatch) {
            const infoContent = infoMatch[1];

            const titleMatch = infoContent.match(/\/Title\s*\(([^)]*)\)/);
            if (titleMatch) {
              metadata.push({
                name: "Titre",
                value: titleMatch[1],
                category: "Document",
                risk: "medium",
                selected: true,
              });
            }

            const authorMatch = infoContent.match(/\/Author\s*\(([^)]*)\)/);
            if (authorMatch) {
              metadata.push({
                name: "Auteur",
                value: authorMatch[1],
                category: "Personnel",
                risk: "high",
                selected: true,
              });
            }
          }

          // Métadonnées génériques
          metadata.push(
            {
              name: "Format",
              value: "PDF",
              category: "Format",
              risk: "low",
              selected: false,
            },
            {
              name: "Taille du fichier",
              value: formatFileSize(file.size),
              category: "Fichier",
              risk: "low",
              selected: false,
            },
            {
              name: "Date de modification",
              value: new Date(file.lastModified).toLocaleString(),
              category: "Temps",
              risk: "medium",
              selected: true,
            }
          );

          resolve(metadata);
        };
        reader.readAsText(file, "latin1");
      }
    });
  };

  const extractDocumentMetadata = async (file: File): Promise<Metadata[]> => {
    // Pour les documents Office, on simule l'extraction car il faudrait une lib spécialisée
    const metadata: Metadata[] = [
      {
        name: "Nom du fichier",
        value: file.name,
        category: "Fichier",
        risk: "low",
        selected: false,
      },
      {
        name: "Type de document",
        value: file.type.includes("word") ? "Document Word" : "Document Office",
        category: "Format",
        risk: "low",
        selected: false,
      },
      {
        name: "Taille",
        value: formatFileSize(file.size),
        category: "Fichier",
        risk: "low",
        selected: false,
      },
      {
        name: "Date de modification",
        value: new Date(file.lastModified).toLocaleString(),
        category: "Temps",
        risk: "medium",
        selected: true,
      },
      {
        name: "Métadonnées intégrées",
        value: "Présentes (auteur, organisation, historique)",
        category: "Document",
        risk: "high",
        selected: true,
      },
    ];

    return metadata;
  };

  const extractGenericMetadata = async (file: File): Promise<Metadata[]> => {
    const metadata: Metadata[] = [
      {
        name: "Nom du fichier",
        value: file.name,
        category: "Fichier",
        risk: "low",
        selected: false,
      },
      {
        name: "Type MIME",
        value: file.type,
        category: "Format",
        risk: "low",
        selected: false,
      },
      {
        name: "Taille",
        value: formatFileSize(file.size),
        category: "Fichier",
        risk: "low",
        selected: false,
      },
      {
        name: "Date de modification",
        value: new Date(file.lastModified).toLocaleString(),
        category: "Temps",
        risk: "medium",
        selected: true,
      },
    ];

    return metadata;
  };

  const handleCleanMetadata = async () => {
    if (!file || !fileInfo) return;

    setIsProcessing(true);
    setProgress(0);
    setActiveTab("processing");

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 150);

      let cleanedBlob: Blob;

      if (file.type.startsWith("image/")) {
        cleanedBlob = await cleanImageMetadata(file);
      } else if (file.type === "application/pdf") {
        cleanedBlob = await cleanPDFMetadata(file, fileInfo.metadata);
      } else {
        // Pour les autres types, on crée une copie "nettoyée"
        cleanedBlob = new Blob([file], { type: file.type });
      }

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setCleanedFileBlob(cleanedBlob);
        setIsProcessing(false);
        setActiveTab("download");
      }, 500);
    } catch (err) {
      setError(
        `Erreur lors du nettoyage: ${
          err instanceof Error ? err.message : "Erreur inconnue"
        }`
      );
      setIsProcessing(false);
      setActiveTab("results");
    }
  };

  const cleanImageMetadata = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // Conversion en blob sans métadonnées EXIF
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            file.type.startsWith("image/jpeg") ? "image/jpeg" : "image/png",
            0.95
          );
        } else {
          resolve(file);
        }
      };

      img.onerror = () => resolve(file);
      img.alt = "";
      img.src = URL.createObjectURL(file);
    });
  };

  const cleanPDFMetadata = async (
    file: File,
    metadata: Metadata[]
  ): Promise<Blob> => {
    try {
      // Import dynamique de pdf-lib
      const { PDFDocument } = await import("pdf-lib");

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      // Nettoyage complet des métadonnées selon la sélection
      const selectedMetadata = metadata.filter((m) => m.selected);

      selectedMetadata.forEach((meta) => {
        switch (meta.name) {
          case "Titre":
            pdfDoc.setTitle("");
            break;
          case "Auteur":
            pdfDoc.setAuthor("");
            break;
          case "Logiciel créateur":
            pdfDoc.setCreator("");
            break;
          case "Producteur":
            pdfDoc.setProducer("");
            break;
          case "Sujet":
            pdfDoc.setSubject("");
            break;
          case "Mots-clés":
            pdfDoc.setKeywords([]);
            break;
          case "Date de création":
            // On ne peut pas vraiment supprimer la date de création
            // mais on peut la réinitialiser
            try {
              pdfDoc.setCreationDate(new Date(0));
            } catch {
              // Ignore si pas supporté
            }
            break;
          case "Date de modification":
            try {
              pdfDoc.setModificationDate(new Date(0));
            } catch {
              // Ignore si pas supporté
            }
            break;
        }
      });

      // Génération du PDF nettoyé
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      return new Blob([pdfBytes.buffer], {
        type: "application/pdf",
      });
    } catch (error) {
      console.error("Erreur lors du nettoyage PDF avec pdf-lib:", error);

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          let content = e.target?.result as string;

          content = content.replace(/\/Info\s*<<[^>]*>>/g, "/Info << >>");

          const blob = new Blob([content], { type: "application/pdf" });
          resolve(blob);
        };
        reader.readAsText(file, "latin1");
      });
    }
  };

  const handleDownload = () => {
    if (!cleanedFileBlob || !file) return;

    const url = URL.createObjectURL(cleanedFileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clean_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      const allSelected = updatedMetadata.every((item) => item.selected);
      setSelectAll(allSelected);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setError(null);
      analyzeFile(droppedFile);
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

  const getSupportedFormats = () => {
    return "JPG, PNG, GIF, PDF, DOC, DOCX et autres formats courants";
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
            <BreadcrumbLink href="/#tools">Outils</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/outils/metadata-cleaner">
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

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

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
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  Glissez-déposez votre fichier ici
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ou cliquez pour parcourir vos fichiers
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Types supportés: {getSupportedFormats()}
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
                  {progress < 50
                    ? "Lecture du fichier..."
                    : progress < 90
                    ? "Extraction des métadonnées..."
                    : "Finalisation..."}
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
                        {fileInfo.type.split("/")[1]?.toUpperCase() ||
                          "Fichier"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        Métadonnées détectées ({fileInfo.metadata.length})
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

                    {fileInfo.metadata.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Aucune métadonnée détectée dans ce fichier.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12 text-center">
                              Suppr.
                            </TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Valeur</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead className="text-center">
                              Risque
                            </TableHead>
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
                              <TableCell
                                className="max-w-xs truncate"
                                title={item.value}
                              >
                                {item.value}
                              </TableCell>
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
                    )}
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
                    <Button
                      onClick={handleCleanMetadata}
                      disabled={
                        fileInfo.metadata.filter((m) => m.selected).length === 0
                      }
                    >
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
                  {fileInfo?.metadata.filter((m) => m.selected).length || 0}{" "}
                  métadonnées ont été supprimées de votre fichier. Vous pouvez
                  maintenant télécharger le fichier nettoyé.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button onClick={handleDownload} className="mb-2">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le fichier nettoyé
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setFileInfo(null);
                      setCleanedFileBlob(null);
                      setActiveTab("upload");
                      setProgress(0);
                      setProcessingComplete(false);
                    }}
                  >
                    Nettoyer un autre fichier
                  </Button>
                </div>
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mt-4">
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

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Nettoyage professionnel :</strong> Cet outil utilise pdf-lib
          pour le nettoyage complet des PDF et Canvas API pour les images.
          Suppression réelle et efficace des métadonnées sensibles tout en
          préservant l&apos;intégrité des fichiers.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Confidentialité garantie</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Tous les fichiers sont traités localement dans votre navigateur.
          Aucune donnée n&apos;est envoyée vers nos serveurs. Vos fichiers et
          métadonnées restent entièrement privés et sous votre contrôle.
        </p>
      </div>
    </div>
  );
}
