import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  UserPlus, 
  Package, 
  Wrench, 
  FileText, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Shield,
  Briefcase,
  Users,
  BarChart3,
  Target,
  Box,
  CheckSquare,
  LifeBuoy,
  MessageSquare,
  Trophy,
  Flame,
  ShoppingCart,
  Store,
  ShieldAlert,
  Newspaper
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isIron = theme === 'ironman';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/newsletter', label: 'Newsletter', icon: Newspaper },
    { path: '/courses', label: 'Cursos', icon: BookOpen },
    { path: '/community', label: 'Comunidade', icon: MessageSquare },
    { path: '/profile', label: 'Meu Perfil', icon: UserCircle },
    { path: '/projects', label: 'Portfólio', icon: Briefcase },
    { path: '/projects-mgmt', label: 'Gestão Projetos', icon: CheckSquare },
    { path: '/inspector', label: 'AI Inspector Core', icon: Zap },
    { path: '/hr', label: 'Gestão R.H', icon: Users },
    { path: '/financial', label: 'Financeiro', icon: BarChart3 },
    { path: '/sales', label: 'Vendas & CRM', icon: Target },
    { path: '/inventory', label: 'Estoque', icon: Box },
    { path: '/support', label: 'Suporte', icon: LifeBuoy },
    { path: '/store', label: 'Loja', icon: ShoppingCart },
    { path: '/enrollment', label: 'Inscrições', icon: UserPlus },
    { path: '/products', label: 'Produtos', icon: Package },
    { path: '/services', label: 'Serviços', icon: Wrench },
    { path: '/budgets', label: 'Orçamentos', icon: FileText },
  ];

  if (user?.role === 'teacher' || user?.role === 'admin') {
    menuItems.push({ path: '/teacher', label: 'Área do Arquiteto', icon: Shield });
  }

  if (user?.role === 'admin') {
    menuItems.push({ path: '/admin', label: 'Superadmin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`fixed left-0 top-0 h-full z-50 w-64 border-r backdrop-blur-xl transition-colors duration-500 ${
              isIron 
                ? 'bg-iron-red/5 border-iron-blue/20' 
                : 'bg-black/80 border-matrix-green/20'
            }`}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isIron ? 'bg-iron-blue/20' : 'bg-matrix-green/20'}`}>
                    <Zap className={isIron ? 'text-iron-blue' : 'text-matrix-green'} size={24} />
                  </div>
                  <span className="text-xl font-bold uppercase tracking-tighter">MasterCode</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 opacity-50 hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                        isActive 
                          ? (isIron ? 'bg-iron-blue/20 text-iron-blue border border-iron-blue/30' : 'bg-matrix-green/20 text-matrix-green border border-matrix-green/30')
                          : (isIron ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5')
                      }`}
                    >
                      <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                      <span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className={`mt-auto pt-6 border-t ${isIron ? 'border-iron-blue/10' : 'border-matrix-green/10'}`}>
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                  <UserCircle size={24} className="opacity-50 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold uppercase truncate">{user?.name}</span>
                    <span className="text-[10px] opacity-40 uppercase">{user?.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group"
                >
                  <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm font-medium uppercase tracking-widest">Sair</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        {/* Navbar */}
        <header className={`sticky top-0 z-40 h-16 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-6 transition-colors duration-500 ${
          isIron ? 'bg-black/40 border-iron-blue/10' : 'bg-black/40 border-matrix-green/10'
        }`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              data-testid="sidebar-toggle"
              className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${isIron ? 'text-iron-blue' : 'text-matrix-green'}`}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-6">
              {/* XP Bar */}
              <div className="flex flex-col gap-1 w-48">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className={isIron ? 'text-iron-blue' : 'text-matrix-green'}>Nível {user?.level || 1}</span>
                  <span className="opacity-50">{user?.xp || 0} / {(user?.level || 1) * 1000} XP</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((user?.xp % 1000) / 1000) * 100}%` }}
                    className={`h-full ${isIron ? 'bg-iron-blue shadow-[0_0_10px_rgba(0,212,255,0.5)]' : 'bg-matrix-green shadow-[0_0_10px_rgba(0,255,65,0.5)]'}`}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <Flame size={14} className="text-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{user?.streak || 0} Dias</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest border-white/10">
              <Trophy size={12} className={isIron ? 'text-iron-gold' : 'text-matrix-green'} />
              <span>Rank #124</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isIron ? 'bg-iron-blue' : 'bg-matrix-green'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 hidden xs:block">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
