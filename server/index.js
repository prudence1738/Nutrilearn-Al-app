// server/index.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const mealplanRoutes = require('./routes/mealplan');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// connect DB (MONGO_URI in env)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nutrilearn';
connectDB(MONGO_URI).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/mealplan', mealplanRoutes);

// simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: new Date().toISOString() }));

// Serve client in production (if you build client into server/public or client/dist)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  // If client build exists, serve index.html; otherwise return JSON for unknown routes
  const indexFile = path.join(clientBuildPath, 'index.html');
  if (require('fs').existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Nutrilearn server listening on port ${PORT}`));
