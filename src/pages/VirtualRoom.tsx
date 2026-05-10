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
  const [isLoading, setIsLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        // Fetch modules
        const modulesRes = await fetch(`/api/courses/${courseId}/modules`);
        const modulesData = await modulesRes.json();
        setModules(modulesData);

        // Fetch lessons for the first module (simplification)
        if (modulesData.length > 0) {
          const lessonsRes = await fetch(`/api/modules/${modulesData[0].id}/lessons`);
          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
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
          body: JSON.stringify({ userId: user.id, lessonId })
        });

        setCompletedIds(prev => [...prev, lessonId]);
        
        // Gain XP for completing a lesson
        await gainXP(250);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: isIron ? ['#ea1f26', '#ffcc00', '#00d4ff'] : ['#00FF41', '#003B00', '#ffffff']
        });

        if (completedIds.length + 1 === lessons.length) {
          // Bonus XP for completing the module
          await gainXP(1000);
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-gray-200">
      {/* Sidebar - Lessons List */}
      <aside className={`w-full lg:w-80 border-r shrink-0 flex flex-col h-screen sticky top-0 z-20 ${isIron ? 'bg-iron-dark border-iron-blue/10' : 'bg-matrix-black border-matrix-green/10'}`}>
        <div className="p-6 border-b border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              <ArrowLeft size={16} /> Voltar
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

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 px-2">Conteúdo do Módulo</h3>
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedLessonIndex(i)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-500 group ${
                selectedLessonIndex === i 
                  ? (isIron ? 'bg-iron-blue/10 border-iron-blue/40 shadow-[0_0_20px_rgba(0,212,255,0.1)]' : 'bg-matrix-green/10 border-matrix-green/40 shadow-[0_0_20px_rgba(0,255,65,0.1)]')
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 ${
                  completedIds.includes(lesson.id)
                    ? (isIron ? 'bg-iron-blue text-black border-iron-blue' : 'bg-matrix-green text-black border-matrix-green')
                    : 'border-white/10 opacity-40'
                }`}>
                  {completedIds.includes(lesson.id) ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${selectedLessonIndex === i ? 'text-white' : 'text-gray-400'}`}>{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Video size={10} className="opacity-40" />
                    <span className="text-[10px] opacity-40 uppercase font-mono">{lesson.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Main Content - Video & Interaction */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Video Player Section */}
        <section className="bg-black aspect-video relative group">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center ${isIron ? 'bg-iron-red text-white' : 'bg-matrix-green text-black'}`}
            >
              <Play size={32} fill="currentColor" />
            </motion.button>
          </div>
          
          {/* Video Player */}
          <iframe 
            src={currentLesson.videoUrl} 
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
               <button className="opacity-60 hover:opacity-100 transition-opacity"><Play size={20} /></button>
               <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className={`h-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} style={{ width: '30%' }} />
               </div>
               <span className="text-[10px] font-mono opacity-60">04:20 / {currentLesson.duration}</span>
            </div>
            <div className="flex items-center gap-4 pointer-events-auto">
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
               <button className="opacity-60 hover:opacity-100 transition-opacity"><Volume2 size={20} /></button>
               <button className="opacity-60 hover:opacity-100 transition-opacity"><Settings size={20} /></button>
               <button className="opacity-60 hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
            </div>
          </div>
        </section>

        {/* Interaction Section (Tabs) */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-white/5 px-6">
            {[
              { id: 'questions', label: 'Dúvidas & J-New', icon: MessageSquare },
              { id: 'description', label: 'Descrição', icon: FileText },
              { id: 'materials', label: 'Materiais', icon: Download },
              { id: 'notes', label: 'Minhas Anotações', icon: Edit3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? (isIron ? 'text-iron-blue' : 'text-matrix-green') : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Chat Messages */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                            msg.role === 'bot' 
                              ? (isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green')
                              : 'bg-white/10 border-white/20 text-white'
                          }`}>
                            {msg.role === 'bot' ? <Bot size={16} /> : <span className="text-xs font-bold">{user?.name?.[0]}</span>}
                          </div>
                          <div className="space-y-1">
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                              msg.role === 'user'
                                ? (isIron ? 'bg-iron-blue/10 border border-iron-blue/20 text-white rounded-tr-none' : 'bg-matrix-green/10 border border-matrix-green/20 text-white rounded-tr-none')
                                : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                            }`}>
                              {msg.text && <p>{msg.text}</p>}
                              {msg.audioUrl && (
                                <div className="flex items-center gap-3 py-1">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIron ? 'bg-iron-blue/20' : 'bg-matrix-green/20'}`}>
                                    <Volume2 size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
                                  </div>
                                  <audio src={msg.audioUrl} controls className="h-8 w-40 sm:w-64 opacity-80" />
                                </div>
                              )}
                            </div>
                            <p className="text-[9px] uppercase opacity-30 tracking-widest text-right">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isIron ? 'bg-iron-blue/10 border-iron-blue/30 text-iron-blue' : 'bg-matrix-green/10 border-matrix-green/30 text-matrix-green'}`}>
                            <Bot size={16} />
                          </div>
                          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                          placeholder="Pergunte ao J-New ou envie um áudio..."
                          className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button 
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            className={`p-2 rounded-lg transition-all ${
                              isRecording 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : `hover:bg-white/5 ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`
                            }`}
                          >
                            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSendMessage(input)}
                        className={`p-3.5 rounded-xl transition-all ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-[9px] text-center mt-3 opacity-30 uppercase tracking-[0.2em]">
                      J-New está processando em tempo real. Pressione e segure o microfone para gravar.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 space-y-6 overflow-y-auto custom-scrollbar"
                >
                  <h2 className="text-2xl font-bold uppercase tracking-widest">Sobre esta aula</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {currentLesson.content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Tópicos abordados</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><ChevronRight size={12} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Estrutura de Dados em Tempo Real</li>
                        <li className="flex items-center gap-2"><ChevronRight size={12} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Integração com J-New</li>
                        <li className="flex items-center gap-2"><ChevronRight size={12} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> Otimização de Renderização</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Instrutor</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-matrix-green/20 flex items-center justify-center border border-matrix-green/40">
                          <Users size={20} className="text-matrix-green" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Arquiteto Master</p>
                          <p className="text-[10px] opacity-40 uppercase">Especialista em Realidades Digitais</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'materials' && (
                <motion.div
                  key="materials"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 space-y-4 overflow-y-auto custom-scrollbar h-full"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold uppercase tracking-widest">Arquivos de Apoio</h2>
                    {completedIds.length === lessons.length && (
                      <motion.button 
                        onClick={() => navigate(`/certificate/${courseId}`)}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                      >
                        <Trophy size={16} /> Gerar Certificado
                      </motion.button>
                    )}
                  </div>
                  {[
                    { title: "Guia de Implementação .PDF", size: "4.2 MB", type: "pdf" },
                    { title: "Código Fonte do Módulo .ZIP", size: "128 MB", type: "zip" },
                    { title: "Assets de Design .FIG", size: "15 MB", type: "design" },
                    { title: "Checklist de Segurança .DOCX", size: "1.1 MB", type: "doc" }
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                          <Download size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-white transition-colors">{file.title}</p>
                          <p className="text-[10px] opacity-40 uppercase">{file.size}</p>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                        <Share2 size={16} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 flex flex-col h-full overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold uppercase tracking-widest">Minhas Anotações</h2>
                    <button className="text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">Limpar Tudo</button>
                  </div>
                  <textarea 
                    placeholder="Escreva suas anotações sobre esta aula aqui... Suas notas são salvas automaticamente no Protocolo MasterCode."
                    className={`flex-1 w-full p-6 rounded-2xl resize-none text-sm leading-relaxed ${isIron ? 'ironman-input' : 'matrix-input'}`}
                  />
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-[9px] opacity-30 uppercase tracking-widest italic">Última sincronização: Agora mesmo</p>
                    <button className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isIron ? 'ironman-btn' : 'matrix-btn'}`}>Salvar Anotação</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Floating Action Button for J-New (Global) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
         <button className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${isIron ? 'bg-iron-red text-white' : 'bg-matrix-green text-black'}`}>
            <Terminal size={24} />
         </button>
      </div>
    </div>
  );
};
