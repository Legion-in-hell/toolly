"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Copy, Check, ArrowDownUp } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed";

type UnitConversion = {
  [key in UnitCategory]: {
    name: string;
    units: {
      [key: string]: {
        name: string;
        toBase: (value: number) => number;
        fromBase: (value: number) => number;
      };
    };
  };
};

const unitConversions: UnitConversion = {
  length: {
    name: "Longueur",
    units: {
      mm: {
        name: "Millimètre (mm)",
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      cm: {
        name: "Centimètre (cm)",
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100,
      },
      m: {
        name: "Mètre (m)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      km: {
        name: "Kilomètre (km)",
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      inch: {
        name: "Pouce (in)",
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
      },
      ft: {
        name: "Pied (ft)",
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      yard: {
        name: "Yard (yd)",
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
      },
      mile: {
        name: "Mile (mi)",
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
    },
  },
  weight: {
    name: "Poids",
    units: {
      mg: {
        name: "Milligramme (mg)",
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      g: {
        name: "Gramme (g)",
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      kg: {
        name: "Kilogramme (kg)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      t: {
        name: "Tonne (t)",
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      oz: {
        name: "Once (oz)",
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
      },
      lb: {
        name: "Livre (lb)",
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
      },
    },
  },
  temperature: {
    name: "Température",
    units: {
      celsius: {
        name: "Celsius (°C)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      fahrenheit: {
        name: "Fahrenheit (°F)",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      kelvin: {
        name: "Kelvin (K)",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  area: {
    name: "Surface",
    units: {
      mm2: {
        name: "Millimètre carré (mm²)",
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      cm2: {
        name: "Centimètre carré (cm²)",
        toBase: (v) => v / 10000,
        fromBase: (v) => v * 10000,
      },
      m2: {
        name: "Mètre carré (m²)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      km2: {
        name: "Kilomètre carré (km²)",
        toBase: (v) => v * 1000000,
        fromBase: (v) => v / 1000000,
      },
      ha: {
        name: "Hectare (ha)",
        toBase: (v) => v * 10000,
        fromBase: (v) => v / 10000,
      },
      acre: {
        name: "Acre",
        toBase: (v) => v * 4046.86,
        fromBase: (v) => v / 4046.86,
      },
    },
  },
  volume: {
    name: "Volume",
    units: {
      ml: {
        name: "Millilitre (ml)",
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      l: {
        name: "Litre (l)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      m3: {
        name: "Mètre cube (m³)",
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      gallon: {
        name: "Gallon US (gal)",
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
      },
      pint: {
        name: "Pinte US (pt)",
        toBase: (v) => v * 0.473176,
        fromBase: (v) => v / 0.473176,
      },
      cup: {
        name: "Tasse US (cup)",
        toBase: (v) => v * 0.236588,
        fromBase: (v) => v / 0.236588,
      },
    },
  },
  speed: {
    name: "Vitesse",
    units: {
      mps: {
        name: "Mètre par seconde (m/s)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      kmh: {
        name: "Kilomètre par heure (km/h)",
        toBase: (v) => v / 3.6,
        fromBase: (v) => v * 3.6,
      },
      mph: {
        name: "Mile par heure (mph)",
        toBase: (v) => v * 0.44704,
        fromBase: (v) => v / 0.44704,
      },
      knot: {
        name: "Nœud (kn)",
        toBase: (v) => v * 0.514444,
        fromBase: (v) => v / 0.514444,
      },
    },
  },
};

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [copied, setCopied] = useState(false);

  // Initialize units when category changes
  useEffect(() => {
    const units = Object.keys(unitConversions[category].units);
    setFromUnit(units[0] || "");
    setToUnit(units[1] || units[0] || "");
  }, [category]);

  const convertValue = React.useCallback(() => {
    if (!inputValue || !fromUnit || !toUnit || isNaN(Number(inputValue))) {
      setOutputValue("");
      return;
    }

    const numValue = Number(inputValue);
    const categoryData = unitConversions[category];

    // Convert to base unit, then to target unit
    const baseValue = categoryData.units[fromUnit].toBase(numValue);
    const result = categoryData.units[toUnit].fromBase(baseValue);

    // Format the result
    const formattedResult = result.toFixed(6).replace(/\.?0+$/, "");
    setOutputValue(formattedResult);
  }, [inputValue, category, fromUnit, toUnit]);

  useEffect(() => {
    convertValue();
  }, [inputValue, category, fromUnit, toUnit, convertValue]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(outputValue);
  };

  const clearFields = () => {
    setInputValue("");
    setOutputValue("");
  };

  const currentUnits = unitConversions[category].units;

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
            <BreadcrumbLink href="/tools/unit-converter">
              Convertisseur d&#39;unités
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Convertisseur d&#39;unités</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Convertissez facilement entre différentes unités de mesure : longueur,
          poids, température, surface, volume et vitesse.
        </p>
      </div>

      <Card className="p-6 mb-8 border-2">
        <div className="mb-6">
          <label htmlFor="category" className="block font-medium mb-2">
            Catégorie d&#39;unités
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as UnitCategory)}
          >
            <SelectTrigger id="category" className="w-full md:w-72">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(unitConversions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="inputValue" className="font-medium">
                Valeur à convertir
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFields}
                className="text-gray-500"
              >
                Effacer
              </Button>
            </div>
            <Input
              id="inputValue"
              type="number"
              placeholder="Entrez une valeur..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="font-mono text-lg"
            />
            <div className="mt-2">
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unité source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="outputValue" className="font-medium">
                Résultat
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!outputValue}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <Input
              id="outputValue"
              type="text"
              readOnly
              value={outputValue}
              className="font-mono text-lg bg-gray-50 dark:bg-gray-900"
              placeholder="Le résultat apparaîtra ici..."
            />
            <div className="mt-2">
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unité cible" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-2">
          <Button
            variant="outline"
            onClick={swapUnits}
            className="w-full md:w-auto"
            disabled={!fromUnit || !toUnit}
          >
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Inverser les unités
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          La conversion est automatique lorsque vous entrez une valeur
        </p>
      </Card>

      <Accordion type="single" collapsible className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

        <AccordionItem value="item-1">
          <AccordionTrigger>
            Quelles catégories d&#39;unités puis-je convertir ?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Longueur</strong> : millimètre, centimètre, mètre,
                kilomètre, pouce, pied, yard, mile
              </li>
              <li>
                <strong>Poids</strong> : milligramme, gramme, kilogramme, tonne,
                once, livre
              </li>
              <li>
                <strong>Température</strong> : Celsius, Fahrenheit, Kelvin
              </li>
              <li>
                <strong>Surface</strong> : millimètre carré, centimètre carré,
                mètre carré, kilomètre carré, hectare, acre
              </li>
              <li>
                <strong>Volume</strong> : millilitre, litre, mètre cube, gallon,
                pinte, tasse
              </li>
              <li>
                <strong>Vitesse</strong> : mètre par seconde, kilomètre par
                heure, mile par heure, nœud
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Comment fonctionne la conversion de température ?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Les conversions de température utilisent des formules spécifiques
              :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Celsius vers Fahrenheit : (°C × 9/5) + 32</li>
              <li>Fahrenheit vers Celsius : (°F - 32) × 5/9</li>
              <li>Celsius vers Kelvin : °C + 273.15</li>
              <li>Kelvin vers Celsius : K - 273.15</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Quelle est la précision des conversions ?
          </AccordionTrigger>
          <AccordionContent>
            Les conversions utilisent des facteurs de conversion standards et
            sont précises jusqu&#39;à 6 décimales. Les zéros inutiles sont
            automatiquement supprimés pour une meilleure lisibilité. Pour les
            applications critiques, vérifiez toujours les résultats avec des
            sources officielles.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Mes données sont-elles sécurisées ?
          </AccordionTrigger>
          <AccordionContent>
            Absolument. Tous les calculs se font directement dans votre
            navigateur. Aucune donnée n&#39;est envoyée à nos serveurs ni
            stockée, garantissant ainsi une confidentialité totale.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Calcul local</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Toutes les conversions sont effectuées dans votre navigateur pour
            garantir votre confidentialité.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Multiples catégories</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Six catégories d&#39;unités avec les conversions les plus courantes
            pour tous vos besoins.
          </p>
        </div>
        <div className="p-5 border rounded-lg">
          <h3 className="font-bold mb-2">Conversion instantanée</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Résultats immédiats dès que vous entrez une valeur, avec précision
            et simplicité.
          </p>
        </div>
      </div>
    </div>
  );
}
