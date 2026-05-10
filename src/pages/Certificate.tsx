import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, Printer, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const Certificate: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const isIron = theme === 'ironman';
  
  const certificateRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tocar o confetti quando a página carrega
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.4 },
      colors: isIron ? ['#ea1f26', '#ffcc00', '#00d4ff'] : ['#00FF41', '#003B00', '#ffffff']
    });

    const fetchCourse = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        const found = data.find((c: any) => c.id === courseId);
        if (found) {
          setCourse(found);
        } else {
            // Em fallback, simule dados do curso se o endpoint não retornar
            setCourse({
                title: 'Masterclass: Desenvolvimento de Realidades Digitais',
                workload: '40 horas'
            })
        }
      } catch (error) {
        setCourse({
            title: 'Masterclass: Desenvolvimento de Realidades Digitais',
            workload: '40 horas'
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isIron]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isIron ? 'border-iron-blue' : 'border-matrix-green'}`} />
      </div>
    );
  }

  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col pt-24 px-6 md:px-12 pb-12">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={16} /> Voltar para a Tela
          </button>
          <div className="flex gap-4">
            <button 
                onClick={handleDownload}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isIron ? 'hover:bg-iron-blue/10 text-iron-blue border border-iron-blue/30' : 'hover:bg-matrix-green/10 text-matrix-green border border-matrix-green/30'}`}
            >
              <Printer size={16} /> Imprimir / PDF
            </button>
            <button 
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
            >
              <Share2 size={16} /> Compartilhar Troféu
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`relative rounded-sm overflow-hidden p-[2px] mx-auto printable-certificate ${isIron ? 'shadow-[0_0_80px_rgba(0,212,255,0.4)]' : 'shadow-[0_0_80px_rgba(0,255,65,0.4)]'}`}
          style={{ maxWidth: '1000px', aspectRatio: '1.414 / 1' }} 
        >
          {/* Animated Border */}
          <div className={`absolute inset-0 z-0 ${isIron ? 'bg-gradient-to-br from-iron-red via-iron-blue to-iron-dark' : 'bg-gradient-to-br from-matrix-green via-black to-matrix-green'} opacity-100`} />
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${isIron ? '%2300d4ff' : '%2300ff41'}' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />

          {/* Certificate Content background */}
          <div className="relative z-10 w-full h-full bg-white flex flex-col items-center justify-center p-12 md:p-20 text-center" ref={certificateRef}>

            {/* Logo / Icon Area */}
            <div className={`w-24 h-24 mb-10 border rounded-full flex flex-col items-center justify-center ${isIron ? 'border-iron-blue shadow-[0_0_40px_rgba(0,212,255,0.3)] text-iron-blue' : 'border-matrix-green shadow-[0_0_40px_rgba(0,255,65,0.3)] text-matrix-green'}`}>
                <Award size={40} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">MasterCode</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.2em] mb-4 text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
               Certificado de Conclusão
            </h1>
            
            <p className="text-sm md:text-md uppercase tracking-[0.3em] mb-10 border-b border-black/10 pb-6 w-full max-w-2xl text-gray-500">
              Sistema de Aprendizagem Neural
            </p>

            <p className="text-lg md:text-xl text-gray-600 mb-2 font-mono">
              Certificamos que o construtor digital
            </p>
            
            <h2 className={`text-4xl md:text-5xl font-bold uppercase tracking-widest my-6 ${isIron ? 'text-iron-blue drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]' : 'text-matrix-green drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]'}`}>
              {user?.name || 'CONSTRUTOR MASTER'}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mt-2 mb-8 font-mono max-w-3xl">
              Concluiu com sucesso o treinamento da matriz simulada do módulo protocolar de 
              <br />
              <span className="text-gray-900 font-bold inline-block mt-4 text-2xl uppercase tracking-wider">{course?.title || 'Protocolo MasterCode'}</span>
            </p>

            <div className="grid grid-cols-2 gap-20 mt-auto pt-8 w-full max-w-3xl border-t border-black/10">
              <div className="flex flex-col items-center text-gray-800">
                 <p className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest">Data de Emissão</p>
                 <p className="font-mono text-xl">{currentDate}</p>
                 <div className={`mt-2 h-[2px] w-full ${isIron ? 'bg-iron-blue/60' : 'bg-matrix-green/60'}`}></div>
              </div>
              <div className="flex flex-col items-center text-gray-800">
                 <p className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest">CH Assinatura Master</p>
                 <p className="font-mono text-xl signature-font italic">{course?.workload || '40 HORAS'}</p>
                 <div className={`mt-2 h-[2px] w-full ${isIron ? 'bg-iron-blue/60' : 'bg-matrix-green/60'}`}></div>
              </div>
            </div>

            {/* Verification Hash */}
            <div className="absolute bottom-6 left-6 text-left text-gray-500">
                <p className="text-[8px] uppercase tracking-widest font-mono">ID: {courseId || 'MC-00000000X'}</p>
                <p className="text-[8px] uppercase tracking-widest font-mono">HASH: {Math.random().toString(36).substring(2, 15)}</p>
            </div>
            
            {/* Stamp Logo */}
            <div className="absolute bottom-12 right-12 pointer-events-none text-gray-300">
              <div className={`w-32 h-32 rounded-full border-8 border-dashed flex items-center justify-center animate-spin-slow rotate-12 ${isIron ? 'border-iron-blue/30' : 'border-matrix-green/30'}`}>
                <div className="text-center rotate-[-12deg] text-gray-400">
                  <p className="font-bold uppercase tracking-widest text-xs">Master</p>
                  <p className="font-bold uppercase tracking-widest text-xs">Code</p>
                  <p className="font-mono text-[8px] mt-2">VERIFIED</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body { visibility: hidden; background: white; }
          .printable-certificate { visibility: visible; position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; transform: scale(0.9); box-shadow: none; }
          .printable-certificate .bg-white { background-color: white !important; -webkit-print-color-adjust: exact; }
        }
        .signature-font { font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; }
      `}</style>
    </div>
  );
};
