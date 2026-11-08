'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Studio Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0c0d0f] flex items-center justify-center p-4 text-[#f5f5f3]">
      <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-[#f5f5f3]">
            Une interruption est survenue
          </h2>
          <p className="text-xs text-[#8e94a0] leading-relaxed">
            Le studio a intercepté une anomalie d&apos;exécution. Vos données locales restent en sécurité.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-[#0c0d0f] font-bold text-xs hover:bg-gold-400 transition-colors shadow-gold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser la vue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
