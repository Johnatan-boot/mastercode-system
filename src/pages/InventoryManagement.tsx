import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Package, 
  Truck, 
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const InventoryManagement: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  const inventory = [
    { id: '1', name: 'Processador i9-14900K', stock: 45, minStock: 10, status: 'Normal', category: 'CPU' },
    { id: '2', name: 'RAM DDR5 32GB', stock: 120, minStock: 20, status: 'Normal', category: 'RAM' },
    { id: '3', name: 'SSD NVMe 2TB', stock: 8, minStock: 15, status: 'Baixo Estoque', category: 'SSD' },
    { id: '4', name: 'Notebook Stark v2', stock: 15, minStock: 5, status: 'Normal', category: 'Laptop' },
    { id: '5', name: 'Pendrive 256GB', stock: 300, minStock: 50, status: 'Normal', category: 'Acessórios' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Gestão de Estoque & Logística</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Monitoramento de ativos físicos e cadeia de suprimentos.</p>
        </div>
        <div className="flex gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed opacity-60 hover:opacity-100 transition-opacity ${isIron ? 'border-iron-blue/40 text-iron-blue' : 'border-matrix-green/40 text-matrix-green'}`}>
            <Truck size={18} /> Fornecedores
          </button>
          <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>
            <Plus size={18} className="mr-2" /> Novo Item
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InventoryStat icon={Box} label="Itens em Estoque" value="1.450" color="blue" isIron={isIron} />
        <InventoryStat icon={AlertTriangle} label="Alertas de Reposição" value="12" color="yellow" isIron={isIron} />
        <InventoryStat icon={RefreshCw} label="Giro de Estoque" value="4.2x" color="green" isIron={isIron} />
      </div>

      <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest">Inventário de Hardware</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
            <input 
              type="text" 
              placeholder="Buscar item..." 
              className={`pl-9 pr-4 py-1.5 text-xs rounded-lg bg-black/40 border ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase opacity-40 font-bold tracking-widest border-b border-white/5">
                <th className="pb-4">Item</th>
                <th className="pb-4">Categoria</th>
                <th className="pb-4">Qtd Atual</th>
                <th className="pb-4">Mínimo</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.map((item) => (
                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isIron ? 'bg-iron-blue/10 border-iron-blue/20 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/20 text-matrix-green'}`}>
                        <Package size={14} />
                      </div>
                      <span className="text-xs font-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs opacity-60">{item.category}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold">{item.stock}</span>
                      {item.stock < item.minStock ? <ArrowDown size={10} className="text-red-500" /> : <ArrowUp size={10} className="text-green-500" />}
                    </div>
                  </td>
                  <td className="py-4 text-xs opacity-60 font-mono">{item.minStock}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                      item.status === 'Normal' 
                        ? (isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green')
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className={`text-[10px] uppercase font-bold px-3 py-1 rounded-lg border border-white/5 hover:border-white/20 transition-all ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
                      Repor
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

function InventoryStat({ icon: Icon, label, value, color, isIron }: any) {
  const colorClasses: any = {
    blue: isIron ? 'text-iron-blue border-iron-blue/20 bg-iron-blue/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    yellow: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
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
