import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Zap, CheckCircle2, CreditCard, Mail, Phone, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Enrollment: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'basic'
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Inscrição de Novos Nodos</h1>
        <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Inicie sua jornada na MasterCode e conecte-se à elite tecnológica.</p>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-white/10`} />
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-500 ${
            isIron ? 'bg-iron-blue' : 'bg-matrix-green'
          }`} style={{ width: `${((step - 1) / 2) * 100}%` }} />
          
          {[1, 2, 3].map((i) => (
            <div key={i} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              step >= i 
                ? (isIron ? 'bg-iron-blue border-iron-blue text-black' : 'bg-matrix-green border-matrix-green text-black')
                : 'bg-black border-white/20 text-white/40'
            }`}>
              {step > i ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{i}</span>}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-10 ${isIron ? 'ironman-card' : 'matrix-card'}`}
        >
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                <User size={24} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Identificação do Nodo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                    placeholder="Ex: Thomas Anderson" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Email de Acesso</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                    placeholder="Ex: neo@zion.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Telefone / Canal Seguro</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                    placeholder="Ex: (11) 99999-9999" 
                  />
                </div>
              </div>
              <button onClick={nextStep} className={`w-full py-4 mt-8 rounded-xl font-bold uppercase tracking-widest transition-all ${
                isIron ? 'ironman-btn' : 'matrix-btn'
              }`}>
                Próximo Passo
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                <Zap size={24} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Seleção de Protocolo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'basic', name: 'Protocolo Básico', price: 'Grátis', desc: 'Acesso aos cursos fundamentais e comunidade.' },
                  { id: 'pro', name: 'Protocolo Elite', price: 'R$ 97/mês', desc: 'Acesso total, mentorias e projetos práticos.' },
                ].map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.plan === plan.id 
                        ? (isIron ? 'border-iron-blue bg-iron-blue/10' : 'border-matrix-green bg-matrix-green/10')
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-bold uppercase tracking-tight">{plan.name}</div>
                      <div className={`text-xs font-bold ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>{plan.price}</div>
                    </div>
                    <p className="text-[10px] opacity-60 leading-relaxed uppercase tracking-widest">{plan.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-all">Voltar</button>
                <button onClick={nextStep} className={`flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                  isIron ? 'ironman-btn' : 'matrix-btn'
                }`}>Confirmar Protocolo</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 ${
                isIron ? 'border-iron-blue text-iron-blue' : 'border-matrix-green text-matrix-green'
              }`}>
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold uppercase tracking-widest">Inscrição Processada</h3>
                <p className="text-sm opacity-60 uppercase tracking-widest">Seu acesso será liberado em instantes. Verifique seu email.</p>
              </div>
              <div className={`p-6 bg-black/40 rounded-2xl border border-white/10 text-left space-y-4`}>
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                  <span className="opacity-40">Nodo:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                  <span className="opacity-40">Protocolo:</span>
                  <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>{formData.plan.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                  <span className="opacity-40">Status:</span>
                  <span className="text-yellow-500">AGUARDANDO SINCRONIZAÇÃO</span>
                </div>
              </div>
              <button onClick={() => window.location.href = '/dashboard'} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                isIron ? 'ironman-btn' : 'matrix-btn'
              }`}>Acessar Dashboard</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
