"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";

const generateQRCode = (text, options = {}) => {
  const defaultOptions = {
    size: 200,
    errorCorrection: "M",
    backgroundColor: "#FFFFFF",
    foregroundColor: "#000000",
    logo: null,
    margin: 4,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dataURL: `data:image/svg+xml;base64,${btoa(`
          <svg width="${mergedOptions.size}" height="${
          mergedOptions.size
        }" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${
              mergedOptions.backgroundColor
            }"/>
            <!-- QR code pattern simulé -->
            <g fill="${mergedOptions.foregroundColor}">
              <rect x="20%" y="20%" width="10%" height="10%"/>
              <rect x="40%" y="20%" width="10%" height="10%"/>
              <rect x="60%" y="20%" width="10%" height="10%"/>
              <rect x="20%" y="40%" width="10%" height="10%"/>
              <rect x="60%" y="40%" width="10%" height="10%"/>
              <rect x="20%" y="60%" width="10%" height="10%"/>
              <rect x="40%" y="60%" width="10%" height="10%"/>
              <rect x="60%" y="60%" width="10%" height="10%"/>
              <!-- Coin pattern -->
              <rect x="20%" y="20%" width="20%" height="5%"/>
              <rect x="20%" y="20%" width="5%" height="20%"/>
              <rect x="60%" y="20%" width="20%" height="5%"/>
              <rect x="75%" y="20%" width="5%" height="20%"/>
              <rect x="20%" y="60%" width="5%" height="20%"/>
              <rect x="20%" y="75%" width="20%" height="5%"/>
              <!-- Data pattern -->
              <rect x="35%" y="35%" width="30%" height="5%"/>
              <rect x="35%" y="45%" width="30%" height="5%"/>
              <rect x="35%" y="55%" width="30%" height="5%"/>
            </g>
            <!-- Logo simulation -->
            ${
              mergedOptions.logo
                ? `<circle cx="${mergedOptions.size / 2}" cy="${
                    mergedOptions.size / 2
                  }" r="${
                    mergedOptions.size / 10
                  }" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>`
                : ""
            }
          </svg>
        `)}`,
        options: mergedOptions,
        text,
        type: "svg",
      });
    }, 200);
  });
};

