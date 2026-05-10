import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mic, Share2, Heart, MessageCircle, Play, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';

export const BlogPost: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'posts', id));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className={`animate-spin ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`} size={48} />
        <p className="text-xs font-mono uppercase tracking-widest opacity-50">Carregando artigo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Artigo não encontrado</h2>
        <button 
          onClick={() => navigate('/newsletter')}
          className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
        >
          Voltar para Newsletter
        </button>
      </div>
    );
  }

  const currentPost = post;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/newsletter')} 
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={16} /> Voltar para Newsletter
      </button>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border ${isIron ? 'border-iron-blue/10 bg-iron-dark/30' : 'border-matrix-green/10 bg-matrix-black/30'}`}
      >
        <div className="h-64 md:h-80 relative bg-gray-900 overflow-hidden">
          <div className={`absolute inset-0 z-10 ${isIron ? 'bg-iron-blue/20 mix-blend-overlay' : 'bg-matrix-green/20 mix-blend-overlay'}`} />
          {currentPost.image && (
            <img 
              src={currentPost.image} 
              alt="Post Header" 
              className="w-full h-full object-cover filter grayscale opacity-40" 
            />
          )}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex gap-3 mb-4">
              {currentPost.tags && currentPost.tags.map((tag: string) => (
               <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}>
                 {tag}
               </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider leading-tight mb-4 text-white">
              {currentPost.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono opacity-60 text-white">
              <span>{currentPost.author}</span>
              <span>•</span>
              <span>{currentPost.createdAt ? new Date(currentPost.createdAt).toLocaleDateString() : 'Recent'}</span>
              <span>•</span>
              <span>{currentPost.readTime || '5 min read'}</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Podcast Player Area - Optional */}
          {(currentPost.hasAudio || currentPost.type === 'podcast') && (
            <div className={`mb-12 p-6 rounded-xl flex items-center gap-6 border ${isIron ? 'bg-iron-blue/5 border-iron-blue/20' : 'bg-matrix-green/5 border-matrix-green/20'}`}>
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
               >
                 {isPlaying ? <Mic className="animate-pulse" size={24} /> : <Play className="ml-1" size={24} />}
               </button>
               <div className="flex-1">
                 <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Ouça a versão Podcast</h4>
                 <p className="text-xs opacity-60 font-mono mb-3">00:00 / --:--</p>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className={`h-full w-0 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                 </div>
               </div>
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-a:text-iron-blue prose-img:rounded-xl">
             <ReactMarkdown>{currentPost.content || currentPost.excerpt}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
            <div className="flex gap-4">
              <button className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${isIron ? 'text-iron-blue hover:text-white' : 'text-matrix-green hover:text-white'}`}>
                <Heart size={16} /> {currentPost.likes || 0} Likes
              </button>
              <button className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${isIron ? 'text-iron-blue hover:text-white' : 'text-matrix-green hover:text-white'}`}>
                <MessageCircle size={16} /> {currentPost.comments || 0} Comentários
              </button>
            </div>
            <button className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isIron ? 'border-iron-blue/30 text-iron-blue hover:bg-iron-blue hover:text-black' : 'border-matrix-green/30 text-matrix-green hover:bg-matrix-green hover:text-black'}`}>
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </motion.article>

      {/* Recommended Content */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
          <Play className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /> 
          Conteúdo Recomendado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 1, title: 'Como iniciar no Next.js', img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800', time: '15:20' },
            { id: 2, title: 'Tailwind CSS Avançado', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', time: '22:15' },
            { id: 3, title: 'Construindo Layouts com Framer Motion', img: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800', time: '10:05' }
          ].map(video => (
            <div key={video.id} className={`rounded-xl overflow-hidden border cursor-pointer group ${isIron ? 'border-iron-blue/10 bg-iron-dark/30 hover:border-iron-blue/30' : 'border-matrix-green/10 bg-matrix-black/30 hover:border-matrix-green/30'}`}>
              <div className="h-40 relative">
                <div className={`absolute inset-0 z-10 transition-opacity ${isIron ? 'bg-iron-blue/20 group-hover:bg-iron-blue/10' : 'bg-matrix-green/20 group-hover:bg-matrix-green/10'} mix-blend-overlay`} />
                <img src={video.img} alt={video.title} className="w-full h-full object-cover filter grayscale opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                   <div className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 ${isIron ? 'border-iron-blue/50 text-iron-blue bg-black/50' : 'border-matrix-green/50 text-matrix-green bg-black/50'}`}>
                     <Play className="ml-1" size={20} />
                   </div>
                </div>
                <div className="absolute bottom-2 right-2 z-20 bg-black/80 px-2 py-1 rounded text-[10px] font-mono">
                  {video.time}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold uppercase tracking-wider text-sm line-clamp-2">{video.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
