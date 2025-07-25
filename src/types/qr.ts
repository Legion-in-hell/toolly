// types/qr.ts
export interface QRCodeConfig {
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  type: string;
  quality: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
  height: number;
}

export interface QRCodeOptions {
  size?: number;
  errorCorrection?: "L" | "M" | "Q" | "H";
  backgroundColor?: string;
  foregroundColor?: string;
  withLogo?: boolean;
  margin?: number;
}

export interface GeneratedQRCode {
  dataURL: string;
  canvas: HTMLCanvasElement | null;
  text: string;
  options: QRCodeConfig;
}

export interface HistoryItem {
  id: string;
  trackingId?: string;
  content: string;
  originalContent?: string;
  type: string;
  date: string;
  preview: string;
  views?: number;
  lastViewed?: string;
}

export interface QRFormData {
  email: { address: string; subject: string; body: string };
  phone: string;
  sms: { number: string; message: string };
  vcard: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    website: string;
    company: string;
    title: string;
    address: string;
  };
  location: { lat: string; lon: string; name: string };
  wifi: {
    ssid: string;
    password: string;
    encryption: string;
    hidden: boolean;
  };
  event: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}

export interface QRType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface QRStats {
  views: number;
  lastViewed?: string;
}

declare global {
  interface Window {
    QRCode: {
      new (element: HTMLElement, options: Record<string, unknown>): unknown;
      CorrectLevel: {
        L: number;
        M: number;
        Q: number;
        H: number;
      };
    };
  }
}
