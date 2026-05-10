import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2, MessageCircle, TrendingUp, Users, Search, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Community: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isIron = theme === 'ironman';
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">Comunidade</h1>
          <p className={`${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'} text-sm`}>
            Conecte-se, compartilhe e evolua com outros construtores.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input 
              type="text" 
              placeholder="Buscar discussões..." 
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs ${isIron ? 'ironman-input' : 'matrix-input'}`}
            />
          </div>
          <button 
            onClick={() => navigate('/newsletter/new')}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
          >
            Novo Post
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className={`animate-spin ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`} size={48} />
              <p className="text-xs font-mono uppercase tracking-widest opacity-50">Sincronizando feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 opacity-50 uppercase tracking-widest text-xs">
              Nenhuma discussão encontrada.
            </div>
          ) : (
            posts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isIron ? 'ironman-card' : 'matrix-card'} cursor-pointer hover:-translate-y-1 transition-transform`}
                onClick={() => navigate(`/newsletter/${post.id}`)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold shrink-0 ${isIron ? 'border-iron-blue bg-iron-blue/10 text-iron-blue' : 'border-matrix-green bg-matrix-green/10 text-matrix-green'}`}>
                    {post.author ? post.author[0] : 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm uppercase tracking-widest">{post.author}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${isIron ? 'border-iron-blue/30 text-iron-blue bg-iron-blue/5' : 'border-matrix-green/30 text-matrix-green bg-matrix-green/5'}`}>
                        {post.authorRole || 'Member'}
                      </span>
                      <span className="text-[10px] opacity-30 ml-auto">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <h3 className="text-xl font-bold mt-3 uppercase tracking-wider">{post.title}</h3>
                    
                    {post.image && (
                      <div className="mt-4 rounded-xl overflow-hidden h-48 relative border border-white/5">
                        <div className={`absolute inset-0 z-10 ${isIron ? 'bg-iron-blue/10' : 'bg-matrix-green/10'} mix-blend-overlay`} />
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover filter grayscale opacity-60" />
                      </div>
                    )}

                    <p className="text-sm text-gray-300 mt-4 leading-relaxed line-clamp-3">
                      {post.excerpt || post.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags && post.tags.map((tag: string) => (
                        <span key={tag} className={`text-[10px] font-mono ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity">
                    <Heart size={16} /> {post.likes || 0}
                  </button>
                  <button className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity">
                    <MessageCircle size={16} /> {post.comments || 0}
                  </button>
                  <button className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity ml-auto">
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
              Tópicos em Alta
            </h3>
            <div className="space-y-3">
              {['#react', '#typescript', '#ai', '#web3', '#security'].map(tag => (
                <div key={tag} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">{tag}</span>
                  <span className="text-[10px] opacity-30">1.2k posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users size={14} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
              Construtores Online
            </h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${isIron ? 'border-iron-blue/30 bg-iron-blue/10' : 'border-matrix-green/30 bg-matrix-green/10'}`}>
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-[10px] opacity-40 mt-4 uppercase text-center">E mais 1.240 membros online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
