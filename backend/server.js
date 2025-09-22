import express from 'express';
import cors from 'cors';
import entryRoutes from './routes/entryRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Loan Management Backend API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/entries', entryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customers', customerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Entry API: http://localhost:${PORT}/api/entries`);
  console.log(`👥 Staff API: http://localhost:${PORT}/api/staff`);
  console.log(`🧑‍💼 Customer API: http://localhost:${PORT}/api/customers`);
});
