
import React, { useState } from 'react';
import { Wallet, ShieldCheck, AlertCircle } from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.toLowerCase() === 'andressa' && password === '123') {
      onLogin();
    } else {
      setError('Acesso negado. Utilize Andressa / 123.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-32 h-32" />
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-indigo-600 p-4 rounded-2xl mb-4 shadow-2xl shadow-indigo-600/30">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">
              {APP_NAME} <span className="text-indigo-500">{APP_SUBTITLE}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Controle Inteligente de Finanças</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Usuário</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Andressa"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
            >
              Entrar na Plataforma
            </button>
          </form>

          <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Ambiente Seguro • Gemini API Cloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
