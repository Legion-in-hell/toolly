// app/api/qr-track/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Génération d'ID simple (remplace nanoid)
const generateId = () => Math.random().toString(36).substring(2, 10);

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

const TRACKED_QRS_FILE = path.join(process.cwd(), "data", "tracked-qrs.json");

// Fonction pour lire les QR codes trackés
const readTrackedQRs = (): Record<string, TrackedQR> => {
  try {
    const dataDir = path.dirname(TRACKED_QRS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

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
    fs.writeFileSync(TRACKED_QRS_FILE, JSON.stringify(qrs, null, 2));
  } catch (error) {
    console.error("Error saving tracked QRs:", error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const { content, type } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: "Content and type are required" },
        { status: 400 }
      );
    }

    const qrId = generateId(); // ID court mais unique
    const trackedQR: TrackedQR = {
      id: qrId,
      originalContent: content,
      type,
      createdAt: new Date().toISOString(),
      views: 0,
    };

    const trackedQRs = readTrackedQRs();
    trackedQRs[qrId] = trackedQR;
    saveTrackedQRs(trackedQRs);

    // Retourner l'URL de tracking pour les types URL
    let trackingContent = content;
    if (type === "url") {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toolly.fr";
      trackingContent = `${baseUrl}/t/${qrId}`;
    }

    return NextResponse.json({
      id: qrId,
      trackingContent,
      originalContent: content,
    });
  } catch (error) {
    console.error("Error creating tracked QR:", error);
    return NextResponse.json(
      { error: "Failed to create tracked QR" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { error: "IDs parameter is required" },
        { status: 400 }
      );
    }

    const qrIds = ids.split(",");
    const trackedQRs = readTrackedQRs();

    const stats = qrIds.reduce((acc, id) => {
      const qr = trackedQRs[id as string];
      if (qr) {
        acc[id as string] = {
          views: qr.views,
          lastViewed: qr.lastViewed,
          createdAt: qr.createdAt,
        };
      }
      return acc;
    }, {} as Record<string, { views: number; lastViewed?: string; createdAt: string }>);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching QR stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR stats" },
      { status: 500 }
    );
  }
}
