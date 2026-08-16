import React from 'react';
import { Activity, ShieldCheck, Cpu, Search, UserCheck, LogOut, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function Header({ activeView, setActiveView, authUser, onLogout, onOpenLogin, onOpenStatusSearch }) {
  return (
    <header className="sticky top-0 z-40 w-full" style={{backgroundColor:'rgba(248,246,242,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid #BAE6FD', boxShadow:'0 2px 16px rgba(56,189,248,0.08)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveView('patient')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-400 flex items-center justify-center shadow-lg shadow-sky-300/30 group-hover:scale-105 transition-transform duration-300">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white font-bold" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center">
                <Activity className="w-2.5 h-2.5 text-sky-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800">
                  BioÓrtesis Cali
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-600 border border-sky-200">
                  3D Salud
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Red Comunitaria de Ingeniería Biomédica • Cali
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Quick Status Lookup Button */}
            <button
              onClick={onOpenStatusSearch}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-sky-50 hover:text-sky-600 border border-slate-200 hover:border-sky-300 transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Consultar</span> Estado
            </button>

            {/* View Switcher for Patients vs Admin */}
            <button
              onClick={() => setActiveView('patient')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeView === 'patient'
                  ? 'bg-sky-100 text-sky-600 border border-sky-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
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
                      ? 'bg-sky-100 text-sky-700 border border-sky-300'
                      : 'bg-white text-sky-500 hover:bg-sky-50 border border-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span> Biomédico
                </button>
                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white shadow-md shadow-sky-300/30 transition-all hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Ingenieros</span>
              </button>
            )}

            {/* Supabase Status Indicator Badge */}
            <div className="hidden lg:flex items-center text-xs">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                isSupabaseConfigured 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                  : 'bg-amber-50 text-amber-600 border-amber-200'
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
