import React from 'react';
import { Activity, ShieldCheck, Cpu, Search, UserCheck, LogOut, Database, Sun, Moon } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useTheme } from '../lib/ThemeContext';

export function Header({ activeView, setActiveView, authUser, onLogout, onOpenLogin, onOpenStatusSearch }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full" style={{
      backgroundColor: 'var(--header-bg)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-primary)',
      boxShadow: 'var(--header-shadow)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveView('patient')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                style={{background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', boxShadow: '0 4px 14px var(--accent-bg)'}}
              >
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" style={{color: isDark ? '#020617' : '#fff'}} />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{backgroundColor: 'var(--bg-card)', border: '2px solid var(--accent)'}}
              >
                <Activity className="w-2.5 h-2.5" style={{color: 'var(--accent)'}} />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight" style={{color: 'var(--text-heading)'}}>
                  BioÓrtesis Cali
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{backgroundColor: 'var(--accent-bg)', color: 'var(--accent-tag)', border: '1px solid var(--border-primary)'}}
                >
                  3D Salud
                </span>
              </div>
              <p className="text-xs hidden sm:block" style={{color: 'var(--text-muted)'}}>
                Red Comunitaria de Ingeniería Biomédica • Cali
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Quick Status Lookup Button */}
            <button
              onClick={onOpenStatusSearch}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{backgroundColor: 'var(--nav-btn-bg)', color: 'var(--nav-btn-text)', border: '1px solid var(--nav-btn-border)'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--nav-btn-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--nav-btn-bg)'}
            >
              <Search className="w-3.5 h-3.5" style={{color: 'var(--accent)'}} />
              <span className="hidden md:inline">Consultar</span> Estado
            </button>

            {/* Solicitar Órtesis */}
            <button
              onClick={() => setActiveView('patient')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all"
              style={activeView === 'patient'
                ? {backgroundColor: 'var(--nav-active-bg)', color: 'var(--nav-active-text)', border: '1px solid var(--nav-active-border)'}
                : {color: 'var(--nav-btn-text)', backgroundColor: 'transparent', border: '1px solid transparent'}
              }
            >
              Solicitar Órtesis
            </button>

            {authUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView('admin')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all"
                  style={activeView === 'admin'
                    ? {backgroundColor: 'var(--nav-active-bg)', color: 'var(--nav-active-text)', border: '1px solid var(--nav-active-border)'}
                    : {backgroundColor: 'var(--nav-btn-bg)', color: 'var(--accent)', border: '1px solid var(--nav-btn-border)'}
                  }
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span> Biomédico
                </button>
                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-1.5 rounded-lg transition-colors"
                  style={{color: 'var(--text-muted)'}}
                  onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.backgroundColor='rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.backgroundColor='transparent'; }}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] t-btn-primary"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Ingenieros</span>
              </button>
            )}

            {/* ===== TOGGLE TEMA CLARO / OSCURO ===== */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: isDark ? 'rgba(250,204,21,0.12)' : 'rgba(14,165,233,0.1)',
                border: isDark ? '1px solid rgba(250,204,21,0.3)' : '1px solid var(--border-primary)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
            >
              {isDark
                ? <Sun  className="w-4 h-4" style={{color:'#fbbf24'}} />
                : <Moon className="w-4 h-4" style={{color:'var(--accent)'}} />
              }
            </button>

            {/* Supabase Status Indicator Badge */}
            <div className="hidden lg:flex items-center text-xs">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border"
                style={isSupabaseConfigured
                  ? {backgroundColor: isDark ? 'rgba(6,78,59,0.4)' : '#f0fdf4', color: isDark ? '#6ee7b7' : '#166534', border: '1px solid ' + (isDark ? 'rgba(16,185,129,0.3)' : '#86efac')}
                  : {backgroundColor: isDark ? 'rgba(120,53,15,0.4)' : '#fffbeb', color: isDark ? '#fcd34d' : '#92400e', border: '1px solid ' + (isDark ? 'rgba(245,158,11,0.3)' : '#fde68a')}
                }
              >
                <Database className="w-3 h-3 mr-1" />
                {isSupabaseConfigured ? 'Supabase Live' : 'Modo Demo'}
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
