import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Terminal, Mic, StopCircle, Volume2 } from 'lucide-react';
import { getJNewResponse, getJNewAudioResponse } from '../services/ai';
import { useTheme } from '../hooks/useTheme';

export const JNewBot: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text?: string; audioUrl?: string }[]>([
    { role: 'bot', text: 'Bem-vindo ao Construtor, aluno. Eu sou J-New. Como posso auxiliar sua evolução hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string, audioUrl?: string) => {
    if (!text?.trim() && !audioUrl) return;

    const userMsg = { role: 'user' as const, text, audioUrl };
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      if (text && text.trim().startsWith('!inspect')) {
        const codeToInspect = text.replace('!inspect', '').trim();
        if (!codeToInspect) {
          setMessages(prev => [...prev, { role: 'bot', text: 'Eu preciso de um trecho de código ou link após o comando !inspect.' }]);
          return;
        }

        try {
          const token = localStorage.getItem('mastercode_token');
          const res = await fetch('/api/inspector/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ codeSnippet: codeToInspect })
          });
          
          if (!res.ok) throw new Error('Falha na request para o Core.');
          const data = await res.json();
          
          const reportText = `✅ **Análise Concluída pelo Motor Core**\n\n**Health Score:** ${data.score.totalScore}/100\n- Segurança: ${data.score.securityScore}\n- Code Quality: ${data.score.maintainabilityScore}\n\n**Principais Alertas:**\n${data.issues.map((iss: any) => `- [${iss.severity.toUpperCase()}] ${iss.description}`).join('\n')}`;
          
          setMessages(prev => [...prev, { role: 'bot', text: reportText }]);
        } catch(e) {
          setMessages(prev => [...prev, { role: 'bot', text: 'Ops, encontrei uma falha crítica ao processar a inspeção no Motor Core.' }]);
        }
        return;
      }

      const responseText = await getJNewResponse(text || "Analise este áudio.", theme);
      const botAudioUrl = await getJNewAudioResponse(responseText, theme);
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: responseText || "Erro na Matrix.",
        audioUrl: botAudioUrl || undefined
      }]);
    } catch (error) {
      console.error("Bot Error:", error);
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
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSend(undefined, audioUrl);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`mb-2 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-100px)] flex flex-col overflow-hidden shadow-2xl rounded-3xl ${
              isIron ? 'ironman-card border-iron-blue/20' : 'matrix-card border-matrix-green/20'
            }`}
          >
            <div className={`flex items-center justify-between border-b p-4 ${isIron ? 'bg-iron-blue/10 border-iron-blue/20' : 'bg-matrix-green/10 border-matrix-green/20'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isIron ? 'bg-iron-blue/20 border-iron-blue/40 text-iron-blue' : 'bg-matrix-green/20 border-matrix-green/40 text-matrix-green'}`}>
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Núcleo J-New</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                    <span className="text-[8px] uppercase opacity-50 font-bold tracking-widest">Sistemas Ativos</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? (isIron ? 'bg-iron-blue/10 border border-iron-blue/20 text-white rounded-tr-none' : 'bg-matrix-green/10 border border-matrix-green/20 text-white rounded-tr-none')
                      : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.text && <p>{msg.text}</p>}
                    {msg.audioUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <Volume2 size={12} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
                        <audio src={msg.audioUrl} controls className="h-6 w-32 opacity-70" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-1 h-1 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-1 h-1 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-1 h-1 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder="Inicie o protocolo..."
                    className={`w-full text-[11px] pr-10 ${isIron ? 'ironman-input' : 'matrix-input'}`}
                  />
                  <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : `hover:bg-white/5 ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`
                    }`}
                  >
                    {isRecording ? <StopCircle size={14} /> : <Mic size={14} />}
                  </button>
                </div>
                <button 
                  onClick={() => handleSend(input)}
                  className={`p-2.5 rounded-xl transition-all ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${isIron ? 'bg-iron-red text-white shadow-[0_0_20px_rgba(234,31,38,0.5)]' : 'bg-matrix-green text-black shadow-[0_0_20px_rgba(0,255,65,0.5)]'}`}
      >
        <Terminal size={28} />
      </motion.button>
    </div>
  );
};
