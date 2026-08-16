import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { StatusTracker } from './components/StatusTracker';
import { LoginModal } from './components/LoginModal';
import { SupabaseSetupBanner } from './components/SupabaseSetupBanner';
import { getStoredAuthUser, logoutSupabaseAuth } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import { Cpu, Shield } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('patient');
  const [authUser, setAuthUser] = useState(null);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStatusTrackerOpen, setIsStatusTrackerOpen] = useState(false);
  const [trackerFolio, setTrackerFolio] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const user = getStoredAuthUser();
    if (user) setAuthUser(user);
  }, []);

  const handleLogout = async () => {
    await logoutSupabaseAuth();
    setAuthUser(null);
    setActiveView('patient');
  };

  const handleFormSubmitted = (data) => setConfirmationData(data);

  const handleOpenTrackerWithFolio = (folioId) => {
    setTrackerFolio(folioId);
    setIsStatusTrackerOpen(true);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-body)'}}>
        
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          authUser={authUser}
          onLogout={handleLogout}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenStatusSearch={() => { setTrackerFolio(''); setIsStatusTrackerOpen(true); }}
        />

        <SupabaseSetupBanner />

        <main className="flex-1">
          {activeView === 'patient' ? (
            <PatientForm onSubmitSuccess={handleFormSubmitted} />
          ) : authUser ? (
            <AdminDashboard authUser={authUser} />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 glass-panel rounded-3xl text-center space-y-4">
              <Shield className="w-12 h-12 mx-auto" style={{color: 'var(--accent)'}} />
              <h2 className="text-xl font-bold" style={{color: 'var(--text-heading)'}}>Acceso Restringido</h2>
              <p className="text-xs" style={{color: 'var(--text-muted)'}}>
                Debes ser un ingeniero biomédico o administrador autenticado para acceder al panel de gestión.
              </p>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider t-btn-primary"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </main>

        <ConfirmationModal
          folioData={confirmationData}
          onClose={() => setConfirmationData(null)}
          onTrackFolio={handleOpenTrackerWithFolio}
        />

        <StatusTracker
          isOpen={isStatusTrackerOpen}
          initialFolio={trackerFolio}
          onClose={() => setIsStatusTrackerOpen(false)}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => { setAuthUser(user); setActiveView('admin'); }}
        />

        {/* Footer */}
        <footer className="py-8 px-4 text-xs" style={{backgroundColor: 'var(--footer-bg)', borderTop: '1px solid var(--border-primary)', color: 'var(--text-muted)'}}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border-primary)'}}>
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold" style={{color: 'var(--text-body)'}}>Red Comunitaria de Ingeniería Biomédica Cali</span>
                <p className="text-[11px]" style={{color: 'var(--text-muted)'}}>Programa de Salud y Manufactura 3D • Santiago de Cali, Colombia</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              {[['Solicitud Pacientes', () => setActiveView('patient')],
                ['Consultar Folio',    () => setIsStatusTrackerOpen(true)],
                ['Acceso Ingenieros',  () => setIsLoginOpen(true)]
              ].map(([label, fn], i, arr) => (
                <React.Fragment key={label}>
                  <button onClick={fn} className="transition-colors" style={{color: 'var(--text-muted)'}}
                    onMouseEnter={e => e.currentTarget.style.color='var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
                  >{label}</button>
                  {i < arr.length - 1 && <span style={{color:'var(--text-muted)'}}>•</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="text-[11px]" style={{color: 'var(--text-muted)'}}>
              Diseño e Impresión 3D Gratuito para la Comunidad • 2026
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}
