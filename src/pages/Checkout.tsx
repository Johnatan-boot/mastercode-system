import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Truck, ArrowLeft, CheckCircle, Lock, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';

export const Checkout: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isIron = theme === 'ironman';
  const product = location.state?.product;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-sm opacity-50 uppercase tracking-widest">Nenhum produto selecionado.</p>
        <button onClick={() => navigate('/store')} className={isIron ? 'ironman-btn' : 'matrix-btn'}>Voltar para Loja</button>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            items: [product],
            total: product.price,
            paymentMethod: 'credit_card'
          })
        });

        if (response.ok) {
          setIsSuccess(true);
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: isIron ? ['#ea1f26', '#ffcc00', '#00d4ff'] : ['#00FF41', '#003B00', '#ffffff']
          });
        }
      } catch (error) {
        console.error('Payment failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 py-12">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${isIron ? 'bg-iron-blue/10 text-iron-blue' : 'bg-matrix-green/10 text-matrix-green'}`}
        >
          <CheckCircle size={48} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold uppercase tracking-widest">Protocolo Concluído</h1>
          <p className="text-sm opacity-60 leading-relaxed">
            Seu pedido foi processado com sucesso. O acesso ao conteúdo ou rastreio do produto já está disponível em seu perfil.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className={isIron ? 'ironman-btn' : 'matrix-btn'}>Ir para Dashboard</button>
          <button onClick={() => navigate('/store')} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">Continuar Comprando</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-widest">Checkout Seguro</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handlePayment} className={`p-8 rounded-3xl border ${isIron ? 'ironman-card' : 'matrix-card'}`}>
            <div className="flex items-center gap-3 mb-8">
              <CreditCard size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Informações de Pagamento</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Nome no Cartão</label>
                <input type="text" required placeholder="NEO ANDERSON" className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Número do Cartão</label>
                <div className="relative">
                  <input type="text" required placeholder="**** **** **** ****" className={`w-full pl-12 ${isIron ? 'ironman-input' : 'matrix-input'}`} />
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Validade</label>
                  <input type="text" required placeholder="MM/YY" className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">CVV</label>
                  <input type="text" required placeholder="***" className={`w-full ${isIron ? 'ironman-input' : 'matrix-input'}`} />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                    isIron 
                    ? 'bg-iron-blue text-black hover:bg-iron-blue/80' 
                    : 'bg-matrix-green text-black hover:bg-matrix-green/80'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                      Processando...
                    </>
                  ) : (
                    <>Finalizar Pagamento (${product.price})</>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Segurança Stark', desc: 'Dados criptografados de ponta a ponta.' },
              { icon: Truck, title: 'Entrega Digital', desc: 'Acesso imediato após confirmação.' },
              { icon: Zap, title: 'Suporte Elite', desc: 'Time J-New disponível 24/7.' }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <item.icon size={20} className={isIron ? 'text-iron-blue' : 'text-matrix-green'} />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.title}</h4>
                <p className="text-[10px] opacity-40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className={isIron ? 'ironman-card' : 'matrix-card'}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Resumo do Pedido</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest line-clamp-2">{product.name}</h4>
                  <p className="text-[10px] opacity-40 uppercase">{product.category}</p>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                  <span>Taxas</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                  <span className="uppercase tracking-widest">Total</span>
                  <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>${product.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
