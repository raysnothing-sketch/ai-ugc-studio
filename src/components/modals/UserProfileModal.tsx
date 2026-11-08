'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { User, Sparkles, Check, Trash2, Camera } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, userProfile, updateUserProfile, clearAllStudioData } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [studioName, setStudioName] = useState(userProfile.studioName);
  const [title, setTitle] = useState(userProfile.title);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [email, setEmail] = useState(userProfile.email);
  const [taxNumber, setTaxNumber] = useState(userProfile.taxNumber);
  const [address, setAddress] = useState(userProfile.address);
  const [currency, setCurrency] = useState(userProfile.currency || '€');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isProfileModalOpen) {
      setName(userProfile.name);
      setStudioName(userProfile.studioName);
      setTitle(userProfile.title);
      setAvatarUrl(userProfile.avatarUrl);
      setEmail(userProfile.email);
      setTaxNumber(userProfile.taxNumber);
      setAddress(userProfile.address);
      setCurrency(userProfile.currency || '€');
    }
  }, [isProfileModalOpen, userProfile]);

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      studioName,
      title,
      avatarUrl,
      email,
      taxNumber,
      address,
      currency
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsProfileModalOpen(false);
    }, 800);
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données locales du studio (clients, projets, factures) ?')) {
      clearAllStudioData();
      setIsProfileModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f5f5f3]">
                Personnalisation du Profil & Studio
              </h3>
              <p className="text-[11px] text-[#8e94a0]">
                Configurez votre identité et vos coordonnées professionnelles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="text-[#8e94a0] hover:text-[#f5f5f3]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Avatar & Studio Name */}
          <div className="flex items-center gap-4 p-3 bg-[#191c22] rounded-xl border border-[#232730]">
            <img
              src={avatarUrl}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gold-500 shadow-md"
            />
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] text-[#8e94a0] block">URL de votre photo de profil / avatar</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-1.5 bg-[#0c0d0f] border border-[#232730] rounded text-[#f5f5f3] text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8e94a0] block mb-1">Votre Nom & Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-semibold"
                required
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Nom de votre Studio</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#8e94a0] block mb-1">Titre Professionnel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Directrice Artistique & Consultante UGC"
              className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8e94a0] block mb-1">Email professionnel</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Devise principale</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              >
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="CHF">CHF (Franc Suisse)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#8e94a0] block mb-1">Numéro TVA / Siret / Identifiant Fiscal</label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="FR..."
              className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#22262e]">
          <button
            type="button"
            onClick={handleResetData}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
            title="Effacer toutes les données locales"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Réinitialiser les données</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Enregistré !' : 'Enregistrer mon profil'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