const qrTypes = [
  { id: "url", name: "URL / Site web", icon: <LinkIcon className="h-4 w-4" /> },
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
  const [qrType, setQrType] = useState("url");
  const [text, setText] = useState("https://exemple.com");
  const [size, setSize] = useState(200);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [withLogo, setWithLogo] = useState(false);
  const [margin, setMargin] = useState(4);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);

  // Champs spécifiques aux types de QR code
  const [email, setEmail] = useState({ address: "", subject: "", body: "" });
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState({ number: "", message: "" });
  const [vcard, setVcard] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    website: "",
    company: "",
    title: "",
    address: "",
  });
  const [location, setLocation] = useState({ lat: "", lon: "", name: "" });
  const [wifi, setWifi] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });
  const [event, setEvent] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Effet pour charger l'historique depuis le localStorage
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

  // Effet pour sauvegarder l'historique dans le localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("qrCodeHistory", JSON.stringify(history));
    }
  }, [history]);

  // Fonction pour générer le QR code
  const handleGenerateQR = async () => {
    setIsGenerating(true);

    try {
      // Préparer le contenu du QR code en fonction du type sélectionné
      let qrContent = "";

      switch (qrType) {
        case "url":
          qrContent = text;
          break;
        case "text":
          qrContent = text;
          break;
        case "email":
          qrContent = `mailto:${email.address}?subject=${encodeURIComponent(
            email.subject
          )}&body=${encodeURIComponent(email.body)}`;
          break;
        case "phone":
          qrContent = `tel:${phone}`;
          break;
        case "sms":
          qrContent = `smsto:${sms.number}:${sms.message}`;
          break;
        case "vcard":
          qrContent = `BEGIN:VCARD
VERSION:3.0
N:${vcard.lastName};${vcard.firstName};;;
FN:${vcard.firstName} ${vcard.lastName}
ORG:${vcard.company}
TITLE:${vcard.title}
TEL;TYPE=WORK,VOICE:${vcard.phone}
EMAIL:${vcard.email}
URL:${vcard.website}
ADR;TYPE=WORK:;;${vcard.address};;;;
END:VCARD`;
          break;
        case "location":
          qrContent = `geo:${location.lat},${
            location.lon
          }?q=${encodeURIComponent(location.name)}`;
          break;
        case "wifi":
          qrContent = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${
            wifi.password
          };H:${wifi.hidden ? "true" : "false"};;`;
          break;
        case "event":
          const startDate =
            new Date(event.startDate)
              .toISOString()
              .replace(/[-:]/g, "")
              .replace(/\.\d+/g, "") + "Z";
          const endDate =
            new Date(event.endDate)
              .toISOString()
              .replace(/[-:]/g, "")
              .replace(/\.\d+/g, "") + "Z";
          qrContent = `BEGIN:VEVENT
SUMMARY:${event.title.replace(/([,;])/g, "\\$1")}
LOCATION:${event.location}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${event.description}
END:VEVENT`;
          break;
        default:
          qrContent = text;
      }

      // Générer le QR code avec les options sélectionnées
      const qrCode = await generateQRCode(qrContent, {
        size,
        errorCorrection,
        backgroundColor,
        foregroundColor,
        logo: withLogo ? "logo.png" : null,
        margin,
      });

      setGeneratedQR(qrCode);

      // Ajouter à l'historique
      if (qrContent.trim()) {
        const newHistoryItem = {
          id: Date.now().toString(),
          content: qrContent,
          type: qrType,
          date: new Date().toISOString(),
          preview: qrCode.dataURL,
        };
        setHistory([newHistoryItem, ...history.slice(0, 9)]); // Garder les 10 derniers
      }

      // Passer à l'onglet de téléchargement
      setActiveTab("download");
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fonction pour réutiliser un QR code de l'historique
  const loadFromHistory = (item) => {
    setQrType(item.type);
    setText(item.content);
    setGeneratedQR({
      dataURL: item.preview,
      text: item.content,
      type: "svg",
    });
    setActiveTab("download");
  };

  // Fonction pour copier l'image du QR code
  const copyQRImage = async () => {
    try {
      if (generatedQR) {
        // Dans une implémentation réelle, il faudrait ajouter le code pour copier l'image dans le presse-papiers
        // Pour la simulation, nous indiquons simplement que c'est copié
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la copie de l'image:", error);
    }
  };

  const downloadQRCode = (format = "png") => {
    if (!generatedQR) return;

    const link = document.createElement("a");
    link.href = generatedQR.dataURL;
    link.download = `qrcode_${new Date().getTime()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qrCodeHistory");
  };

  const renderForm = () => {
    switch (qrType) {
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url-input">Adresse web (URL)</Label>
              <Input
                id="url-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://exemple.com"
                className="mt-1"
              />
            </div>
            <Accordion type="single" collapsible className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Qu&#39;est-ce qu&#39;un QR code et comment l&#39;utiliser ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Un QR code (Quick Response code) est un type de code-barres
                    en deux dimensions qui peut être scanné avec un smartphone
                    ou une tablette pour accéder rapidement à des informations.
                  </p>
                  <p className="mt-2">Pour utiliser un QR code :</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>
                      Ouvrez l&#39;appareil photo de votre smartphone ou une
                      application de scan de QR code
                    </li>
                    <li>
                      Placez votre appareil devant le QR code pour le scanner
                    </li>
                    <li>
                      Suivez le lien ou affichez l&#39;information contenue dans
                      le QR code
                    </li>
                  </ol>
                  <p className="mt-2">
                    Les QR codes peuvent contenir différents types de données :
                    URL, texte, coordonnées de contact, informations WiFi, etc.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Quelles sont les différences entre les niveaux de correction
                  d&#39;erreur ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Le niveau de correction d&#39;erreur détermine la capacité
                    du QR code à rester lisible même s&#39;il est partiellement
                    endommagé ou obstrué.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Niveau L (Faible) - 7% :</strong> Offre une
                      capacité de récupération minimale mais permet de stocker
                      plus de données.
                    </li>
                    <li>
                      <strong>Niveau M (Standard) - 15% :</strong> Équilibre
                      entre la capacité de données et la résistance aux
                      dommages. Recommandé pour un usage général.
                    </li>
                    <li>
                      <strong>Niveau Q (Élevé) - 25% :</strong> Plus résistant
                      aux dommages, idéal pour les environnements industriels ou
                      extérieurs.
                    </li>
                    <li>
                      <strong>Niveau H (Maximum) - 30% :</strong> Offre la
                      meilleure protection contre les dommages, mais réduit la
                      capacité de stockage de données.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Si vous prévoyez d&#39;imprimer votre QR code sur des
                    supports qui pourraient être rayés ou salis, ou si vous
                    ajoutez un logo au centre, optez pour un niveau de
                    correction plus élevé (Q ou H).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Quel format de fichier QR code est le meilleur ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>Le meilleur format dépend de votre utilisation prévue :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>SVG :</strong> Format vectoriel idéal pour
                      l&#39;impression, le redimensionnement sans perte de
                      qualité et le web. Préférez le SVG si vous devez imprimer
                      votre QR code en grand format.
                    </li>
                    <li>
                      <strong>PNG :</strong> Format bitmap avec transparence,
                      parfait pour le web et les documents numériques. C&#39;est
                      un bon choix pour la plupart des usages courants.
                    </li>
                    <li>
                      <strong>JPG/JPEG :</strong> Format compressé sans
                      transparence, adapté aux photos et aux impressions où la
                      transparence n&#39;est pas nécessaire.
                    </li>
                    <li>
                      <strong>PDF :</strong> Idéal pour l&#39;intégration dans
                      des documents professionnels, présentations ou brochures.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Pour un usage professionnel ou si vous devez redimensionner
                    le QR code, le format SVG est généralement le meilleur
                    choix.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Comment personnaliser l&#39;apparence de mon QR code ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Vous pouvez personnaliser votre QR code de plusieurs façons
                    :
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Couleurs :</strong> Modifiez les couleurs du
                      premier plan (modules du QR code) et de
                      l&#39;arrière-plan. Pour une bonne lisibilité, maintenez
                      un contraste élevé entre les deux couleurs.
                    </li>
                    <li>
                      <strong>Taille :</strong> Ajustez la taille du QR code
                      selon vos besoins. Pour l&#39;impression, assurez-vous que
                      le code mesure au moins 2 × 2 cm pour être facilement
                      scannable.
                    </li>
                    <li>
                      <strong>Marge :</strong> Modifiez la marge blanche autour
                      du QR code. Une marge minimale est nécessaire pour que le
                      code soit correctement scannable.
                    </li>
                    <li>
                      <strong>Logo :</strong> Ajoutez un logo au centre du QR
                      code. Dans ce cas, augmentez le niveau de correction
                      d&#39;erreur à Q ou H pour garantir que le code reste
                      lisible.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Important : Après toute personnalisation, testez toujours le
                    scan de votre QR code avec plusieurs appareils pour vous
                    assurer qu&#39;il fonctionne correctement.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 border rounded-lg">
                <h3 className="font-bold mb-2">Multi-contenus</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Créez des QR codes pour différents types de contenu : URLs,
                  texte, email, contact, WiFi, et plus encore.
                </p>
              </div>
              <div className="p-5 border rounded-lg">
                <h3 className="font-bold mb-2">Personnalisation avancée</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Modifiez les couleurs, la taille, les marges et ajoutez un
                  logo pour personnaliser complètement vos QR codes.
                </p>
              </div>
              <div className="p-5 border rounded-lg">
                <h3 className="font-bold mb-2">Formats multiples</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Téléchargez vos QR codes en SVG, PNG, JPG ou PDF selon vos
                  besoins d&#39;utilisation et d&#39;impression.
                </p>
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-input">Texte libre</Label>
              <Textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Saisissez votre texte ici..."
                className="mt-1 min-h-32"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-address">Adresse email</Label>
              <Input
                id="email-address"
                type="email"
                value={email.address}
                onChange={(e) =>
                  setEmail({ ...email, address: e.target.value })
                }
                placeholder="contact@exemple.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Sujet (optionnel)</Label>
              <Input
                id="email-subject"
                value={email.subject}
                onChange={(e) =>
                  setEmail({ ...email, subject: e.target.value })
                }
                placeholder="Objet de l'email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message (optionnel)</Label>
              <Textarea
                id="email-body"
                value={email.body}
                onChange={(e) => setEmail({ ...email, body: e.target.value })}
                placeholder="Contenu de l'email..."
                className="mt-1"
              />
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone-number">Numéro de téléphone</Label>
              <Input
                id="phone-number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 1 23 45 67 89"
                className="mt-1"
              />
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sms-number">Numéro de téléphone</Label>
              <Input
                id="sms-number"
                type="tel"
                value={sms.number}
                onChange={(e) => setSms({ ...sms, number: e.target.value })}
                placeholder="+33 1 23 45 67 89"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sms-message">Message (optionnel)</Label>
              <Textarea
                id="sms-message"
                value={sms.message}
                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                placeholder="Votre message..."
                className="mt-1"
              />
            </div>
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vcard-firstname">Prénom</Label>
                <Input
                  id="vcard-firstname"
                  value={vcard.firstName}
                  onChange={(e) =>
                    setVcard({ ...vcard, firstName: e.target.value })
                  }
                  placeholder="Prénom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vcard-lastname">Nom</Label>
                <Input
                  id="vcard-lastname"
                  value={vcard.lastName}
                  onChange={(e) =>
                    setVcard({ ...vcard, lastName: e.target.value })
                  }
                  placeholder="Nom"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vcard-phone">Téléphone</Label>
                <Input
                  id="vcard-phone"
                  type="tel"
                  value={vcard.phone}
                  onChange={(e) =>
                    setVcard({ ...vcard, phone: e.target.value })
                  }
                  placeholder="+33 1 23 45 67 89"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vcard-email">Email</Label>
                <Input
                  id="vcard-email"
                  type="email"
                  value={vcard.email}
                  onChange={(e) =>
                    setVcard({ ...vcard, email: e.target.value })
                  }
                  placeholder="contact@exemple.com"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vcard-company">Entreprise (optionnel)</Label>
                <Input
                  id="vcard-company"
                  value={vcard.company}
                  onChange={(e) =>
                    setVcard({ ...vcard, company: e.target.value })
                  }
                  placeholder="Nom de l'entreprise"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vcard-title">Fonction (optionnel)</Label>
                <Input
                  id="vcard-title"
                  value={vcard.title}
                  onChange={(e) =>
                    setVcard({ ...vcard, title: e.target.value })
                  }
                  placeholder="Développeur, Manager, etc."
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="vcard-website">Site web (optionnel)</Label>
              <Input
                id="vcard-website"
                value={vcard.website}
                onChange={(e) =>
                  setVcard({ ...vcard, website: e.target.value })
                }
                placeholder="https://exemple.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="vcard-address">Adresse (optionnel)</Label>
              <Input
                id="vcard-address"
                value={vcard.address}
                onChange={(e) =>
                  setVcard({ ...vcard, address: e.target.value })
                }
                placeholder="123 rue Exemple, 75000 Paris"
                className="mt-1"
              />
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location-lat">Latitude</Label>
                <Input
                  id="location-lat"
                  value={location.lat}
                  onChange={(e) =>
                    setLocation({ ...location, lat: e.target.value })
                  }
                  placeholder="48.8566"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location-lon">Longitude</Label>
                <Input
                  id="location-lon"
                  value={location.lon}
                  onChange={(e) =>
                    setLocation({ ...location, lon: e.target.value })
                  }
                  placeholder="2.3522"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location-name">Nom du lieu (optionnel)</Label>
              <Input
                id="location-name"
                value={location.name}
                onChange={(e) =>
                  setLocation({ ...location, name: e.target.value })
                }
                placeholder="Tour Eiffel, Paris"
                className="mt-1"
              />
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="wifi-ssid">Nom du réseau (SSID)</Label>
              <Input
                id="wifi-ssid"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                placeholder="MonWiFi"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wifi-password">Mot de passe</Label>
              <Input
                id="wifi-password"
                type="password"
                value={wifi.password}
                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                placeholder="Mot de passe"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wifi-encryption">Type de sécurité</Label>
              <Select
                value={wifi.encryption}
                onValueChange={(value) =>
                  setWifi({ ...wifi, encryption: value })
                }
              >
                <SelectTrigger id="wifi-encryption" className="mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">Aucun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="wifi-hidden"
                checked={wifi.hidden}
                onCheckedChange={(checked) =>
                  setWifi({ ...wifi, hidden: checked })
                }
              />
              <Label htmlFor="wifi-hidden">Réseau caché</Label>
            </div>
          </div>
        );

      case "event":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Titre de l&#39;événement</Label>
              <Input
                id="event-title"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                placeholder="Réunion d'équipe"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="event-location">Lieu (optionnel)</Label>
              <Input
                id="event-location"
                value={event.location}
                onChange={(e) =>
                  setEvent({ ...event, location: e.target.value })
                }
                placeholder="Salle de conférence, Bureau"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start">Date et heure de début</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={event.startDate || ""}
                  onChange={(e) =>
                    setEvent({ ...event, startDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="event-end">Date et heure de fin</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={event.endDate || ""}
                  onChange={(e) =>
                    setEvent({ ...event, endDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="event-description">Description (optionnel)</Label>
              <Textarea
                id="event-description"
                value={event.description}
                onChange={(e) =>
                  setEvent({ ...event, description: e.target.value })
                }
                placeholder="Détails de l'événement..."
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return <div>Type de QR code non pris en charge</div>;
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
            <BreadcrumbLink href="/tools/qr-generator">
              Générateur de QR codes
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Générateur de QR codes</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Créez facilement des QR codes personnalisés pour vos sites web,
          contacts, WiFi, et bien plus. Personnalisez l&#39;apparence et
          téléchargez au format de votre choix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6 border-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="content">Créer un QR code</TabsTrigger>
                <TabsTrigger value="download" disabled={!generatedQR}>
                  Télécharger
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <div className="space-y-6">
                  <div>
                    <Label className="block font-medium mb-2">
                      Type de contenu
                    </Label>
                    <RadioGroup
                      value={qrType}
                      onValueChange={setQrType}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                      {qrTypes.map((type) => (
                        <div key={type.id} className="flex items-center">
                          <RadioGroupItem
                            value={type.id}
                            id={`type-${type.id}`}
                            className="mr-2"
                          />
                          <Label
                            htmlFor={`type-${type.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <span className="mr-2">{type.icon}</span>
                            {type.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator />

                  {renderForm()}

                  <Separator />

                  <Accordion type="single" collapsible>
                    <AccordionItem value="appearance">
                      <AccordionTrigger className="font-medium">
                        Options d&#39;apparence et avancées
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div>
                            <Label htmlFor="qr-size">Taille</Label>
                            <div className="flex items-center gap-4 mt-1">
                              <Slider
                                id="qr-size"
                                min={100}
                                max={400}
                                step={10}
                                value={[size]}
                                onValueChange={(value) => setSize(value[0])}
                                className="flex-1"
                              />
                              <span className="text-sm font-mono w-12 text-right">
                                {size}px
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="qr-margin">Marge</Label>
                            <div className="flex items-center gap-4 mt-1">
                              <Slider
                                id="qr-margin"
                                min={0}
                                max={10}
                                step={1}
                                value={[margin]}
                                onValueChange={(value) => setMargin(value[0])}
                                className="flex-1"
                              />
                              <span className="text-sm font-mono w-12 text-right">
                                {margin}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bg-color">Couleur de fond</Label>
                              <div className="flex mt-1">
                                <div
                                  className="w-10 h-10 rounded-l-md border border-r-0 flex items-center justify-center"
                                  style={{ backgroundColor: backgroundColor }}
                                ></div>
                                <Input
                                  id="bg-color"
                                  type="text"
                                  value={backgroundColor}
                                  onChange={(e) =>
                                    setBackgroundColor(e.target.value)
                                  }
                                  className="rounded-l-none"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="fg-color">Couleur du code</Label>
                              <div className="flex mt-1">
                                <div
                                  className="w-10 h-10 rounded-l-md border border-r-0 flex items-center justify-center"
                                  style={{ backgroundColor: foregroundColor }}
                                ></div>
                                <Input
                                  id="fg-color"
                                  type="text"
                                  value={foregroundColor}
                                  onChange={(e) =>
                                    setForegroundColor(e.target.value)
                                  }
                                  className="rounded-l-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="error-correction">
                              Niveau de correction d&#39;erreur
                            </Label>
                            <Select
                              value={errorCorrection}
                              onValueChange={setErrorCorrection}
                            >
                              <SelectTrigger
                                id="error-correction"
                                className="mt-1"
                              >
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="L">
                                  <div className="flex items-center">
                                    <span>Faible (L)</span>
                                    <Badge variant="outline" className="ml-2">
                                      7%
                                    </Badge>
                                  </div>
                                </SelectItem>
                                <SelectItem value="M">
                                  <div className="flex items-center">
                                    <span>Standard (M)</span>
                                    <Badge variant="outline" className="ml-2">
                                      15%
                                    </Badge>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Q">
                                  <div className="flex items-center">
                                    <span>Élevé (Q)</span>
                                    <Badge variant="outline" className="ml-2">
                                      25%
                                    </Badge>
                                  </div>
                                </SelectItem>
                                <SelectItem value="H">
                                  <div className="flex items-center">
                                    <span>Maximum (H)</span>
                                    <Badge variant="outline" className="ml-2">
                                      30%
                                    </Badge>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                              Un niveau plus élevé permet de scanner le QR code
                              même s&#39;il est partiellement endommagé.
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="with-logo"
                              checked={withLogo}
                              onCheckedChange={setWithLogo}
                            />
                            <Label htmlFor="with-logo">
                              Ajouter un logo au centre (simulation)
                            </Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
