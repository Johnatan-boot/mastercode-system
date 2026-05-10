import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Course } from '../types';

export const CourseArea: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isIron = theme === 'ironman';
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const coursesRes = await fetch('/api/courses', { headers });
        const coursesData = await coursesRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);

        if (user && token) {
          const progressRes = await fetch(`/api/progress/${user.id}`, { headers });
          const progressData = await progressRes.json();
          setUserProgress(Array.isArray(progressData) ? progressData : []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchData();
  }, [user]);

  const getProgress = (courseId: string) => {
    // Check if userProgress is an array before filtering
    if (!Array.isArray(userProgress)) return 0;
    
    // This is a simplified progress calculation
    // In a real app, you'd check how many lessons in this course are completed
    const completedInCourse = userProgress.filter(p => p.lessonId && p.lessonId.startsWith('les-')).length;
    // Mocking progress for now based on the course
    if (courseId === 'matrix-mastery') return Math.min(Math.round((completedInCourse / 2) * 100), 100);
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-8 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
            <h1 className="text-3xl font-bold uppercase tracking-widest">Minhas Trilhas</h1>
          </div>
          <p className={`text-sm ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
            Continue de onde parou e alcance o próximo nível.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl border ${isIron ? 'border-iron-blue/20 bg-iron-blue/5' : 'border-matrix-green/20 bg-matrix-green/5'}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-1">Total de Horas</span>
            <span className="text-lg font-bold">54h</span>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${isIron ? 'border-iron-blue/20 bg-iron-blue/5' : 'border-matrix-green/20 bg-matrix-green/5'}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-1">Certificados</span>
            <span className="text-lg font-bold">12</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const progress = getProgress(course.id);
          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -8 }}
              className={`group flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                course.category === 'Security' 
                  ? 'ironman-card border-iron-blue/30 shadow-iron-blue/10' 
                  : isIron ? 'ironman-card hover:shadow-iron-blue/10' : 'matrix-card hover:shadow-matrix-green/10'
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                    isIron
                      ? 'border-iron-blue/30 text-iron-blue bg-iron-blue/10' 
                      : 'border-matrix-green/30 text-matrix-green bg-matrix-green/10'
                  }`}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold uppercase leading-tight tracking-wide mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] opacity-60 uppercase font-bold">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {course.totalLessons} Aulas</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <p className="text-sm text-gray-400 mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                
                <div className="space-y-6 mt-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                      <span className="opacity-40">Progresso da Trilha</span>
                      <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>{progress}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isIron ? 'bg-iron-blue/10' : 'bg-matrix-green/10'}`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full relative ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} 
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </motion.div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/room/${course.id}`)}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 mb-2 ${
                      isIron 
                      ? 'bg-iron-blue text-black hover:bg-iron-blue/80' 
                      : 'bg-matrix-green text-black hover:bg-matrix-green/80'
                    }`}
                  >
                    Continuar Trilha <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/certificate/${course.id}`)}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border ${
                      isIron 
                      ? 'border-iron-blue/30 text-iron-blue hover:bg-iron-blue/10' 
                      : 'border-matrix-green/30 text-matrix-green hover:bg-matrix-green/10'
                    }`}
                  >
                    Acessar Certificado
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative p-12 rounded-[2.5rem] overflow-hidden group ${
          isIron 
            ? 'bg-gradient-to-br from-iron-dark via-iron-surface to-iron-accent border border-iron-blue/20' 
            : 'bg-gradient-to-br from-matrix-dark via-matrix-surface to-matrix-black border border-matrix-green/20'
        }`}
      >
        {/* Animated Background Gradients */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
        <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-10 animate-pulse delay-700 ${isIron ? 'bg-iron-red' : 'bg-matrix-green'}`} />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 backdrop-blur-xl border ${
            isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green'
          }`}>
            <Play size={40} className="ml-1" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
              Explorar <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>Novos Horizontes</span>
            </h3>
            <p className="text-base opacity-60 max-w-xl mx-auto leading-relaxed">
              Acesse o catálogo completo e descubra novos protocolos de conhecimento para sua carreira. 
              Sua jornada para a maestria começa aqui.
            </p>
          </div>

          <button className={`group relative px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 ${
            isIron ? 'bg-iron-blue text-black hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]' : 'bg-matrix-green text-black hover:shadow-[0_0_40px_rgba(0,255,65,0.4)]'
          }`}>
            <span className="relative z-10 flex items-center gap-3">
              Ver Catálogo Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
