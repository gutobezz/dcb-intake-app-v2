# DCB Intake — Product Spec & Developer Handoff

**Company:** D&C Builders (Design & Create Builders) — Los Angeles, CA  
**License:** #1116111  
**Live URL:** https://dcbintake.pages.dev  
**Status:** Working MVP, needs proper rebuild with production stack

---

## What This Product Is

D&C Builders is a residential construction and remodeling company. Their sales team meets with homeowners, assesses the property, and then manually writes up proposals — currently in Word or PDF. That process takes hours, proposals look inconsistent, and revisions from partner companies like Realm (a real estate renovation platform) require manual edits back and forth.

**DCB Intake is a web application that automates the entire sales pipeline from first client touch to signed contract:**

1. A sales advisor fills in a structured intake form (client info, property details, scope of work)
2. The app instantly generates a professional branded PDF proposal
3. The proposal goes into a CRM pipeline (Active → Sent → Follow Up → Won / Lost)
4. The client signs digitally via DocuSign
5. Revisions from Realm or other partners get parsed by AI and applied automatically
6. Change orders are created and sent via DocuSign when scope changes post-contract

---

## Where This Started

The first version was a Python script (`DCB-Proposal-Generator/generate_proposal.py`) that took a JSON config file and generated a PDF using WeasyPrint. It worked but required running commands in a terminal — not practical for a sales team.

The current version is a browser-based React app (single HTML file, ~5,800 lines of JSX) that runs entirely in the browser with no backend. It was built iteratively and works, but has architectural limitations that need to be addressed for a production product.

---

## Current Tech Stack (What Exists Today)

| Layer | Current | Problem |
|---|---|---|
| Frontend | Single-file React (Babel standalone, no build step) | 600KB JSX file, no TypeScript, hard to maintain |
| Deployment | Cloudflare Pages (static zip upload) | Manual deploy, no CI/CD |
| Database | Browser localStorage | Data lives on one device, no multi-user, no backup |
| PDF Generation | n8n webhook → PDFShift (external SaaS) | Costs per PDF, no offline, limited control |
| Auth | None | Anyone with the URL can access it |
| AI | Direct Anthropic API calls from browser | API key in browser localStorage |
| Contracts | DocuSign via MCP | Working |
| CRM | localStorage with export/import | No shared pipeline between team members |

---

## What the App Does — Feature by Feature

### 1. Client Intake Form (7 tabs)

**Tab 0 — Client**
- First/last name, email, phone
- Referral source (Google, Yelp, Realm, Referral, etc.) — configurable list
- Assigned advisor — configurable list (David, Chris, Kayley, Ben, Dylan, Kerr)
- Lead source → advisor auto-mapping
- Calendar import — reads Google Calendar events via Gmail MCP, auto-fills client data from meeting notes

**Tab 1 — Property**
- Address, property type (SFR, Condo, Multi-Family, Commercial)
- Year built, sq footage, bedrooms, bathrooms
- Stories, HOA (Yes/No)
- Has plans / RTI (Ready to Issue permits)
- Floor plan upload — accepts PDF or image, sends to Claude API for AI analysis:
  - Extracts: room count, window count, door count, sq footage estimate, bedroom/bathroom count
  - Wall analysis: identifies load-bearing walls, removal candidates
  - Construction notes: plumbing locations, electrical panel, HVAC, structural concerns
  - Auto-fill suggestions: pre-fills form fields based on analysis

**Tab 2 — Scope**
- Project type selection (20+ types): Kitchen Remodel, Bathroom Remodel, ADU/JADU, Garage Conversion, 1st Story Addition, 2nd Story Addition, Flooring, Roofing, Windows & Doors, etc.
- Each project type expands to show its specific scope items (e.g., Kitchen Remodel has: Design & Plans, Demo, Framing, Electrical, Plumbing, HVAC, Cabinets, Countertops, Backsplash, Flooring, Appliances, Paint, Lighting, etc.)
- Each scope item has a detailed description that appears in the proposal
- Descriptions are editable per-proposal
- Finish selections (e.g., "LVP / Tile / Hardwood") and quantities per item
- Notes per scope item
- Advanced trade-based scope (foundations, framing, roofing, etc.) — collapsible
- Additional work upsells: HVAC, House Rewire, Panel Upgrade, Recessed Lighting, Solar, EV Charger, etc.
- Custom scope items can be added
- Multiple instances of the same scope type (e.g., 2 bathrooms)

