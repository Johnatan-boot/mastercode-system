import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Trophy, Flame, Target, BookOpen, Briefcase, Settings, Edit2, Share2, Shield, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isIron = theme === 'ironman';

  const achievements = [
    { id: 1, title: 'Primeiro Passo', desc: 'Concluiu a primeira aula.', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, title: 'Fogo Constante', desc: 'Manteve uma sequência de 5 dias.', icon: Flame, color: 'text-orange-500' },
    { id: 3, title: 'Mestre da Matrix', desc: 'Finalizou o módulo de React Avançado.', icon: Zap, color: 'text-green-500' },
    { id: 4, title: 'Protocolo Stark', desc: 'Implementou segurança de alto nível.', icon: Shield, color: 'text-blue-500' },
  ];

  const stats = [
    { label: 'XP Total', value: user?.xp || 0, icon: Zap },
    { label: 'Nível', value: user?.level || 1, icon: Trophy },
    { label: 'Streak', value: `${user?.streak || 0} Dias`, icon: Flame },
    { label: 'Cursos', value: 3, icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className={`relative p-8 rounded-3xl border overflow-hidden ${isIron ? 'ironman-card' : 'matrix-card'}`}>
        <div className="absolute top-0 right-0 p-6 flex gap-3">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-50 hover:opacity-100">
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-50 hover:opacity-100">
            <Settings size={18} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold ${isIron ? 'border-iron-blue bg-iron-blue/10 text-iron-blue' : 'border-matrix-green bg-matrix-green/10 text-matrix-green'}`}>
              {user?.name?.[0]}
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
              <Edit2 size={14} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-widest">{user?.name}</h1>
            <p className="text-sm opacity-60 uppercase tracking-widest">{user?.role} • Membro desde Março 2026</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              {['Fullstack Developer', 'React Expert', 'UI/UX Designer'].map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isIron ? 'border-iron-blue/30 text-iron-blue bg-iron-blue/5' : 'border-matrix-green/30 text-matrix-green bg-matrix-green/5'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={isIron ? 'ironman-card p-6' : 'matrix-card p-6'}>
                <div className={`p-2 rounded-lg w-fit mb-4 ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-xl font-bold">{stat.value}</h4>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
              <Trophy size={16} className={isIron ? 'text-iron-gold' : 'text-matrix-green'} />
              Conquistas Desbloqueadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                  <div className={`p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${ach.color}`}>
                    <ach.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">{ach.title}</h4>
                    <p className="text-[10px] opacity-40 uppercase">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Activity */}
        <div className="space-y-6">
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Briefcase size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
              Projetos Recentes
            </h3>
            <div className="space-y-4">
              {[
                { title: 'MasterCode Platform', status: 'Em andamento' },
                { title: 'Stark Security Protocol', status: 'Concluído' },
                { title: 'Matrix Rain Engine', status: 'Concluído' },
              ].map((proj, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{proj.title}</h4>
                  <p className={`text-[9px] uppercase font-bold ${proj.status === 'Concluído' ? 'text-green-500' : 'text-yellow-500'}`}>{proj.status}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              Ver Todos os Projetos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
