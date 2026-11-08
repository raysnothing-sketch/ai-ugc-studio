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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0d0f] p-4 text-[#f5f5f3]">
      {/* Background glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#14161a] border border-[#2b2f3a] rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-[#191c22] to-[#0c0d0f] border border-[#d4af37]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <Lock className="w-7 h-7 text-[#d4af37]" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#f5f5f3]">
              {studioName}
            </h1>
            <p className="text-xs text-[#8e94a0] mt-1">
              Espace Privé de {ownerName} • Production Marketing & IA
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 bg-[#191c22] rounded-xl border border-[#232730] flex items-center gap-3 text-xs text-[#8e94a0]">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Accès privé et sécurisé. Vos clés d&apos;API et données clients sont protégées.</span>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8e94a0] block">
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
                className="w-full pl-10 pr-4 py-3 bg-[#0c0d0f] border border-[#232730] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 rounded-xl text-[#f5f5f3] tracking-widest text-center text-lg font-mono placeholder:tracking-normal placeholder:text-xs placeholder:text-[#656a76] transition-all"
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] font-bold text-xs uppercase tracking-wider hover:from-[#e5c05d] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Vérification...' : 'Déverrouiller le Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-[#656a76]">
          AI UGC Studio — Personal Edition (v1.0 Production)
        </p>
      </div>
    </div>
  );
};
