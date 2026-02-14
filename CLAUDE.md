# FWG ERP Process Navigator

## Project Overview
Interactive web application for Fluid Water Group's ERP implementation programme. Provides visual business process flows, role-based navigation, cross-process interconnection mapping, and document status tracking across the Sage 200/Sicon Manufacturing implementation.

## Architecture
- **Backend**: Node.js + Express + better-sqlite3
- **Frontend**: Single-page HTML served by Express (vanilla JS, no build step)
- **Database**: SQLite with local volume on Railway
- **Hosting**: Railway (single service serving both API and static files)

## Project Structure
```
fwg-erp-navigator/
├── CLAUDE.md              # This file
├── package.json           # Dependencies and scripts
├── railway.toml           # Railway deployment config
├── server.js              # Express server entry point
├── src/
│   ├── routes/
│   │   └── api.js         # REST API routes
│   ├── middleware/
│   │   └── auth.js        # Simple password auth
│   └── db/
│       ├── init.js        # Database initialisation & schema
│       └── seed.js        # Seed data (processes, phases, docs)
├── public/
│   └── index.html         # Full frontend SPA (self-contained)
└── client/
    └── (development reference only)
```

## Key Commands
```bash
npm install              # Install dependencies
npm run dev              # Start dev server with auto-reload (port 3000)
npm start                # Start production server
npm run db:reset         # Reset database to seed state
```

## Deployment to Railway

### First-time setup:
```bash
# 1. Install Railway CLI if not already installed
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Create a volume for SQLite persistence
#    In Railway dashboard: select service → Settings → Volumes → Mount Volume
#    Mount path: /data
#    Or via CLI:
railway volume add --mount /data

# 5. Set environment variables
railway variables set NODE_ENV=production
railway variables set AUTH_PASSWORD=<choose-a-password>
railway variables set DB_PATH=/data/fwg-navigator.db
railway variables set PORT=3000

# 6. Deploy
railway up

# 7. Generate a public domain
railway domain
```

### Subsequent deploys:
```bash
railway up
```

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment |
| DB_PATH | ./data/fwg-navigator.db | SQLite database path |
| AUTH_PASSWORD | fwg2026 | Simple shared password for admin access |

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/processes | No | All process data (static) |
| GET | /api/documents | No | All documents with current status |
| PUT | /api/documents/:code/status | Yes | Update document status |
| PUT | /api/documents/:code/notes | Yes | Update document notes |
| GET | /api/stats | No | Summary statistics |
| GET | /api/stats/:processCode | No | Per-process statistics |
| POST | /api/reset | Yes | Reset all statuses (with confirmation) |
| GET | /api/export/csv | No | Export CSV of all document statuses |
| POST | /api/auth/login | No | Authenticate with password |
| GET | /api/auth/check | No | Check if current session is authenticated |

## Authentication Model
Simple shared password approach (suitable for internal team tool):
- Staff can browse all process flows, roles, and connections without authentication
- Changing document status or notes requires password authentication
- Password is set via AUTH_PASSWORD environment variable
- Session stored in httpOnly cookie

## Database Schema
```sql
CREATE TABLE documents (
  code TEXT PRIMARY KEY,        -- e.g. 'O2C-001'
  process_code TEXT NOT NULL,   -- e.g. 'O2C'
  phase_label TEXT NOT NULL,    -- e.g. 'Customer Setup'
  system TEXT NOT NULL,         -- e.g. 'Sage 200 SL'
  status TEXT DEFAULT 'not-started',  -- not-started|in-progress|review|completed
  notes TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now')),
  updated_by TEXT DEFAULT NULL
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_code TEXT NOT NULL,
  field TEXT NOT NULL,           -- 'status' or 'notes'
  old_value TEXT,
  new_value TEXT,
  changed_at TEXT DEFAULT (datetime('now')),
  changed_by TEXT DEFAULT 'admin'
);
```

## Important Notes
- The frontend (public/index.html) is a complete self-contained SPA — all process data, flow diagrams, role views, connections map, and status dashboard are embedded
- The API provides persistence and multi-user state — the frontend falls back to localStorage if the API is unavailable
- SQLite on Railway requires a volume mount at /data for persistence across deploys
- The seed script populates all 48 process documents + 6 governance documents on first run
