// app/api/qr-track/visit/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const trackedQRs = readTrackedQRs();
    const qr = trackedQRs[id];

    if (!qr) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 });
    }

    // Incrémenter le compteur de vues
    qr.views += 1;
    qr.lastViewed = new Date().toISOString();
    qr.userAgent = request.headers.get("user-agent") || "";
    qr.referrer = request.headers.get("referer") || "";

    trackedQRs[id] = qr;
    saveTrackedQRs(trackedQRs);

    return NextResponse.json({
      success: true,
      qr: {
        id: qr.id,
        originalContent: qr.originalContent,
        type: qr.type,
        views: qr.views,
        lastViewed: qr.lastViewed,
      },
    });
  } catch (error) {
    console.error("Error processing QR visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
