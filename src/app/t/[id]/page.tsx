// app/t/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TrackedQR {
  id: string;
  originalContent: string;
  type: string;
  createdAt: string;
  views: number;
  lastViewed?: string;
}

export default function QRTrackingPage() {
  const params = useParams();
  const [qr, setQr] = useState<TrackedQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trackAndRedirect = async () => {
      const id = params.id as string;

      if (!id) {
        setError("ID manquant");
        setLoading(false);
        return;
      }

      try {
        // Appel à l'API pour incrémenter et récupérer les données
        const response = await fetch(`/api/qr-track/visit/${id}`, {
          method: "POST",
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("QR code non trouvé");
          } else {
            setError("Erreur lors du chargement");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setQr(data.qr);

        // Si c'est une URL, rediriger après un court délai
        if (
          data.qr.type === "url" &&
          data.qr.originalContent.startsWith("http")
        ) {
          setTimeout(() => {
            window.location.href = data.qr.originalContent;
          }, 1000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur de connexion");
        setLoading(false);
      }
    };

    trackAndRedirect();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
          {qr?.type === "url" && (
            <p className="text-gray-600 dark:text-gray-400">
              Redirection en cours vers {qr.originalContent}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <a
            href="/tools/qr-generator"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un nouveau QR code
          </a>
        </div>
      </div>
    );
  }

  if (!qr) {
    return null;
  }

  // Affichage pour les types non-URL
  const renderContent = () => {
    switch (qr.type) {
      case "email":
        const mailtoMatch = qr.originalContent.match(
          /^mailto:([^?]+)(\?(.+))?$/
        );
        if (mailtoMatch) {
          const email = mailtoMatch[1];
          const params = new URLSearchParams(mailtoMatch[3] || "");
          const subject = params.get("subject") || "";
          const body = params.get("body") || "";

          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">📧 Contact Email</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> {email}
                </p>
                {subject && (
                  <p>
                    <strong>Sujet:</strong> {subject}
                  </p>
                )}
                {body && (
                  <p>
                    <strong>Message:</strong> {body}
                  </p>
                )}
              </div>
              <a
                href={qr.originalContent}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ouvrir l&#39;email
              </a>
            </div>
          );
        }
        break;

      case "phone":
        const phone = qr.originalContent.replace("tel:", "");
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">📞 Téléphone</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-2xl font-mono">{phone}</p>
            </div>
            <a
              href={qr.originalContent}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Appeler
            </a>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">📝 Texte</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{qr.originalContent}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">QR Code</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-mono break-all">{qr.originalContent}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Généré avec Toolly.fr • {qr.views} vue{qr.views > 1 ? "s" : ""}
          </p>
        </div>

        {renderContent()}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <a
            href="/tools/qr-generator"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            🔗 Créer votre QR code sur Toolly.fr
          </a>
        </div>
      </div>
    </div>
  );
}
