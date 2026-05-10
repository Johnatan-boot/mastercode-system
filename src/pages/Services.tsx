import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Shield, Database, Code, Zap, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: any;
  features: string[];
}

const services: Service[] = [
  {
    id: '1',
    title: 'Manutenção de Hardware Crítico',
    description: 'Reparo e otimização de servidores, estações de trabalho e sistemas de alta performance.',
    price: 'A partir de R$ 350,00',
    icon: Wrench,
    features: ['Limpeza Ultrassônica', 'Troca de Pasta Térmica Premium', 'Diagnóstico de Circuito']
  },
  {
    id: '2',
    title: 'Segurança e Criptografia',
    description: 'Implementação de protocolos de segurança de nível militar para proteção de dados sensíveis.',
    price: 'Sob Consulta',
    icon: Shield,
    features: ['Firewall Stark', 'Criptografia de Ponta a Ponta', 'Auditoria de Vulnerabilidades']
  },
  {
    id: '3',
    title: 'Recuperação de Dados de Zion',
    description: 'Recuperação especializada de dados em HDs, SSDs e sistemas de armazenamento corrompidos.',
    price: 'A partir de R$ 800,00',
    icon: Database,
    features: ['Laboratório de Sala Limpa', 'Recuperação de RAID', 'Forense Digital']
  },
  {
    id: '4',
    title: 'Desenvolvimento de Softwares Customizados',
    description: 'Criação de soluções de software sob medida, desde scripts de automação até sistemas complexos.',
    price: 'Sob Consulta',
    icon: Code,
    features: ['Arquitetura Microservices', 'Integração com IA', 'Otimização de Performance']
  }
];

export const Services: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Serviços Especializados</h1>
        <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Suporte técnico de elite para infraestruturas digitais complexas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 flex flex-col md:flex-row gap-8 ${isIron ? 'ironman-card' : 'matrix-card'}`}
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border ${
                isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green'
              }`}>
                <Icon size={32} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{service.title}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                    isIron ? 'border-iron-blue/30 text-iron-blue' : 'border-matrix-green/30 text-matrix-green'
                  }`}>
                    {service.price}
                  </span>
                </div>

                <p className="text-sm opacity-60 mb-6 leading-relaxed">{service.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                      <CheckCircle2 size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                  <button className={`flex-1 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
                    isIron ? 'ironman-btn' : 'matrix-btn'
                  }`}>
                    Solicitar Serviço
                  </button>
                  <button className={`p-3 rounded-lg border transition-all ${
                    isIron ? 'border-iron-blue/30 text-iron-blue hover:bg-iron-blue/10' : 'border-matrix-green/30 text-matrix-green hover:bg-matrix-green/10'
                  }`}>
                    <Clock size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className={`mt-16 p-10 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center ${
        isIron ? 'bg-iron-blue/5 border border-iron-blue/10' : 'bg-matrix-green/5 border border-matrix-green/10'
      }`}>
        {[
          { label: 'SLA de Resposta', value: '15min', icon: Zap },
          { label: 'Sistemas Ativos', value: '4.2k', icon: Cpu },
          { label: 'Casos Resolvidos', value: '12k+', icon: CheckCircle2 },
          { label: 'Uptime Garantido', value: '99.9%', icon: Shield },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i}>
              <Icon size={24} className={`mx-auto mb-4 ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`} />
              <div className="text-2xl font-bold tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase opacity-40 font-bold tracking-widest">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
