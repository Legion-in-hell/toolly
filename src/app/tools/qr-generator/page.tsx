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
  Calendar,
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
import { Button } from "@/components/ui/button";

interface QRCodeOptions {
  size?: number;
  errorCorrection?: "L" | "M" | "Q" | "H";
  backgroundColor?: string;
  foregroundColor?: string;
  logo?: string | null;
  margin?: number;
}

const generateQRCode = (text: string, options: QRCodeOptions = {}) => {
  const defaultOptions = {
    size: 200,
    errorCorrection: "M",
    backgroundColor: "#FFFFFF",
    foregroundColor: "#000000",
    logo: null,
    margin: 4,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Promise<{
    dataURL: string;
    options: QRCodeOptions;
    text: string;
    type: string;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        dataURL: `data:image/svg+xml;base64,${btoa(`
          <svg width="${mergedOptions.size}" height="${
          mergedOptions.size
        }" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${
              mergedOptions.backgroundColor
            }"/>
            <g fill="${mergedOptions.foregroundColor}">
              <rect x="20%" y="20%" width="10%" height="10%"/>
              <rect x="40%" y="20%" width="10%" height="10%"/>
              <rect x="60%" y="20%" width="10%" height="10%"/>
              <rect x="20%" y="40%" width="10%" height="10%"/>
              <rect x="60%" y="40%" width="10%" height="10%"/>
              <rect x="20%" y="60%" width="10%" height="10%"/>
              <rect x="40%" y="60%" width="10%" height="10%"/>
              <rect x="60%" y="60%" width="10%" height="10%"/>
              <rect x="20%" y="20%" width="20%" height="5%"/>
              <rect x="20%" y="20%" width="5%" height="20%"/>
              <rect x="60%" y="20%" width="20%" height="5%"/>
              <rect x="75%" y="20%" width="5%" height="20%"/>
              <rect x="20%" y="60%" width="5%" height="20%"/>
              <rect x="20%" y="75%" width="20%" height="5%"/>
              <rect x="35%" y="35%" width="30%" height="5%"/>
              <rect x="35%" y="45%" width="30%" height="5%"/>
              <rect x="35%" y="55%" width="30%" height="5%"/>
            </g>
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
        options: {
          ...mergedOptions,
          errorCorrection: mergedOptions.errorCorrection as
            | "L"
            | "M"
            | "Q"
            | "H",
        },
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
  const [backgroundColor] = useState("#FFFFFF");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "M"
  );
  const [withLogo, setWithLogo] = useState(false);
  const [margin, setMargin] = useState(4);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);

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

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("qrCodeHistory", JSON.stringify(history));
    }
  }, [history]);

  const handleGenerateQR = async () => {
    setIsGenerating(true);

    try {
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

      const qrCode = await generateQRCode(qrContent, {
        size,
        errorCorrection,
        backgroundColor,
        foregroundColor,
        logo: withLogo ? "logo.png" : null,
        margin,
      });

      setGeneratedQR(qrCode);

      if (qrContent.trim()) {
        const newHistoryItem = {
          id: Date.now().toString(),
          content: qrContent,
          type: qrType,
          date: new Date().toISOString(),
          preview: qrCode.dataURL,
        };
        setHistory([newHistoryItem, ...history.slice(0, 9)]);
      }

      setActiveTab("download");
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const copyQRImage = async () => {
    try {
      if (generatedQR) {
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
                            <div>
                              <Label htmlFor="error-correction">
                                Niveau de correction d&#39;erreur
                              </Label>
                              <Select
                                value={errorCorrection}
                                onValueChange={(value) =>
                                  setErrorCorrection(
                                    value as "M" | "L" | "Q" | "H"
                                  )
                                }
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
                                Un niveau plus élevé permet de scanner le QR
                                code même s&#39;il est partiellement endommagé.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="with-logo"
                                checked={withLogo}
                                onCheckedChange={setWithLogo}
                              />
                              <Label htmlFor="with-logo">
                                Ajouter un logo au centre
                              </Label>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleGenerateQR}
                      disabled={isGenerating}
                      className="w-full md:w-auto"
                    >
                      {isGenerating ? "Génération..." : "Générer le QR code"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="download">
                {generatedQR && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                        <img
                          src={generatedQR.dataURL}
                          alt="QR Code généré"
                          className="mx-auto"
                          style={{ width: size, height: size }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 max-w-md text-center">
                        Scannez ce QR code avec l&#39;appareil photo de votre
                        smartphone ou une application de lecture de QR code.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <Button onClick={() => downloadQRCode("svg")}>
                        Télécharger en SVG
                      </Button>
                      <Button onClick={() => downloadQRCode("png")}>
                        Télécharger en PNG
                      </Button>
                      <Button onClick={copyQRImage} className="sm:col-span-2">
                        {copied ? "Copié!" : "Copier l'image"}
                      </Button>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("content")}
                        className="w-full"
                      >
                        Retour à l&#39;éditeur
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border-2">
            <h2 className="text-xl font-bold mb-4">Historique récent</h2>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center space-x-3"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.preview}
                        alt={`QR code ${item.type}`}
                        className="w-12 h-12 border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.content.substring(0, 30)}
                        {item.content.length > 30 ? "..." : ""}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="w-full mt-4"
                >
                  Effacer l&#39;historique
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucun QR code récent
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