**Tab 3 — Details**
- Budget range (internal, not shown on proposal)
- Desired start date, financing type
- Project price (shown on proposal cover)
- Allowances — line items with description and amount (e.g., "Tile installation: Up to $5/sqft")
- Payment schedule — milestone-based with percentage or dollar amounts
- Job assignment — team members on this job
- Lead score (🔥 Hot / 🟠 Warm / 🔵 Cool / 🧊 Cold)
- Follow-up reminders toggle
- Client priorities (Price, Communication, Timeline, Quality, etc.)
- Additional notes and tags
- Proposal options: Table of Contents toggle, font scale
- Design page editor — custom sections that appear in the proposal
- General notes editor — legal/operational notes that appear at the end

**Tab 4 — Review**
- Full summary of all entered data
- Generate Proposal button → opens proposal preview
- Send Contract via DocuSign — sends construction contract with:
  - Contract price, down payment, start date, completion date
  - Client info auto-filled
  - Goes via DocuSign production account

**Tab 5 — Library (CRM)**
- Save current proposal to library
- Revision history — every change tracked with version number
- Pipeline view:
  - Status filter: All / Active / Sent / Follow Up / Won ✅ / Lost ✗
  - Pipeline total (sum of Active proposals)
  - Won total
  - Search by client name, address, price
- Per-proposal actions: Load, History, Bids, Won, Lost
- Export all proposals to JSON backup
- Import JSON backup
- Import from PDF — upload an old proposal PDF, Claude extracts all data, loads into form
- Bid Analysis — competitor bid comparison tool
- Revisions tab:
  - Quick add/remove scope types
  - Update price
  - **AI Revision Assistant** — paste email or text from Realm/advisor → Claude parses the request → shows suggested changes (add scope, remove scope, update price) → one-click apply → auto-saves as new revision
- Restore Last Draft

**Tab 6 — Change Orders**
- Select client from signed contracts
- Increased or Decreased change order type
- Line items with description, quantity, unit price
- Scope description text
- Timeline extension (days)
- Send via DocuSign (draft or direct send)
- Import scope from current intake
- Quick-fill from current client

---

### 2. Proposal Generation

When the user clicks "Generate Proposal" on the Review tab, the app renders a complete branded proposal document in HTML:

**Page structure:**
1. **Cover page** — dark background, D&C Builders logo, "PROJECT PROPOSAL", client name (large), address, scope of work list, project price, date
2. **Table of Contents** (optional toggle) — lists all sections with page numbers
3. **Design & Plans page** — editable sections describing design process, architectural, engineering, mood boards
4. **Scope pages** — one section per selected project type:
   - Header with page number
   - Section title (e.g., "Kitchen Remodel")
   - Each selected scope item with title + bullet description
   - Items flow naturally, no artificial breaks — `page-break-inside: avoid` keeps each item's title + bullets together
5. **Allowances & Payment Schedule page** — table of allowances + milestone payment table
6. **General Notes & Conditions page** — 31 standard legal/operational notes
7. **Thank you page** — dark background, website URL

The user can:
- Toggle sections on/off per proposal
- Edit any text inline before generating PDF
- Set font scale (S/M/L)
- Save as PDF — sends HTML to n8n webhook → PDFShift → returns PDF file

---

### 3. PDF Generation Pipeline

```
Browser → POST HTML to n8n webhook (dcbuilders.app.n8n.cloud/webhook/dcb-pdf)
       → n8n sends to PDFShift API
       → PDFShift renders headless Chrome → returns PDF bytes
       → n8n returns PDF blob to browser
       → Browser auto-downloads
```

**Key CSS for PDF:**
- `@page { size: letter; margin: 0; }` — full bleed
- Cover page: `height: 11in` — exact letter height
- Scope items: `page-break-inside: avoid; break-inside: avoid` — no splits mid-item

---

### 4. AI Features

All AI features call the Anthropic Claude API directly from the browser using model `claude-sonnet-4-20250514`.

**Floor Plan Analysis (Property tab)**
- Upload PDF or image of floor plans
- Extracts: rooms, dimensions, window/door counts, bedroom/bathroom count
- Identifies: load-bearing walls, plumbing wet walls, electrical panel location
- Suggests: scope items to add based on what's visible
- Auto-fills form fields

**PDF Import (Library tab)**
- Upload any old D&C Builders proposal PDF
- Extracts: client name, address, email, phone, project price, scope types, payment schedule, allowances
- Loads into form and saves as new proposal
- Enables revisions on proposals that were made before the library feature existed

**AI Revision Assistant (Library → Revisions tab)**
- Load a proposal from library
- Paste email or text from Realm, Block Renovation, or any advisor
- Claude reads the current proposal context + the message
- Returns: summary of request + list of changes (add scope, remove scope, update price, add note)
- One-click apply: changes are applied to the form, auto-saved as new revision

