"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Clock,
  PlusCircle,
  Trash2,
  ChevronDown,
  Sun,
  Moon,
  RefreshCw,
  Settings,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const timeZones = [
  {
    id: "local",
    city: "Mon emplacement",
    country: "Local",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emoji: "📍",
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    timezone: "Europe/Paris",
    emoji: "🇫🇷",
  },
  {
    id: "new_york",
    city: "New York",
    country: "États-Unis",
    timezone: "America/New_York",
    emoji: "🇺🇸",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japon",
    timezone: "Asia/Tokyo",
    emoji: "🇯🇵",
  },
  {
    id: "london",
    city: "Londres",
    country: "Royaume-Uni",
    timezone: "Europe/London",
    emoji: "🇬🇧",
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australie",
    timezone: "Australia/Sydney",
    emoji: "🇦🇺",
  },
  {
    id: "dubai",
    city: "Dubaï",
    country: "Émirats arabes unis",
    timezone: "Asia/Dubai",
    emoji: "🇦🇪",
  },
  {
    id: "moscow",
    city: "Moscou",
    country: "Russie",
    timezone: "Europe/Moscow",
    emoji: "🇷🇺",
  },
  {
    id: "rio",
    city: "Rio de Janeiro",
    country: "Brésil",
    timezone: "America/Sao_Paulo",
    emoji: "🇧🇷",
  },
  {
    id: "beijing",
    city: "Pékin",
    country: "Chine",
    timezone: "Asia/Shanghai",
    emoji: "🇨🇳",
  },
  {
    id: "los_angeles",
    city: "Los Angeles",
    country: "États-Unis",
    timezone: "America/Los_Angeles",
    emoji: "🇺🇸",
  },
  {
    id: "johannesburg",
    city: "Johannesburg",
    country: "Afrique du Sud",
    timezone: "Africa/Johannesburg",
    emoji: "🇿🇦",
  },
  {
    id: "singapore",
    city: "Singapour",
    country: "Singapour",
    timezone: "Asia/Singapore",
    emoji: "🇸🇬",
  },
  {
    id: "berlin",
    city: "Berlin",
    country: "Allemagne",
    timezone: "Europe/Berlin",
    emoji: "🇩🇪",
  },
  {
    id: "mumbai",
    city: "Mumbai",
    country: "Inde",
    timezone: "Asia/Kolkata",
    emoji: "🇮🇳",
  },
];

