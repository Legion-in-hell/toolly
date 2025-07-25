// middleware.ts (à la racine du projet, même niveau que package.json)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface TrackedQR {
  id: string;
  originalContent: string;
  type: string;
  createdAt: string;
  views: number;
  lastViewed?: string;
  userAgent?: string;
  referrer?: string;
}

// Fonction pour lire les QR codes trackés
const readTrackedQRs = (): Record<string, TrackedQR> => {
  try {
    const TRACKED_QRS_FILE = path.join(
      process.cwd(),
      "data",
      "tracked-qrs.json"
    );
    if (fs.existsSync(TRACKED_QRS_FILE)) {
      const data = fs.readFileSync(TRACKED_QRS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading tracked QRs:", error);
  }
  return {};
};

// Fonction pour sauvegarder les QR codes trackés
const saveTrackedQRs = (qrs: Record<string, TrackedQR>) => {
  try {
    const TRACKED_QRS_FILE = path.join(
      process.cwd(),
      "data",
      "tracked-qrs.json"
    );
    const dataDir = path.dirname(TRACKED_QRS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(TRACKED_QRS_FILE, JSON.stringify(qrs, null, 2));
  } catch (error) {
    console.error("Error saving tracked QRs:", error);
  }
};

export function middleware(request: NextRequest) {
  // Vérifier si c'est une route de tracking QR
  if (request.nextUrl.pathname.startsWith("/t/")) {
    const id = request.nextUrl.pathname.split("/t/")[1];

    if (!id) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    try {
      const trackedQRs = readTrackedQRs();
      const qr = trackedQRs[id];

      if (!qr) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }

      // Incrémenter le compteur de vues
      qr.views += 1;
      qr.lastViewed = new Date().toISOString();
      qr.userAgent = request.headers.get("user-agent") || "";
      qr.referrer = request.headers.get("referer") || "";

      trackedQRs[id] = qr;
      saveTrackedQRs(trackedQRs);

      // Rediriger vers l'URL originale si c'est une URL
      if (qr.type === "url" && qr.originalContent.startsWith("http")) {
        return NextResponse.redirect(qr.originalContent);
      }

      // Pour les autres types, continuer vers la page d'affichage
      return NextResponse.rewrite(new URL(`/qr-display/${id}`, request.url));
    } catch (error) {
      console.error("Error processing QR redirect:", error);
      return NextResponse.rewrite(new URL("/404", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/t/:path*",
};
