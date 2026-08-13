import React from 'react';
import { Activity, ShieldCheck, Cpu, Search, UserCheck, LogOut, Database, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function Header({ activeView, setActiveView, authUser, onLogout, onOpenLogin, onOpenStatusSearch }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 glass-panel shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveView('patient')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center">
                <Activity className="w-2.5 h-2.5 text-teal-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent">
                  BioÓrtesis UAO
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Cali 3D
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Universidad Autónoma de Occidente • Ingeniería Biomédica
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Quick Status Lookup Button */}
            <button
              onClick={onOpenStatusSearch}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Consultar</span> Estado
            </button>

            {/* View Switcher for Patients vs Admin */}
            <button
              onClick={() => setActiveView('patient')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'patient'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Solicitar Órtesis
            </button>

            {authUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView('admin')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeView === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/90 text-emerald-400 hover:bg-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span> Biomédico
                </button>
                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Ingenieros</span>
              </button>
            )}

            {/* Supabase Status Indicator Badge */}
            <div className="hidden lg:flex items-center text-xs">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                isSupabaseConfigured 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
              }`}>
                <Database className="w-3 h-3 mr-1" />
                {isSupabaseConfigured ? 'Supabase Live' : 'Modo Demo (Local)'}
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