export default function WorldClock() {
  const [selectedTimeZones, setSelectedTimeZones] = useState([
    timeZones[0],
    timeZones[1],
    timeZones[2],
    timeZones[3],
  ]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [showSeconds, setShowSeconds] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const availableTimeZones = timeZones.filter(
    (tz) => !selectedTimeZones.some((stz) => stz.id === tz.id)
  );

  const filteredTimeZones = availableTimeZones.filter(
    (tz) =>
      tz.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTimeZone = (timeZone) => {
    setSelectedTimeZones([...selectedTimeZones, timeZone]);
    setSearchOpen(false);
    localStorage.setItem(
      "selectedTimeZones",
      JSON.stringify([...selectedTimeZones, timeZone].map((tz) => tz.id))
    );
  };

  const removeTimeZone = (timeZoneId) => {
    const updatedTimeZones = selectedTimeZones.filter(
      (tz) => tz.id !== timeZoneId
    );
    setSelectedTimeZones(updatedTimeZones);
    localStorage.setItem(
      "selectedTimeZones",
      JSON.stringify(updatedTimeZones.map((tz) => tz.id))
    );
  };

  useEffect(() => {
    const savedTimeZones = localStorage.getItem("selectedTimeZones");
    if (savedTimeZones) {
      try {
        const timeZoneIds = JSON.parse(savedTimeZones);
        const savedTzs = timeZoneIds.map(
          (id) => timeZones.find((tz) => tz.id === id) || timeZones[0]
        );
        setSelectedTimeZones(savedTzs);
      } catch (error) {
        console.error("Erreur lors du chargement des fuseaux horaires:", error);
      }
    }

    const saved24Hour = localStorage.getItem("is24HourFormat");
    if (saved24Hour !== null) {
      setIs24HourFormat(saved24Hour === "true");
    }

    const savedShowSeconds = localStorage.getItem("showSeconds");
    if (savedShowSeconds !== null) {
      setShowSeconds(savedShowSeconds === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("is24HourFormat", is24HourFormat.toString());
    localStorage.setItem("showSeconds", showSeconds.toString());
  }, [is24HourFormat, showSeconds]);

  const formatTime = (timezone) => {
    try {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds && { second: "2-digit" }),
        hour12: !is24HourFormat,
        timeZone: timezone,
      };

      return new Intl.DateTimeFormat("fr-FR", options).format(currentTime);
    } catch (error) {
      console.error(`Erreur de formatage pour ${timezone}:`, error);
      return "Erreur";
    }
  };

  const formatDate = (timezone) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      };

      return new Intl.DateTimeFormat("fr-FR", options).format(currentTime);
    } catch (error) {
      console.error(`Erreur de formatage pour ${timezone}:`, error);
      return "Erreur";
    }
  };

  const isDayTime = (timezone) => {
    try {
      const hour = new Intl.DateTimeFormat("fr-FR", {
        hour: "numeric",
        hour12: false,
        timeZone: timezone,
      })
        .format(currentTime)
        .split(" ")[0];

      const hourNum = parseInt(hour, 10);
      return hourNum >= 6 && hourNum < 18;
    } catch (error) {
      console.error(`Erreur pour ${timezone}:`, error);
      return true;
    }
  };

  const sortedTimeZones = [...selectedTimeZones].sort((a, b) => {
    if (sortOrder === "default") {
      return 0;
    }

    if (sortOrder === "name") {
      return a.city.localeCompare(b.city);
    }

    try {
      const hourA = new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: a.timezone,
        }).format(currentTime)
      ).getTime();
      const hourB = new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: b.timezone,
        }).format(currentTime)
      ).getTime();

      return sortOrder === "time-asc" ? hourA - hourB : hourB - hourA;
    } catch (error) {
      return 0;
    }
  });

  const getTimeDifference = (timezone) => {
    if (timezone === Intl.DateTimeFormat().resolvedOptions().timeZone) {
      return "";
    }

    try {
      const localHour = new Date().getHours() + new Date().getMinutes() / 60;

      const targetOptions = {
        timeZone: timezone,
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      };
      const targetTimeStr = new Intl.DateTimeFormat(
        "en-US",
        targetOptions
      ).format(new Date());
      const [targetHourStr, targetMinuteStr] = targetTimeStr.split(":");
      const targetHour =
        parseInt(targetHourStr, 10) + parseInt(targetMinuteStr, 10) / 60;

      let hourDiff = targetHour - localHour;

      if (hourDiff > 12) hourDiff -= 24;
      if (hourDiff < -12) hourDiff += 24;

      const totalMinutes = Math.round(Math.abs(hourDiff) * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours === 0 && minutes === 0) return "";

      const sign = hourDiff >= 0 ? "+" : "-";

      let diffString = sign + hours.toString();
      if (minutes > 0) {
        diffString += ":" + minutes.toString().padStart(2, "0");
      }

      return diffString + "h";
    } catch (error) {
      console.error(`Erreur de calcul de différence pour ${timezone}:`, error);
      return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <BreadcrumbLink href="/tools/world-clock">
              Horloge mondiale
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Horloge mondiale</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Consultez l&#39;heure actuelle dans différents fuseaux horaires du
          monde entier. Ajoutez et personnalisez vos villes préférées.
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setSearchOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter une ville
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Actualiser"
            onClick={() => setCurrentTime(new Date())}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="format-24h">Format 24 heures</Label>
                    <Switch
                      id="format-24h"
                      checked={is24HourFormat}
                      onCheckedChange={setIs24HourFormat}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-seconds">Afficher les secondes</Label>
                    <Switch
                      id="show-seconds"
                      checked={showSeconds}
                      onCheckedChange={setShowSeconds}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full border-none p-0 h-auto shadow-none">
                      <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trier par</SelectLabel>
                        <SelectItem value="default">Par défaut</SelectItem>
                        <SelectItem value="name">Nom de ville</SelectItem>
                        <SelectItem value="time-asc">
                          Heure (croissant)
                        </SelectItem>
                        <SelectItem value="time-desc">
                          Heure (décroissant)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-2">Ajouter une ville</h2>
          <p className="text-sm text-gray-500 mb-4">
            Recherchez et ajoutez de nouvelles villes à votre horloge mondiale.
          </p>
        </div>
        <CommandInput
          placeholder="Rechercher une ville..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Aucune ville trouvée</CommandEmpty>
          <CommandGroup heading="Villes disponibles">
            {filteredTimeZones.map((tz) => (
              <CommandItem
                key={tz.id}
                onSelect={() => addTimeZone(tz)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tz.emoji}</span>
                  <span>
                    {tz.city}, {tz.country}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {formatTime(tz.timezone)}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sortedTimeZones.map((tz) => (
          <Card
            key={tz.id}
            className={`p-5 overflow-hidden ${
              isDayTime(tz.timezone)
                ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/10"
                : "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/30 dark:to-purple-900/10"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tz.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{tz.city}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {tz.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {tz.id !== "local" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                    onClick={() => removeTimeZone(tz.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {isDayTime(tz.timezone) ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-400" />
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm capitalize mb-3">
              {formatDate(tz.timezone)}
            </p>

            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold tabular-nums">
                {formatTime(tz.timezone)}
              </div>
              {tz.id !== "local" && (
                <Badge
                  variant="outline"
                  className="text-gray-600 dark:text-gray-400"
                >
                  {getTimeDifference(tz.timezone)}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedTimeZones.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            Aucune ville sélectionnée
          </h3>
          <p className="text-gray-500 mb-4">
            Ajoutez des villes pour voir l&#39;heure dans différents fuseaux
            horaires
          </p>
          <Button onClick={() => setSearchOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une ville
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Plusieurs fuseaux</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Suivez l&#39;heure dans toutes les grandes villes du monde en temps
            réel.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Mode jour/nuit</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Visualisez facilement quelles villes sont en journée ou en soirée
            grâce aux indicateurs visuels.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Personnalisation</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Choisissez le format d&#39;heure, l&#39;affichage des secondes et
            l&#39;ordre de tri selon vos préférences.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Comment les différences horaires sont-elles calculées ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Les différences horaires sont calculées par rapport à votre fuseau
              horaire local. Si vous êtes à Paris (GMT+1) et que vous regardez
              l&#39;heure à New York (GMT-5), la différence affichée sera de
              -6h, indiquant que New York est en retard de 6 heures par rapport
              à Paris.
            </p>
            <p className="mt-2">
              Ces calculs prennent automatiquement en compte les changements
              d&#39;heure d&#39;été et d&#39;hiver dans chaque région, pour
              toujours vous montrer l&#39;écart horaire exact en temps réel.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Puis-je ajouter mes propres villes ou fuseaux horaires ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Actuellement, notre outil propose une sélection des principales
              villes mondiales. Pour ajouter une ville, utilisez le bouton
              &quot;Ajouter une ville&quot; et sélectionnez-la dans la liste
              disponible.
            </p>
            <p className="mt-2">
              Dans une future mise à jour, nous prévoyons d&#39;ajouter la
              possibilité de créer des entrées personnalisées pour des lieux
              spécifiques qui ne figurent pas dans notre liste prédéfinie.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Comment utiliser cette horloge pour planifier des appels
            internationaux ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Pour planifier des appels ou réunions internationales :</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Ajoutez les fuseaux horaires de tous les participants</li>
              <li>
                Utilisez l&#39;option de tri par heure pour visualiser
                facilement les heures de travail qui se chevauchent
              </li>
              <li>
                Notez que les indicateurs jour/nuit vous aident à éviter de
                programmer des appels pendant la nuit pour certains participants
              </li>
              <li>
                Les différences horaires affichées vous permettent d&#39;avoir
                une référence rapide pour convertir les heures mentionnées
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Les horloges se mettent-elles à jour automatiquement ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Oui, toutes les horloges se mettent à jour automatiquement chaque
              seconde pour afficher l&#39;heure actuelle. Les différences
              d&#39;heure et les indicateurs jour/nuit sont également actualisés
              en temps réel.
            </p>
            <p className="mt-2">
              Si vous fermez votre navigateur et revenez plus tard, l&#39;outil
              restaurera automatiquement vos villes sélectionnées et vos
              préférences d&#39;affichage.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
