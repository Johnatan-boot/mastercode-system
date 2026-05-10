import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Video, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export const NewPost: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isIron = theme === 'ironman';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('article');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para publicar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = {
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        author: user.displayName || user.email || 'Anônimo',
        authorId: user.uid,
        authorRole: user.role || 'Member',
        type,
        image,
        hasAudio: type === 'podcast',
        hasVideo: type === 'video',
        createdAt: new Date().toISOString(), // Fallback for list sorting if serverTimestamp is slow
        serverCreatedAt: serverTimestamp(),
        tags: ['#mastercode', `#${type}`],
        likes: 0,
        comments: 0
      };

      await addDoc(collection(db, 'posts'), newPost);
      navigate('/newsletter');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/newsletter')} 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">
            Novo Post
          </h1>
          <p className={`${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'} text-sm mt-1`}>
            Crie publicações ricas com texto, áudio e vídeo para a comunidade.
          </p>
        </div>
        <button 
           onClick={handleSave}
           disabled={isSubmitting || !title || !content}
           className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all ${isIron ? 'ironman-btn' : 'matrix-btn'} ${(isSubmitting || !title || !content) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isSubmitting ? 'Publicando...' : 'Publicar Post'}
        </button>
      </header>

      <motion.form 
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 md:p-8 rounded-2xl border space-y-8 ${isIron ? 'border-iron-blue/10 bg-iron-dark/30' : 'border-matrix-green/10 bg-matrix-black/30'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Título da Publicação</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Novo framework para o MasterCode..."
              className={`w-full px-4 py-3 rounded-xl bg-transparent border text-xl font-bold outline-none transition-all ${isIron ? 'border-iron-blue/30 focus:border-iron-blue text-white' : 'border-matrix-green/30 focus:border-matrix-green text-white'}`}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Tipo de Conteúdo</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-transparent border font-bold outline-none transition-all appearance-none ${isIron ? 'border-iron-blue/30 focus:border-iron-blue text-white bg-iron-dark' : 'border-matrix-green/30 focus:border-matrix-green text-white bg-matrix-black'}`}
            >
              <option value="article">Artigo / News</option>
              <option value="video">Vídeo Aula</option>
              <option value="podcast">Podcast</option>
              <option value="discussion">Discussão Comunidade</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Mídias de Capa e Conteúdo</label>
          <div className="flex flex-wrap gap-4">
             <button type="button" className={`flex-1 min-w-[140px] px-6 py-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${isIron ? 'border-iron-blue/30 hover:bg-iron-blue/5 text-iron-blue' : 'border-matrix-green/30 hover:bg-matrix-green/5 text-matrix-green'}`}>
                <ImageIcon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Imagem de Capa</span>
             </button>
             <button type="button" className={`flex-1 min-w-[140px] px-6 py-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${isIron ? 'border-iron-blue/30 hover:bg-iron-blue/5 text-iron-blue' : 'border-matrix-green/30 hover:bg-matrix-green/5 text-matrix-green'}`}>
                <Mic size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Anexar Podcast</span>
             </button>
             <button type="button" className={`flex-1 min-w-[140px] px-6 py-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${isIron ? 'border-iron-blue/30 hover:bg-iron-blue/5 text-iron-blue' : 'border-matrix-green/30 hover:bg-matrix-green/5 text-matrix-green'}`}>
                <Video size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Vídeo Aula / Vlog</span>
             </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <label className="block text-xs font-bold uppercase tracking-widest opacity-60">Conteúdo do Post (Markdown suportado)</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Escreva seu artigo aqui..."
            className={`w-full px-4 py-4 rounded-xl bg-transparent border outline-none transition-all resize-y ${isIron ? 'border-iron-blue/30 focus:border-iron-blue text-gray-300' : 'border-matrix-green/30 focus:border-matrix-green text-gray-300'}`}
          />
        </div>

      </motion.form>
    </div>
  );
};
