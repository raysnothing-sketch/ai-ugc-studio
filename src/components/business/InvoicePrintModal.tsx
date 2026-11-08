'use client';

import React from 'react';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';
import { Invoice, UserProfile } from '@/lib/types';

interface InvoicePrintModalProps {
  invoice: Invoice;
  userProfile: UserProfile;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  userProfile,
  onClose
}) => {
  const isInvoice = invoice.type === 'invoice';
  const docTitle = isInvoice ? 'FACTURE' : 'DEVIS';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-8">
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22262e] bg-[#111317] print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-400 font-bold text-xs">
              {docTitle} {invoice.number}
            </span>
            <span className="text-xs text-[#8e94a0]">• Prêt pour téléchargement / impression</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-gold-500 text-[#0c0d0f] font-bold text-xs hover:bg-gold-400 transition-colors flex items-center gap-1.5 shadow-gold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Exporter PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8e94a0] hover:text-[#f5f5f3] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document (A4 White Sheet for Real Professional PDF) */}
        <div id="printable-invoice" className="p-10 bg-white text-zinc-900 font-sans text-xs space-y-8 select-text">
          {/* Header Row */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-950">
                {userProfile.studioName}
              </h1>
              <p className="text-zinc-600 font-medium">{userProfile.name}</p>
              <p className="text-zinc-500">{userProfile.title}</p>
              <p className="text-zinc-500">{userProfile.address}</p>
              <p className="text-zinc-500 font-mono">TVA / SIRET : {userProfile.taxNumber}</p>
              <p className="text-zinc-500">{userProfile.email}</p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-zinc-950 text-white font-bold text-sm rounded">
                {docTitle}
              </span>
              <p className="text-base font-extrabold text-zinc-900 font-mono mt-1">
                {invoice.number}
              </p>
              <p className="text-zinc-500">Date d&apos;émission : <strong>{invoice.issueDate}</strong></p>
              <p className="text-zinc-500">Date d&apos;échéance : <strong>{invoice.dueDate}</strong></p>
            </div>
          </div>

          {/* Client Destination */}
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Destinataire</p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5">{invoice.clientName}</p>
              <p className="text-zinc-600">{invoice.clientAddress || 'Adresse client professionnelle'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Statut du document</p>
              <p className="text-xs font-bold text-emerald-600 uppercase mt-0.5">
                {invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Émise / En attente' : 'Brouillon validé'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-left text-[11px] uppercase tracking-wider text-zinc-600">
                  <th className="py-2.5">Description de la prestation</th>
                  <th className="py-2.5 text-center">Qté</th>
                  <th className="py-2.5 text-right">Prix Unitaire HT</th>
                  <th className="py-2.5 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-zinc-900">{item.description}</td>
                    <td className="py-3 text-center text-zinc-600">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-zinc-700">{userProfile.currency || '€'}{item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-bold text-zinc-900">{userProfile.currency || '€'}{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end pt-4 border-t border-zinc-200">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-zinc-600">
                <span>Total HT :</span>
                <span className="font-mono">{userProfile.currency || '€'}{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>TVA ({invoice.taxRate}%) :</span>
                <span className="font-mono">{userProfile.currency || '€'}{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-2 border-t-2 border-zinc-900">
                <span>Total TTC :</span>
                <span className="font-mono text-gold-600">{userProfile.currency || '€'}{invoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Legal Mentions / GoBD / French Law */}
          <div className="pt-8 border-t border-zinc-200 text-[10px] text-zinc-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-zinc-700">Conditions de règlement & Mentions légales :</p>
            <p>Paiement sous 30 jours à réception. En cas de retard de paiement, pénalité de 3 fois le taux d&apos;intérêt légal en vigueur ainsi qu&apos;une indemnité forfaitaire pour frais de recouvrement de 40 € (art. L.441-6 du Code de commerce).</p>
            <p>Conforme aux normes européennes de facturation électronique et GoBD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
