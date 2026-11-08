'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Info,
  DollarSign,
  FolderPlus,
  Trash2
} from 'lucide-react';
import { Invoice } from '@/lib/types';
import { InvoicePrintModal } from './InvoicePrintModal';

export const BusinessManagerView: React.FC = () => {
  const {
    language,
    invoices,
    addInvoice,
    deleteInvoice,
    services,
    clients,
    userProfile,
    isNewDocModalOpen,
    setIsNewDocModalOpen
  } = useApp();
  const t = TRANSLATIONS[language].business;

  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices' | 'payments' | 'services'>('quotes');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // New Doc Form
  const [docType, setDocType] = useState<'quote' | 'invoice'>('quote');
  const [clientName, setClientName] = useState(clients[0]?.name || 'Nouveau Client');
  const [description, setDescription] = useState('Pack Vidéos UGC & Stratégie Publicitaire');
  const [amount, setAmount] = useState('1800');
  const [taxRate, setTaxRate] = useState('20');

  const filteredInvoices = invoices.filter((doc) => {
    if (activeTab === 'quotes') return doc.type === 'quote';
    if (activeTab === 'invoices') return doc.type === 'invoice';
    if (activeTab === 'payments') return doc.status === 'paid' || doc.paidAmount > 0;
    return true;
  });

  const totalRevenue = invoices
    .filter((i) => i.type === 'invoice' && (i.status === 'paid' || i.status === 'sent'))
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingInvoices = invoices.filter((i) => i.type === 'invoice' && i.status === 'sent');
  const nextInvoice = pendingInvoices.length > 0 ? pendingInvoices[0] : null;

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const num = `#${currentYear}-${String(invoices.length + 1).padStart(3, '0')}`;
    const sub = parseFloat(amount) || 1000;
    const rate = parseFloat(taxRate) || 20;
    const tax = Math.round((sub * rate) / 100);

    const newDoc: Omit<Invoice, 'id'> = {
      number: num,
      clientId: 'cli-user',
      clientName: clientName,
      clientAddress: 'Adresse Client',
      type: docType,
      issueDate: new Date().toLocaleDateString('fr-FR'),
      dueDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('fr-FR'),
      items: [
        {
          id: `item-${Date.now()}`,
          description: description,
          quantity: 1,
          unitPrice: sub,
          total: sub
        }
      ],
      subtotal: sub,
      taxRate: rate,
      taxAmount: tax,
      totalAmount: sub + tax,
      paidAmount: 0,
      status: docType === 'invoice' ? 'sent' : 'draft',
      notes: `Émis par ${userProfile.name} • ${userProfile.studioName}`
    };

    addInvoice(newDoc);
    setIsNewDocModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsNewDocModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
        >
          <span>{t.newQuote}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#22262e] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'quotes'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.tabs.quotes}
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'invoices'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.tabs.invoices}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'payments'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.tabs.payments}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'services'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.tabs.services}
        </button>
      </div>

      {/* 3 Column Cards: Real Revenue, Real Documents List, Real Next Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Chiffre d'affaires réel (5 cols) */}
        <div className="md:col-span-5 bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8e94a0]">
              {t.revenueThisMonth}
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-extrabold text-[#f5f5f3] tracking-tight">
                {userProfile.currency || '€'}{totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Réel
              </span>
            </div>
          </div>

          {/* Golden curve sparkline */}
          <div className="w-full h-24 mt-4 relative">
            <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={totalRevenue > 0 ? "M 0 65 Q 60 40, 120 48 T 240 25 T 300 12 L 300 80 L 0 80 Z" : "M 0 75 L 300 75 L 300 80 L 0 80 Z"}
                fill="url(#goldCurveGrad)"
              />
              <path
                d={totalRevenue > 0 ? "M 0 65 Q 60 40, 120 48 T 240 25 T 300 12" : "M 0 75 L 300 75"}
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Derniers documents (4 cols) */}
        <div className="md:col-span-4 bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.recentDocs}
            </h3>
            {invoices.length > 0 && (
              <span className="text-[11px] text-gold-400 font-medium">Voir tout →</span>
            )}
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {invoices.length === 0 ? (
              <div className="py-5 text-center text-[#8e94a0] space-y-2">
                <FileText className="w-7 h-7 mx-auto text-[#656a76]" />
                <p className="text-xs">Aucun document pour l&apos;instant</p>
                <button
                  onClick={() => setIsNewDocModalOpen(true)}
                  className="text-xs text-gold-400 hover:text-gold-300 font-medium"
                >
                  + Créer un devis
                </button>
              </div>
            ) : (
              invoices.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedInvoice(doc)}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#191c22] border border-[#232730] hover:border-[#d4af37]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-gold-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#f5f5f3] group-hover:text-gold-300 transition-colors truncate">
                        {doc.type === 'invoice' ? 'Facture' : 'Devis'} {doc.number}
                      </p>
                      <p className="text-[10px] text-[#8e94a0] truncate">{doc.clientName}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-[#f5f5f3]">
                      {userProfile.currency || '€'}{doc.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#8e94a0]">{doc.issueDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 3: Prochaine échéance (3 cols) */}
        <div className="md:col-span-3 bg-gradient-to-br from-[#1c1913] to-[#14161a] border border-[#d4af37]/30 rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8e94a0] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                {t.nextDeadline}
              </span>
              <Calendar className="w-4 h-4 text-gold-400" />
            </div>

            {nextInvoice ? (
              <>
                <p className="text-xl font-bold text-[#f5f5f3] mt-1">{nextInvoice.dueDate}</p>
                <p className="text-2xl font-extrabold text-gold-400 mt-0.5">
                  {userProfile.currency || '€'}{nextInvoice.totalAmount.toLocaleString()}
                </p>
                <p className="text-[11px] text-[#8e94a0] mt-1 truncate">
                  Facture {nextInvoice.number} • {nextInvoice.clientName}
                </p>
              </>
            ) : (
              <div className="py-4">
                <p className="text-sm font-semibold text-[#f5f5f3]">Aucune échéance en attente</p>
                <p className="text-[11px] text-[#8e94a0] mt-1">Vos factures émises apparaîtront ici</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                if (nextInvoice) setSelectedInvoice(nextInvoice);
                else setIsNewDocModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#d4af37] text-[#0c0d0f] font-bold text-xs hover:bg-[#e5c05d] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
            >
              <span>{nextInvoice ? t.viewDetails : '+ Nouveau devis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog of standard freelance services if services tab active */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="bg-[#14161a] border border-[#232730] p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-[#f5f5f3]">{srv.name}</h4>
                  <p className="text-xs text-gold-400">{srv.category}</p>
                </div>
                <span className="text-sm font-extrabold text-gold-400">
                  {userProfile.currency || '€'}{srv.price}
                </span>
              </div>
              <p className="text-xs text-[#8e94a0] leading-relaxed">{srv.description}</p>
              <div className="pt-2 border-t border-[#22262e] flex justify-between items-center text-[11px] text-[#8e94a0]">
                <span>Délai : {srv.duration}</span>
                <button
                  onClick={() => {
                    setDescription(srv.name);
                    setAmount(String(srv.price));
                    setIsNewDocModalOpen(true);
                  }}
                  className="text-gold-400 hover:text-gold-300 font-medium"
                >
                  Insérer dans un devis →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GoBD Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#14161a] border border-[#232730] text-xs text-[#8e94a0]">
        <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.gobdNotice}
        </p>
      </div>

      {/* Document Detail Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#f5f5f3]">
                  {selectedInvoice.type === 'invoice' ? 'Facture' : 'Devis'} {selectedInvoice.number}
                </h3>
                <p className="text-xs text-[#8e94a0]">
                  Client : <span className="text-[#f5f5f3] font-medium">{selectedInvoice.clientName}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1.5 rounded-lg hover:bg-[#1f232b]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#8e94a0]">
                <span>Date d&apos;émission : {selectedInvoice.issueDate}</span>
                <span>Date d&apos;échéance : {selectedInvoice.dueDate}</span>
              </div>

              {/* Items Table */}
              <div className="border border-[#232730] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#191c22] text-[#8e94a0] text-[11px]">
                    <tr>
                      <th className="p-2.5">Prestation</th>
                      <th className="p-2.5 text-right">Qté</th>
                      <th className="p-2.5 text-right">Prix Unitaire</th>
                      <th className="p-2.5 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232730] text-[#f5f5f3]">
                    {selectedInvoice.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-2.5">{it.description}</td>
                        <td className="p-2.5 text-right">{it.quantity}</td>
                        <td className="p-2.5 text-right">{userProfile.currency || '€'}{it.unitPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-medium">{userProfile.currency || '€'}{it.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-[#191c22] p-3 rounded-lg space-y-1.5 text-right">
                <p className="text-[#8e94a0]">
                  Sous-total HT : <strong className="text-[#f5f5f3]">{userProfile.currency || '€'}{selectedInvoice.subtotal.toLocaleString()}</strong>
                </p>
                <p className="text-[#8e94a0]">
                  TVA ({selectedInvoice.taxRate}%) : <strong className="text-[#f5f5f3]">{userProfile.currency || '€'}{selectedInvoice.taxAmount.toLocaleString()}</strong>
                </p>
                <p className="text-sm font-bold text-gold-400">
                  Total TTC : {userProfile.currency || '€'}{selectedInvoice.totalAmount.toLocaleString()}
                </p>
              </div>

              {selectedInvoice.notes && (
                <p className="text-[11px] text-[#656a76] italic">{selectedInvoice.notes}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#22262e]">
              <button
                onClick={() => {
                  deleteInvoice(selectedInvoice.id);
                  setSelectedInvoice(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors shadow-gold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimer / Exporter PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Printable / PDF Invoice Modal */}
      {isPrintModalOpen && selectedInvoice && (
        <InvoicePrintModal
          invoice={selectedInvoice}
          userProfile={userProfile}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* New Document Modal */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateDocument}
            className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <h3 className="text-base font-bold text-[#f5f5f3]">
                Créer un nouveau document commercial
              </h3>
              <button
                type="button"
                onClick={() => setIsNewDocModalOpen(false)}
                className="text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8e94a0] block mb-1">Type de document</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as 'quote' | 'invoice')}
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  >
                    <option value="quote">Devis Commercial</option>
                    <option value="invoice">Facture Professionnelle</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#8e94a0] block mb-1">Nom du Client</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nom du client"
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Description de la prestation</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8e94a0] block mb-1">Montant HT ({userProfile.currency || '€'})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#8e94a0] block mb-1">Taux TVA (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#22262e]">
              <button
                type="button"
                onClick={() => setIsNewDocModalOpen(false)}
                className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
              >
                Créer et Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
