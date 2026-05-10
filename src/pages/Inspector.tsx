import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useInspection } from '../hooks/useInspection';
import { Shield, Zap, Search, Code2, CopyCheck, BrainCircuit, Activity, AlertTriangle } from 'lucide-react';

export const Inspector: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [codeSnippet, setCodeSnippet] = useState('');
  const { scanCode, isScanning, report, error } = useInspection();

  const handleScan = () => {
    scanCode(codeSnippet);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit size={32} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
          <h1 className="text-4xl font-bold uppercase tracking-widest">AI Software Inspector</h1>
        </div>
        <p className={`text-lg max-w-3xl ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
          Motor de Auditoria de Engenharia Core. Submeta seu código para avaliação de arquitetura, segurança e boas práticas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className={`p-6 rounded-2xl border ${isIron ? 'bg-iron-dark/50 border-iron-blue/20' : 'bg-matrix-dark/50 border-matrix-green/20'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Code2 size={20} /> Input Core
            </h2>
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${isIron ? 'text-iron-blue border-iron-blue/30' : 'text-matrix-green border-matrix-green/30'}`}>
              Auto-detect Language
            </span>
          </div>
          
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="// Cole seu bloco de código, classe ou função aqui para inspeção profunda..."
            className={`w-full h-80 bg-black/50 rounded-xl p-4 font-mono text-sm border focus:outline-none focus:ring-2 resize-none ${
              isIron 
                ? 'border-iron-blue/20 focus:ring-iron-blue/50 text-iron-blue/90' 
                : 'border-matrix-green/20 focus:ring-matrix-green/50 text-matrix-green/90'
            }`}
          />
          
          <button 
            onClick={handleScan}
            disabled={isScanning || !codeSnippet.trim()}
            className={`mt-4 w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            } ${isIron ? 'bg-iron-blue text-black' : 'bg-matrix-green text-black'}`}
          >
            {isScanning ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Search size={20} className="animate-spin" /> Inspecionando Arquitetura...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CopyCheck size={20} /> Iniciar Inspeção
              </span>
            )}
          </button>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}
        </div>

        {/* Results Area */}
        <div className={`p-6 rounded-2xl border flex flex-col ${isIron ? 'bg-iron-dark/50 border-iron-blue/20' : 'bg-matrix-dark/50 border-matrix-green/20'}`}>
          {!report && !isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <Shield size={64} className="mb-4" />
              <p className="max-w-xs text-sm">Aguardando inteligência. O sistema calculará débitos técnicos e anti-patterns.</p>
            </div>
          )}

          {isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={`w-24 h-24 rounded-full border-t-2 border-l-2 animate-spin mb-4 ${isIron ? 'border-iron-blue' : 'border-matrix-green'}`} />
              <p className={`text-sm font-bold uppercase tracking-widest animate-pulse ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
                Sintetizando AST...
              </p>
            </div>
          )}

          {report && !isScanning && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-widest">Health Score</h2>
                <div className={`text-5xl font-black ${report.score > 80 ? 'text-green-500' : report.score > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {report.score}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Segurança</div>
                  <div className="text-xl font-bold flex items-center gap-2"><Shield size={16}/> {report.security}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Performance</div>
                  <div className="text-xl font-bold flex items-center gap-2"><Zap size={16}/> {report.performance}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Clean Code</div>
                  <div className="text-xl font-bold flex items-center gap-2"><Code2 size={16}/> {report.maintainability}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest mt-6 mb-4">Actionable Issues</h3>
                {report.issues.map((issue: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="mt-1">{issue.icon}</div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{issue.type}</div>
                      <p className="text-sm">{issue.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
