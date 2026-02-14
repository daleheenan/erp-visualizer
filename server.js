const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { seed } = require('./src/db/seed');
const { login, checkAuth, logout } = require('./src/middleware/auth');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ──────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// Rate limiting for write operations
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Too many requests, please slow down' },
});

// ─── AUTH ROUTES ────────────────────────────────────────────
app.post('/api/auth/login', writeLimiter, login);
app.get('/api/auth/check', checkAuth);
app.post('/api/auth/logout', logout);

// ─── API ROUTES ─────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── STATIC FILES ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── STARTUP ────────────────────────────────────────────────
// Seed database on first run
seed(false);

app.listen(PORT, () => {
  console.log(`FWG ERP Process Navigator running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_PATH || './data/fwg-navigator.db'}`);
});
