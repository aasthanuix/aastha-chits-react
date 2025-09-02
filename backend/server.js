import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import { connectDB } from './config/db.js';
import { initIO } from './config/socket.js';

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


const PORT = process.env.PORT || 6000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = initIO(server); // Socket.IO instance

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

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://user.aasthageooads.com",
  "https://admin.aasthageooads.com",
  "https://aasthageooads.com"
];

// Express CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options('*', cors()); // handle preflight requests


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chit-plans', chitPlanRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auctions', auctionRoutes); // handles public & admin

app.get('/', (_req, res) => res.send('API Working'));

// Start server
// const PORT = process.env.PORT || 4000;

// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
