# FWG ERP Process Navigator — Claude Code Deployment Prompt

Paste this into Claude Code to deploy the application.

---

## PROMPT TO PASTE INTO CLAUDE CODE:

```
I have a Node.js project in this directory called "fwg-erp-navigator". It's an Express server with SQLite (better-sqlite3) that serves a single-page HTML application for tracking ERP process documents.

Please help me deploy this to Railway. Here's what I need you to do:

1. First, read the CLAUDE.md file to understand the project structure
2. Run `npm install` to install dependencies
3. Test locally with `npm run dev` to verify the server starts and the database seeds correctly
4. Verify the API works by testing:
   - GET http://localhost:3000/api/stats (should return document counts)
   - GET http://localhost:3000/api/documents (should return 54 documents)
   - Open http://localhost:3000 in the browser to verify the frontend renders
5. Set up Railway deployment:
   - Run `railway login` (I'll authenticate in the browser)
   - Run `railway init` to create a new project (name it "fwg-erp-navigator")
   - Create a volume for database persistence: mount path should be /data
   - Set these environment variables:
     - NODE_ENV=production
     - AUTH_PASSWORD=<I'll tell you the password>
     - DB_PATH=/data/fwg-navigator.db
     - PORT=3000
   - Deploy with `railway up`
   - Generate a public domain with `railway domain`
6. After deployment, verify the live URL works and the API returns data

The project has a railway.toml already configured. The SQLite database auto-seeds on first startup.
```

---

## ALTERNATIVE: GitHub + Railway Auto-Deploy

If you prefer CI/CD from GitHub:

```
I have a Node.js project called "fwg-erp-navigator". Please help me:

1. Initialise a git repo in this directory
2. Create a new GitHub repository (private) called "fwg-erp-navigator"
3. Push the code to GitHub
4. Connect the GitHub repo to Railway for automatic deploys:
   - Login to Railway: `railway login`
   - Create project: `railway init`
   - Link GitHub repo in Railway dashboard (Settings → Source)
   - Add a volume mounted at /data 
   - Set environment variables: NODE_ENV=production, AUTH_PASSWORD=<password>, DB_PATH=/data/fwg-navigator.db, PORT=3000
   - Generate a public domain

This way every git push will auto-deploy to Railway.
```

---

## POST-DEPLOYMENT CHECKLIST

After Railway deployment is live:

- [ ] Visit the public URL — frontend should load with all 6 process flows
- [ ] Click "Login to edit" → enter password → verify authentication works
- [ ] Change a document status → refresh page → verify it persists (database working)
- [ ] Click "Export CSV" → verify download works
- [ ] Open Status Dashboard tab → verify all 54 documents show with progress bars
- [ ] Share the URL with the FWG project team
- [ ] (Optional) Set up a custom domain in Railway settings if desired
