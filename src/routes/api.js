const express = require('express');
const { getDb } = require('../db/init');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ─── READ OPERATIONS (no auth required) ────────────────────

// Get all documents with current status
router.get('/documents', (req, res) => {
  const db = getDb();
  const docs = db.prepare('SELECT * FROM documents ORDER BY process_code, code').all();
  res.json(docs);
});

// Get single document
router.get('/documents/:code', (req, res) => {
  const db = getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE code = ?').get(req.params.code);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

// Get summary statistics
router.get('/stats', (req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
      SUM(CASE WHEN status = 'not-started' THEN 1 ELSE 0 END) as not_started
    FROM documents
  `).get();
  stats.pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  res.json(stats);
});

// Get per-process statistics
router.get('/stats/:processCode', (req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
      SUM(CASE WHEN status = 'not-started' THEN 1 ELSE 0 END) as not_started
    FROM documents WHERE process_code = ?
  `).get(req.params.processCode);
  if (!stats || stats.total === 0) return res.status(404).json({ error: 'Process not found' });
  stats.pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  res.json(stats);
});

// Export CSV
router.get('/export/csv', (req, res) => {
  const db = getDb();
  const docs = db.prepare('SELECT * FROM documents ORDER BY process_code, code').all();

  let csv = 'Code,Process,Process Name,Phase,System,Status,Notes,Updated At,Updated By\n';
  docs.forEach(d => {
    csv += `"${d.code}","${d.process_code}","${d.process_name}","${d.phase_label}","${d.system}","${d.status}","${(d.notes || '').replace(/"/g, '""')}","${d.updated_at || ''}","${d.updated_by || ''}"\n`;
  });

  const date = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=FWG_Process_Status_${date}.csv`);
  res.send(csv);
});

// Get audit log for a document
router.get('/documents/:code/audit', (req, res) => {
  const db = getDb();
  const log = db.prepare('SELECT * FROM audit_log WHERE doc_code = ? ORDER BY changed_at DESC LIMIT 50').all(req.params.code);
  res.json(log);
});

// ─── WRITE OPERATIONS (auth required) ──────────────────────

// Update document status
router.put('/documents/:code/status', requireAuth, (req, res) => {
  const db = getDb();
  const { status } = req.body;
  const validStatuses = ['not-started', 'in-progress', 'review', 'completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const doc = db.prepare('SELECT * FROM documents WHERE code = ?').get(req.params.code);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const oldStatus = doc.status;
  if (oldStatus === status) return res.json(doc);

  const update = db.transaction(() => {
    db.prepare('UPDATE documents SET status = ?, updated_at = datetime(\'now\'), updated_by = \'admin\' WHERE code = ?')
      .run(status, req.params.code);

    db.prepare('INSERT INTO audit_log (doc_code, field, old_value, new_value) VALUES (?, ?, ?, ?)')
      .run(req.params.code, 'status', oldStatus, status);
  });

  update();

  const updated = db.prepare('SELECT * FROM documents WHERE code = ?').get(req.params.code);
  res.json(updated);
});

// Update document notes
router.put('/documents/:code/notes', requireAuth, (req, res) => {
  const db = getDb();
  const { notes } = req.body;

  if (typeof notes !== 'string') {
    return res.status(400).json({ error: 'Notes must be a string' });
  }

  const doc = db.prepare('SELECT * FROM documents WHERE code = ?').get(req.params.code);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const oldNotes = doc.notes;

  const update = db.transaction(() => {
    db.prepare('UPDATE documents SET notes = ?, updated_at = datetime(\'now\'), updated_by = \'admin\' WHERE code = ?')
      .run(notes, req.params.code);

    db.prepare('INSERT INTO audit_log (doc_code, field, old_value, new_value) VALUES (?, ?, ?, ?)')
      .run(req.params.code, 'notes', oldNotes, notes);
  });

  update();

  const updated = db.prepare('SELECT * FROM documents WHERE code = ?').get(req.params.code);
  res.json(updated);
});

// Bulk status update
router.put('/documents/bulk/status', requireAuth, (req, res) => {
  const db = getDb();
  const { codes, status } = req.body;
  const validStatuses = ['not-started', 'in-progress', 'review', 'completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (!Array.isArray(codes) || codes.length === 0) {
    return res.status(400).json({ error: 'Codes must be a non-empty array' });
  }

  const bulkUpdate = db.transaction(() => {
    const stmt = db.prepare('UPDATE documents SET status = ?, updated_at = datetime(\'now\'), updated_by = \'admin\' WHERE code = ?');
    const auditStmt = db.prepare('INSERT INTO audit_log (doc_code, field, old_value, new_value) VALUES (?, ?, ?, ?)');

    for (const code of codes) {
      const doc = db.prepare('SELECT status FROM documents WHERE code = ?').get(code);
      if (doc && doc.status !== status) {
        stmt.run(status, code);
        auditStmt.run(code, 'status', doc.status, status);
      }
    }
  });

  bulkUpdate();
  res.json({ success: true, updated: codes.length });
});

// Reset all statuses
router.post('/reset', requireAuth, (req, res) => {
  const db = getDb();
  const { confirm } = req.body;

  if (confirm !== 'RESET') {
    return res.status(400).json({ error: 'Send { confirm: "RESET" } to confirm' });
  }

  const reset = db.transaction(() => {
    db.prepare('INSERT INTO audit_log (doc_code, field, old_value, new_value) SELECT code, \'status\', status, \'not-started\' FROM documents WHERE status != \'not-started\'').run();
    db.prepare('UPDATE documents SET status = \'not-started\', notes = \'\', updated_at = datetime(\'now\'), updated_by = \'admin\'').run();
  });

  reset();
  res.json({ success: true, message: 'All documents reset to not-started' });
});

module.exports = router;
