import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { Lock, Mail, Cpu, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = isLogin 
        ? await login(email, password)
        : await register(name, email, password);
      
      if (res.user) {
        navigate('/dashboard');
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("Erro na conexão com o servidor.");
    }
  };

  const isIron = theme === 'ironman';

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md ${isIron ? 'ironman-card' : 'matrix-card'}`}
      >
        <div className="text-center mb-8">
          {isIron ? (
            <ShieldCheck className="mx-auto text-iron-blue mb-4 animate-pulse" size={48} />
          ) : (
            <Cpu className="mx-auto text-matrix-green mb-4" size={48} />
          )}
          <h1 className={`text-3xl font-bold tracking-[0.2em] uppercase ${isIron ? 'text-iron-gold' : 'text-matrix-green'}`}>
            MasterCode
          </h1>
          <p className={`${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'} text-sm mt-2`}>
            {isLogin ? (isIron ? 'Sincronizando interface Stark...' : 'Entrando no fluxo digital...') : 'Inicializando novo nodo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center border ${
                isIron ? 'bg-iron-red/10 border-iron-red text-iron-red' : 'bg-red-500/10 border-red-500 text-red-500'
              }`}
            >
              {error}
            </motion.div>
          )}

          {!isLogin && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className={`text-xs uppercase tracking-widest flex items-center gap-2 ${isIron ? 'text-iron-blue' : ''}`}>
                <Cpu size={14} /> Designação
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                placeholder="Neo / Tony Stark"
                required
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <label className={`text-xs uppercase tracking-widest flex items-center gap-2 ${isIron ? 'text-iron-blue' : ''}`}>
              <Mail size={14} /> Identidade
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
              placeholder="neo@mastercode.io"
              required
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs uppercase tracking-widest flex items-center gap-2 ${isIron ? 'text-iron-blue' : ''}`}>
              <Lock size={14} /> Chave de Acesso
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={`w-full py-3 text-sm ${isIron ? 'ironman-btn' : 'matrix-btn'}`}>
            {isLogin ? 'Iniciar Sessão' : 'Criar Identidade'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={`text-xs uppercase tracking-widest transition-colors ${isIron ? 'text-iron-blue/60 hover:text-iron-blue' : 'text-matrix-green/60 hover:text-matrix-green'}`}
          >
            {isLogin ? "Não tem uma identidade? Registre-se" : "Já possui uma identidade? Login"}
          </button>
        </div>

        <div className={`mt-8 pt-6 border-t text-center ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}>
          <p className={`text-xs ${isIron ? 'text-iron-blue/40 italic' : 'text-matrix-green/40'}`}>
            {isIron ? '"Às vezes você tem que correr antes de aprender a andar."' : '"Há uma diferença entre conhecer o caminho e percorrer o caminho."'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
