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

    if (error) {
      setErrorMsg(error);
      setLoading(false);
    } else {
      setLoading(false);
      onLoginSuccess(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(240,249,255,0.85)', backdropFilter:'blur(12px)'}}>
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 overflow-hidden" style={{backgroundColor:'white', border:'1px solid #BAE6FD', boxShadow:'0 24px 60px rgba(56,189,248,0.18)'}}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{color:'#94a3b8'}}
          onMouseEnter={e => { e.target.style.color='#1e293b'; e.target.style.backgroundColor='#F1F5F9'; }}
          onMouseLeave={e => { e.target.style.color='#94a3b8'; e.target.style.backgroundColor='transparent'; }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg" style={{background:'linear-gradient(135deg,#38BDF8,#0EA5E9)', boxShadow:'0 8px 24px rgba(56,189,248,0.3)'}}>
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold" style={{color:'#0c4a6e'}}>
            Acceso Ingenieros Biomédicos
          </h2>
          <p className="text-xs mt-1" style={{color:'#64748b'}}>
            Plataforma de evaluación y diseño de órtesis 3D.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl text-xs flex items-start space-x-2.5 mb-4" style={{backgroundColor:'#FFF1F2', border:'1px solid #FECACA', color:'#991b1b'}}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{color:'#ef4444'}} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#475569'}}>
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4" style={{color:'#94a3b8'}} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alvarezal1327@gmail.com"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none transition-all"
                style={{backgroundColor:'#F8FAFC', border:'1px solid #BAE6FD', color:'#1e293b'}}
                onFocus={e => e.target.style.boxShadow='0 0 0 3px rgba(56,189,248,0.2)'}
                onBlur={e => e.target.style.boxShadow='none'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#475569'}}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4" style={{color:'#94a3b8'}} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none transition-all"
                style={{backgroundColor:'#F8FAFC', border:'1px solid #BAE6FD', color:'#1e293b'}}
                onFocus={e => e.target.style.boxShadow='0 0 0 3px rgba(56,189,248,0.2)'}
                onBlur={e => e.target.style.boxShadow='none'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#38BDF8,#0EA5E9)', color:'white', boxShadow:'0 4px 16px rgba(56,189,248,0.35)'}}
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}