---

### 5. Integrations

**DocuSign**
- Production Account ID: `40ca8fc4-6d97-49ff-8d29-41d2ff01f2a8`
- Construction contracts sent from Review tab
- Change orders sent from Change Order tab
- Both use DocuSign MCP server

**Google Calendar (via Gmail MCP)**
- Reads upcoming/recent meetings
- Extracts client name, address, phone from meeting description
- Auto-fills intake form

**n8n Cloud**
- PDF generation webhook
- Contract sending webhook
- DocuSign completion webhook → creates Slack channel per signed contract

**Supabase**
- CRM leads table — active (bulk import of 31 leads pending)
- Proposals table — NOT YET IMPLEMENTED (still localStorage)

**Slack**
- Notification channel created per signed contract
- Named: `{client-name}_{address}_{timestamp}`

---

## What's Missing / What Needs to Be Built Properly

### Critical Missing Features

**1. Authentication**
There is zero auth. Anyone with the URL can access the full app including all client proposals. Need:
- Login for the D&C team (5-10 users)
- Role-based: Admin (David/Nadeer) vs Advisor (read/write own proposals) vs Read-only

**2. Shared Database**
Proposals live in browser localStorage. This means:
- If David saves a proposal on his laptop, Chris can't see it
- If the browser storage is cleared, all proposals are gone
- No real-time collaboration

Need: Supabase `proposals` table with user/team scoping

**3. Real PDF Generation**
The current PDFShift approach is:
- External SaaS with per-PDF cost
- Limited CSS support (some print styles don't work perfectly)
- Page headers on overflow pages don't work (CSS running headers aren't supported)

Need: Either a proper Puppeteer/Playwright serverless function, or a React-to-PDF library like `@react-pdf/renderer` that gives full control

**4. Proper Page Numbers on All Pages**
Currently the page number only appears on the FIRST page of each scope section. When a kitchen remodel scope flows onto pages 5 and 6, page 6 has no number. This is because page numbers are computed in React (we know the starting page) but we can't know which physical page overflow content lands on.

Fix options:
- CSS `@page` running headers (requires PDFShift support or custom puppeteer)
- Switch to `@react-pdf/renderer` which has proper page-aware rendering

**5. No CI/CD**
Currently: edit JSX → run Python splice script → zip → drag-drop to Cloudflare Pages dashboard
Need: GitHub repo → push → auto-deploy via Cloudflare Pages GitHub integration

---

### Nice-to-Have Features (Planned)

- **Client portal** — send client a link to view their proposal, comment, approve
- **E-signature on proposal** (separate from DocuSign contract) — client initials each scope page
- **Proposal templates** — save a scope configuration as a template for common job types
- **Material selections app** — separate companion app for luxury design selections (tile, cabinet, countertop choices with images) — early version exists in `dcb-design-selections.jsx`
- **Automated follow-up** — Twilio SMS/email reminders based on lead score and last contact date
- **Reporting dashboard** — win rate by advisor, pipeline by month, average project size
- **Multi-location** — eventually expand to other offices

---

## Recommended Tech Stack for Rebuild

### Frontend
- **Next.js 15** (App Router) — replaces the single-file Babel hack
- **TypeScript** — the current JSX has no types, bugs are hard to catch
- **Tailwind CSS** — replace 5,800 lines of inline styles
- **shadcn/ui** — component library consistent with the existing design language

### Backend
- **Next.js API Routes** or **Supabase Edge Functions** — replace n8n webhooks
- **Supabase** — PostgreSQL database (already partially set up):
  - `proposals` table (client, property, scope, pricing, versions)
  - `leads` table (CRM pipeline)
  - `users` table (team members)
  - Row-level security per advisor

### Auth
- **Supabase Auth** — email/password or Google SSO for the team

### PDF Generation
- **`@react-pdf/renderer`** — renders React components directly to PDF, proper page numbers, no external SaaS dependency
- OR **Puppeteer on Vercel** — render the existing HTML proposal in headless Chrome server-side

### AI
- **Anthropic SDK** (server-side) — move API calls from browser to API routes, keep key secure
- Keep `claude-sonnet-4-20250514` for floor plan analysis, revision parsing, PDF import

### Contracts
- **DocuSign REST API** — replace the MCP approach for production reliability
- Keep existing envelope templates

### Deployment
- **Vercel** — deploys Next.js natively, serverless functions for PDF/AI
- **GitHub** — source control (currently no git)
- **Cloudflare** — keep as CDN/DNS layer

### Notifications
- **Twilio** — SMS follow-up reminders (explored, not yet built)
- **Slack SDK** — replace n8n webhook for Slack notifications

