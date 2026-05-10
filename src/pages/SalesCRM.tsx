import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  UserPlus, 
  MessageSquare, 
  Phone, 
  Mail, 
  MoreHorizontal,
  Star,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const SalesCRM: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  const leads = [
    { id: 1, name: 'Bruce Wayne', company: 'Wayne Enterprises', value: 'R$ 50.000', status: 'Negociação', priority: 'Alta' },
    { id: 2, name: 'Clark Kent', company: 'Daily Planet', value: 'R$ 12.000', status: 'Proposta', priority: 'Média' },
    { id: 3, name: 'Diana Prince', company: 'Themyscira Tech', value: 'R$ 85.000', status: 'Lead Qualificado', priority: 'Alta' },
    { id: 4, name: 'Barry Allen', company: 'Central City Labs', value: 'R$ 5.000', status: 'Contato Inicial', priority: 'Baixa' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Vendas & CRM</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Gestão de leads, pipeline de vendas e conversão de clientes.</p>
        </div>
        <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>
          <UserPlus size={18} className="mr-2" /> Novo Lead
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <PipelineStage label="Lead Qualificado" count={12} value="R$ 145k" color="blue" isIron={isIron} />
        <PipelineStage label="Em Contato" count={8} value="R$ 92k" color="yellow" isIron={isIron} />
        <PipelineStage label="Proposta Enviada" count={5} value="R$ 210k" color="purple" isIron={isIron} />
        <PipelineStage label="Fechamento" count={3} value="R$ 450k" color="green" isIron={isIron} />
      </div>

      <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Pipeline de Oportunidades</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold opacity-60">
              <Filter size={12} /> Filtrar por Prioridade
            </div>
          </div>
          <button className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">Ver Todos</button>
        </div>

        <div className="space-y-4">
          {leads.map((lead) => (
            <motion.div 
              key={lead.id}
              whileHover={{ x: 4 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isIron ? 'bg-iron-blue/10 border-iron-blue/20 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/20 text-matrix-green'}`}>
                  <Target size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{lead.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      lead.priority === 'Alta' ? 'bg-red-500/20 text-red-500' : lead.priority === 'Média' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {lead.priority}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-40 uppercase font-bold tracking-tighter">{lead.company}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="text-[9px] uppercase opacity-30 font-bold mb-1">Valor Estimado</div>
                  <div className="text-xs font-mono font-bold">{lead.value}</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[9px] uppercase opacity-30 font-bold mb-1">Status</div>
                  <div className={`text-[10px] font-bold uppercase ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>{lead.status}</div>
                </div>
                <div className="flex items-center justify-end gap-2 col-span-2 md:col-span-1">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"><Phone size={14} /></button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"><Mail size={14} /></button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"><MessageSquare size={14} /></button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
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

function PipelineStage({ label, count, value, color, isIron }: any) {
  const colorClasses: any = {
    blue: isIron ? 'text-iron-blue border-iron-blue/20 bg-iron-blue/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    yellow: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    purple: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
    green: isIron ? 'text-iron-gold border-iron-gold/20 bg-iron-gold/5' : 'text-matrix-green border-matrix-green/20 bg-matrix-green/5',
  };

  return (
    <div className={`p-5 rounded-2xl border transition-transform hover:scale-105 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
        <span className="text-xs font-bold">{count}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
