"use client";

import ExoNetClassifier from "@/components/ExoNetClassifier";
import { useEffect, useState } from "react";

export default function Home() {
  const [constellations, setConstellations] = useState<Array<{
    id: number;
    type: number;
    top: string;
    left: string;
    animationDelay: string;
  }>>([]);

  useEffect(() => {
    // Generate very random constellations (very low frequency)
    const generateConstellations = () => {
      const constellationCount = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
      const newConstellations = [];
      
      for (let i = 0; i < constellationCount; i++) {
        newConstellations.push({
          id: i,
          type: Math.floor(Math.random() * 3) + 1, // Random type 1-3
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 90}%`,
          animationDelay: `${Math.random() * 10}s`,
        });
      }
      
      setConstellations(newConstellations);
    };

    generateConstellations();
    
    // Regenerate constellations very rarely (every 30-60 seconds)
    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // Only 20% chance to regenerate
        generateConstellations();
      }
    }, 30000 + Math.random() * 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background stars - INCREASED OPACITY FOR MORE ILLUMINATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-70">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* Very random constellations */}
      {constellations.map((constellation) => (
        <div
          key={constellation.id}
          className={`fixed pointer-events-none constellation-${constellation.type}`}
          style={{
            top: constellation.top,
            left: constellation.left,
            animation: `fadeInOut ${15 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: constellation.animationDelay,
          }}
        />
      ))}

      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <ExoNetClassifier />
      </main>

      {/* Footer - Apple-style minimal */}
      <footer className="relative z-10 text-center py-12 text-sm text-gray-500 border-t border-white/5">
        <p className="font-light">ExoNET — Accelerating scientific discovery through explainable AI</p>
      </footer>
    </div>
  );
}