---

## Data Model (Proposed)

```typescript
// proposals
{
  id: uuid
  created_at: timestamp
  updated_at: timestamp
  advisor_id: uuid → users.id
  status: 'active' | 'sent' | 'follow_up' | 'won' | 'lost'
  
  // Client
  client_first_name: string
  client_last_name: string
  client_email: string
  client_phone: string
  referral_source: string
  
  // Property
  address: string
  property_type: string
  year_built: number
  sqft: number
  bedrooms: number
  bathrooms: number
  stories: string
  hoa: boolean
  has_plans: boolean
  
  // Scope
  project_types: string[]        // ['kitchen_remodel', 'bathroom_remodel']
  scope_items: jsonb             // { 'kitchen_remodel::k1': true, ... }
  scope_notes: jsonb             // { 'kitchen_remodel::k1': ['note1'] }
  desc_overrides: jsonb          // custom descriptions per item
  finish_selections: jsonb
  scope_counts: jsonb
  
  // Pricing
  project_price: string
  budget_range: string
  financing: string
  allowances: jsonb              // [{ description, amount }]
  payment_schedule: jsonb        // [{ milestone, amount, pct }]
  
  // Internal
  lead_score: 'hot' | 'warm' | 'cool' | 'cold'
  salespersons: string[]
  follow_up: boolean
  follow_up_days: number
  priorities: string[]
  additional_notes: string
  notes_tags: string[]
  
  // Proposal customization
  design_page_sections: jsonb
  general_notes: string[]
  show_toc: boolean
  
  // Versions
  version: number
  revisions: jsonb               // [{ version, date, notes, data_snapshot }]
  
  // Contracts
  docusign_envelope_id: string
  contract_signed_at: timestamp
}

// users (team members)
{
  id: uuid
  email: string
  name: string
  role: 'admin' | 'advisor' | 'readonly'
}
```

---

## Current File Map

```
/agentproject/
├── DCB-Proposal-Generator/          ← OLD: Python script, generates PDF from JSON
│   ├── generate_proposal.py         ← WeasyPrint HTML→PDF generator
│   ├── clients/                     ← Client JSON configs
│   └── README.md                    ← How to use the Python generator
│
└── DCB-Intake-App/                  ← CURRENT: Browser-based React app
    ├── CLAUDE.md                    ← Technical handoff doc (for Claude Code)
    ├── PRODUCT_SPEC.md              ← This file (for human devs)
    ├── build.py                     ← Splice intake.jsx into index.html + zip
    ├── intake.jsx                   ← ~5,800 line source JSX (the whole app)
    ├── index.html                   ← Deployed file (intake.jsx spliced in)
    ├── react.production.min.js      ← React 18.2.0 (bundled, no CDN)
    ├── react-dom.production.min.js  ← ReactDOM 18.2.0 (bundled, no CDN)
    └── babel.min.js                 ← Babel 7.23.6 standalone (bundled, no CDN)
```

---

## Questions for Dev Kickoff

1. **Supabase project** — credentials and project URL for the existing Supabase instance need to be shared
2. **DocuSign templates** — the contract template IDs in production DocuSign need to be documented
3. **n8n workflows** — export the existing n8n workflows as JSON backups before migration
4. **Scope data** — the `PROJECT_SCOPES` object in `intake.jsx` (lines 300–1000) contains all scope item definitions with descriptions — this needs to become a database table so it can be edited without a code deploy
5. **Design assets** — the D&C Builders logo is SVG inline in the JSX; need a proper asset file

---

## Priority Order for Rebuild

**Phase 1 — Foundation (2-3 weeks)**
- [ ] Next.js + TypeScript + Tailwind setup
- [ ] Supabase auth (team login)
- [ ] Proposals table + CRUD API
- [ ] Port intake form (tabs 0–4) to proper components
- [ ] Port proposal generation (same HTML output, just cleaner React)

**Phase 2 — PDF + CRM (1-2 weeks)**
- [ ] Server-side PDF via Puppeteer or @react-pdf/renderer
- [ ] Proper page numbers on all pages
- [ ] Proposal library / pipeline view
- [ ] Revision history

**Phase 3 — AI + Integrations (1-2 weeks)**
- [ ] Floor plan analysis (server-side Anthropic call)
- [ ] AI revision assistant
- [ ] PDF import
- [ ] DocuSign contracts
- [ ] Change orders

**Phase 4 — Polish (ongoing)**
- [ ] Scope items in database (editable without deploy)
- [ ] Reporting/analytics
- [ ] Client portal
- [ ] Twilio follow-ups
- [ ] Material selections companion app
