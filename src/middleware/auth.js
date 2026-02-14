const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'fwg2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fwg-nav-session-' + Date.now();

// Simple session store (in-memory, survives restarts via cookie)
const sessions = new Map();

function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function login(req, res) {
  const { password } = req.body;
  if (password === AUTH_PASSWORD) {
    const token = generateToken();
    sessions.set(token, { authenticated: true, createdAt: Date.now() });
    res.cookie('fwg_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid password' });
}

function checkAuth(req, res) {
  const token = req.cookies?.fwg_session;
  const session = token ? sessions.get(token) : null;
  return res.json({ authenticated: !!session?.authenticated });
}

function logout(req, res) {
  const token = req.cookies?.fwg_session;
  if (token) sessions.delete(token);
  res.clearCookie('fwg_session');
  return res.json({ success: true });
}

// Middleware: require auth for write operations
function requireAuth(req, res, next) {
  const token = req.cookies?.fwg_session;
  const session = token ? sessions.get(token) : null;
  if (session?.authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required. Please log in.' });
}

// Cleanup expired sessions every hour
setInterval(() => {
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (now - session.createdAt > maxAge) sessions.delete(token);
  }
}, 60 * 60 * 1000);

module.exports = { login, checkAuth, logout, requireAuth };
