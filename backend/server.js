import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import { connectDB } from './config/db.js';
import { initIO } from './config/socket.js';

// Import Routes
import emailRoutes from './routes/emailRoute.js';
import adminRoutes from './routes/adminRoute.js';
import userRoutes from './routes/userRoute.js';
import chitPlanRoutes from './routes/chitPlanRoute.js';
import statsRoutes from './routes/statsRoute.js';
import transactionRoutes from './routes/transactionsRoute.js';
import auctionRoutes from './routes/auctionRoute.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Allowed origins - Define them immediately for use in middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://universalsexports.com",
  "https://www.universalsexports.com",
  "https://universalsexports.com",
  "https://admin.universalsexports.com"
];

// ------------------------------------------------------------------
// 1. 🚀 EARLY MIDDLEWARE (CORS & Body Parsing) - FIX FOR PREFLIGHT
// ------------------------------------------------------------------

// Express CORS Configuration (Must be early to handle preflight OPTIONS)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser requests (e.g., Postman, server-to-server)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true); 
    } else {
      // Log the disallowed origin for debugging purposes
      console.error("CORS Blocked Origin:", origin);
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests explicitly, MUST come after app.use(cors)
app.options('*', cors()); 

// Body parser - required to parse JSON requests
app.use(express.json()); 

// Static files
app.use('/uploads', express.static('uploads'));

// ------------------------------------------------------------------
// 2. 🔌 SOCKET.IO SETUP & MIDDLEWARE
// ------------------------------------------------------------------

const io = initIO(server); 

// Attach io to all requests for controllers
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Socket rooms & subscriptions
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join specific chit plan room
  socket.on('joinPlanRoom', (planId) => {
    if (!planId) return;
    socket.join(planId);
    console.log(`Socket ${socket.id} joined plan room: ${planId}`);
  });

  // Join auction room
  socket.on('auction:join', (auctionId) => {
    if (!auctionId) return;
    socket.join(`auction:${auctionId}`);
    console.log(`Socket ${socket.id} joined auction room: auction:${auctionId}`);
  });

  socket.on('auction:leave', (auctionId) => {
    if (!auctionId) return;
    socket.leave(`auction:${auctionId}`);
    console.log(`Socket ${socket.id} left auction room: auction:${auctionId}`);
  });

  // Subscribe to all auctions for live updates
  socket.on('auction:subscribeAll', () => {
    socket.join('auctions:all');
    console.log(`Socket ${socket.id} subscribed to all auctions`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// ------------------------------------------------------------------
// 3. 🗺️ API ROUTES
// ------------------------------------------------------------------

app.use('/api', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chit-plans', chitPlanRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auctions', auctionRoutes);

app.get('/', (_req, res) => res.send('API Working'));

// ------------------------------------------------------------------
// 4. 🚀 START SERVER (Final Fix: Use the 'server' object)
// ------------------------------------------------------------------

const PORT = process.env.PORT || 6000; 

// START THE SERVER USING THE HTTP SERVER OBJECT (`server`), NOT `app.listen()`
server.listen(PORT, '0.0.0.0', () => { 
  console.log(`Server running on port ${PORT}`);
});
