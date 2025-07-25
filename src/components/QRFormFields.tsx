// components/QRFormFields.tsx
import React from "react";
import { QRFormData } from "../types/qr";

interface QRFormFieldsProps {
  qrType: string;
  text: string;
  setText: (text: string) => void;
  formData: QRFormData;
  setFormData: (data: QRFormData) => void;
  enableTracking: boolean;
}

export const QRFormFields: React.FC<QRFormFieldsProps> = ({
  qrType,
  text,
  setText,
  formData,
  setFormData,
  enableTracking,
}) => {
  const inputClassName =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  const labelClassName =
    "block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100";

  switch (qrType) {
    case "url":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Adresse web (URL)</label>
            <input
              type="url"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://toolly.fr"
              className={inputClassName}
            />
            {enableTracking && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ✨ Le tracking est activé - vous pourrez voir le nombre de clics
              </p>
            )}
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Texte libre</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Saisissez votre texte ici..."
              rows={4}
              className={inputClassName}
            />
          </div>
        </div>
      );

    case "email":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Adresse email</label>
            <input
              type="email"
              value={formData.email.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: { ...formData.email, address: e.target.value },
                })
              }
              placeholder="contact@toolly.fr"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Sujet (optionnel)</label>
            <input
              type="text"
              value={formData.email.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: { ...formData.email, subject: e.target.value },
                })
              }
              placeholder="Objet de l'email"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Message (optionnel)</label>
            <textarea
              value={formData.email.body}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: { ...formData.email, body: e.target.value },
                })
              }
              placeholder="Contenu de l'email..."
              rows={3}
              className={inputClassName}
            />
          </div>
        </div>
      );

    case "phone":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Numéro de téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+33 1 23 45 67 89"
              className={inputClassName}
            />
          </div>
        </div>
      );

    case "sms":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Numéro de téléphone</label>
            <input
              type="tel"
              value={formData.sms.number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sms: { ...formData.sms, number: e.target.value },
                })
              }
              placeholder="+33 1 23 45 67 89"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Message (optionnel)</label>
            <textarea
              value={formData.sms.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sms: { ...formData.sms, message: e.target.value },
                })
              }
              placeholder="Votre message..."
              rows={3}
              className={inputClassName}
            />
          </div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Nom du réseau (SSID)</label>
            <input
              type="text"
              value={formData.wifi.ssid}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wifi: { ...formData.wifi, ssid: e.target.value },
                })
              }
              placeholder="MonWiFi"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Mot de passe</label>
            <input
              type="password"
              value={formData.wifi.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wifi: { ...formData.wifi, password: e.target.value },
                })
              }
              placeholder="Mot de passe"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Type de sécurité</label>
            <select
              value={formData.wifi.encryption}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wifi: { ...formData.wifi, encryption: e.target.value },
                })
              }
              className={inputClassName}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Aucun</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="wifi-hidden"
              checked={formData.wifi.hidden}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wifi: { ...formData.wifi, hidden: e.target.checked },
                })
              }
              className="rounded"
            />
            <label
              htmlFor="wifi-hidden"
              className="text-sm text-gray-900 dark:text-gray-100"
            >
              Réseau caché
            </label>
          </div>
        </div>
      );

    default:
      return (
        <div>
          <label className={labelClassName}>Contenu</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contenu du QR code"
            className={inputClassName}
          />
        </div>
      );
  }
};
