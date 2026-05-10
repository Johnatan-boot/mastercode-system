import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const DB_FILE = path.join(process.cwd(), "db.json");

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    return {
      users: [
        { 
          id: 1, 
          email: 'neo@mastercode.io', 
          password: bcrypt.hashSync('redpill', 10), 
          name: 'Neo', 
          role: 'student',
          xp: 1250,
          level: 12,
          streak: 5,
          subscription: 'premium',
          status: 'active',
          lastActivity: new Date().toISOString()
        },
        { 
          id: 2, 
          email: 'architect@mastercode.io', 
          password: bcrypt.hashSync('matrix', 10), 
          name: 'The Architect', 
          role: 'admin',
          xp: 9999,
          level: 99,
          streak: 365,
          subscription: 'lifetime',
          status: 'active',
          lastActivity: new Date().toISOString()
        }
      ],
      courses: [
        { id: 'matrix-mastery', title: "Dominando a Matrix", description: "Aprenda a desconstruir realidades digitais com React e Microfrontends.", category: 'Frontend', image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", totalLessons: 12, duration: "18h" },
        { id: 'stark-protocols', title: "Protocolos Stark", description: "Segurança avançada e arquitetura de sistemas de alta performance.", category: 'Security', image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800", totalLessons: 8, duration: "12h" },
        { id: 'oracle-wisdom', title: "Sabedoria da Oráculo", description: "Integração profunda de Inteligência Artificial e LLMs em fluxos de trabalho.", category: 'AI', image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", totalLessons: 15, duration: "24h" }
      ],
      modules: [
        { id: 'mod-1', courseId: 'matrix-mastery', title: 'Introdução à Realidade Digital', order: 1 },
        { id: 'mod-2', courseId: 'matrix-mastery', title: 'Desconstruindo o DOM', order: 2 }
      ],
      lessons: [
        { id: 'les-1', moduleId: 'mod-1', title: 'O que é a Matrix?', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: 'Nesta aula vamos entender os fundamentos da Matrix.', duration: '15:00', order: 1 },
        { id: 'les-2', moduleId: 'mod-1', title: 'Escolhendo a Pílula Vermelha', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: 'A decisão que mudará sua vida como desenvolvedor.', duration: '20:00', order: 2 }
      ],
      userProgress: [],
      orders: [],
      posts: [
        { id: '1', userId: 2, userName: 'The Architect', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Architect', content: 'Bem-vindos à MasterCode. O código é a única verdade.', likes: 42, comments: 2, timestamp: new Date().toISOString(), tags: ['welcome', 'matrix'] }
      ],
      certificates: []
    };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const JWT_SECRET = process.env.JWT_SECRET || "matrix-reloaded-secret";

// Middleware to authenticate JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  const db = loadDB();
  const user = db.users.find((u: any) => u.id === req.user.userId);
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize DB
  let db = loadDB();

  const products = [
    { id: 1, name: 'Mastering React Microfrontends', price: 199, category: 'Course', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: 2, name: 'Stark Security Protocol Kit', price: 499, category: 'Bundle', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80' },
    { id: 3, name: 'J-New AI Assistant Pro', price: 29, category: 'Subscription', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' },
    { id: 4, name: 'Matrix Rain Mechanical Keyboard', price: 159, category: 'Hardware', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80' }
  ];

  // API Routes
  app.get("/api/courses", (req, res) => {
    res.json(db.courses);
  });

  app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    let modules = db.modules.filter((m: any) => m.courseId === courseId);
    if (modules.length === 0) {
      modules = [
        { id: `mod-1-${courseId}`, courseId, title: 'Módulo de Introdução', order: 1 }
      ];
    }
    res.json(modules);
  });

  app.get("/api/modules/:moduleId/lessons", (req, res) => {
    const { moduleId } = req.params;
    let lessons = db.lessons.filter((l: any) => l.moduleId === moduleId);
    if (lessons.length === 0) {
      lessons = [
        { id: `les-1-${moduleId}`, moduleId, title: 'Aula Inaugural', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: 'Aula gerada automaticamente.', duration: '15:00', order: 1 }
      ];
    }
    res.json(lessons);
  });

  app.post("/api/progress", authenticateToken, (req: any, res) => {
    const { lessonId } = req.body;
    const userId = req.user.userId;
    
    const progress = { userId, lessonId, completedAt: new Date().toISOString() };
    
    // Check if progress already exists
    const exists = db.userProgress.find((p: any) => p.userId === userId && p.lessonId === lessonId);
    if (!exists) {
      db.userProgress.push(progress);
      
      // Update Streak Logic
      const user = db.users.find((u: any) => u.id === userId);
      if (user) {
        const lastActivity = new Date(user.lastActivity || 0);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        } else if (user.streak === 0) {
          user.streak = 1;
        }
        user.lastActivity = today.toISOString();
      }
      
      saveDB(db);
    }
    res.json({ success: true });
  });

  app.get("/api/progress/:userId", authenticateToken, (req: any, res) => {
    const { userId } = req.params;
    const progress = db.userProgress.filter((p: any) => p.userId === parseInt(userId));
    res.json(progress);
  });

  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: Date.now(), 
      email, 
      password: hashedPassword, 
      name, 
      role: 'student',
      xp: 0,
      level: 1,
      streak: 0,
      subscription: 'free',
      status: 'active',
      lastActivity: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name, role: user.role, xp: user.xp, level: user.level, streak: user.streak, subscription: user.subscription, status: user.status } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name: user.name, role: user.role, xp: user.xp, level: user.level, streak: user.streak, subscription: user.subscription, status: user.status } });
  });

  app.post("/api/user/xp", authenticateToken, (req: any, res) => {
    const { amount } = req.body;
    const userId = req.user.userId;
    const user = db.users.find((u: any) => u.id === userId);
    if (user) {
      user.xp += amount;
      // Level logic: floor(sqrt(xp / 100)) + 1
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
      saveDB(db);
      return res.json({ xp: user.xp, level: user.level });
    }
    res.status(404).json({ error: "User not found" });
  });

  // Community Endpoints
  app.get("/api/community/posts", (req, res) => {
    res.json(db.posts || []);
  });

  app.post("/api/community/posts", authenticateToken, (req: any, res) => {
    const { content, tags } = req.body;
    const user = db.users.find((u: any) => u.id === req.user.userId);
    
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      content,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      tags: tags || []
    };

    if (!db.posts) db.posts = [];
    db.posts.unshift(newPost);
    saveDB(db);
    res.json(newPost);
  });

  app.post("/api/inspector/analyze", authenticateToken, async (req: any, res) => {
    try {
      const { InMemoryInspectionRepository } = await import('./src/core/ai-inspector/scanner/infra/database/InMemoryInspectionRepository');
      const { InMemoryReportRepository } = await import('./src/core/ai-inspector/reporting/infra/database/InMemoryReportRepository');
      const { GeminiScannerEngine } = await import('./src/core/ai-inspector/scanner/infra/ai/GeminiScannerEngine');
      const { RunInspectionUseCase } = await import('./src/core/ai-inspector/scanner/application/useCases/RunInspectionUseCase');
      
      const inspectionRepository = new InMemoryInspectionRepository();
      const reportRepository = new InMemoryReportRepository();
      const scannerEngine = new GeminiScannerEngine();
      const runInspectionUseCase = new RunInspectionUseCase(inspectionRepository, reportRepository, scannerEngine);

      const { codeSnippet } = req.body;
      const userId = String(req.user.userId);
      
      if (!codeSnippet) {
        return res.status(400).json({ error: "O trecho de código (codeSnippet) é obrigatório." });
      }

      const result = await runInspectionUseCase.execute({ userId, codeSnippet });
      res.json({
        inspectionDetails: result.inspection,
        score: {
          totalScore: result.report.totalScore,
          securityScore: result.report.securityScore,
          performanceScore: result.report.performanceScore,
          maintainabilityScore: result.report.maintainabilityScore,
          architectureScore: result.report.architectureScore
        },
        issues: result.issues
      });
    } catch (error: any) {
      console.error("[Inspector Error]", error.message || error);
      res.status(500).json({ error: "Falha na análise estrutural: " + (error.message || error) });
    }
  });

  // Certificate Endpoints
  app.get("/api/certificates", authenticateToken, (req: any, res) => {
    const certificates = (db.certificates || []).filter((c: any) => c.userId === req.user.userId);
    res.json(certificates);
  });

  app.post("/api/certificates/generate", authenticateToken, (req: any, res) => {
    const { courseId } = req.body;
    const user = db.users.find((u: any) => u.id === req.user.userId);
    const course = db.courses.find((c: any) => c.id === courseId);

    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const newCertificate = {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      courseTitle: course.title,
      issuedAt: new Date().toISOString(),
      code: Math.random().toString(36).substring(2, 15).toUpperCase()
    };

    if (!db.certificates) db.certificates = [];
    db.certificates.push(newCertificate);
    saveDB(db);
    res.json(newCertificate);
  });

  app.get("/api/dashboard/kpis", (req, res) => {
    // Mock KPIs
    res.json({
      courseEfficiency: 85,
      activeUsers: db.users.length,
      revenue: 45000 + db.orders.reduce((acc: any, o: any) => acc + o.total, 0),
      completionRate: 72
    });
  });

  // E-commerce & Payments
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/orders", (req, res) => {
    const { userId, items, total, paymentMethod } = req.body;
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      total,
      paymentMethod,
      status: 'completed',
      date: new Date().toISOString()
    };
    db.orders.push(order);
    saveDB(db);
    res.json({ success: true, order });
  });

  // Superadmin Endpoints
  app.get("/api/admin/stats", authenticateToken, isAdmin, (req: any, res) => {
    // Mock data for charts
    const monthlyRevenue = [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
      { name: 'Jul', value: 3490 },
    ];

    const userGrowth = [
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 250 },
      { name: 'Mar', value: 400 },
      { name: 'Apr', value: 600 },
      { name: 'May', value: 850 },
      { name: 'Jun', value: 1100 },
      { name: 'Jul', value: db.users.length },
    ];

    const rankings = [...db.users]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 5)
      .map(u => ({ name: u.name, xp: u.xp, level: u.level }));

    res.json({ monthlyRevenue, userGrowth, rankings });
  });

  app.get("/api/admin/users", authenticateToken, isAdmin, (req: any, res) => {
    res.json(db.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      subscription: u.subscription || 'none',
      status: u.status || 'inactive',
      xp: u.xp,
      level: u.level
    })));
  });

  app.post("/api/admin/courses", authenticateToken, isAdmin, (req: any, res) => {
    const course = { id: `course-${Date.now()}`, ...req.body };
    db.courses.push(course);
    saveDB(db);
    res.json(course);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MasterCode Server running on http://localhost:${PORT}`);
  });
}

startServer();
