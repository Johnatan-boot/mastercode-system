import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, Plus, Edit, Trash2, Mail } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const TeacherArea: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  return (
    <div className="max-w-7xl mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest">Controle do Arquiteto</h1>
          <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Gerencie seus discípulos digitais e fluxos de conteúdo.</p>
        </div>
        <button className={isIron ? 'ironman-btn flex items-center gap-2' : 'matrix-btn flex items-center gap-2'}>
          <Plus size={18} /> Novo Módulo
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <BookOpen size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Módulos Ativos
            </h3>
            <div className="space-y-4">
              <TeacherCourseItem isIron={isIron} title="Dominando a Matrix" students={1240} lessons={12} status="Ativo" />
              <TeacherCourseItem isIron={isIron} title="Protocolos de Segurança de Zion" students={850} lessons={8} status="Rascunho" />
              <TeacherCourseItem isIron={isIron} title="Sabedoria da Oráculo: Integração IA" students={2100} lessons={15} status="Ativo" />
            </div>
          </div>

          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Sistema de Transmissão
            </h3>
            <div className="space-y-4">
              <p className={`text-xs ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>Envie uma transmissão criptografada para todos os assinantes.</p>
              <textarea 
                className={`w-full h-32 resize-none ${isIron ? 'ironman-input' : 'matrix-input'}`} 
                placeholder="Digite sua mensagem para os alunos..."
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase opacity-50">Alvo: 4.190 Nodos Ativos</span>
                <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>Transmitir</button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Support / Mentoring */}
        <div className="space-y-6">
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Fila de Mentoria
            </h3>
            <div className="space-y-4">
              <MentoringRequest isIron={isIron} name="Thomas Anderson" topic="React Context vs Redux" time="2m atrás" />
              <MentoringRequest isIron={isIron} name="Trinity" topic="Roteamento Microfrontend" time="15m atrás" />
              <MentoringRequest isIron={isIron} name="Morpheus" topic="Arquitetura de Sistema" time="1h atrás" />
            </div>
            <button className={`w-full mt-6 text-xs ${isIron ? 'ironman-btn' : 'matrix-btn'}`}>Ver Todas as Solicitações</button>
          </div>

          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Melhores Alunos
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center justify-between p-2 border-b ${isIron ? 'border-iron-blue/10' : 'border-matrix-green/10'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] ${isIron ? 'bg-iron-blue/20 border-iron-blue/40' : 'bg-matrix-green/20 border-matrix-green/40'}`}>
                      {i}
                    </div>
                    <span className="text-xs">Aluno_{i * 42}</span>
                  </div>
                  <span className={`text-[10px] ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>98% Score</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Email Campaign Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Campanhas de E-mail</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Comunique-se com seus assinantes e alunos.</p>
          </div>
        </div>

        <div className={isIron ? 'ironman-card' : 'matrix-card'}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Assunto do E-mail</label>
                <input type="text" placeholder="Novidades no Módulo 03..." className={isIron ? 'ironman-input w-full' : 'matrix-input w-full'} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Segmento de Alunos</label>
                <select className={isIron ? 'ironman-input w-full' : 'matrix-input w-full'}>
                  <option>Todos os Assinantes</option>
                  <option>Alunos de React</option>
                  <option>Inscritos em Mentorias</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Conteúdo da Mensagem</label>
              <textarea rows={4} placeholder="Olá aluno, temos novidades..." className={isIron ? 'ironman-input w-full resize-none' : 'matrix-input w-full resize-none'} />
            </div>
            <div className="flex justify-end">
              <button className={isIron ? 'ironman-btn' : 'matrix-btn'}>Disparar Campanha</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function TeacherCourseItem({ title, students, lessons, status, isIron }: any) {
  return (
    <div className={`p-4 bg-black/40 border rounded-lg flex items-center justify-between group transition-all ${isIron ? 'border-iron-blue/10 hover:border-iron-blue/40' : 'border-matrix-green/10 hover:border-matrix-green/40'}`}>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-[10px] uppercase opacity-50">{students} Alunos • {lessons} Aulas • <span className={status === 'Ativo' ? (isIron ? 'text-iron-blue' : 'text-matrix-green') : 'text-yellow-500'}>{status}</span></p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className={`p-2 rounded ${isIron ? 'hover:bg-iron-blue/10 text-iron-blue' : 'hover:bg-matrix-green/10 text-matrix-green'}`}><Edit size={16} /></button>
        <button className="p-2 hover:bg-red-500/10 rounded text-red-500"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

function MentoringRequest({ name, topic, time, isIron }: any) {
  return (
    <div className={`p-3 border rounded transition-colors cursor-pointer ${isIron ? 'border-iron-blue/10 hover:bg-iron-blue/5' : 'border-matrix-green/10 hover:bg-matrix-green/5'}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-bold">{name}</span>
        <span className="text-[9px] opacity-40 uppercase">{time}</span>
      </div>
      <p className={`text-[10px] truncate ${isIron ? 'text-iron-blue/70' : 'text-matrix-green/70'}`}>{topic}</p>
    </div>
  );
}
