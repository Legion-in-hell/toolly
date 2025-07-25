// hooks/useQRStats.ts
import { useState, useEffect, useCallback } from "react";
import { QRStats } from "../types/qr";

type HistoryItem = { trackingId?: string };

export const useQRStats = (history: HistoryItem[]) => {
  const [qrStats, setQrStats] = useState<Record<string, QRStats>>({});
  const [loadingStats, setLoadingStats] = useState(false);

  const loadViewStats = useCallback(async (qrIds: string[]) => {
    if (qrIds.length === 0) return;

    setLoadingStats(true);
    try {
      const response = await fetch(`/api/qr-track?ids=${qrIds.join(",")}`);
      if (response.ok) {
        const stats = await response.json();
        setQrStats((prev) => ({ ...prev, ...stats }));
      } else {
        console.error("Failed to load stats:", response.status);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Charger les stats automatiquement quand l'historique change
  useEffect(() => {
    const trackingIds = history
      .map((item) => item.trackingId)
      .filter((id): id is string => Boolean(id));

    if (trackingIds.length > 0) {
      loadViewStats(trackingIds);
    }
  }, [history, loadViewStats]);

  // Rafraîchir les stats toutes les 30 secondes
  useEffect(() => {
    const refreshStats = () => {
      const trackingIds = history
        .map((item) => item.trackingId)
        .filter((id): id is string => Boolean(id));

      if (trackingIds.length > 0) {
        loadViewStats(trackingIds);
      }
    };

    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [history, loadViewStats]);

  return {
    qrStats,
    loadingStats,
    loadViewStats,
  };
};
