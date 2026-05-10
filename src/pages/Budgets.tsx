import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Calculator, Clock, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface BudgetLineItem {
  id: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
}

export const Budgets: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [items, setItems] = useState<BudgetLineItem[]>([
    { id: '1', description: 'Manutenção de Servidor', quantity: 1, estimatedPrice: 450.00 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, estimatedPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetLineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const total = items.reduce((acc, item) => acc + (item.quantity * item.estimatedPrice), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Solicitação de Orçamento</h1>
        <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Calcule o custo da sua infraestrutura digital personalizada.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Budget Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className={`p-8 ${isIron ? 'ironman-card' : 'matrix-card'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Nome do Cliente</label>
                <input type="text" required className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} placeholder="Ex: Thomas Anderson" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Email de Contato</label>
                <input type="email" required className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} placeholder="Ex: neo@zion.com" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calculator size={18} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Itens do Orçamento
                </h3>
                <button 
                  type="button" 
                  onClick={addItem}
                  className={`p-2 rounded-lg border transition-all ${
                    isIron ? 'border-iron-blue/30 text-iron-blue hover:bg-iron-blue/10' : 'border-matrix-green/30 text-matrix-green hover:bg-matrix-green/10'
                  }`}
                >
                  <Plus size={18} />
                </button>
              </div>

              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-end p-4 bg-white/5 rounded-xl border border-white/10 group">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Descrição</label>
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                      placeholder="Ex: Upgrade de Servidor"
                    />
                  </div>
                  <div className="w-full md:w-24 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Qtd</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                      className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                    />
                  </div>
                  <div className="w-full md:w-40 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-30">Preço Est. (R$)</label>
                    <input 
                      type="number" 
                      value={item.estimatedPrice}
                      onChange={(e) => updateItem(item.id, 'estimatedPrice', parseFloat(e.target.value))}
                      className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
              <div className="text-center md:text-left">
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Total Estimado</div>
                <div className="text-3xl font-bold tracking-tighter">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isIron ? 'ironman-btn' : 'matrix-btn'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Solicitação
                  </>
                )}
              </button>
            </div>
          </form>

          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl flex items-center gap-4 border ${
                isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green'
              }`}
            >
              <CheckCircle2 size={24} />
              <div>
                <div className="font-bold uppercase tracking-widest text-sm">Transmissão Concluída</div>
                <div className="text-xs opacity-70">Seu orçamento foi enviado para o conselho. Aguarde o retorno.</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isIron ? 'bg-iron-blue/5 border-iron-blue/10' : 'bg-matrix-green/5 border-matrix-green/10'}`}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Prazos Médios
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Análise de Hardware', time: '24h' },
                { label: 'Projetos de Software', time: '48h' },
                { label: 'Infraestrutura de Rede', time: '72h' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{item.label}</span>
                  <span className={`text-xs font-bold ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-8 rounded-3xl border ${isIron ? 'bg-iron-blue/5 border-iron-blue/10' : 'bg-matrix-green/5 border-matrix-green/10'}`}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-500" /> Importante
            </h3>
            <ul className="space-y-3 text-[10px] uppercase tracking-widest opacity-60 leading-relaxed">
              <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Valores são estimativas baseadas no mercado atual.</li>
              <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Orçamentos complexos podem exigir visita técnica.</li>
              <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Validade da proposta: 7 dias terrestres.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
