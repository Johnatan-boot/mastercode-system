import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag, Star, ArrowRight, Filter, Search } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export const Store: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isIron = theme === 'ironman';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-8 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
            <h1 className="text-3xl font-bold uppercase tracking-widest">MasterCode Store</h1>
          </div>
          <p className={`text-sm ${isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}`}>
            Equipamentos e protocolos de elite para sua evolução.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs ${isIron ? 'ironman-input' : 'matrix-input'}`}
            />
          </div>
          <button className={`p-2 rounded-xl border ${isIron ? 'border-iron-blue/20 bg-iron-blue/5' : 'border-matrix-green/20 bg-matrix-green/5'}`}>
            <Filter size={18} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isIron ? 'border-iron-blue' : 'border-matrix-green'}`} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              className={`group flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl ${isIron ? 'ironman-card hover:shadow-iron-blue/10' : 'matrix-card hover:shadow-matrix-green/10'}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${isIron ? 'border-iron-blue/30 text-iron-blue bg-iron-blue/10' : 'border-matrix-green/30 text-matrix-green bg-matrix-green/10'}`}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-sm font-bold uppercase leading-tight tracking-wide mb-2 line-clamp-2 h-10">{product.name}</h3>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-40 uppercase font-bold">Preço</span>
                    <span className={`text-lg font-bold ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
                      ${product.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout', { state: { product } })}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isIron 
                      ? 'bg-iron-blue text-black hover:bg-iron-blue/80' 
                      : 'bg-matrix-green text-black hover:bg-matrix-green/80'
                    }`}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cart Summary Floating Button (Mock) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 ${isIron ? 'bg-iron-red text-white' : 'bg-matrix-green text-black'}`}>
          <div className="relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">0</span>
          </div>
        </button>
      </div>
    </div>
  );
};
