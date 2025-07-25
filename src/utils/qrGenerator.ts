// utils/qrGenerator.ts
import { QRCodeOptions, GeneratedQRCode, QRFormData } from "../types/qr";

export const generateQRCode = async (
  text: string,
  options: QRCodeOptions = {}
): Promise<GeneratedQRCode> => {
  return new Promise((resolve, reject) => {
    if (!window.QRCode) {
      reject(new Error("QRCode library not loaded"));
      return;
    }

    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      const qrOptions = {
        text: text,
        width: options.size || 200,
        height: options.size || 200,
        colorDark: options.foregroundColor || "#000000",
        colorLight: options.backgroundColor || "#FFFFFF",
        correctLevel: (() => {
          switch (options.errorCorrection) {
            case "L":
              return window.QRCode.CorrectLevel.L || 1;
            case "M":
              return window.QRCode.CorrectLevel.M || 0;
            case "Q":
              return window.QRCode.CorrectLevel.Q || 3;
            case "H":
              return window.QRCode.CorrectLevel.H || 2;
            default:
              return window.QRCode.CorrectLevel.M || 0;
          }
        })(),
      };

      new window.QRCode(tempDiv, qrOptions);

      setTimeout(() => {
        try {
          const canvas = tempDiv.querySelector("canvas") as HTMLCanvasElement;
          const img = tempDiv.querySelector("img") as HTMLImageElement;

          let dataURL: string;
          if (canvas) {
            dataURL = canvas.toDataURL("image/png");
          } else if (img && img.src) {
            dataURL = img.src;
          } else {
            throw new Error("Could not get QR code data");
          }

          document.body.removeChild(tempDiv);

          if (options.withLogo) {
            addLogoToQR(dataURL, options, resolve, reject, text);
          } else {
            resolve(createQRResult(dataURL, text, options));
          }
        } catch (error) {
          document.body.removeChild(tempDiv);
          reject(error);
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
};

const addLogoToQR = (
  dataURL: string,
  options: QRCodeOptions,
  resolve: (value: GeneratedQRCode) => void,
  reject: (reason?: unknown) => void,
  text: string
) => {
  const finalCanvas = document.createElement("canvas");
  const ctx = finalCanvas.getContext("2d");

  if (!ctx) {
    reject(new Error("Cannot get canvas context"));
    return;
  }

  const qrImg = document.createElement("img");
  qrImg.onload = function () {
    finalCanvas.width = options.size || 200;
    finalCanvas.height = options.size || 200;

    ctx.drawImage(qrImg, 0, 0, finalCanvas.width, finalCanvas.height);

    const logo = document.createElement("img");
    logo.onload = function () {
      // Taille du logo
      const logoSize = finalCanvas.width * 0.15;
      const x = (finalCanvas.width - logoSize) / 2;
      const y = (finalCanvas.height - logoSize) / 2;

      // Arrière-plan blanc pour le logo
      const bgPadding = 8;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(
        x - bgPadding,
        y - bgPadding,
        logoSize + bgPadding * 2,
        logoSize + bgPadding * 2
      );

      // Bordure autour du logo
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x - bgPadding,
        y - bgPadding,
        logoSize + bgPadding * 2,
        logoSize + bgPadding * 2
      );

      // Dessiner le logo
      ctx.drawImage(logo, x, y, logoSize, logoSize);

      resolve(
        createQRResult(
          finalCanvas.toDataURL("image/png"),
          text,
          options,
          finalCanvas
        )
      );
    };

    logo.onerror = function () {
      console.warn("Logo introuvable à /logo.png - QR généré sans logo");
      resolve(
        createQRResult(
          finalCanvas.toDataURL("image/png"),
          text,
          options,
          finalCanvas
        )
      );
    };

    logo.src = "/logo.png";
  };

  qrImg.src = dataURL;
};

const createQRResult = (
  dataURL: string,
  text: string,
  options: QRCodeOptions,
  canvas?: HTMLCanvasElement
): GeneratedQRCode => ({
  dataURL,
  canvas: canvas || null,
  text,
  options: {
    errorCorrectionLevel: options.errorCorrection || "M",
    type: "image/png",
    quality: 0.92,
    margin: options.margin || 4,
    color: {
      dark: options.foregroundColor || "#000000",
      light: options.backgroundColor || "#FFFFFF",
    },
    width: options.size || 200,
    height: options.size || 200,
  },
});

export const generateQRContent = (
  qrType: string,
  text: string,
  formData: QRFormData
): string => {
  switch (qrType) {
    case "url":
    case "text":
      return text;

    case "email":
      return `mailto:${formData.email.address}?subject=${encodeURIComponent(
        formData.email.subject
      )}&body=${encodeURIComponent(formData.email.body)}`;

    case "phone":
      return `tel:${formData.phone}`;

    case "sms":
      return `smsto:${formData.sms.number}:${formData.sms.message}`;

    case "vcard":
      return `BEGIN:VCARD
VERSION:3.0
N:${formData.vcard.lastName};${formData.vcard.firstName};;;
FN:${formData.vcard.firstName} ${formData.vcard.lastName}
ORG:${formData.vcard.company}
TITLE:${formData.vcard.title}
TEL;TYPE=WORK,VOICE:${formData.vcard.phone}
EMAIL:${formData.vcard.email}
URL:${formData.vcard.website}
ADR;TYPE=WORK:;;${formData.vcard.address};;;;
END:VCARD`;

    case "location":
      return `geo:${formData.location.lat},${
        formData.location.lon
      }?q=${encodeURIComponent(formData.location.name)}`;

    case "wifi":
      return `WIFI:S:${formData.wifi.ssid};T:${formData.wifi.encryption};P:${
        formData.wifi.password
      };H:${formData.wifi.hidden ? "true" : "false"};;`;

    case "event":
      const startDate = formData.event.startDate
        ? new Date(formData.event.startDate)
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d+/g, "") + "Z"
        : "";
      const endDate = formData.event.endDate
        ? new Date(formData.event.endDate)
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d+/g, "") + "Z"
        : "";
      return `BEGIN:VEVENT
SUMMARY:${formData.event.title.replace(/([,;])/g, "\\$1")}
LOCATION:${formData.event.location}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${formData.event.description}
END:VEVENT`;

    default:
      return text;
  }
};

export const createTrackedQR = async (
  content: string,
  type: string,
  enableTracking: boolean
) => {
  if (!enableTracking) return { trackingContent: content, trackingId: null };

  try {
    const response = await fetch("/api/qr-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        trackingContent: data.trackingContent,
        trackingId: data.id,
        originalContent: content,
      };
    }
  } catch (error) {
    console.debug("Failed to create tracked QR:", error);
  }

  return { trackingContent: content, trackingId: null };
};
