"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronRight,
  Link,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Info,
  Calendar,
  Download,
  Copy,
  Eye,
  TrendingUp,
} from "lucide-react";

// Import des types et utilitaires
import {
  QRType,
  HistoryItem,
  GeneratedQRCode,
  QRFormData,
} from "../../../types/qr";
import { useQRStats } from "../../../hooks/useQRStats";
import {
  generateQRCode,
  generateQRContent,
  createTrackedQR,
} from "../../../utils/qrGenerator";
import { QRFormFields } from "../../../components/QRFormFields";

const qrTypes: QRType[] = [
  { id: "url", name: "URL / Site web", icon: <Link className="h-4 w-4" /> },
  { id: "text", name: "Texte libre", icon: <Info className="h-4 w-4" /> },
  { id: "email", name: "Email", icon: <Mail className="h-4 w-4" /> },
  { id: "phone", name: "Téléphone", icon: <Phone className="h-4 w-4" /> },
  { id: "sms", name: "SMS", icon: <Phone className="h-4 w-4" /> },
  { id: "vcard", name: "Contact / vCard", icon: <Phone className="h-4 w-4" /> },
  {
    id: "location",
    name: "Localisation",
    icon: <MapPin className="h-4 w-4" />,
  },
  { id: "wifi", name: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  { id: "event", name: "Événement", icon: <Calendar className="h-4 w-4" /> },
];

export default function QRGenerator() {
  // États principaux
  const [qrType, setQrType] = useState("url");
  const [text, setText] = useState("https://toolly.fr");
  const [size, setSize] = useState(200);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "M"
  );
  const [margin, setMargin] = useState(4);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQRCode | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [enableTracking, setEnableTracking] = useState(true);

  // Données des formulaires
  const [formData, setFormData] = useState<QRFormData>({
    email: { address: "", subject: "", body: "" },
    phone: "",
    sms: { number: "", message: "" },
    vcard: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      website: "",
      company: "",
      title: "",
      address: "",
    },
    location: { lat: "", lon: "", name: "" },
    wifi: {
      ssid: "",
      password: "",
      encryption: "WPA",
      hidden: false,
    },
    event: {
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // Hook pour les statistiques
  const { qrStats, loadingStats, loadViewStats } = useQRStats(history);

  // Charger la librairie QRCode
  useEffect(() => {
    if (!window.QRCode) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      script.async = true;
      script.onload = () => setIsLibraryLoaded(true);
      script.onerror = () => console.error("Failed to load QRCode library");
      document.head.appendChild(script);
    } else {
      setIsLibraryLoaded(true);
    }
  }, []);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("qrCodeHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("qrCodeHistory", JSON.stringify(history));
    }
  }, [history]);

  // Fonction pour générer le QR code
  const handleGenerateQR = async (): Promise<void> => {
    if (!isLibraryLoaded) {
      alert(
        "La librairie QR Code est en cours de chargement, veuillez patienter..."
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Générer le contenu QR
      const qrContent = generateQRContent(qrType, text, formData);

      // Créer un QR code tracké si activé
      const { trackingContent, trackingId, originalContent } =
        await createTrackedQR(qrContent, qrType, enableTracking);

      // Générer le QR code visuel
      const qrCode = await generateQRCode(trackingContent, {
        size,
        errorCorrection,
        backgroundColor,
        foregroundColor,
        margin,
      });

      setGeneratedQR(qrCode);

      // Ajouter à l'historique
      if (qrContent.trim()) {
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          trackingId: trackingId || undefined,
          content: trackingContent,
          originalContent: originalContent || qrContent,
          type: qrType,
          date: new Date().toISOString(),
          preview: qrCode.dataURL,
          views: 0,
        };
        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      }

      setActiveTab("download");
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      alert("Erreur lors de la génération du QR code. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Charger un QR depuis l'historique
  const loadFromHistory = (item: HistoryItem) => {
    setQrType(item.type);
    setText(item.originalContent || item.content);
    setGeneratedQR({
      dataURL: item.preview,
      text: item.content,
      canvas: null,
      options: {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.92,
        margin: 4,
        color: { dark: "#000000", light: "#FFFFFF" },
        width: 200,
        height: 200,
      },
    });
    setActiveTab("download");
  };

  // Copier l'image QR
  const copyQRImage = async () => {
    try {
      if (generatedQR?.dataURL && navigator.clipboard) {
        const response = await fetch(generatedQR.dataURL);
        const blob = await response.blob();

        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      // Fallback
      if (navigator.clipboard && generatedQR?.dataURL) {
        try {
          await navigator.clipboard.writeText(generatedQR.dataURL);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackError) {
          console.error("Erreur lors de la copie fallback:", fallbackError);
        }
      }
    }
  };

  // Télécharger le QR code
  const downloadQRCode = (format = "png") => {
    if (!generatedQR?.dataURL) return;

    const link = document.createElement("a");
    link.href = generatedQR.dataURL;
    link.download = `toolly-qrcode-${new Date().getTime()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effacer l'historique
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qrCodeHistory");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <span>Accueil</span>
        <ChevronRight className="h-4 w-4" />
        <span>Outils</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100">
          Générateur de QR codes
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Générateur de QR codes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Créez facilement des QR codes personnalisés pour vos sites web,
          contacts, WiFi, et bien plus. Personnalisez l&apos;apparence et
          téléchargez au format de votre choix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
            {/* Status de la librairie */}
            {!isLibraryLoaded && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Chargement de la librairie QR Code en cours...
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-600 mb-6">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "content"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Créer un QR code
              </button>
              <button
                onClick={() => setActiveTab("download")}
                disabled={!generatedQR}
                className={`px-4 py-2 font-medium ml-4 ${
                  activeTab === "download" && generatedQR
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Télécharger
              </button>
            </div>

            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Type de contenu
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {qrTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center cursor-pointer text-gray-900 dark:text-gray-100"
                      >
                        <input
                          type="radio"
                          name="qrType"
                          value={type.id}
                          checked={qrType === type.id}
                          onChange={(e) => setQrType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="mr-2">{type.icon}</span>
                        <span className="text-sm">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-600" />

                {/* Form Fields */}
                <QRFormFields
                  qrType={qrType}
                  text={text}
                  setText={setText}
                  formData={formData}
                  setFormData={setFormData}
                  enableTracking={enableTracking}
                />

                <hr className="border-gray-200 dark:border-gray-600" />

                {/* Options d'apparence */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Options d&apos;apparence
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Taille: {size}px
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        step="10"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Marge: {margin}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={margin}
                        onChange={(e) => setMargin(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Couleur de fond
                      </label>
                      <div className="flex">
                        <div
                          className="w-10 h-10 rounded-l border border-r-0 border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor }}
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Couleur avant-plan
                      </label>
                      <div className="flex">
                        <div
                          className="w-10 h-10 rounded-l border border-r-0 border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: foregroundColor }}
                        />
                        <input
                          type="text"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Niveau de correction
                      </label>
                      <select
                        value={errorCorrection}
                        onChange={(e) =>
                          setErrorCorrection(
                            e.target.value as "L" | "M" | "Q" | "H"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="L">Faible (L) - 7%</option>
                        <option value="M">Standard (M) - 15%</option>
                        <option value="Q">Élevé (Q) - 25%</option>
                        <option value="H">Maximum (H) - 30%</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enable-tracking"
                        checked={enableTracking}
                        onChange={(e) => setEnableTracking(e.target.checked)}
                        className="rounded"
                      />
                      <label
                        htmlFor="enable-tracking"
                        className="text-sm text-gray-900 dark:text-gray-100 flex items-center"
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Activer le suivi
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleGenerateQR}
                    disabled={isGenerating || !isLibraryLoaded}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isGenerating
                      ? "Génération..."
                      : !isLibraryLoaded
                      ? "Chargement..."
                      : "Générer le QR code"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "download" && generatedQR && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <Image
                      src={generatedQR.dataURL}
                      alt="QR Code généré"
                      width={size}
                      height={size}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                    Scannez ce QR code avec l&apos;appareil photo de votre
                    smartphone ou une application de lecture de QR code.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => downloadQRCode("png")}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PNG
                  </button>
                  <button
                    onClick={copyQRImage}
                    className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copié!" : "Copier l'image"}
                  </button>
                </div>

                <hr className="border-gray-200 dark:border-gray-600" />

                <button
                  onClick={() => setActiveTab("content")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Retour à l&apos;éditeur
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar avec historique et stats */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Historique récent
              </h2>
              {history.some((item) => item.trackingId) && (
                <button
                  onClick={() => {
                    const trackingIds = history
                      .map((item) => item.trackingId)
                      .filter(Boolean) as string[];
                    loadViewStats(trackingIds);
                  }}
                  disabled={loadingStats}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                  title="Actualiser les statistiques"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loadingStats ? "animate-spin" : ""}`}
                  />
                </button>
              )}
            </div>

            {/* Résumé des stats */}
            {Object.keys(qrStats).length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total vues:
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {Object.values(qrStats).reduce(
                      (sum, stat) => sum + stat.views,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    QR actifs:
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {
                      Object.values(qrStats).filter((stat) => stat.views > 0)
                        .length
                    }
                  </span>
                </div>
              </div>
            )}

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => {
                  const stats = qrStats[item.trackingId || ""];
                  return (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.preview}
                            alt={`QR code ${item.type}`}
                            width={48}
                            height={48}
                            className="border border-gray-200 dark:border-gray-600 rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                            {(item.originalContent || item.content).substring(
                              0,
                              25
                            )}
                            {(item.originalContent || item.content).length > 25
                              ? "..."
                              : ""}
                          </p>

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.date).toLocaleDateString("fr-FR")}
                            </p>

                            {item.trackingId && (
                              <div className="flex items-center gap-2">
                                {loadingStats && !stats ? (
                                  <div className="flex items-center text-xs text-gray-400">
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    <span>...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-xs">
                                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                    <span
                                      className={`font-medium ${
                                        (stats?.views || 0) > 0
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      {stats?.views || 0}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {item.trackingId && stats?.lastViewed && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Dernière vue:{" "}
                              {new Date(stats.lastViewed).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}

                          {!item.trackingId && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">
                              Sans suivi
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={clearHistory}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Effacer l&apos;historique
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun QR code récent
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Vos QR codes générés apparaîtront ici
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
