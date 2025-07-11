"use client";

import React, { useState } from "react";
import { MessageSquare, Users, X, Sparkles, ArrowRight } from "lucide-react";

export default function DiscordCTABanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-t-2 border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Contenu principal */}
          <div className="flex items-center space-x-4">
            {/* Icône animée */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3">
                <MessageSquare className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>

            {/* Texte accrocheur */}
            <div className="text-white">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-bounce" />
                <span className="font-bold text-lg">
                  Rejoins notre Discord !
                </span>
                <Sparkles
                  className="h-4 w-4 text-yellow-300 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <div className="text-sm text-white/90 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>
                  Suggestions d&#39;outils • Previews exclusives • Communauté
                  dev
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center space-x-3 relative z-10">
            <a
              href="https://discord.gg/4R5zUpvUGZ"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Discord link clicked!");
              }}
            >
              <span>Rejoindre</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* Bouton fermer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
                console.log("Banner closed!");
              }}
              className="text-white hover:bg-white/10 rounded-full p-2 cursor-pointer transition-colors relative z-10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badge "Nouveau" optionnel */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
            🎉 NOUVEAU
          </div>
        </div>
      </div>

      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse opacity-50 pointer-events-none"></div>
    </div>
  );
}
