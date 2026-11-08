'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Users, Plus, Mail, Phone, Globe, MapPin, Building, ChevronRight, Search, UserPlus, Trash2 } from 'lucide-react';
import { Client } from '@/lib/types';

export const ClientsView: React.FC = () => {
  const { clients, addClient, deleteClient, userProfile, isNewClientModalOpen, setIsNewClientModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // New Client Form
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [sector, setSector] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addClient({
      name,
      contactName: contactName || name,
      email,
      phone,
      website,
      address,
      sector: sector || 'Marketing & Création',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      notes: 'Client enregistré dans votre studio.'
    });

    setIsNewClientModalOpen(false);
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setAddress('');
    setSector('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Clients & Marques</h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            Gérez vos clients réels, leurs fiches coordonnées et leur historique de projets.
          </p>
        </div>

        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Search Bar */}
      {clients.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656a76]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par entreprise, contact, secteur..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#14161a] border border-[#232730] rounded-xl text-[#f5f5f3] placeholder-[#656a76] focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      )}

      {/* Clients Grid or Empty State */}
      {clients.length === 0 ? (
        <div className="bg-[#14161a] border border-[#232730] rounded-2xl p-10 text-center space-y-3">
          <Users className="w-10 h-10 text-gold-400/60 mx-auto" />
          <h3 className="text-sm font-bold text-[#f5f5f3]">Aucun client enregistré pour l&apos;instant</h3>
          <p className="text-xs text-[#8e94a0] max-w-sm mx-auto">
            Commencez par ajouter votre premier client pour lui associer des projets, des devis et des campagnes publicitaires.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsNewClientModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ajouter votre premier client</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/50 rounded-xl p-5 shadow-card cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatarUrl}
                    alt={client.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#2b2f3a]"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors truncate">
                      {client.name}
                    </h3>
                    <p className="text-xs text-[#8e94a0] truncate">{client.contactName}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
                      {client.sector}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#8e94a0] pt-2 border-t border-[#22262e]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#656a76] shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#656a76] shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#22262e] mt-4 text-xs">
                <span className="text-[#8e94a0]">
                  Facturé : <strong className="text-[#f5f5f3]">{userProfile.currency || '€'}{client.totalBilled.toLocaleString()}</strong>
                </span>
                <span className="text-gold-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Voir fiche <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedClient.avatarUrl}
                  alt={selectedClient.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#2b2f3a]"
                />
                <div>
                  <h3 className="text-base font-bold text-[#f5f5f3]">{selectedClient.name}</h3>
                  <p className="text-xs text-gold-400">{selectedClient.sector}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#8e94a0]">
              <p><strong className="text-[#f5f5f3]">Contact référent :</strong> {selectedClient.contactName}</p>
              <p><strong className="text-[#f5f5f3]">Email :</strong> {selectedClient.email}</p>
              {selectedClient.phone && <p><strong className="text-[#f5f5f3]">Téléphone :</strong> {selectedClient.phone}</p>}
              {selectedClient.website && <p><strong className="text-[#f5f5f3]">Site web :</strong> {selectedClient.website}</p>}
              {selectedClient.address && <p><strong className="text-[#f5f5f3]">Adresse :</strong> {selectedClient.address}</p>}
              {selectedClient.notes && (
                <div className="p-3 rounded-lg bg-[#191c22] border border-[#232730] text-[#b8bcc8] mt-2">
                  <strong className="text-gold-400 block mb-1">Notes internes :</strong>
                  {selectedClient.notes}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#22262e]">
              <button
                onClick={() => {
                  deleteClient(selectedClient.id);
                  setSelectedClient(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer ce client
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <h3 className="text-base font-bold text-[#f5f5f3]">Nouveau Client</h3>
              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(false)}
                className="text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#8e94a0] block mb-1">Nom de l&apos;entreprise / Marque</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : BioCosmetics Studio"
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Nom du contact</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex : Julia Weber"
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8e94a0] block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@marque.com"
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#8e94a0] block mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Secteur d&apos;activité</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Cosmétiques, Sport, E-commerce, Mode..."
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#22262e]">
              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(false)}
                className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
              >
                Créer la fiche client
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
