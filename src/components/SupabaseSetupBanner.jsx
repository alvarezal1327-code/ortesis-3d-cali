import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Code, Terminal, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function SupabaseSetupBanner() {
  const [expanded, setExpanded] = useState(false);

  if (isSupabaseConfigured) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="rounded-2xl bg-amber-950/40 border border-amber-500/30 p-4 text-amber-200 text-xs shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>Modo de Demostración Activo (Simulación Local)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                  Offline Fallback
                </span>
              </h4>
              <p className="text-amber-300/80 text-xs mt-0.5">
                La aplicación está lista y funcionando con datos de prueba de Cali. Para conectarla a tu backend real de Supabase, configura las variables <code className="bg-amber-950 px-1.5 py-0.5 rounded font-mono text-amber-200">VITE_SUPABASE_URL</code> y <code className="bg-amber-950 px-1.5 py-0.5 rounded font-mono text-amber-200">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-xs border border-amber-500/40 flex items-center space-x-1 shrink-0 self-end sm:self-center transition-colors"
          >
            <span>{expanded ? 'Ocultar Instrucciones SQL' : 'Ver Instrucciones SQL Supabase'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-amber-500/30 space-y-3 font-mono text-[11px] text-slate-300 animate-fade-in">
            <p className="font-sans text-xs text-amber-200 font-semibold">
              Ejecuta el siguiente código en el SQL Editor de tu proyecto en Supabase:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400">
              <pre>{`-- 1. Crear tabla solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre_paciente TEXT NOT NULL,
  telefono TEXT NOT NULL,
  barrio TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url TEXT,
  estado TEXT DEFAULT 'Pendiente',
  tipo_ferula TEXT DEFAULT 'Por evaluar por Biomédico',
  notas TEXT,
  ingeniero_asignado TEXT
);

-- 2. Habilitar RLS en solicitudes (Permitir inserción pública y lectura pública/admin)
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción pública" ON solicitudes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura general" ON solicitudes
  FOR SELECT USING (true);

CREATE POLICY "Permitir actualización a autenticados" ON solicitudes
  FOR UPDATE USING (true);

-- 3. Crear Storage Bucket para imágenes de lesiones
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lesiones-fotos', 'lesiones-fotos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Acceso público lectura imágenes" ON storage.objects
  FOR SELECT USING (bucket_id = 'lesiones-fotos');

CREATE POLICY "Permitir subida pública de imágenes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'lesiones-fotos');`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
