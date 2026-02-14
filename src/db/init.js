const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/fwg-navigator.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      code TEXT PRIMARY KEY,
      process_code TEXT NOT NULL,
      process_name TEXT NOT NULL,
      phase_label TEXT NOT NULL,
      system TEXT NOT NULL,
      doc_type TEXT DEFAULT 'process',
      status TEXT DEFAULT 'not-started' CHECK(status IN ('not-started','in-progress','review','completed')),
      notes TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      updated_by TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_code TEXT NOT NULL,
      field TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at TEXT DEFAULT (datetime('now')),
      changed_by TEXT DEFAULT 'admin'
    );

    CREATE INDEX IF NOT EXISTS idx_documents_process ON documents(process_code);
    CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
    CREATE INDEX IF NOT EXISTS idx_audit_doc ON audit_log(doc_code);
  `);
}

module.exports = { getDb, DB_PATH };
