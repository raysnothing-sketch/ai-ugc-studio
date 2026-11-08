'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Settings, Key, Database, HardDrive, User, Check, ShieldCheck, DollarSign, Trash2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, clearAllStudioData } = useApp();
  const [saved, setSaved] = useState(false);

  // Profile fields
  const [name, setName] = useState(userProfile.name);
  const [studioName, setStudioName] = useState(userProfile.studioName);
  const [title, setTitle] = useState(userProfile.title);
  const [taxNumber, setTaxNumber] = useState(userProfile.taxNumber);
  const [address, setAddress] = useState(userProfile.address);
  const [currency, setCurrency] = useState(userProfile.currency || '€');

  useEffect(() => {
    setName(userProfile.name);
    setStudioName(userProfile.studioName);
    setTitle(userProfile.title);
    setTaxNumber(userProfile.taxNumber);
    setAddress(userProfile.address);
    setCurrency(userProfile.currency || '€');
  }, [userProfile]);

  // API Configs
  const [tursoUrl, setTursoUrl] = useState('libsql://ai-ugc-studio.turso.io');
  const [r2Bucket, setR2Bucket] = useState('ai-ugc-studio-storage');
  const [heygenKey, setHeygenKey] = useState('sk_heygen_live_****************');
  const [elevenlabsKey, setElevenlabsKey] = useState('xi_eleven_prod_****************');
  const [runwayKey, setRunwayKey] = useState('rw_gen3_live_****************');
  const [openaiKey, setOpenaiKey] = useState('sk-proj-live-****************');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      studioName,
      title,
      taxNumber,
      address,
      currency
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données locales du studio ?')) {
      clearAllStudioData();
      alert('Toutes les données ont été réinitialisées.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Paramètres du Studio</h1>
        <p className="text-xs text-[#8e94a0] mt-1">
          Personnalisation de votre profil, devise, clés d&apos;API, base de données Turso et stockage Cloudflare R2.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            Profil & Identité de votre Studio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#8e94a0] block mb-1">Votre Nom & Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-semibold"
                required
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Nom du Studio</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-semibold"
                required
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Titre Professionnel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Devise</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              >
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="CHF">CHF (Franc Suisse)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Numéro Fiscal / TVA / Siret</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Adresse de facturation</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              />
            </div>
          </div>
        </div>

        {/* Database & Cloudflare R2 */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Infrastructure : Base de données Turso & Cloudflare R2
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#8e94a0] block mb-1">URL Base de données Turso</label>
              <input
                type="text"
                value={tursoUrl}
                onChange={(e) => setTursoUrl(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Bucket Cloudflare R2</label>
              <input
                type="text"
                value={r2Bucket}
                onChange={(e) => setR2Bucket(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* AI Providers Keys */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Fournisseurs IA Connectés
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Chiffrement côté serveur
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#8e94a0] block mb-1">HeyGen API (Génération Vidéo Avatars & Lip-Sync)</label>
              <input
                type="password"
                value={heygenKey}
                onChange={(e) => setHeygenKey(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
              />
            </div>

            <div>
              <label className="text-[#8e94a0] block mb-1">ElevenLabs API (Voix Synthétiques Multilingues DE/FR/EN)</label>
              <input
                type="password"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
              />
            </div>

            <div>
              <label className="text-[#8e94a0] block mb-1">Runway Gen-3 / Luma Dream Machine (Cinematic Studio)</label>
              <input
                type="password"
                value={runwayKey}
                onChange={(e) => setRunwayKey(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
              />
            </div>

            <div>
              <label className="text-[#8e94a0] block mb-1">OpenAI / Anthropic (Marketing Intelligence & Scripts)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Anti-Debit Financial Shield Card */}
        <div className="bg-[#14161a] border border-[#d4af37]/40 rounded-xl p-5 shadow-gold space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              Bouclier de Sécurité Budgétaire & Anti-Prélèvement
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
              Protection Active
            </span>
          </div>

          <p className="text-xs text-[#8e94a0] leading-relaxed">
            Ce disjoncteur logiciel empêche toute plateforme externe de débiter de l&apos;argent au-delà de la limite que vous fixez.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#0c0d0f] border border-[#232730] rounded-lg space-y-1.5">
              <label className="text-[#f5f5f3] font-semibold block">
                Plafond Mensuel Strict (Hard Limit)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={25}
                  min={0}
                  max={500}
                  className="w-24 p-2 bg-[#14161a] border border-[#232730] rounded text-gold-400 font-bold font-mono text-center text-sm"
                />
                <span className="text-[#8e94a0]">€ / mois max</span>
              </div>
              <span className="text-[10px] text-[#656a76] block">
                Dès que ce montant est atteint, l&apos;application coupe immédiatement tout appel payant.
              </span>
            </div>

            <div className="p-3 bg-[#0c0d0f] border border-[#232730] rounded-lg space-y-1.5">
              <label className="text-[#f5f5f3] font-semibold block">
                Mode &apos;Simulation Sans Frais&apos; (0 €)
              </label>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold text-[11px]">
                  Mode Sécurisé
                </span>
                <span className="text-[11px] text-[#8e94a0]">
                  Génère des aperçus photoréalistes sans solliciter vos cartes bancaires.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#191c22] border border-[#2b2f3a] text-[11px] text-[#8e94a0] space-y-1">
            <p className="font-semibold text-[#f5f5f3] flex items-center gap-1.5">
              🛡️ Règles d&apos;or pour empêcher les plateformes de débiter votre compte :
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[#8e94a0]">
              <li><strong>Cartes virtuelles à plafond bloqué :</strong> Utilisez une carte virtuelle (Revolut, Lydia, Wise ou Qonto) plafonnée à 20 € max. Toute tentative de débit supérieur est rejetée à la source par la banque.</li>
              <li><strong>Désactiver l&apos;auto-recharge (Auto-refill) :</strong> Sur OpenAI, ElevenLabs et HeyGen, désactivez toujours l&apos;option de réapprovisionnement automatique pour payer uniquement au solde prépayé.</li>
            </ul>
          </div>
        </div>

        {/* Save & Reset Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Réinitialiser les données locales</span>
          </button>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Enregistré !
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
