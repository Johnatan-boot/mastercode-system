import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, CreditCard, CheckCircle, LogOut, Layout, BookOpen, Settings, Zap, Shield, Volume2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then(res => res.json())
      .then(data => setKpis(data));
  }, []);

  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'Mai', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const isIron = theme === 'ironman';
  const accentColor = isIron ? '#00D4FF' : '#00FF41';
  const borderColor = isIron ? 'border-iron-blue/20' : 'border-matrix-green/20';

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">Visão do Sistema</h1>
          <p className={`${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'} text-sm`}>
            Bem-vindo, {user?.name}. {isIron ? 'Sistemas online.' : 'A Matrix está estável.'}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-tighter opacity-50">Assinatura</p>
            <p className={`text-xs font-bold ${isIron ? 'text-iron-gold' : 'text-matrix-green'}`}>ACESSO PREMIUM</p>
          </div>
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isIron ? 'border-iron-blue bg-iron-blue/10' : 'border-matrix-green bg-matrix-green/10'}`}>
            {isIron ? <Shield size={20} className="text-iron-blue" /> : <span className="text-sm font-bold">{user?.name?.[0]}</span>}
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <KPICard isIron={isIron} title="Eficiência" value={`${kpis?.courseEfficiency || 0}%`} icon={<TrendingUp size={20} />} trend="+5.2%" />
        <KPICard isIron={isIron} title="Nodos Ativos" value={kpis?.activeUsers || 0} icon={<Users size={20} />} trend="+124" />
        <KPICard isIron={isIron} title="Receita" value={`R$${kpis?.revenue || 0}`} icon={<CreditCard size={20} />} trend="+R$1.2k" />
        <KPICard isIron={isIron} title="Conclusão" value={`${kpis?.completionRate || 0}%`} icon={<CheckCircle size={20} />} trend="+2.1%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className={isIron ? 'ironman-card' : 'matrix-card'}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Crescimento da Rede</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={isIron ? '#1A1A1A' : '#003B00'} />
                <XAxis dataKey="name" stroke={accentColor} fontSize={10} />
                <YAxis stroke={accentColor} fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0208', border: `1px solid ${accentColor}`, color: accentColor }}
                  itemStyle={{ color: accentColor }}
                />
                <Line type="monotone" dataKey="value" stroke={accentColor} strokeWidth={2} dot={{ fill: accentColor }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={isIron ? 'ironman-card' : 'matrix-card'}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Alocação de Recursos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={isIron ? '#1A1A1A' : '#003B00'} />
                <XAxis dataKey="name" stroke={accentColor} fontSize={10} />
                <YAxis stroke={accentColor} fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0208', border: `1px solid ${accentColor}`, color: accentColor }}
                  itemStyle={{ color: accentColor }}
                />
                <Bar dataKey="value" fill={accentColor} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Sound Test Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
            <Volume2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Teste de Áudio</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Verifique se o som do sistema está funcionando.</p>
          </div>
        </div>
        <div className={isIron ? 'ironman-card' : 'matrix-card'}>
          <button 
            onClick={() => {
              const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
              audio.play().catch(e => console.error("Test sound blocked:", e));
            }}
            className={`w-full py-4 text-xs font-bold uppercase tracking-widest border rounded-xl transition-all ${
              isIron ? 'border-iron-blue/20 hover:bg-iron-blue/10 text-iron-blue shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'border-matrix-green/20 hover:bg-matrix-green/10 text-matrix-green shadow-[0_0_15px_rgba(0,255,65,0.1)]'
            }`}
          >
            Tocar Som de Teste (Clique aqui)
          </button>
        </div>
      </section>

      {/* Zapier Integrations Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIron ? 'bg-iron-gold/10 text-iron-gold' : 'bg-matrix-green/10 text-matrix-green'}`}>
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Automações Zapier</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Sincronize seus fluxos de trabalho com o Núcleo J-New.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Sincronizar Alunos", desc: "Envia novos inscritos para o Google Sheets.", status: "Ativo" },
            { title: "Notificações Slack", desc: "Alertas de novas vendas e mentorias.", status: "Ativo" },
            { title: "E-mail Marketing", desc: "Integração com Mailchimp para novos leads.", status: "Pausado" }
          ].map((zap, i) => (
            <div key={i} className={isIron ? 'ironman-card' : 'matrix-card'}>
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${zap.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {zap.status}
                </div>
                <Settings size={14} className="opacity-30 cursor-pointer hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-bold uppercase text-sm mb-1">{zap.title}</h4>
              <p className="text-xs opacity-50 mb-4">{zap.desc}</p>
              <button className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest border rounded-lg transition-all ${
                isIron ? 'border-iron-blue/20 hover:bg-iron-blue/10 text-iron-blue' : 'border-matrix-green/20 hover:bg-matrix-green/10 text-matrix-green'
              }`}>
                Configurar Fluxo
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function KPICard({ title, value, icon, trend, isIron }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={isIron ? 'ironman-card' : 'matrix-card'}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>{trend}</span>
      </div>
      <p className={`text-xs uppercase tracking-widest mb-1 ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </motion.div>
  );
}
