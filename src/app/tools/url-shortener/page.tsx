"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Copy,
  RefreshCw,
  Link as LinkIcon,
  QrCode,
  ExternalLink,
  Trash2,
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
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const shortenUrl = (url, customAlias = "") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 8);
      const shortCode = customAlias || randomId;
      resolve({
        originalUrl: url,
        shortUrl: `https://short.url/${shortCode}`,
        shortCode: shortCode,
        createdAt: new Date().toISOString(),
        clicks: 0,
      });
    }, 600);
  });
};

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [useCustomAlias, setUseCustomAlias] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    const savedUrls = localStorage.getItem("shortenedUrls");
    if (savedUrls) {
      setShortenedUrls(JSON.parse(savedUrls));
    }
  }, []);

  useEffect(() => {
    if (shortenedUrls.length > 0) {
      localStorage.setItem("shortenedUrls", JSON.stringify(shortenedUrls));
    }
  }, [shortenedUrls]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShortenUrl = async () => {
    setError("");

    if (!longUrl) {
      setError("Veuillez entrer une URL à raccourcir");
      return;
    }

    if (!validateUrl(longUrl)) {
      setError(
        "URL invalide. Assurez-vous qu'elle commence par http:// ou https://"
      );
      return;
    }

    if (useCustomAlias && !customAlias) {
      setError(
        "Veuillez entrer un alias personnalisé ou désactiver cette option"
      );
      return;
    }

    if (useCustomAlias && customAlias.length < 3) {
      setError("L'alias personnalisé doit contenir au moins 3 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const result = await shortenUrl(
        longUrl,
        useCustomAlias ? customAlias : ""
      );

      const newShortenedUrls = [result, ...shortenedUrls];
      setShortenedUrls(newShortenedUrls);

      setLongUrl("");
      setCustomAlias("");
      setCurrentUrl(result);
      setActiveTab("history");
    } catch (err) {
      setError("Une erreur s'est produite lors du raccourcissement de l'URL");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteUrl = (shortCode) => {
    const updatedUrls = shortenedUrls.filter(
      (url) => url.shortCode !== shortCode
    );
    setShortenedUrls(updatedUrls);

    if (updatedUrls.length === 0) {
      localStorage.removeItem("shortenedUrls");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
            <BreadcrumbLink href="/tools/url-shortener">
              Raccourcisseur d&#39;URL
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Raccourcisseur d&#39;URL</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transformez vos liens longs en URLs courtes et faciles à partager.
          Personnalisez vos liens et suivez les statistiques d&#39;utilisation.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="new">Nouveau lien</TabsTrigger>
            <TabsTrigger value="history">
              Historique ({shortenedUrls.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <div className="space-y-6">
              <div>
                <Label htmlFor="long-url" className="text-base font-medium">
                  URL à raccourcir
                </Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="long-url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://exemple.com/page-avec-un-chemin-tres-long"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleShortenUrl}
                    disabled={isLoading}
                    className="whitespace-nowrap"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LinkIcon className="mr-2 h-4 w-4" />
                    )}
                    Raccourcir
                  </Button>
                </div>
              </div>

              <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between mb-4">
                  <Label
                    htmlFor="custom-alias-toggle"
                    className="font-medium cursor-pointer"
                  >
                    Créer un alias personnalisé
                  </Label>
                  <Switch
                    id="custom-alias-toggle"
                    checked={useCustomAlias}
                    onCheckedChange={setUseCustomAlias}
                  />
                </div>

                {useCustomAlias && (
                  <div className="mt-2">
                    <Label htmlFor="custom-alias" className="text-sm">
                      Alias personnalisé
                    </Label>
                    <div className="flex gap-2 items-center mt-1">
                      <div className="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-md text-gray-500 dark:text-gray-400">
                        short.url/
                      </div>
                      <Input
                        id="custom-alias"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="mon-lien"
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {shortenedUrls.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <LinkIcon className="mx-auto h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun lien raccourci
                </h3>
                <p>
                  Créez votre premier lien raccourci en utilisant l&#39;onglet
                  &quot;Nouveau lien&quot;
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab("new")}
                >
                  Créer un lien
                </Button>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lien court</TableHead>
                      <TableHead className="hidden md:table-cell">
                        URL originale
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Clics
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortenedUrls.map((url) => (
                      <TableRow key={url.shortCode}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {url === currentUrl && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Nouveau
                              </Badge>
                            )}
                            <span className="text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                              {url.shortUrl}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className="truncate block max-w-[200px]"
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-500">
                          {formatDate(url.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {url.clicks}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Copier le lien"
                              onClick={() => copyToClipboard(url.shortUrl)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="QR Code"
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>
                                    QR Code pour votre lien
                                  </DialogTitle>
                                  <DialogDescription>
                                    Scannez ce QR Code pour accéder au lien
                                    raccourci.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center p-4">
                                  <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <QrCode className="h-32 w-32 text-gray-400" />
                                  </div>
                                </div>
                                <DialogFooter className="flex justify-between items-center sm:justify-between">
                                  <div className="text-sm truncate text-gray-500">
                                    {url.shortUrl}
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      copyToClipboard(url.shortUrl)
                                    }
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copier le lien
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ouvrir le lien"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Supprimer"
                              onClick={() => deleteUrl(url.shortCode)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Pourquoi utiliser un raccourcisseur d&#39;URL ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Les raccourcisseurs d&#39;URL offrent plusieurs avantages :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Des liens plus courts et esthétiques pour vos communications
              </li>
              <li>
                Facilité de partage sur les réseaux sociaux et par message
              </li>
              <li>
                Possibilité de suivre les statistiques de clics et
                d&#39;engagement
              </li>
              <li>
                Personnalisation des liens pour une meilleure mémorisation
              </li>
              <li>
                Liens propres et professionnels pour vos campagnes marketing
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Mes liens courts sont-ils permanents ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Oui, tous les liens créés avec notre service sont permanents et
              n&#39;expirent pas. Cependant, si vous supprimez un lien de votre
              historique, il ne sera plus accessible. Nous recommandons de
              conserver une copie de vos liens importants.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Comment fonctionnent les statistiques de clics ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Notre service enregistre chaque clic sur vos liens raccourcis,
              vous permettant de suivre leur popularité. Les statistiques
              comprennent :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Le nombre total de clics</li>
              <li>La répartition géographique des visiteurs</li>
              <li>Les appareils et navigateurs utilisés</li>
              <li>L&#39;évolution des clics dans le temps</li>
            </ul>
            <p className="mt-2">
              Pour accéder aux statistiques détaillées, cliquez sur l&#39;icône
              de graphique à côté de votre lien dans l&#39;historique.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Est-ce que tous les types d&#39;URL peuvent être raccourcis ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Notre service permet de raccourcir la plupart des URLs standards,
              mais certaines restrictions s&#39;appliquent :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Les URLs doivent être valides et commencer par http:// ou
                https://
              </li>
              <li>
                Les liens vers du contenu illégal ou malveillant sont interdits
              </li>
              <li>
                Certains domaines peuvent être bloqués pour des raisons de
                sécurité
              </li>
            </ul>
            <p className="mt-2">
              Si vous rencontrez des difficultés pour raccourcir une URL
              spécifique, vérifiez qu&#39;elle est correctement formatée et
              respecte nos conditions d&#39;utilisation.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Confidentialité garantie</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Vos URLs sont traitées de manière confidentielle et ne sont jamais
            partagées avec des tiers.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Liens personnalisés</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Créez des liens mémorables avec des alias personnalisés pour un
            meilleur branding.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Statistiques de clics</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Suivez les performances de vos liens avec des statistiques
            détaillées sur les clics et les visites.
          </p>
        </div>
      </div>
    </div>
  );
}
function setCopied(arg0: boolean) {
  throw new Error("Function not implemented.");
}
