import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { StatusTracker } from './components/StatusTracker';
import { LoginModal } from './components/LoginModal';
import { SupabaseSetupBanner } from './components/SupabaseSetupBanner';
import { getStoredAuthUser, logoutSupabaseAuth } from './lib/supabase';
import { Cpu, Heart, Shield, Activity, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('patient'); // 'patient' | 'admin'
  const [authUser, setAuthUser] = useState(null);
  
  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStatusTrackerOpen, setIsStatusTrackerOpen] = useState(false);
  const [trackerFolio, setTrackerFolio] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    // Check logged user on load
    const user = getStoredAuthUser();
    if (user) {
      setAuthUser(user);
    }
  }, []);

  const handleLogout = async () => {
    await logoutSupabaseAuth();
    setAuthUser(null);
    setActiveView('patient');
  };

  const handleFormSubmitted = (data) => {
    setConfirmationData(data);
  };

  const handleOpenTrackerWithFolio = (folioId) => {
    setTrackerFolio(folioId);
    setIsStatusTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        authUser={authUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenStatusSearch={() => {
          setTrackerFolio('');
          setIsStatusTrackerOpen(true);
        }}
      />

      {/* Supabase Connection Banner */}
      <SupabaseSetupBanner />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'patient' ? (
          <PatientForm onSubmitSuccess={handleFormSubmitted} />
        ) : authUser ? (
          <AdminDashboard authUser={authUser} />
        ) : (
          <div className="max-w-md mx-auto my-16 p-8 glass-panel rounded-3xl text-center space-y-4">
            <Shield className="w-12 h-12 text-teal-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
            <p className="text-xs text-slate-400">
              Debes ser un ingeniero biomédico o administrador autenticado para acceder al panel de gestión.
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        folioData={confirmationData}
        onClose={() => setConfirmationData(null)}
        onTrackFolio={handleOpenTrackerWithFolio}
      />

      {/* Public Status Search Modal */}
      <StatusTracker
        isOpen={isStatusTrackerOpen}
        initialFolio={trackerFolio}
        onClose={() => setIsStatusTrackerOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setAuthUser(user);
          setActiveView('admin');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200">Red Comunitaria de Ingeniería Biomédica Cali</span>
              <p className="text-[11px] text-slate-400">Programa de Salud y Manufactura 3D • Santiago de Cali, Colombia</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setActiveView('patient')}
              className="hover:text-teal-300 transition-colors"
            >
              Solicitud Pacientes
            </button>
            <span>•</span>
            <button
              onClick={() => setIsStatusTrackerOpen(true)}
              className="hover:text-teal-300 transition-colors"
            >
              Consultar Folio
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hover:text-teal-300 transition-colors"
            >
              Acceso Docentes / Biomédicos
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Diseño e Impresión 3D Gratuito para la Comunidad • 2026
          </div>

        </div>
      </footer>

    </div>
  );
}
