import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, MessageSquare, ShieldAlert, ArrowRight, X, Sparkles, Phone } from 'lucide-react';

export function ConfirmationModal({ folioData, onClose, onTrackFolio }) {
  const [copied, setCopied] = useState(false);

  if (!folioData) return null;

  const handleCopyFolio = () => {
    navigator.clipboard.writeText(folioData.folioId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola equipo de Biomédica UAO. Registré una solicitud de órtesis 3D en Cali con Folio: *${folioData.folioId}* a nombre de ${folioData.nombre}. Quisiera hacer seguimiento.`
  );
  const whatsappUrl = `https://wa.me/573150000000?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-teal-500/30 shadow-2xl overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 inline-block mb-2">
            ¡Solicitud Recibida con Éxito!
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Folio de Seguimiento Asignado
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Guardado en el sistema de Ingeniería Biomédica UAO Cali.
          </p>
        </div>

        {/* Folio ID Box */}
        <div className="bg-slate-900/90 border-2 border-dashed border-teal-500/40 rounded-2xl p-4 text-center mb-6 relative">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Código de Folio
          </p>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-300 tracking-wider">
              {folioData.folioId}
            </span>
            <button
              onClick={handleCopyFolio}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Copiar Folio"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-[10px] text-emerald-400 font-medium mt-1">
              ¡Folio copiado al portapapeles!
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            ¿Qué sucede a continuación?
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
            <li>Un ingeniero biomédico UAO revisará la fotografía e información enviada.</li>
            <li>Te contactaremos al WhatsApp <strong>+57 {folioData.telefono}</strong> para agendar la toma de medidas o validación.</li>
            <li>Una vez impresa la órtesis en PETG biomédico, se coordinará la entrega en Cali.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirmar por WhatsApp con Biomédica UAO</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onTrackFolio(folioData.folioId);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <span>Consultar Estado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800"
            >
              Entendido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
