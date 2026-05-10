import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  Layout, 
  List, 
  MoreVertical, 
  Plus, 
  Search, 
  User,
  Calendar,
  Flag
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ProjectManagement: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Refatorar Núcleo J-New', status: 'Em Progresso', priority: 'Alta', assignee: 'Tony Stark' },
    { id: '2', title: 'Implementar Protocolo Zion', status: 'A Fazer', priority: 'Média', assignee: 'Neo Anderson' },
    { id: '3', title: 'Otimizar Banco de Dados', status: 'Concluído', priority: 'Baixa', assignee: 'Trinity' },
    { id: '4', title: 'Segurança de Rede v4', status: 'Em Progresso', priority: 'Crítica', assignee: 'Morpheus' },
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Gestão de Projetos & Sprints</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Planejamento ágil e execução de protocolos tecnológicos.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold ${isIron ? 'bg-iron-blue/20 text-iron-blue' : 'bg-matrix-green/20 text-matrix-green'}`}>
                <User size={14} />
              </div>
            ))}
          </div>
          <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>
            <Plus size={18} className="mr-2" /> Nova Sprint
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban Columns */}
        <KanbanColumn title="A Fazer" tasks={tasks.filter(t => t.status === 'A Fazer')} isIron={isIron} />
        <KanbanColumn title="Em Progresso" tasks={tasks.filter(t => t.status === 'Em Progresso')} isIron={isIron} />
        <KanbanColumn title="Concluído" tasks={tasks.filter(t => t.status === 'Concluído')} isIron={isIron} />
      </div>

      {/* Task List Table */}
      <div className={`p-6 rounded-3xl border ${isIron ? 'ironman-card border-iron-blue/10' : 'matrix-card border-matrix-green/10'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest">Backlog de Tarefas</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
              <input 
                type="text" 
                placeholder="Filtrar tarefas..." 
                className={`pl-9 pr-4 py-1.5 text-xs rounded-lg bg-black/40 border ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase opacity-40 font-bold tracking-widest border-b border-white/5">
                <th className="pb-4">Tarefa</th>
                <th className="pb-4">Responsável</th>
                <th className="pb-4">Prioridade</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Prazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map((task) => (
                <tr key={task.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={14} className="opacity-30" />
                      <span className="text-xs font-bold">{task.title}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[10px] opacity-60">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      task.priority === 'Crítica' ? 'bg-red-500/20 text-red-500' : task.priority === 'Alta' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 text-[10px] opacity-60 uppercase font-bold tracking-tighter">{task.status}</td>
                  <td className="py-4 text-right text-[10px] opacity-40 font-mono">31/03/2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function KanbanColumn({ title, tasks, isIron }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{title}</h3>
        <span className="text-[10px] font-bold opacity-20">{tasks.length}</span>
      </div>
      <div className={`p-4 rounded-3xl border min-h-[200px] space-y-4 ${isIron ? 'bg-iron-blue/5 border-iron-blue/10' : 'bg-matrix-green/5 border-matrix-green/10'}`}>
        {tasks.map((task: any) => (
          <motion.div
            key={task.id}
            whileHover={{ y: -2 }}
            className={`p-4 rounded-2xl border bg-black/40 backdrop-blur-md ${isIron ? 'border-iron-blue/20' : 'border-matrix-green/20'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                task.priority === 'Crítica' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
              }`}>
                {task.priority}
              </span>
              <button className="opacity-20 hover:opacity-100 transition-opacity"><MoreVertical size={14} /></button>
            </div>
            <p className="text-xs font-bold mb-4">{task.title}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                  {task.assignee[0]}
                </div>
                <span className="text-[9px] opacity-40 uppercase">{task.assignee.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1 opacity-20">
                <Calendar size={10} />
                <span className="text-[8px] font-mono">Mar 31</span>
              </div>
            </div>
          </motion.div>
        ))}
        <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity border border-dashed border-white/10 rounded-xl">
          + Adicionar Tarefa
        </button>
      </div>
    </div>
  );
}
