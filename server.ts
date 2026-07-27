import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock database
  const users: any[] = [
    {
      uid: 'admin-1',
      fullName: 'Admin User',
      mobile: '9999999999',
      password: await bcrypt.hash('123456', 10),
      role: 'admin'
    },
    {
      uid: 'customer-1',
      fullName: 'John Doe',
      mobile: '1234567890',
      password: await bcrypt.hash('123456', 10),
      role: 'customer'
    },
    {
      uid: 'customer-2',
      fullName: 'Shubham Yadav',
      mobile: '9876543210',
      password: await bcrypt.hash('123456', 10),
      role: 'customer'
    },
    {
      uid: 'seller-1',
      fullName: 'Shop Owner',
      mobile: '8888888888',
      password: await bcrypt.hash('123456', 10),
      role: 'seller'
    },
    {
      uid: 'rider-1',
      fullName: 'Delivery Rider',
      mobile: '7777777777',
      password: await bcrypt.hash('123456', 10),
      role: 'rider'
    }
  ];
  const products: any[] = [];
  const shops: any[] = [];

  // API Routes
  const apiRouter = express.Router();

  // Health check
  apiRouter.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      usersCount: users.length,
      time: new Date().toISOString()
    });
  });

  // Auth Routes
  apiRouter.post('/auth/register', async (req, res) => {
    const { fullName, mobile, password, role } = req.body;
    console.log(`[AUTH] Register attempt for mobile: ${mobile}`);
    
    const existingUser = users.find(u => u.mobile === mobile);
    if (existingUser) {
      console.log(`[AUTH] Registration failed: User ${mobile} already exists`);
      return res.status(400).json({ detail: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      uid: Math.random().toString(36).substring(7),
      fullName,
      mobile,
      password: hashedPassword,
      role: role || 'customer'
    };

    users.push(newUser);
    console.log(`[AUTH] Registration successful: ${mobile} (UID: ${newUser.uid})`);
    res.status(201).json({ message: 'User registered successfully' });
  });

  apiRouter.post('/auth/login', async (req, res) => {
    const { mobile, password } = req.body;
    console.log(`[AUTH] Login attempt for mobile: ${mobile}`);
    // console.log(`[AUTH] Received password: ${password}`); // Debug only
    
    if (!mobile || !password) {
      console.log('[AUTH] Login failed: Missing mobile or password');
      return res.status(400).json({ detail: 'Mobile and password are required' });
    }

    let user = users.find(u => u.mobile === mobile);
    if (!user) {
      console.log(`[AUTH] User ${mobile} not found. Seamlessly registering user on-the-fly.`);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        uid: Math.random().toString(36).substring(7),
        fullName: mobile === '9876543210' ? 'Shubham Yadav' : 'Guest User',
        mobile,
        password: hashedPassword,
        role: 'customer'
      };
      users.push(user);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`[AUTH] Login failed: Invalid password for ${mobile}`);
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    const token = jwt.sign({ uid: user.uid, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const { password: _, ...userWithoutPassword } = user;
    console.log(`[AUTH] Login successful: ${mobile}`);
    res.json({
      token,
      user: userWithoutPassword
    });
  });

  apiRouter.get('/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ detail: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.uid === decoded.uid);
      if (!user) {
        return res.status(404).json({ detail: 'User not found' });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(401).json({ detail: 'Invalid token' });
    }
  });

  // Product Routes
  apiRouter.get('/products', (req, res) => {
    res.json(products);
  });

  apiRouter.post('/products', (req, res) => {
    const product = { id: Math.random().toString(36).substring(7), ...req.body };
    products.push(product);
    res.status(201).json(product);
  });

  // Shop Routes
  apiRouter.get('/shops', (req, res) => {
    res.json(shops);
  });

  apiRouter.post('/shops', (req, res) => {
    const shop = { id: Math.random().toString(36).substring(7), ...req.body };
    shops.push(shop);
    res.status(201).json(shop);
  });

  // Download Flutter Code ZIP
  app.get('/download-flutter-code', (req, res) => {
    const zipPath = path.join(process.cwd(), 'public', 'flutter_code.zip');
    res.download(zipPath, 'apna_mandla_flutter_code.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).send('File not ready yet.');
      }
    });
  });

  // Download Complete Project ZIP
  app.get('/download-full-project', (req, res) => {
    const zipPath = path.join(process.cwd(), 'public', 'full_project.zip');
    res.download(zipPath, 'apna_mandla_full_project.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).send('File not ready yet.');
      }
    });
  });

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
