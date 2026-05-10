import React from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const SupportTickets: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  const tickets = [
    { id: 'TK-1024', subject: 'Erro no Protocolo Zion', user: 'Neo Anderson', status: 'Aberto', priority: 'Alta', time: '2h atrás' },
    { id: 'TK-1025', subject: 'Falha na Armadura Mark 85', user: 'Tony Stark', status: 'Em Progresso', priority: 'Crítica', time: '1h atrás' },
    { id: 'TK-1026', subject: 'Dúvida sobre Microfrontends', user: 'Trinity', status: 'Aguardando', priority: 'Média', time: '5h atrás' },
    { id: 'TK-1027', subject: 'Acesso ao Núcleo J-New', user: 'Morpheus', status: 'Concluído', priority: 'Alta', time: '1d atrás' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Suporte & Central de Ajuda</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Resolução de incidentes e suporte técnico especializado.</p>
        </div>
        <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>
          <MessageCircle size={18} className="mr-2" /> Abrir Ticket
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportStat icon={AlertCircle} label="Tickets Abertos" value="24" color="red" isIron={isIron} />
        <SupportStat icon={Clock} label="Tempo Médio Resposta" value="18 min" color="blue" isIron={isIron} />
        <SupportStat icon={CheckCircle2} label="Resolvidos Hoje" value="42" color="green" isIron={isIron} />
      </div>

      <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest">Fila de Atendimento</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
              <input 
                type="text" 
                placeholder="Buscar ticket..." 
                className={`pl-9 pr-4 py-1.5 text-xs rounded-lg bg-black/40 border ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <motion.div 
              key={ticket.id}
              whileHover={{ x: 4 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isIron ? 'bg-iron-blue/10 border-iron-blue/20 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/20 text-matrix-green'}`}>
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono opacity-40">{ticket.id}</span>
                    <span className="text-sm font-bold">{ticket.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={10} className="opacity-40" />
                    <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{ticket.user}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="text-[9px] uppercase opacity-30 font-bold mb-1">Prioridade</div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                    ticket.priority === 'Crítica' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[9px] uppercase opacity-30 font-bold mb-1">Status</div>
                  <div className={`text-[10px] font-bold uppercase ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>{ticket.status}</div>
                </div>
                <div className="flex items-center justify-end gap-4 col-span-2 md:col-span-1">
                  <span className="text-[10px] opacity-40 font-mono">{ticket.time}</span>
                  <button className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

function SupportStat({ icon: Icon, label, value, color, isIron }: any) {
  const colorClasses: any = {
    red: 'text-red-500 border-red-500/20 bg-red-500/5',
    blue: isIron ? 'text-iron-blue border-iron-blue/20 bg-iron-blue/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    green: isIron ? 'text-iron-gold border-iron-gold/20 bg-iron-gold/5' : 'text-matrix-green border-matrix-green/20 bg-matrix-green/5',
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="opacity-60" />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
