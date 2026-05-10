import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  UserPlus,
  Search
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const HRManagement: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchIn, setIsPunchIn] = useState(false);
  const [punchLogs, setPunchLogs] = useState([
    { id: 1, type: 'Entrada', time: '08:00:12', date: '29/03/2026', status: 'Normal' },
    { id: 2, type: 'Saída Almoço', time: '12:05:45', date: '29/03/2026', status: 'Normal' },
    { id: 3, type: 'Retorno Almoço', time: '13:02:10', date: '29/03/2026', status: 'Normal' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    const now = new Date();
    const newLog = {
      id: punchLogs.length + 1,
      type: isPunchIn ? 'Saída' : 'Entrada',
      time: now.toLocaleTimeString('pt-BR'),
      date: now.toLocaleDateString('pt-BR'),
      status: 'Normal'
    };
    setPunchLogs([newLog, ...punchLogs]);
    setIsPunchIn(!isPunchIn);
  };

  const employees = [
    { id: 1, name: 'Tony Stark', role: 'CEO / Lead Architect', status: 'Ativo', performance: 98 },
    { id: 2, name: 'Neo Anderson', role: 'Senior Developer', status: 'Ativo', performance: 95 },
    { id: 3, name: 'Trinity', role: 'Security Specialist', status: 'Em Férias', performance: 92 },
    { id: 4, name: 'Morpheus', role: 'Operations Director', status: 'Ativo', performance: 89 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Gestão de R.H & Talentos</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Núcleo de gerenciamento de capital humano e performance.</p>
        </div>
        <div className={`p-4 rounded-2xl border flex items-center gap-6 ${isIron ? 'ironman-card border-iron-blue/20' : 'matrix-card border-matrix-green/20'}`}>
          <div className="text-center">
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest mb-1">Horário Local</div>
            <div className={`text-2xl font-mono font-bold ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
          </div>
          <button 
            onClick={handlePunch}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
              isPunchIn 
                ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30' 
                : (isIron ? 'ironman-btn' : 'matrix-btn')
            }`}
          >
            {isPunchIn ? <Pause size={18} /> : <Play size={18} />}
            {isPunchIn ? 'Registrar Saída' : 'Registrar Ponto'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Users} label="Total Colaboradores" value="156" trend="+12%" isIron={isIron} />
            <StatCard icon={TrendingUp} label="Produtividade Média" value="94.2%" trend="+2.4%" isIron={isIron} />
            <StatCard icon={DollarSign} label="Folha Mensal" value="R$ 842k" trend="+5%" isIron={isIron} />
          </div>

          {/* Employee List */}
          <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest">Equipe de Elite</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className={`pl-9 pr-4 py-1.5 text-xs rounded-lg bg-black/40 border ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}
                  />
                </div>
                <button className={`p-1.5 rounded-lg border ${isIron ? 'border-iron-blue/20 text-iron-blue' : 'border-matrix-green/20 text-matrix-green'}`}>
                  <UserPlus size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase opacity-40 font-bold tracking-widest border-b border-white/5">
                    <th className="pb-4">Colaborador</th>
                    <th className="pb-4">Cargo</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Performance</th>
                    <th className="pb-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isIron ? 'bg-iron-blue/20 text-iron-blue' : 'bg-matrix-green/20 text-matrix-green'}`}>
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-bold">{emp.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs opacity-60">{emp.role}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                          emp.status === 'Ativo' 
                            ? (isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green')
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                            <div className={`h-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} style={{ width: `${emp.performance}%` }} />
                          </div>
                          <span className="text-[10px] font-bold">{emp.performance}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <button className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">Perfil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Ponto Eletrônico Logs */}
        <div className="space-y-8">
          <div className={`p-6 rounded-3xl border h-full ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
            <div className="flex items-center gap-2 mb-6">
              <Clock className={isIron ? 'text-iron-blue' : 'text-matrix-green'} size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Logs de Ponto</h3>
            </div>

            <div className="space-y-4">
              {punchLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${log.type.includes('Entrada') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {log.type.includes('Entrada') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-tighter">{log.type}</div>
                      <div className="text-[8px] opacity-40 uppercase">{log.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold">{log.time}</div>
                    <div className="text-[8px] text-green-500 uppercase font-bold tracking-widest">{log.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className={`w-full mt-6 py-3 text-[10px] font-bold uppercase tracking-widest border border-dashed rounded-xl opacity-40 hover:opacity-100 transition-opacity ${isIron ? 'border-iron-blue/40 text-iron-blue' : 'border-matrix-green/40 text-matrix-green'}`}>
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, trend, isIron }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-bold text-green-500">{trend}</span>
      </div>
      <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
