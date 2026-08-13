import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, X, Shield, ArrowRight, Printer, MapPin, User, Calendar, Cpu } from 'lucide-react';
import { fetchSolicitudByFolio } from '../lib/supabase';

const STATUS_STEPS = [
  { key: 'Pendiente', title: 'Solicitud Recibida', desc: 'En cola para revisión inicial.' },
  { key: 'En Evaluación', title: 'Evaluación Biomédica', desc: 'Análisis fotogramétrico de la anatomía.' },
  { key: 'En Impresión 3D', title: 'Impresión 3D Lab Biomédico', desc: 'Fabricación en filamento PETG/PLA.' },
  { key: 'Entregado', title: 'Entregado al Paciente', desc: 'Ajuste clínico realizado con éxito.' }
];

export function StatusTracker({ initialFolio = '', isOpen, onClose }) {
  const [folioId, setFolioId] = useState(initialFolio);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!folioId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    const { data, error } = await fetchSolicitudByFolio(folioId.trim());

    if (error || !data) {
      setErrorMsg(error || 'No se encontró ninguna solicitud con ese folio.');
    } else {
      setResult(data);
    }
    setLoading(false);
  };

  // Auto-search if initialFolio provided
  React.useEffect(() => {
    if (initialFolio) {
      setFolioId(initialFolio);
      handleSearch();
    }
  }, [initialFolio]);

  if (!isOpen) return null;

  const getCurrentStepIndex = (status) => {
    switch (status) {
      case 'Pendiente': return 0;
      case 'En Evaluación': return 1;
      case 'En Impresión 3D': return 2;
      case 'Entregado': return 3;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Portal del Paciente</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Seguimiento de Órtesis 3D
          </h2>
          <p className="text-xs text-slate-400">
            Ingresa tu código de Folio (Ej. CALI-8F3A29) para verificar el estado de impresión y diseño en el laboratorio.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={folioId}
              onChange={(e) => setFolioId(e.target.value.toUpperCase())}
              placeholder="CALI-XXXXXX"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder-slate-500 uppercase tracking-widest focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
        </form>

        {/* Error */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-200 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Search Result Card */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Case Overview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Paciente • {result.barrio} (Cali)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {result.nombre_paciente}
                  </h3>
                  <span className="text-xs font-mono text-teal-400">
                    Folio: {result.id}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Estado Actual</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    result.estado === 'Entregado' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    result.estado === 'En Impresión 3D' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    result.estado === 'En Evaluación' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-slate-700/60 text-slate-300 border border-slate-600'
                  }`}>
                    <Cpu className="w-3.5 h-3.5 mr-1" />
                    {result.estado}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Férula Asignada:</span>
                  <span className="font-semibold text-white">{result.tipo_ferula}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ingeniero Responsable:</span>
                  <span className="font-semibold text-white">{result.ingeniero_asignado || 'Laboratorio Biomédico Cali'}</span>
                </div>
              </div>

              {result.notas && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl">
                  <span className="text-teal-400 font-semibold block text-[10px] uppercase">
                    Notas del Biomédico:
                  </span>
                  <p className="mt-0.5 italic text-slate-300">{result.notas}</p>
                </div>
              )}
            </div>

            {/* Timeline Steps Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                Proceso de Manufactura Biomédica
              </h4>

              <div className="relative space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getCurrentStepIndex(result.estado);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="flex items-start space-x-4 relative">
                      {/* Vertical Connecting Line */}
                      {idx !== STATUS_STEPS.length - 1 && (
                        <div className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                          idx < currentIdx ? 'bg-teal-500' : 'bg-slate-800'
                        }`}></div>
                      )}

                      {/* Step Circle Indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isDone
                          ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-semibold ${
                            isCurrent ? 'text-teal-300 font-bold' : isDone ? 'text-white' : 'text-slate-500'
                          }`}>
                            {step.title}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-medium border border-teal-500/40">
                              En progreso
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
