import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { seedDatabase } from './lib/seed';
import { MatrixRain } from './components/MatrixRain';
import { JNewBot } from './components/JNewBot';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CourseArea } from './pages/CourseArea';
import { TeacherArea } from './pages/TeacherArea';
import { Products } from './pages/Products';
import { Services } from './pages/Services';
import { Budgets } from './pages/Budgets';
import { Enrollment } from './pages/Enrollment';
import { Projects } from './pages/Projects';
import { VirtualRoom } from './pages/VirtualRoom';
import { HRManagement } from './pages/HRManagement';
import { FinancialManagement } from './pages/FinancialManagement';
import { SalesCRM } from './pages/SalesCRM';
import { InventoryManagement } from './pages/InventoryManagement';
import { ProjectManagement } from './pages/ProjectManagement';
import { SupportTickets } from './pages/SupportTickets';
import { Inspector } from './pages/Inspector';
import { Community } from './pages/Community';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { NewPost } from './pages/NewPost';
import { Profile } from './pages/Profile';
import { Store } from './pages/Store';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Certificate } from './pages/Certificate';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { Sun, Moon, Zap, Volume2, VolumeX } from 'lucide-react';

import confetti from 'canvas-confetti';

function AppContent() {
  const { theme, toggleTheme, isMuted, toggleMute } = useTheme();

  useEffect(() => {
    seedDatabase();
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    if (theme === 'matrix') { // Switching to Ironman
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea1f26', '#ffcc00', '#00d4ff']
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {theme === 'matrix' ? <MatrixRain /> : <div className="ironman-hud" />}
      <div className={`scanline ${theme === 'ironman' ? 'scanline-iron' : ''}`} />
      
      {/* Theme & Sound Controls */}
      <div className="fixed top-6 right-6 z-[60] flex items-center gap-2">
        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Ativar som" : "Desativar som"}
          className={`p-2 rounded-full border transition-all duration-300 bg-black/80 backdrop-blur-md ${
            isMuted ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}
          style={{ 
            borderColor: theme === 'matrix' ? '#00FF41' : '#00D4FF',
            color: theme === 'matrix' ? '#00FF41' : '#00D4FF',
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Theme Toggle Capsule */}
        <button 
          onClick={handleThemeToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 bg-black/80 backdrop-blur-md group"
          style={{ 
            borderColor: theme === 'matrix' ? '#00FF41' : '#00D4FF',
            color: theme === 'matrix' ? '#00FF41' : '#00D4FF',
            boxShadow: theme === 'matrix' ? '0 0 15px rgba(0,255,65,0.3)' : '0 0 15px rgba(0,212,255,0.3)'
          }}
        >
          <div className="flex items-center gap-2">
            {theme === 'matrix' ? <Zap size={16} /> : <Sun size={16} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {theme === 'matrix' ? 'Protocolo Matrix' : 'Protocolo Stark'}
            </span>
          </div>
        </button>
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Layout><CourseArea /></Layout></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
        <Route path="/newsletter" element={<ProtectedRoute><Layout><BlogList /></Layout></ProtectedRoute>} />
        <Route path="/newsletter/new" element={<ProtectedRoute><Layout><NewPost /></Layout></ProtectedRoute>} />
        <Route path="/newsletter/:id" element={<ProtectedRoute><Layout><BlogPost /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
        <Route path="/enrollment" element={<ProtectedRoute><Layout><Enrollment /></Layout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Layout><Budgets /></Layout></ProtectedRoute>} />
        <Route path="/hr" element={<ProtectedRoute><Layout><HRManagement /></Layout></ProtectedRoute>} />
        <Route path="/financial" element={<ProtectedRoute><Layout><FinancialManagement /></Layout></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><Layout><SalesCRM /></Layout></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Layout><InventoryManagement /></Layout></ProtectedRoute>} />
        <Route path="/projects-mgmt" element={<ProtectedRoute><Layout><ProjectManagement /></Layout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Layout><SupportTickets /></Layout></ProtectedRoute>} />
        <Route path="/store" element={<ProtectedRoute><Layout><Store /></Layout></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute role="teacher"><Layout><TeacherArea /></Layout></ProtectedRoute>} />
        <Route path="/inspector" element={<ProtectedRoute><Layout><Inspector /></Layout></ProtectedRoute>} />
        
        {/* Virtual Room - No Layout as it has its own sidebar */}
        <Route path="/room/:id" element={<ProtectedRoute><VirtualRoom /></ProtectedRoute>} />
        <Route path="/certificate/:courseId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>

      <JNewBot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">INICIALIZANDO CONSTRUTOR...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}
