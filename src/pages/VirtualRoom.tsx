import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  ChevronRight, 
  Video, 
  FileText, 
  MessageSquare, 
  Mic, 
  Send, 
  Volume2, 
  ArrowLeft,
  MoreVertical,
  Download,
  Share2,
  Users,
  Bot,
  Terminal,
  StopCircle,
  Edit3,
  Trophy,
  Settings
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { getJNewResponse, getJNewAudioResponse } from '../services/ai';
import confetti from 'canvas-confetti';
import { Lesson, Module } from '../types';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text?: string;
  audioUrl?: string;
  timestamp: Date;
}

export const VirtualRoom: React.FC = () => {
  const { theme } = useTheme();
  const { user, gainXP } = useAuth();
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();
  const isIron = theme === 'ironman';
  
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'questions' | 'materials' | 'notes'>('questions');
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  // Active study session timer
  const [studyTime, setStudyTime] = useState(0);
  const [xpToasts, setXpToasts] = useState<{ id: string; text: string }[]>([]);

  // Keep a reference to gainXP to keep intervals stable and avoid resetting timer on user profile change
  const gainXPRef = useRef(gainXP);
  useEffect(() => {
    gainXPRef.current = gainXP;
  }, [gainXP]);

  // Set up student active timer (gains 20 XP every 60 seconds)
  useEffect(() => {
    const timerId = setInterval(() => {
      setStudyTime(prev => {
        const nextTime = prev + 1;
        // Verify 1 minute milestone (60s)
        if (nextTime > 0 && nextTime % 60 === 0) {
          gainXPRef.current(20)
            .then(() => {
              const id = Date.now().toString();
              setXpToasts(curr => [...curr, { id, text: '+20 XP de Aprendizado Contínuo! ⏱️' }]);
              setTimeout(() => {
                setXpToasts(curr => curr.filter(item => item.id !== id));
              }, 4000);
            })
            .catch(err => console.error("Error rewarding study time XP:", err));
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatStudyTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  
  // HTML5 & CSS Live Playground States
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (courseId === 'css-mastery' || (course && course.title && course.title.toLowerCase().includes('css'))) {
      setCode(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Playground CSS Mastercode</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #090d16;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #10b981;
            border-radius: 16px;
            padding: 2.5rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 35px -5px rgba(16, 185, 129, 0.2);
            border-color: #34d399;
        }

        h2 {
            margin-top: 0;
            color: #10b981;
            font-size: 1.8rem;
            letter-spacing: -0.025em;
        }

        p {
            color: #94a3b8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .btn {
            background-color: #10b981;
            color: #000;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
        }

        .btn:hover {
            background-color: #34d399;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Aprendendo CSS!</h2>
        <p>Modifique as regras CSS acima dentro do bloco &lt;style&gt; e visualize as alterações de layout, cantos e cores em tempo real no visualizador ao lado.</p>
        <button class="btn">Executar Ação</button>
    </div>
</body>
</html>`);
    } else {
      setCode(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Playground Mastercode</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 90vh;
            margin: 0;
        }
        h1 {
            color: #38bdf8;
            border-bottom: 2px solid #334155;
            padding-bottom: 10px;
        }
        p {
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <h1>Olá, Mastercode!</h1>
    <p>Edite este cabeçalho ou parágrafo no editor ao lado e veja a mágica ocorrer.</p>
</body>
</html>`);
    }
  }, [courseId]);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Saudações, aluno. Sou o Núcleo J-New. Estou monitorando esta sala virtual. Como posso otimizar seu aprendizado hoje?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Simple and highly customizable written content formatter
  const renderLessonContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```html[\s\S]*?```|```javascript[\s\S]*?```|```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeType = part.startsWith('```html') ? 'html' : part.startsWith('```javascript') ? 'javascript' : 'code';
        const cleanCode = part
          .replace(/```html\n|```javascript\n|```\n/g, '')
          .replace(/```/g, '');
        return (
          <div key={index} className="my-4 font-mono text-[11px] rounded-xl overflow-hidden border border-white/10">
            <div className="bg-white/5 px-4 py-2 text-[10px] uppercase font-bold tracking-wider opacity-60 flex justify-between items-center select-none border-b border-white/5">
              <span>💻 Código {codeType.toUpperCase()} ({courseId === 'matrix-mastery' ? 'Mastercode' : 'W3Schools'})</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cleanCode);
                }}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-[9px] uppercase font-mono"
              >
                Copiar
              </button>
            </div>
            <pre className="p-4 bg-black/60 text-emerald-400 overflow-x-auto text-left leading-relaxed">
              <code>{cleanCode}</code>
            </pre>
            {codeType === 'html' && (
              <div className="bg-emerald-500/5 px-4 py-3 flex gap-3 items-center justify-between border-t border-white/5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🔬 Playground Interativo</span>
                <button
                  onClick={() => {
                    setCode(cleanCode);
                    const element = document.getElementById('playground-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${isIron ? 'bg-iron-blue hover:bg-iron-blue/80 text-black' : 'bg-matrix-green hover:bg-matrix-green/80 text-black'} transition-all`}
                >
                  Testar no Playground
                </button>
              </div>
            )}
          </div>
        );
      }

      const lines = part.split('\n');
      return lines.map((line, lIdx) => {
        if (line.startsWith('### ')) {
          return (
            <h3 key={`${index}-${lIdx}`} className="text-sm font-bold text-white mt-6 mb-2 uppercase tracking-wide border-l-2 pl-2 border-current">
              {line.replace('### ', '')}
            </h3>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={`${index}-${lIdx}`} className="text-base font-bold text-white mt-8 mb-3 uppercase tracking-widest border-l-4 pl-2 border-current">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={`${index}-${lIdx}`} className="ml-4 list-disc text-gray-300 text-xs leading-relaxed mb-1.5 font-sans">
              {line.replace('- ', '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={`${index}-${lIdx}`} className="h-2" />;
        }
        const inlineParts = line.split(/(`[^`]+`)/);
        const renderedLine = inlineParts.map((ip, ipIdx) => {
          if (ip.startsWith('`') && ip.endsWith('`')) {
            return (
              <code key={ipIdx} className={`px-1 py-0.5 rounded font-mono text-[11px] ${isIron ? 'bg-iron-blue/10 text-iron-blue border border-iron-blue/10' : 'bg-matrix-green/10 text-matrix-green border border-matrix-green/10'}`}>
                {ip.slice(1, -1)}
              </code>
            );
          }
          return ip;
        });
        return (
          <p key={`${index}-${lIdx}`} className="text-gray-300 text-xs leading-relaxed mb-3 font-sans">
            {renderedLine}
          </p>
        );
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        // Fetch modules, lessons of this course, and full course list in parallel
        const [modulesRes, lessonsRes, coursesRes] = await Promise.all([
          fetch(`/api/courses/${courseId}/modules`),
          fetch(`/api/courses/${courseId}/lessons`),
          fetch(`/api/courses`)
        ]);
        const modulesData = await modulesRes.json();
        const lessonsData = await lessonsRes.json();
        const coursesData = await coursesRes.json();
        
        setModules(modulesData);
        setLessons(lessonsData);
        if (Array.isArray(coursesData)) {
          const currentCourse = coursesData.find((c: any) => c.id === courseId);
          if (currentCourse) {
            setCourse(currentCourse);
          }
        }

        // Fetch user progress
        if (user) {
          const token = localStorage.getItem('token');
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          const progressRes = await fetch(`/api/progress/${user.id}`, { headers });
          const progressData = await progressRes.json();
          if (Array.isArray(progressData)) {
            setCompletedIds(progressData.map((p: any) => p.lessonId));
          }
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, user]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleComplete = async (lessonId: string) => {
    if (!completedIds.includes(lessonId) && user) {
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ userId: user.id || user.uid, lessonId })
        });

        setCompletedIds(prev => [...prev, lessonId]);
        
        // Gain XP for completing a lesson
        await gainXP(250);

        // Add visual XP notification toast
        const id1 = Date.now().toString();
        setXpToasts(curr => [...curr, { id: id1, text: '+250 XP: Tópico Concluído! 🚀' }]);
        setTimeout(() => {
          setXpToasts(curr => curr.filter(item => item.id !== id1));
        }, 4000);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: isIron ? ['#ea1f26', '#ffcc00', '#00d4ff'] : ['#00FF41', '#003B00', '#ffffff']
        });

        if (completedIds.length + 1 === lessons.length) {
          // Bonus XP for completing the module
          await gainXP(1000);

          // Add module milestone bonus toast
          const id2 = (Date.now() + 1).toString();
          setXpToasts(curr => [...curr, { id: id2, text: '+1000 XP: Especialização Concluída! 🏆' }]);
          setTimeout(() => {
            setXpToasts(curr => curr.filter(item => item.id !== id2));
          }, 5000);

          confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.5 },
            colors: isIron ? ['#ea1f26', '#ffcc00', '#00d4ff'] : ['#00FF41', '#003B00', '#ffffff']
          });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const currentLesson = lessons[selectedLessonIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isIron ? 'border-iron-blue' : 'border-matrix-green'}`} />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nenhuma aula encontrada para este curso.</h2>
          <button onClick={() => navigate('/dashboard')} className={isIron ? 'ironman-btn' : 'matrix-btn'}>Voltar ao Dashboard</button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (text?: string, audioUrl?: string) => {
    if (!text && !audioUrl) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      audioUrl,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Get J-New text response
      const responseText = await getJNewResponse(text || "Analise este áudio e me auxilie.", theme);
      
      // Get J-New audio response (TTS)
      const botAudioUrl = await getJNewAudioResponse(responseText, theme);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        audioUrl: botAudioUrl || undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSendMessage(undefined, audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-gray-200 relative">
      {/* Floating XP Toasts */}
      <div className="fixed top-20 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {xpToasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg border backdrop-blur-md flex items-center gap-2 ${
                isIron
                  ? 'bg-iron-dark/95 border-iron-blue/30 text-iron-blue shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                  : 'bg-matrix-black/95 border-matrix-green/30 text-matrix-green shadow-[0_0_15px_rgba(0,255,65,0.15)]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar - Lessons List */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-[45] lg:hidden backdrop-blur-sm"
            />
            
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed lg:sticky left-0 top-0 h-screen z-50 w-80 border-r shrink-0 flex flex-col ${isIron ? 'bg-iron-dark border-iron-blue/10' : 'bg-matrix-black border-matrix-green/10'}`}
            >
              <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      } else {
                        navigate('/dashboard');
                      }
                    }} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft size={16} /> {typeof window !== 'undefined' && window.innerWidth < 1024 ? 'Fechar' : 'Voltar'}
                  </button>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                    {completedIds.length}/{lessons.length} Concluído
                  </div>
                </div>
                
                <button 
                   onClick={() => navigate(`/certificate/${courseId}`)}
                   className={`w-full px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                >
                  <Trophy size={16} /> Acessar Meu Certificado
                </button>
              </div>

              {/* Group Topics by Module Hierarchically */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2 px-2">Estrutura do Curso</h3>
                {modules.map((moduleItem, modIdx) => {
                  const moduleLessons = lessons.filter(l => l.moduleId === moduleItem.id);
                  if (moduleLessons.length === 0) return null;
                  return (
                    <div key={moduleItem.id} className="space-y-2">
                      <h4 className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 leading-snug ${isIron ? 'text-iron-blue/75' : 'text-matrix-green/75'}`}>
                        {moduleItem.title}
                      </h4>
                      <div className="space-y-1.5">
                        {moduleLessons.map((lesson) => {
                          const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                          const isSelected = selectedLessonIndex === globalIndex;
                          const isCompleted = completedIds.includes(lesson.id);
                          return (
                            <motion.div
                              key={lesson.id}
                              whileHover={{ x: 3 }}
                              onClick={() => {
                                setSelectedLessonIndex(globalIndex);
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                  setIsSidebarOpen(false);
                                }
                              }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 group ${
                                isSelected 
                                  ? (isIron ? 'bg-iron-blue/10 border-iron-blue/40 shadow-[0_0_15px_rgba(0,212,255,0.05)]' : 'bg-matrix-green/10 border-matrix-green/40 shadow-[0_0_15px_rgba(0,255,65,0.05)]')
                                  : 'bg-white/5 border-transparent hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                                  isCompleted
                                    ? (isIron ? 'bg-iron-blue text-black border-iron-blue' : 'bg-matrix-green text-black border-matrix-green')
                                    : 'border-white/10 opacity-40'
                                }`}>
                                  {isCompleted ? <CheckCircle size={11} /> : (globalIndex + 1)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`}>{lesson.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Video size={9} className="opacity-40" />
                                    <span className="text-[9px] opacity-40 uppercase font-mono">{lesson.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - Expanded Split Workspace with Sidebar Toggles */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top bar with lesson title, status, and button */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-black/40">
          <div className="flex items-center gap-4 min-w-0">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-lg border transition-all ${
                  isIron ? 'border-iron-blue/25 text-iron-blue hover:bg-iron-blue/10' : 'border-matrix-green/25 text-matrix-green hover:bg-matrix-green/10'
                }`}
                title="Abrir Menu de Tópicos"
              >
                <ChevronRight size={18} className="animate-pulse" />
              </button>
            )}
            <div className="min-w-0">
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
                {modules.find(m => m.id === currentLesson?.moduleId)?.title || course?.title || 'Curso de CSS3'}
              </span>
              <h2 className="text-sm font-bold text-white truncate">{currentLesson?.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Active Study Timer */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 font-mono text-[10px] uppercase font-bold tracking-wider ${isIron ? 'text-iron-blue border-iron-blue/10 animate-pulse' : 'text-matrix-green border-matrix-green/10 animate-pulse'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span>⏱️ Estudo Ativo: {formatStudyTime(studyTime)}</span>
            </div>

            {/* real-time HUD Level Progress Bar */}
            <div className="hidden md:flex flex-col items-end gap-1 select-none">
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className="opacity-40">Nível {user?.level || 1}</span>
                <span className={isIron ? 'text-iron-blue font-bold' : 'text-matrix-green font-bold'}>
                  {user?.xp || 0} / {(user?.level || 1) * 1000} XP
                </span>
              </div>
              <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${isIron ? 'bg-iron-blue shadow-[0_0_8px_rgba(0,212,255,0.5)]' : 'bg-matrix-green shadow-[0_0_8px_rgba(0,255,65,0.5)]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (((user?.xp || 0) % 1000) / 1000) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-1 text-[10px] font-mono opacity-50">
              <span>+250 XP</span>
            </div>

            <button
              onClick={() => handleComplete(currentLesson.id)}
              disabled={completedIds.includes(currentLesson.id)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                completedIds.includes(currentLesson.id)
                  ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                  : (isIron ? 'bg-iron-blue text-black hover:scale-105' : 'bg-matrix-green text-black hover:scale-105')
              }`}
            >
              {completedIds.includes(currentLesson.id) ? 'Concluída' : 'Concluir Aula'}
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Grid workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar lg:grid lg:grid-cols-12 lg:h-[calc(100vh-64px)]">
          
          {/* Left Column (65% width) - Video player followed directly by text didactics and code editor playground */}
          <div className="lg:col-span-8 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6 lg:h-full">
            
            {/* Elegant Rounded Video Wrapper */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              <iframe 
                src={currentLesson.videoUrl} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
              {completedIds.includes(currentLesson.id) && (
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-black px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg pointer-events-none">
                  <CheckCircle size={12} /> Tópico Concluído
                </div>
              )}
            </div>

            {/* Divided Layout: Matéria em Texto (HTML5 / W3Schools documentation style) */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Material Didático Teórico</h3>
                    <p className="text-[9px] opacity-40 uppercase">Preparado com referências oficiais W3Schools e Mastercode</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                  {completedIds.length}/{lessons.length} Concluído
                </div>
              </div>

              {/* Dynamic rendered markdown text */}
              <div className="prose prose-invert max-w-none text-left">
                {renderLessonContent(currentLesson.content)}
              </div>
            </div>

             {/* Interactive HTML5 "Tente Você Mesmo" Live Playground */}
             <div id="playground-section" className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg space-y-4">
               <div className="flex items-center justify-between border-b border-white/10 pb-4">
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                     <Terminal size={18} />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white uppercase tracking-wider">Playground Interativo {(courseId === 'css-mastery' || (course && course.title && course.title.toLowerCase().includes('css'))) ? 'CSS' : 'HTML5'}</h3>
                     <p className="text-[9px] opacity-40 uppercase">Tente Você Mesmo: Modifique o código e confira o resultado</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => {
                       if (courseId === 'css-mastery' || (course && course.title && course.title.toLowerCase().includes('css'))) {
                         setCode(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Playground CSS Mastercode</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #090d16;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid #10b981;
            border-radius: 16px;
            padding: 2.5rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 35px -5px rgba(16, 185, 129, 0.2);
            border-color: #34d399;
        }

        h2 {
            margin-top: 0;
            color: #10b981;
            font-size: 1.8rem;
            letter-spacing: -0.025em;
        }

        p {
            color: #94a3b8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .btn {
            background-color: #10b981;
            color: #000;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
        }

        .btn:hover {
            background-color: #34d399;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Aprendendo CSS!</h2>
        <p>Modifique as regras CSS acima dentro do bloco &lt;style&gt; e visualize as alterações de layout, cantos e cores em tempo real no visualizador ao lado.</p>
        <button class="btn">Executar Ação</button>
    </div>
</body>
</html>`);
                       } else {
                         setCode('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <title>Playground Mastercode</title>\n    <style>\n        body {\n            font-family: system-ui, sans-serif;\n            background: #0f172a;\n            color: #f8fafc;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n            height: 90vh;\n            margin: 0;\n        }\n        h1 {\n            color: #38bdf8;\n            border-bottom: 2px solid #334155;\n            padding-bottom: 10px;\n        }\n        p {\n            color: #94a3b8;\n        }\n    </style>\n</head>\n<body>\n    <h1>Olá, Mastercode!</h1>\n    <p>Edite este cabeçalho ou parágrafo no editor ao lado e veja a mágica ocorrer.</p>\n</body>\n</html>');
                       }
                     }}
                     className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-[9px] font-mono text-gray-400"
                   >
                     Resetar
                   </button>
                   <button
                     onClick={() => setCode('')}
                     className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-[9px] font-mono text-gray-400"
                   >
                     Limpar
                   </button>
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Editor panel */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider opacity-60">Editor:</label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[280px] p-3 font-mono text-[11px] rounded-xl bg-black/60 border border-white/10 focus:border-current text-emerald-400 leading-relaxed resize-none focus:outline-none"
                    placeholder="<!-- Digite seu código HTML aqui -->"
                  />
                </div>

                {/* Simulated live visual terminal */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[9px] uppercase font-bold tracking-wider opacity-60">Visualização:</label>
                  <div className="flex-1 border border-white/15 rounded-xl overflow-hidden bg-white h-[280px]">
                    <iframe
                      srcDoc={code}
                      title="Playground Preview"
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (35% width) - Interactive features (IA, Anotações, Arquivos) */}
          <div className="lg:col-span-4 flex flex-col bg-white/[0.02] border-l border-white/5 lg:h-full overflow-hidden">
            
            {/* Tabs for fast switching */}
            <div className="flex border-b border-white/5 px-2 overflow-x-auto whitespace-nowrap custom-scrollbar shrink-0">
              {[
                { id: 'questions', label: 'IA J-New', icon: MessageSquare },
                { id: 'notes', label: 'Notas', icon: Edit3 },
                { id: 'materials', label: 'Arquivos', icon: Download }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-[9px] font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? (isIron ? 'text-iron-blue' : 'text-matrix-green') : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <tab.icon size={13} className="shrink-0" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Interactive feature frames container */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'questions' && (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col overflow-hidden h-full"
                  >
                    {/* Chat Messages */}
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border ${
                              msg.role === 'bot' 
                                ? (isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green')
                                : 'bg-white/10 border-white/20 text-white'
                            }`}>
                              {msg.role === 'bot' ? <Bot size={13} /> : <span className="text-[10px] font-bold">{user?.name?.[0]}</span>}
                            </div>
                            <div className="space-y-1">
                              <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                                msg.role === 'user'
                                  ? (isIron ? 'bg-iron-blue/10 border border-iron-blue/20 text-white rounded-tr-none' : 'bg-matrix-green/10 border border-matrix-green/20 text-white rounded-tr-none')
                                  : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                              }`}>
                                {msg.text && <p className="font-sans">{msg.text}</p>}
                                {msg.audioUrl && (
                                  <div className="flex items-center gap-2 py-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-white/5`}>
                                      <Volume2 size={12} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
                                    </div>
                                    <audio src={msg.audioUrl} controls className="h-6 w-36 opacity-85" />
                                  </div>
                                )}
                              </div>
                              <p className="text-[8px] uppercase opacity-30 tracking-widest text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green'}`}>
                              <Bot size={13} />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-none">
                              <div className="flex gap-1.5">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-current" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-current" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-current" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/5 bg-black/30 backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                            placeholder="Pergunte ao J-New ou envie áudio..."
                            className={`w-full text-xs py-2 px-3 focus:outline-none ${isIron ? 'ironman-input' : 'matrix-input'}`}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                            <button 
                              onMouseDown={startRecording}
                              onMouseUp={stopRecording}
                              className={`p-1 hover:scale-105 transition-all ${
                                isRecording 
                                  ? 'bg-red-500 text-white animate-pulse rounded' 
                                  : `${isIron ? 'text-iron-blue' : 'text-matrix-green'}`
                              }`}
                            >
                              {isRecording ? <StopCircle size={15} /> : <Mic size={15} />}
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSendMessage(input)}
                          className={`p-2 rounded-xl transition-all ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                        >
                          <Send size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 flex flex-col h-full overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white">Minhas Anotações</h3>
                      <button 
                        onClick={() => {
                          const area = document.getElementById('lesson-notes-textarea') as HTMLTextAreaElement;
                          if (area) area.value = '';
                        }}
                        className="text-[9px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                      >
                        Limpar
                      </button>
                    </div>
                    <textarea 
                      id="lesson-notes-textarea"
                      placeholder={`Escreva suas anotações sobre esta aula de ${course?.title || 'CSS3'} aqui...`}
                      className={`flex-1 w-full p-4 rounded-xl resize-none text-xs leading-relaxed focus:outline-none ${isIron ? 'ironman-input' : 'matrix-input'}`}
                    />
                    <div className="mt-3 flex flex-col gap-2">
                      <button className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isIron ? 'ironman-btn' : 'matrix-btn'}`}>
                        Salvar Notas
                      </button>
                      <p className="text-[8px] opacity-30 uppercase tracking-widest text-center italic">Sincronizado automaticamente</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'materials' && (
                  <motion.div
                    key="materials"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 space-y-3 overflow-y-auto custom-scrollbar h-full"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white">Arquivos de Apoio</h3>
                      {completedIds.length === lessons.length && (
                        <button 
                          onClick={() => navigate(`/certificate/${courseId}`)}
                          className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                        >
                          <Trophy size={11} /> Certificado
                        </button>
                      )}
                    </div>
                    {((courseId === 'css-mastery' || (course && course.title && course.title.toLowerCase().includes('css')))
                      ? [
                          { title: "Guia Completo CSS3 W3Schools.pdf", size: "5.2 MB" },
                          { title: "Exercícios Práticos Resolvidos.zip", size: "12 MB" },
                          { title: "CheatSheet Seletores e Box-Model.pdf", size: "1.5 MB" },
                          { title: "Códigos de Exemplo da Aula.css", size: "8 KB" }
                        ]
                      : [
                          { title: "Guia Completo HTML5 W3Schools.pdf", size: "4.8 MB" },
                          { title: "Exercícios Práticos Resolvidos.zip", size: "12 MB" },
                          { title: "CheatSheet Elementos Semânticos.pdf", size: "1.2 MB" },
                          { title: "Códigos de Exemplo da Aula.html", size: "15 KB" }
                        ]
                    ).map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                            <Download size={13} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold group-hover:text-white transition-colors truncate">{file.title}</p>
                            <p className="text-[8px] opacity-40 uppercase font-mono">{file.size}</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg shrink-0">
                          <Share2 size={12} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Action Button for J-New (Global Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
         <button 
           onClick={() => {
             setActiveTab('questions');
             setIsSidebarOpen(false);
           }}
           className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${isIron ? 'bg-iron-red text-white' : 'bg-matrix-green text-black'}`}
         >
            <Terminal size={24} />
         </button>
      </div>
    </div>
  );
};
