import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Filter, Cpu, MemoryStick, HardDrive, Laptop, Monitor, MousePointer2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: string[];
  icon: any;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Processador Intel Core i9-14900K',
    category: 'Processadores',
    price: 3499.00,
    image: 'https://picsum.photos/seed/cpu/400/300',
    specs: ['24 Cores', '32 Threads', '6.0 GHz Turbo'],
    icon: Cpu
  },
  {
    id: '2',
    name: 'Memória RAM DDR5 32GB (2x16GB) 6000MHz',
    category: 'Memórias',
    price: 1299.00,
    image: 'https://picsum.photos/seed/ram/400/300',
    specs: ['CL30', 'RGB', 'Dual Channel'],
    icon: MemoryStick
  },
  {
    id: '3',
    name: 'SSD NVMe Gen5 2TB',
    category: 'Armazenamento',
    price: 1899.00,
    image: 'https://picsum.photos/seed/ssd/400/300',
    specs: ['12.000 MB/s Leitura', '10.000 MB/s Escrita'],
    icon: HardDrive
  },
  {
    id: '4',
    name: 'Notebook Gamer Stark Edition',
    category: 'Notebooks',
    price: 12499.00,
    image: 'https://picsum.photos/seed/laptop/400/300',
    specs: ['RTX 4080', 'i9-13980HX', '32GB RAM'],
    icon: Laptop
  },
  {
    id: '5',
    name: 'Estação de Trabalho Zion v2',
    category: 'Computadores',
    price: 8999.00,
    image: 'https://picsum.photos/seed/pc/400/300',
    specs: ['RTX 4070 Ti', 'Ryzen 9 7900X', '64GB RAM'],
    icon: Monitor
  },
  {
    id: '6',
    name: 'Pendrive Criptografado 256GB',
    category: 'Acessórios',
    price: 499.00,
    image: 'https://picsum.photos/seed/usb/400/300',
    specs: ['USB 3.2 Gen 2', 'Criptografia AES-256'],
    icon: MousePointer2
  }
];

export const Products: React.FC = () => {
  const { theme } = useTheme();
  const isIron = theme === 'ironman';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Arsenal Tecnológico</h1>
        <p className={isIron ? 'text-iron-blue/60' : 'text-matrix-green/60'}>Equipamentos de alta performance para a elite digital.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`} size={20} />
          <input 
            type="text" 
            placeholder="Buscar hardware..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 ${isIron ? 'ironman-input' : 'matrix-input'}`}
          />
        </div>
        <button className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
          isIron ? 'border-iron-blue/30 hover:bg-iron-blue/10 text-iron-blue' : 'border-matrix-green/30 hover:bg-matrix-green/10 text-matrix-green'
        }`}>
          <Filter size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const Icon = product.icon;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group overflow-hidden ${isIron ? 'ironman-card' : 'matrix-card'}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-4 right-4 p-2 rounded-lg backdrop-blur-md border ${
                  isIron ? 'bg-black/60 border-iron-blue/30 text-iron-blue' : 'bg-black/60 border-matrix-green/30 text-matrix-green'
                }`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}>
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-tight mt-1">{product.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] opacity-60 uppercase">
                      <div className={`w-1 h-1 rounded-full ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
                      {spec}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xl font-bold tracking-tighter">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isIron ? 'ironman-btn' : 'matrix-btn'
                  }`}>
                    <ShoppingCart size={16} />
                    <span className="text-[10px] font-bold uppercase">Adicionar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
