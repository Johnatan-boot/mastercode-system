import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mic, Share2, Heart, MessageCircle, Play, Loader2 } from 'lucide-react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const FALLBACK_POSTS: Record<string, any> = {
  'fallback-1': {
    id: 'fallback-1',
    title: 'Criação de Design Systems - Frontend',
    content: `Um design system no contexto do frontend é uma abordagem estruturada e sistemática para projetar e desenvolver interfaces de usuário consistentes em um aplicativo ou site.

### Origem do Design System
Grandes empresas, como Google, Airbnb e Salesforce, começaram a desenvolver suas próprias soluções internas para lidar com a complexidade e a falta de consistência em seus projetos.

### Benefícios do Design System
- **Consistência Visual**: Garante uma aparência e sensação unificadas em todo o produto digital.
- **Eficiência no Desenvolvimento**: Promove a reutilização sistemática de componentes e códigos prontos.
- **Colaboração Eficiente**: Estreita as pontes de comunicação e colaboração direta entre designers e desenvolvedores frontend.
- **Manutenibilidade Simplificada**: Permite correções e atualizações globais efetuadas em apenas um componente base do repositório.`,
    excerpt: 'Um design system no contexto do frontend é uma abordagem estruturada e sistemática...',
    author: 'Johnatan Quenes',
    authorRole: 'Senior Developer',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1587560699334-bea5356ac8ce?auto=format&fit=crop&q=80&w=800',
    tags: ['Design Systems', 'Frontend'],
    likes: 124,
    comments: 18,
    readTime: '5 min de leitura',
    createdAt: '2026-06-21T18:00:00Z'
  },
  'fallback-2': {
    id: 'fallback-2',
    title: 'Micro Front-end: Web Components com Angular',
    content: `Implementando arquiteturas modernas de Micro Frontends utilizando a tecnologia Angular Elements para empacotar componentes da nossa aplicação como Web Components nativos executáveis.

### O que são Angular Elements?
Angular Elements é a especificação e o ecossistema nativo do time do Angular que permite transpilar e encapsular componentes inteligentes em Custom Elements nativos do navegador.

### Passo a Passo de Setup
Basta adicionar o pacote ao seu repositório Angular:

\`\`\`bash
ng add @angular/elements
\`\`\`

Isso permite modularizar e carregar partes independentes da sua aplicação, delegando ao framework a compilação de saídas agnósticas.`,
    excerpt: 'Essa é a segunda parte de uma série de artigos sobre Micro Front-ends utilizando Angular Elements...',
    author: 'Johnatan Quenes dos Santos',
    authorRole: 'Tech Lead',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
    tags: ['Micro Front-end', 'Angular'],
    likes: 85,
    comments: 12,
    readTime: '8 min de leitura',
    createdAt: '2026-06-18T18:00:00Z'
  },
  'fallback-3': {
    id: 'fallback-3',
    title: 'Web Components: Reutilização Nativa',
    content: `As especificações de Web Components constituem um conjunto de tecnologias nativas do W3C que nos permitem estender as capacidades nativas do HTML.

### Os Pilares do Padrão
1. **Custom Elements**: Conjunto de APIs JavaScript para definir novos tipos de tags HTML personalizadas.
2. **Shadow DOM**: Isolamento robusto de escopo CSS e árvore DOM, evitando vazamento de estilos de design.
3. **Templates HTML**: Elementos de marcação que permanecem invisíveis até que sejam instanciados programaticamente.`,
    excerpt: 'Web Components buscam resolver problemas de reutilização de código de modo nativo...',
    author: 'Johnatan Quenes',
    authorRole: 'Senior Developer',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    tags: ['Web Components', 'Frontend'],
    likes: 92,
    comments: 7,
    readTime: '6 min de leitura',
    createdAt: '2026-06-15T18:00:00Z'
  }
};

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
      
      // If it's a fallback static ID
      if (id.startsWith('fallback-')) {
        setPost(FALLBACK_POSTS[id] || null);
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, 'posts', id));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback if document not found in Firestore
          setPost(FALLBACK_POSTS[id] || null);
        }
      } catch (error) {
        console.warn("Firestore error getting post details, checking local fallback: ", error);
        setPost(FALLBACK_POSTS[id] || null);
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
  const videoId = currentPost.videoUrl ? getYouTubeId(currentPost.videoUrl) : null;

  const handleLike = async () => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'posts', id), {
        likes: increment(1)
      });
      setPost((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${id}`);
    }
  };

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
          {/* Video Player */}
          {videoId && (
            <div className="mb-12 aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Podcast Player Area - Optional */}
          {(currentPost.hasAudio || currentPost.type === 'podcast' || currentPost.audioUrl) && (
            <div className={`mb-12 p-6 rounded-xl flex items-center gap-6 border ${isIron ? 'bg-iron-blue/5 border-iron-blue/20' : 'bg-matrix-green/5 border-matrix-green/20'}`}>
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${isIron ? 'ironman-btn' : 'matrix-btn'}`}
               >
                 {isPlaying ? <Mic className="animate-pulse" size={24} /> : <Play className="ml-1" size={24} />}
               </button>
               <div className="flex-1">
                 <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Ouça a versão Podcast</h4>
                 {currentPost.audioUrl ? (
                   <audio 
                     src={currentPost.audioUrl} 
                     controls={isPlaying}
                     className="w-full mt-2 h-8"
                     onPlay={() => setIsPlaying(true)}
                     onPause={() => setIsPlaying(false)}
                   />
                 ) : (
                    <>
                      <p className="text-xs opacity-60 font-mono mb-3">00:00 / --:--</p>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full w-0 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                      </div>
                    </>
                 )}
               </div>
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-a:text-iron-blue prose-img:rounded-xl">
             <ReactMarkdown>{currentPost.content || currentPost.excerpt}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
            <div className="flex gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${isIron ? 'text-iron-blue hover:text-white' : 'text-matrix-green hover:text-white'}`}
              >
                <Heart size={16} fill={currentPost.likes > 0 ? "currentColor" : "none"} /> {currentPost.likes || 0} Likes
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
