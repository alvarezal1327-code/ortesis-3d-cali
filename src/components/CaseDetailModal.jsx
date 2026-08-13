import React, { useState } from 'react';
import { X, CheckCircle2, Cpu, Phone, MapPin, Calendar, MessageSquare, Printer, ZoomIn, Save, Edit3, UserCheck, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { updateSolicitudStatus } from '../lib/supabase';
import { PrintCaseSheet } from './PrintCaseSheet';

const SPLINT_OPTIONS = [
  'Por evaluar por Biomédico',
  'Férula Cock-Up de Muñeca (PETG)',
  'Férula Spica Inmovilizadora de Pulgar',
  'Órtesis de Antebrazo Rígida de Protección',
  'Férula Dinámica Muelle para Dedos',
  'Órtesis Tobillo-Pie Custom (AFO)',
  'Férula de Alineación Reposo Nocturno'
];

export function CaseDetailModal({ item, isOpen, onClose, onRecordUpdated }) {
  if (!isOpen || !item) return null;

  const [estado, setEstado] = useState(item.estado || 'Pendiente');
  const [tipoFerula, setTipoFerula] = useState(item.tipo_ferula || SPLINT_OPTIONS[0]);
  const [notas, setNotas] = useState(item.notas || '');
  const [ingeniero, setIngeniero] = useState(item.ingeniero_asignado || 'Dra. María Alejandra (Ingeniería Biomédica)');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showZoomPhoto, setShowZoomPhoto] = useState(false);
  const [showPrintSheet, setShowPrintSheet] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const updates = {
      estado,
      tipo_ferula: tipoFerula,
      notas,
      ingeniero_asignado: ingeniero
    };

    const { data, error } = await updateSolicitudStatus(item.id, updates);

    setIsSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRecordUpdated();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola ${item.nombre_paciente}, te saludamos de la Red de Ingeniería Biomédica en Cali respecto a tu solicitud de órtesis 3D (Folio: ${item.id}).`
  );
  const whatsappUrl = `https://wa.me/57${item.telefono.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-4xl rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden my-8">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
                  {item.id}
                </span>
                <span className="text-xs text-slate-400">
                  Recibido: {new Date(item.created_at).toLocaleDateString('es-CO')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {item.nombre_paciente}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {item.barrio} (Cali)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +57 {item.telefono}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar WhatsApp</span>
              </a>

              <button
                onClick={() => setShowPrintSheet(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Ficha Imprimible</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Column (Photo & Patient Info) / Right Column (Status & Spec Form) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              
              {/* Photo Viewer Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Fotografía de la Lesión
                  </span>
                  <button
                    onClick={() => setShowZoomPhoto(true)}
                    className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                  </button>
                </div>

                <div 
                  onClick={() => setShowZoomPhoto(true)}
                  className="w-full h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer relative"
                >
                  <img
                    src={item.imagen_url}
                    alt={`Lesión de ${item.nombre_paciente}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                    <ZoomIn className="w-5 h-5" /> Click para Ampliar Fotografía
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Descripción del Paciente
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  "{item.descripcion}"
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN (Management Form) */}
            <form onSubmit={handleSave} className="space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-400" />
                  Gestión Clínica del Caso
                </h3>
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado!
                  </span>
                )}
              </div>

              {/* Selector de Estado */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estado de la Solicitud *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'Pendiente', color: 'border-slate-600 bg-slate-800 text-slate-300' },
                    { key: 'En Evaluación', color: 'border-amber-500/50 bg-amber-950/30 text-amber-300' },
                    { key: 'En Impresión 3D', color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' },
                    { key: 'Entregado', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' }
                  ].map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setEstado(st.key)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        estado === st.key
                          ? `${st.color} shadow-md ring-2 ring-teal-500/30`
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st.key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Férula */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tipo de Órtesis Prescrita / Asignada *
                </label>
                <select
                  value={tipoFerula}
                  onChange={(e) => setTipoFerula(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {SPLINT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ingeniero Responsable */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ingeniero Biomédico Responsable
                </label>
                <input
                  type="text"
                  value={ingeniero}
                  onChange={(e) => setIngeniero(e.target.value)}
                  placeholder="Nombre del ingeniero responsable"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Notas Técnicas de Impresión 3D */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas Técnicas de Manufactura 3D
                </label>
                <textarea
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej. Material PETG antibacteriano, boquilla 0.4mm, relleno al 40% en patrón Gyroid. Medidas de circunferencia..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando Cambios...' : 'Guardar Actualización'}</span>
              </button>

            </form>

          </div>

        </div>
      </div>

      {/* Full Resolution Photo Modal */}
      {showZoomPhoto && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowZoomPhoto(false)}
              className="absolute -top-12 right-0 text-slate-300 hover:text-white p-2"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={item.imagen_url}
              alt="Ampliada"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Print Case Sheet Modal */}
      {showPrintSheet && (
        <PrintCaseSheet item={item} onClose={() => setShowPrintSheet(false)} />
      )}
    </>
  );
}
