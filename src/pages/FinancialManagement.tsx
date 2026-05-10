import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

export const FinancialManagement: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Núcleo Financeiro</h1>
        <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Controle de ativos, fluxos de caixa e projeções de crescimento.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceStatCard 
          label="Receita Total" 
          value="R$ 1.248.500" 
          trend="+15.4%" 
          isPositive={true} 
          icon={TrendingUp} 
          isIron={isIron} 
        />
        <FinanceStatCard 
          label="Despesas" 
          value="R$ 432.100" 
          trend="-2.1%" 
          isPositive={true} 
          icon={TrendingDown} 
          isIron={isIron} 
        />
        <FinanceStatCard 
          label="Lucro Líquido" 
          value="R$ 816.400" 
          trend="+18.2%" 
          isPositive={true} 
          icon={DollarSign} 
          isIron={isIron} 
        />
        <FinanceStatCard 
          label="Assinaturas Ativas" 
          value="12.450" 
          trend="+8.5%" 
          isPositive={true} 
          icon={CreditCard} 
          isIron={isIron} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest">Fluxo de Receita vs Despesas</h3>
            <div className="flex gap-2">
              <button className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border ${isIron ? 'border-iron-blue/20 text-iron-blue' : 'border-matrix-green/20 text-matrix-green'}`}>Mensal</button>
              <button className="px-3 py-1 text-[10px] font-bold uppercase rounded-lg border border-white/5 opacity-40">Anual</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isIron ? '#00D4FF' : '#00FF41'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isIron ? '#00D4FF' : '#00FF41'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: `1px solid ${isIron ? '#00D4FF30' : '#00FF4130'}`,
                    borderRadius: '12px',
                    fontSize: '10px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke={isIron ? '#00D4FF' : '#00FF41'} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ea1f26" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Transações Recentes</h3>
          <div className="space-y-4">
            {[
              { id: 1, desc: 'Assinatura Plano Master', amount: '+ R$ 1.200', type: 'in', date: 'Hoje' },
              { id: 2, desc: 'Servidor AWS Cloud', amount: '- R$ 4.500', type: 'out', date: 'Ontem' },
              { id: 3, desc: 'Venda Processador Intel', amount: '+ R$ 2.800', type: 'in', date: '27 Mar' },
              { id: 4, desc: 'Marketing Digital', amount: '- R$ 1.500', type: 'out', date: '26 Mar' },
              { id: 5, desc: 'Assinatura Plano Stark', amount: '+ R$ 800', type: 'in', date: '25 Mar' },
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-tighter">{tx.desc}</div>
                    <div className="text-[8px] opacity-40 uppercase">{tx.date}</div>
                  </div>
                </div>
                <div className={`text-xs font-mono font-bold ${tx.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-6 py-3 text-[10px] font-bold uppercase tracking-widest border border-dashed rounded-xl opacity-40 hover:opacity-100 transition-opacity ${isIron ? 'border-iron-blue/40 text-iron-blue' : 'border-matrix-green/40 text-matrix-green'}`}>
            Exportar Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
};

function FinanceStatCard({ label, value, trend, isPositive, icon: Icon, isIron }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
          <Icon size={18} />
        </div>
        <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
      </div>
      <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
