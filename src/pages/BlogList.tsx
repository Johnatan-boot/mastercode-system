import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Video, Mic, ArrowRight, PlusCircle, Search, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export const BlogList: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className={`animate-spin ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`} size={48} />
        <p className="text-xs font-mono uppercase tracking-widest opacity-50">Carregando conteúdos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest flex items-center gap-3">
            <Newspaper className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
            Newsletter & Insights
          </h1>
          <p className={`${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'} text-sm mt-1`}>
            Acompanhe as novidades, artigos e podcasts da nossa comunidade.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input 
              type="text" 
              placeholder="Buscar conteúdos..." 
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs ${isIron ? 'ironman-input' : 'matrix-input'}`}
            />
          </div>
          <button 
            onClick={() => navigate('/newsletter/new')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
          >
            <PlusCircle size={16} /> Novo Post
          </button>
        </div>
      </header>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col rounded-xl overflow-hidden border transition-all hover:-translate-y-1 ${isIron ? 'border-iron-blue/10 bg-iron-dark/30 hover:border-iron-blue/30' : 'border-matrix-green/10 bg-matrix-black/30 hover:border-matrix-green/30'}`}
          >
            <div className="h-48 relative bg-gray-900">
               <div className={`absolute inset-0 z-10 ${isIron ? 'bg-iron-blue/20 mix-blend-overlay' : 'bg-matrix-green/20 mix-blend-overlay'}`} />
               <img src={post.image} alt={post.title} className="w-full h-full object-cover filter grayscale opacity-40" />
               <div className="absolute top-4 right-4 z-20 flex gap-2">
                 {post.hasAudio && <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><Mic size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /></div>}
                 {post.hasVideo && <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><Video size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} /></div>}
               </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={12} className="opacity-40" />
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-mono">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3 leading-tight">{post.title}</h3>
              <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                 <span className="text-xs font-mono opacity-60">{post.readTime}</span>
                 <button 
                  onClick={() => navigate(`/newsletter/${post.id}`)}
                  className={`text-xs font-bold uppercase flex items-center gap-1 transition-colors ${isIron ? 'text-iron-blue hover:text-white' : 'text-matrix-green hover:text-white'}`}
                 >
                   Ler Mais <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
