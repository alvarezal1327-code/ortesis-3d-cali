import React from 'react';
import { Cpu, Printer, X, Shield, MapPin, Phone, Calendar, User, FileText } from 'lucide-react';

export function PrintCaseSheet({ item, onClose }) {
  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs font-mono font-bold">
              FICHA TÉCNICA BIOMÉDICA 3D
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div id="printable-case-sheet" className="p-6 bg-white text-slate-900 rounded-xl font-sans">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                UNIVERSIDAD AUTÓNOMA DE OCCIDENTE
              </h1>
              <h2 className="text-sm font-bold text-teal-700">
                FACULTAD DE INGENIERÍA • DEPARTAMENTO DE BIOMÉDICA
              </h2>
              <p className="text-xs text-slate-600">
                Red de Órtesis y Férulas Personalizadas 3D — Cali, Colombia
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-mono font-bold text-slate-500 block">ORDEN DE MANUFACTURA 3D</span>
              <span className="text-lg font-mono font-extrabold text-teal-800">{item.id}</span>
              <span className="text-[10px] text-slate-500 block">
                Fecha: {new Date(item.created_at).toLocaleDateString('es-CO')}
              </span>
            </div>
          </div>

          {/* Section 1: Patient Data */}
          <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              1. INFORMACIÓN CLÍNICA DEL PACIENTE
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 block">Nombre del Paciente:</span>
                <span className="text-slate-900">{item.nombre_paciente}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Teléfono / WhatsApp:</span>
                <span className="text-slate-900">+57 {item.telefono}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Ubicación / Barrio en Cali:</span>
                <span className="text-slate-900">{item.barrio}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Estado del Caso:</span>
                <span className="font-bold text-teal-700">{item.estado}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Description & Injury Photo */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                2. DESCRIPCIÓN DE LA AFECTACIÓN
              </h3>
              <p className="text-slate-800 leading-relaxed italic mb-3">
                "{item.descripcion}"
              </p>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <span className="font-bold text-slate-700 block">Férula Prescrita:</span>
                <span className="font-bold text-teal-800 text-sm">{item.tipo_ferula}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">REGISTRO FOTOGRÁFICO DE LA LESIÓN</span>
              <div className="w-full h-40 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src={item.imagen_url}
                  alt="Lesión"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Specifications for 3D Printing */}
          <div className="mb-6 bg-teal-50 p-4 rounded-lg border border-teal-200 text-xs">
            <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1">
              3. ESPECIFICACIONES TÉCNICAS DE IMPRESIÓN 3D (LABORATORIO BIOMÉDICO)
            </h3>
            <div className="grid grid-cols-3 gap-2 text-[11px] mb-3">
              <div>
                <span className="font-bold text-slate-700 block">Material Recomendado:</span>
                <span>PETG Biomédico / PLA Grado Médico</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Infill (Relleno):</span>
                <span>35% - 50% Gyroid / Tri-Hexagonal</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Temperatura de Boquilla:</span>
                <span>235°C - 245°C</span>
              </div>
            </div>

            <div className="border-t border-teal-200 pt-2">
              <span className="font-bold text-slate-700 block">Notas & Observaciones del Ingeniero:</span>
              <p className="text-slate-800 italic mt-0.5">{item.notas || 'Sin observaciones adicionales.'}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 mb-1 h-12"></div>
              <span className="font-bold text-slate-800 block">Firma Ingeniero Biomédico Responsable</span>
              <span className="text-[10px] text-slate-500">{item.ingeniero_asignado || 'Facultad de Ingeniería UAO'}</span>
            </div>
            <div>
              <div className="border-b border-slate-400 mb-1 h-12"></div>
              <span className="font-bold text-slate-800 block">Conformidad de Entrega Paciente</span>
              <span className="text-[10px] text-slate-500">Documento de identidad: __________________</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
