import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2, Globe, Cpu, Shield, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  links?: { label: string; url: string }[];
  category: 'Web' | 'Mobile' | 'AI' | 'Security';
}

const projects: Project[] = [
  {
    id: '1',
    title: 'SIO Kingstar',
    description: 'Sistema de Inteligência Operacional avançado para monitoramento e análise de dados industriais em tempo real.',
    tags: ['AI', 'React', 'Node.js', 'Real-time'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    category: 'AI',
    liveUrl: 'https://ai.studio/apps/8801b947-4ae8-45f7-80a5-3882ff3e112e'
  },
  {
    id: '2',
    title: 'SaaS Confeitaria',
    description: 'Gestão completa para confeitarias. Versão 2.0 com painel administrativo avançado e Versão 1.0 clássica.',
    tags: ['Next.js', 'Financeiro', 'Stock Control'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    links: [
      { label: 'V2.0', url: 'https://saas-confeitaria-v20.vercel.app/' },
      { label: 'V1.0', url: 'https://saas-confeitaria.vercel.app/login.html' }
    ]
  },
  {
    id: '3',
    title: 'Proffy',
    description: 'Plataforma que conecta alunos e professores, facilitando o agendamento de aulas particulares.',
    tags: ['Education', 'React', 'Node.js'],
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    liveUrl: 'https://criando-primeiro-servidor.vercel.app/'
  },
  {
    id: '4',
    title: 'Cash-Bank',
    description: 'O novo banco digital criado pela MasterCode. Evolução constante da experiência bancária.',
    tags: ['Fintech', 'Banking', 'Modern UI'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    links: [
      { label: 'V1.0', url: 'https://cash-bank-frontend.vercel.app' },
      { label: 'V2.0 (Evolution)', url: 'https://ai.studio/apps/97e81213-38ca-4c28-ad9b-2445b485e7b2' }
    ]
  },
  {
    id: '5',
    title: 'Ponto Eletrônico',
    description: 'Sistema moderno para controle de jornada de trabalho, integrado e simplificado.',
    tags: ['HR Tech', 'Control', 'Dashboard'],
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    liveUrl: 'https://ai.studio/apps/5e5a376a-d5e0-4e17-8ce5-afb792862c5c'
  },
  {
    id: '6',
    title: 'AutoCenter Papa-Léguas',
    description: 'Gerenciamento completo para centros automotivos, agendamentos e histórico.',
    tags: ['Services', 'React', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    githubUrl: '#'
  },
  {
    id: '7',
    title: 'App Transaction Amount',
    description: 'Monitoramento detalhado de valores transacionados com análise intuitiva de fluxo financeiro.',
    tags: ['Finance', 'Analytics', 'Dashboard'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    category: 'Web',
    liveUrl: 'https://app-transactions-amount.vercel.app/'
  },
  {
    id: '8',
    title: "Marvel Avenger's Hub",
    description: 'Central de heróis da Marvel com exploração interativa de personagens e missões épicas.',
    tags: ['Marvel', 'Avengers', 'SuperHeroes', 'AI'],
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800',
    category: 'AI',
    liveUrl: 'https://ai.studio/apps/50192e3a-4eb5-4a7c-a9c2-73c887ad04c2'
  }
];

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-16 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
            Portfólio de <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>Projetos</span>
          </h1>
          <p className={`text-lg max-w-2xl ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
            Uma vitrine das simulações e sistemas desenvolvidos durante nossa trajetória na MasterCode.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-500 ${
              isIron 
                ? 'ironman-card border-iron-blue/10 hover:border-iron-blue/40' 
                : 'matrix-card border-matrix-green/10 hover:border-matrix-green/40'
            }`}
          >
            {/* Project Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                  isIron ? 'bg-iron-blue/20 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/20 border-matrix-green/30 text-matrix-green'
                }`}>
                  {project.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <h3 className="mb-3 text-2xl font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                {project.title}
              </h3>
              <p className="mb-6 text-sm opacity-60 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mb-8 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                        <Github size={20} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  
                  <button className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                    isIron ? 'text-iron-blue' : 'text-matrix-green'
                  }`}>
                    Detalhes <Zap size={14} />
                  </button>
                </div>

                {project.links && (
                  <div className="flex flex-wrap gap-2">
                    {project.links.map(link => (
                      <a 
                        key={link.url}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex-1 text-center py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter border transition-all ${
                          isIron 
                            ? 'bg-iron-blue/10 border-iron-blue/20 text-iron-blue hover:bg-iron-blue/20' 
                            : 'bg-matrix-green/10 border-matrix-green/20 text-matrix-green hover:bg-matrix-green/20'
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
