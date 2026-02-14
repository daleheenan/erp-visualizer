const { getDb } = require('./init');

const SEED_DATA = [
  // O2C — Order to Cash
  { code: "O2C-001", process_code: "O2C", process_name: "Order to Cash", phase_label: "Customer Setup", system: "Sage 200 SL" },
  { code: "O2C-002", process_code: "O2C", process_name: "Order to Cash", phase_label: "Sales Quotation", system: "Salesforce CRM" },
  { code: "O2C-003", process_code: "O2C", process_name: "Order to Cash", phase_label: "Sales Order", system: "Sage 200 SOP" },
  { code: "O2C-004", process_code: "O2C", process_name: "Order to Cash", phase_label: "Sales Order", system: "Sage 200 SOP" },
  { code: "O2C-005", process_code: "O2C", process_name: "Order to Cash", phase_label: "Dispatch & Delivery", system: "Logia WMS" },
  { code: "O2C-006", process_code: "O2C", process_name: "Order to Cash", phase_label: "Invoicing", system: "Sage 200 SL" },
  { code: "O2C-007", process_code: "O2C", process_name: "Order to Cash", phase_label: "Invoicing", system: "Sage 200 SL" },
  { code: "O2C-008", process_code: "O2C", process_name: "Order to Cash", phase_label: "Credit Control", system: "Sage 200 SL" },
  { code: "O2C-009", process_code: "O2C", process_name: "Order to Cash", phase_label: "Credit Control", system: "Sage 200 SL" },
  { code: "O2C-010", process_code: "O2C", process_name: "Order to Cash", phase_label: "Cash Collection", system: "Sage 200 CB" },
  { code: "O2C-011", process_code: "O2C", process_name: "Order to Cash", phase_label: "Cash Collection", system: "Sage 200 CB" },
  { code: "O2C-012", process_code: "O2C", process_name: "Order to Cash", phase_label: "Bad Debt Write-Off", system: "Sage 200 NL" },

  // S2P — Source to Pay
  { code: "S2P-001", process_code: "S2P", process_name: "Source to Pay", phase_label: "Supplier Setup", system: "Sage 200 PL / Tipalti" },
  { code: "S2P-002", process_code: "S2P", process_name: "Source to Pay", phase_label: "Purchase Requisition", system: "Sage 200 POP" },
  { code: "S2P-003", process_code: "S2P", process_name: "Source to Pay", phase_label: "Purchase Requisition", system: "Sage 200 POP" },
  { code: "S2P-004", process_code: "S2P", process_name: "Source to Pay", phase_label: "Purchase Order", system: "Sage 200 POP" },
  { code: "S2P-005", process_code: "S2P", process_name: "Source to Pay", phase_label: "Purchase Order", system: "Sage 200 POP" },
  { code: "S2P-006", process_code: "S2P", process_name: "Source to Pay", phase_label: "Goods Receipt", system: "Logia WMS / Sage 200" },
  { code: "S2P-007", process_code: "S2P", process_name: "Source to Pay", phase_label: "Invoice Matching", system: "Sage 200 PL" },
  { code: "S2P-008", process_code: "S2P", process_name: "Source to Pay", phase_label: "Supplier Returns", system: "Sage 200 POP" },
  { code: "S2P-009", process_code: "S2P", process_name: "Source to Pay", phase_label: "Payment Processing", system: "Tipalti / Sage 200 CB" },

  // R2R — Record to Report
  { code: "FIN-001", process_code: "R2R", process_name: "Record to Report", phase_label: "Chart of Accounts", system: "Sage 200 NL" },
  { code: "FIN-002", process_code: "R2R", process_name: "Record to Report", phase_label: "Cost Centre / Dept", system: "Sage 200 NL" },
  { code: "FIN-003", process_code: "R2R", process_name: "Record to Report", phase_label: "Cost Centre / Dept", system: "Sage 200 NL" },
  { code: "R2R-001", process_code: "R2R", process_name: "Record to Report", phase_label: "Journal Posting", system: "Sage 200 NL" },
  { code: "R2R-002", process_code: "R2R", process_name: "Record to Report", phase_label: "Journal Posting", system: "Sage 200 NL" },
  { code: "R2R-003", process_code: "R2R", process_name: "Record to Report", phase_label: "Intercompany", system: "Sage 200 NL" },
  { code: "R2R-004", process_code: "R2R", process_name: "Record to Report", phase_label: "Intercompany", system: "Sage 200 NL" },
  { code: "R2R-005", process_code: "R2R", process_name: "Record to Report", phase_label: "Bank Reconciliation", system: "Sage 200 CB" },
  { code: "R2R-006", process_code: "R2R", process_name: "Record to Report", phase_label: "Month-End Close", system: "Sage 200 NL" },
  { code: "R2R-007", process_code: "R2R", process_name: "Record to Report", phase_label: "Month-End Close", system: "Sage 200 NL" },
  { code: "R2R-008", process_code: "R2R", process_name: "Record to Report", phase_label: "Financial Reporting", system: "Sage 200 NL" },
  { code: "R2R-009", process_code: "R2R", process_name: "Record to Report", phase_label: "Financial Reporting", system: "Sage 200 NL" },
  { code: "R2R-010", process_code: "R2R", process_name: "Record to Report", phase_label: "Period Close", system: "Sage 200 NL" },

  // A2D — Acquire to Dispose
  { code: "A2D-001", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Asset Policy", system: "Sicon Fixed Assets" },
  { code: "A2D-002", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Asset Acquisition", system: "Sicon Fixed Assets" },
  { code: "A2D-003", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Asset Acquisition", system: "Sicon Fixed Assets" },
  { code: "A2D-004", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Depreciation", system: "Sicon Fixed Assets" },
  { code: "A2D-005", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Asset Maintenance", system: "Sicon Fixed Assets" },
  { code: "A2D-006", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Asset Maintenance", system: "Sicon Fixed Assets" },
  { code: "A2D-007", process_code: "A2D", process_name: "Acquire to Dispose", phase_label: "Disposal", system: "Sicon Fixed Assets" },

  // H2R — Hire to Retire
  { code: "H2R-REC-001", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Recruitment", system: "ADP-FWG" },
  { code: "H2R-ONB-001", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Onboarding", system: "ADP-FWG" },
  { code: "H2R-001", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Expense Management", system: "ADP-FWG / Sage 200" },
  { code: "H2R-002", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Expense Management", system: "ADP-FWG / Sage 200" },
  { code: "H2R-003", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Payroll Processing", system: "ADP-FWG / Sage 200 NL" },
  { code: "H2R-004", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Payroll Processing", system: "ADP-FWG / Sage 200 NL" },
  { code: "H2R-OFF-001", process_code: "H2R", process_name: "Hire to Retire", phase_label: "Offboarding", system: "ADP-FWG" },

  // P2D — Project to Delivery
  { code: "P2D-001", process_code: "P2D", process_name: "Project to Delivery", phase_label: "Project Setup", system: "Sage 200 / Joblogic" },
  { code: "P2D-002", process_code: "P2D", process_name: "Project to Delivery", phase_label: "Cost Capture", system: "Sage 200 NL / Joblogic" },
  { code: "P2D-003", process_code: "P2D", process_name: "Project to Delivery", phase_label: "Milestone Billing", system: "Sage 200 SL" },

  // GOV — Governance
  { code: "GOV-001", process_code: "GOV", process_name: "Governance", phase_label: "Segregation of Duties Matrix", system: "Cross-cutting", doc_type: "governance" },
  { code: "GOV-002", process_code: "GOV", process_name: "Governance", phase_label: "Approval Authority Matrix", system: "Cross-cutting", doc_type: "governance" },
  { code: "GOV-003", process_code: "GOV", process_name: "Governance", phase_label: "Training Needs Analysis", system: "Cross-cutting", doc_type: "governance" },
  { code: "GOV-004", process_code: "GOV", process_name: "Governance", phase_label: "Month-End Close Checklist", system: "Cross-cutting", doc_type: "governance" },
  { code: "GOV-005", process_code: "GOV", process_name: "Governance", phase_label: "KPI Dashboard Specification", system: "Cross-cutting", doc_type: "governance" },
  { code: "GOV-006", process_code: "GOV", process_name: "Governance", phase_label: "Quick Reference Guides", system: "Cross-cutting", doc_type: "governance" },
];

function seed(reset = false) {
  const db = getDb();

  if (reset) {
    db.exec('DELETE FROM audit_log');
    db.exec('DELETE FROM documents');
    console.log('Database cleared.');
  }

  const existing = db.prepare('SELECT COUNT(*) as count FROM documents').get();
  if (existing.count > 0 && !reset) {
    console.log(`Database already has ${existing.count} documents. Use --reset to re-seed.`);
    return;
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO documents (code, process_code, process_name, phase_label, system, doc_type)
    VALUES (@code, @process_code, @process_name, @phase_label, @system, @doc_type)
  `);

  const insertMany = db.transaction((docs) => {
    for (const doc of docs) {
      insert.run({
        code: doc.code,
        process_code: doc.process_code,
        process_name: doc.process_name,
        phase_label: doc.phase_label,
        system: doc.system,
        doc_type: doc.doc_type || 'process',
      });
    }
  });

  insertMany(SEED_DATA);
  console.log(`Seeded ${SEED_DATA.length} documents.`);
}

// Run directly if called as script
if (require.main === module) {
  const reset = process.argv.includes('--reset');
  seed(reset);
  process.exit(0);
}

module.exports = { seed, SEED_DATA };
