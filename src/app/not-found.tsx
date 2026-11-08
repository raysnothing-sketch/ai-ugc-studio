import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0d0f] flex items-center justify-center p-4 text-[#f5f5f3]">
      <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto shadow-gold">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#f5f5f3]">Page introuvable (404)</h2>
          <p className="text-xs text-[#8e94a0] leading-relaxed">
            La section demandée n&apos;existe pas ou a été déplacée dans le studio.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-[#0c0d0f] font-bold text-xs hover:bg-gold-400 transition-colors shadow-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
