import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical, 
  Search, 
  Filter, 
  Download,
  ShieldAlert,
  Zap,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface AdminStats {
  monthlyRevenue: any[];
  userGrowth: any[];
  rankings: any[];
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription: string;
  status: string;
  xp: number;
  level: number;
}

export const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const isIron = theme === 'ironman';
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users')
        ]);
        const statsData = await statsRes.json();
        const usersData = await usersRes.json();
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isIron ? 'border-iron-blue' : 'border-matrix-green'}`} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert size={24} className={isIron ? 'text-iron-red' : 'text-matrix-green'} />
            <h1 className="text-3xl font-bold uppercase tracking-widest">Superadmin Control</h1>
          </div>
          <p className={`text-sm ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
            Monitoramento global de protocolos, assinaturas e evolução de construtores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> Exportar Relatório
          </button>
          <div className={`px-4 py-2 rounded-xl border ${isIron ? 'border-iron-blue/20 bg-iron-blue/5' : 'border-matrix-green/20 bg-matrix-green/5'}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-1">Status do Sistema</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase">Operacional</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Receita Total', value: '$45,890', change: '+12.5%', icon: DollarSign, color: 'text-green-500' },
          { label: 'Usuários Ativos', value: users.length, change: '+5.2%', icon: Users, color: 'text-blue-500' },
          { label: 'Taxa de Conversão', value: '18.4%', change: '-2.1%', icon: TrendingUp, color: 'text-yellow-500' },
          { label: 'XP Médio/Aluno', value: '4.2k', change: '+8.9%', icon: Award, color: 'text-purple-500' }
        ].map((kpi, i) => (
          <div key={i} className={isIron ? 'ironman-card p-6' : 'matrix-card p-6'}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-2xl font-bold">{kpi.value}</h4>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={isIron ? 'ironman-card p-8' : 'matrix-card p-8'}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
            <TrendingUp size={16} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
            Crescimento de Receita (Mensal)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isIron ? '#00D4FF' : '#00FF41'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isIron ? '#00D4FF' : '#00FF41'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: isIron ? '#00D4FF' : '#00FF41' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isIron ? '#00D4FF' : '#00FF41'} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={isIron ? 'ironman-card p-8' : 'matrix-card p-8'}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
            <Users size={16} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
            Ranking de Construtores (Top XP)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.rankings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 'bold' }} 
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '12px' }}
                />
                <Bar dataKey="xp" radius={[0, 4, 4, 0]}>
                  {stats?.rankings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? (isIron ? '#ea1f26' : '#00FF41') : '#ffffff20'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className={isIron ? 'ironman-card p-8' : 'matrix-card p-8'}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
            Gerenciamento de Assinaturas & Alunos
          </h3>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs ${isIron ? 'ironman-input' : 'matrix-input'}`}
              />
            </div>
            <button className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest opacity-40 font-bold">
                <th className="pb-4 px-4">Construtor</th>
                <th className="pb-4 px-4">Plano</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Nível/XP</th>
                <th className="pb-4 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{u.name}</p>
                        <p className="text-[10px] opacity-40">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] px-2 py-1 rounded-lg border uppercase font-bold ${
                      u.subscription === 'lifetime' ? 'border-purple-500/50 text-purple-500 bg-purple-500/5' :
                      u.subscription === 'premium' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' :
                      'border-white/20 text-white/40'
                    }`}>
                      {u.subscription}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {u.status === 'active' ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <Clock size={14} className="text-yellow-500" />
                      )}
                      <span className="text-[10px] uppercase font-bold">{u.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Lvl {u.level}</p>
                      <p className="text-[10px] opacity-40">{u.xp} XP</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
