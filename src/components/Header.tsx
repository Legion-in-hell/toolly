"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="h-8 w-8"
            src="/logo.png"
            alt="Toolly Logo"
            width={32}
            height={32}
            priority={true}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Toolly
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="font-medium hover:text-blue-600 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/about"
            className="font-medium hover:text-blue-600 transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="font-medium hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/donation"
            className="font-medium hover:text-blue-600 transition-colors"
          >
            Donation
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/tools"
              className="font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tous les outils
            </Link>
            <Link
              href="/about"
              className="font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="font-medium hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
