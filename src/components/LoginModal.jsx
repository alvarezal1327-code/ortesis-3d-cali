import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, X } from 'lucide-react';
import { loginSupabaseAuth } from '../lib/supabase';

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { user, error } = await loginSupabaseAuth(email, password);
    if (error) { setErrorMsg(error); setLoading(false); }
    else { setLoading(false); onLoginSuccess(user); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(12px)'}}>
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 overflow-hidden"
        style={{backgroundColor: 'var(--modal-bg)', border: '1px solid var(--border-primary)', boxShadow: '0 24px 60px rgba(0,0,0,0.15)'}}>
        
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{color: 'var(--text-muted)'}}
          onMouseEnter={e => { e.currentTarget.style.color='var(--text-heading)'; e.currentTarget.style.backgroundColor='var(--nav-btn-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.backgroundColor='transparent'; }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 t-btn-primary shadow-lg">
            <ShieldCheck className="w-8 h-8" style={{color: 'var(--btn-primary-text)'}} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold" style={{color: 'var(--text-heading)'}}>
            Acceso Ingenieros Biomédicos
          </h2>
          <p className="text-xs mt-1" style={{color: 'var(--text-muted)'}}>
            Plataforma de evaluación y diseño de órtesis 3D.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl text-xs flex items-start space-x-2.5 mb-4"
            style={{backgroundColor: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)'}}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{color: 'var(--error-icon)'}} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="t-label">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4" style={{color: 'var(--text-placeholder)'}} />
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="t-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="t-label">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4" style={{color: 'var(--text-placeholder)'}} />
              <input type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="t-input pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold t-btn-primary">
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}
