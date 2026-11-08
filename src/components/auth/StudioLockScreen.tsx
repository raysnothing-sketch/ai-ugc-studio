'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, Shield, ArrowRight, KeyRound } from 'lucide-react';

interface StudioLockScreenProps {
  onUnlocked: () => void;
  studioName?: string;
  ownerName?: string;
}

export const StudioLockScreen: React.FC<StudioLockScreenProps> = ({
  onUnlocked,
  studioName = 'AI UGC Studio',
  ownerName = 'Rayan'
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Code incorrect');
      }

      onUnlocked();
    } catch (err: any) {
      setError(err.message || 'Code d\'accès incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080a] p-4 text-[#f5f5f3] overflow-hidden">
      {/* Ambient background with dimmed panoramic banner */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/banner.jpg"
          alt="Studio Background"
          className="w-full h-full object-cover opacity-15 filter blur-[3px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-[#07080a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#d4af37]/20 via-[#aa7c11]/5 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md bg-[#0e1014]/90 backdrop-blur-2xl border border-[#d4af37]/25 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        {/* Header with Official Metallic App Icon */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden p-[2px] bg-gradient-to-br from-[#fff2c6] via-[#d4af37] to-[#805a10] shadow-[0_0_30px_rgba(212,175,55,0.45)]">
            <img
              src="/icon.jpg"
              alt="AI UGC Studio Logo"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#f5f5f3] flex items-center justify-center gap-2">
              <span>{studioName}</span>
            </h1>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-400 mt-1">
              Personal Edition
            </p>
            <p className="text-xs text-[#8e94a0] mt-1.5">
              Plan. Create. Grow. • Espace Privé de {ownerName}
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 bg-[#13161c] rounded-xl border border-[#d4af37]/15 flex items-center gap-3 text-xs text-[#8e94a0]">
          <Shield className="w-4 h-4 text-gold-400 shrink-0" />
          <span>Accès privé protégé par clé de session chiffrée.</span>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8e94a0] block text-center">
              Code d&apos;accès Studio (PIN)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656a76]" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Entrez votre code (ex: 1234)"
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-[#07080a] border border-[#1e232d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 rounded-xl text-[#f5f5f3] tracking-widest text-center text-lg font-mono placeholder:tracking-normal placeholder:text-xs placeholder:text-[#656a76] transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 font-medium text-center pt-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e5b869] via-[#d4af37] to-[#aa7c11] text-[#07080a] font-extrabold text-xs uppercase tracking-wider hover:from-[#f0c776] hover:to-[#be8c18] transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Vérification...' : 'Déverrouiller le Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-[#555b68] tracking-wide">
          AI UGC Studio — Personal Edition (v1.0 Production)
        </p>
      </div>
    </div>
  );
};
