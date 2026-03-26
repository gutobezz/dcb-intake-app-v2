# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js Version Warning

This project uses **Next.js 16.2.1** — a version with breaking changes from what most LLMs know. APIs, conventions, and file structure may differ from your training data. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

No test suite is configured.

## Required Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

The app will crash on startup if Supabase vars are missing. AI features are silently disabled if `ANTHROPIC_API_KEY` is absent.

## Architecture Overview

**DCB Intake App** is a CRM + proposal tool for a construction/remodeling company. It lets advisors fill out intake forms for client projects, generates PDF proposals, and syncs with Pipedrive CRM.

### Routing

All meaningful routes live under `src/app/(protected)/` and require Supabase auth. Unauthenticated users are redirected to `/login` by the middleware at `src/middleware.ts`.

| Route | Purpose |
|---|---|
| `/intake` | Create/edit proposals (7-tab form) |
| `/library` | Pipeline view of all proposals |
| `/library/[id]` | Proposal detail + actions |
| `/proposal/[id]` | Rendered PDF proposal view |
| `/change-orders` | Change order management |
| `/settings` | Integrations and team settings |

### Intake Form (Core Feature)

The form at `src/components/intake/intake-form.tsx` orchestrates 7 tabs:

1. **Client (👤)** — contact info, referral source, lead score
2. **Property (📍)** — address, property specs
3. **Scope (📦)** — project types + scope items from the constants catalog
4. **Details (📝)** — pricing, payment schedule, allowances, notes
5. **Review (✅)** — read-only summary
6. **Library (📚)** — link to pipeline
7. **Change Order (📋)** — change order entry

**State management:** `src/hooks/use-proposal-form.ts` uses `useReducer`. All form state is typed via `ProposalFormState` in `src/lib/types.ts`.

**Auto-save:** `src/hooks/use-autosave.ts` debounces saves to Supabase (2-second delay).

### Scope Data

`src/lib/constants/project-types.ts` is the heart of the business logic — it defines 16+ project types (Kitchen, Bathroom, ADU, Addition, New Construction, etc.), each with a catalog of scope items. Each item has a key, title, description, std/opt designation, and optional finish selectors. This file is large and central; understand it before modifying scope-related features.

### AI Features

Three Claude-powered endpoints in `src/app/api/ai/`:

- `POST /api/ai/pdf-import` — extracts text from a PDF, passes it to Claude to parse into `ProposalFormState` fields
- `POST /api/ai/floor-plan` — base64-encodes an image and sends it to Claude vision for room/scope analysis
- `POST /api/ai/revision` — parses PDF revision requests into structured change orders

Claude client is initialized in `src/lib/ai/anthropic.ts`.

### Supabase

- **Browser client:** `src/lib/supabase/client.ts`
- **Server client:** `src/lib/supabase/server.ts` (reads cookies via Next.js headers)
- **Middleware:** `src/lib/supabase/middleware.ts` refreshes auth sessions

All tables have RLS enabled — admins have full access, advisors have scoped access. No edge functions are deployed.

#### Database Schema

**`users`** — team members (mirrors `auth.users`)
| column | type |
|---|---|
| id (PK) | uuid |
| email | text |
| name | text |
| role | text — `admin` \| `advisor` \| `readonly` |
| created_at / updated_at | timestamptz |

**`proposals`** — main entity, one row per client intake
| column | type | notes |
|---|---|---|
| id (PK) | uuid | |
| advisor_id (FK → users) | uuid | |
| status | text | `active` \| `sent` \| `follow_up` \| `won` \| `lost` |
| first_name, last_name, email, phone | text | |
| referral_source | text | |
| address, property_type, stories | text | |
| year_built, sqft, bedrooms, bathrooms | integer | |
| hoa, has_plans | boolean | |
| project_types | text[] | selected project types |
| scope_items, scope_notes, desc_overrides, finish_selections, scope_counts | jsonb | keyed by scope item key |
| project_price, budget_range, financing | text | |
| allowances, payment_schedule | jsonb | arrays |
| lead_score | text | `hot` \| `warm` \| `cool` \| `cold` |
| salespersons, priorities, notes_tags, general_notes | text[] | |
| follow_up | boolean | |
| follow_up_days | integer | |
| additional_notes | text | |
| design_page_sections | jsonb | |
| show_toc | boolean | |
| version | integer | starts at 1 |
| revisions | jsonb | array of revision history |
| docusign_envelope_id | text | |
| contract_signed_at | timestamptz | |
| pipedrive_deal_id | integer | from migration 002 |
| created_at / updated_at | timestamptz | |

**`leads`** — CRM pipeline entries (FK → proposals)
| column | type | notes |
|---|---|---|
| id (PK) | uuid | |
| proposal_id (FK → proposals) | uuid | nullable |
| client_name, email, phone, address | text | |
| source, advisor, notes | text | |
| status | text | `new` \| `contacted` \| `qualified` \| `proposal_sent` \| `won` \| `lost` |
| lead_score | text | `hot` \| `warm` \| `cool` \| `cold` |
| next_follow_up | date | |

**`change_orders`** — linked to a proposal
| column | type | notes |
|---|---|---|
| id (PK) | uuid | |
| proposal_id (FK → proposals) | uuid | |
| created_by (FK → users) | uuid | |
| type | text | |
| line_items | jsonb | |
| scope_description | text | |
| timeline_extension_days | integer | |
| total_amount | text | |
| docusign_envelope_id | text | |
| status | text | |

**`scope_templates`** — reusable scope item catalog (admin-managed)
| column | type |
|---|---|
| id (PK) | uuid |
| project_type, scope_key, title, description, category | text |
| sort_order | integer |
| is_default | boolean |

#### Relationships

```
users ←── proposals (advisor_id)
proposals ←── leads (proposal_id)
proposals ←── change_orders (proposal_id)
users ←── change_orders (created_by)
```

Migrations live in `supabase/migrations/` (001 initial schema, 002 adds `pipedrive_deal_id`).

### PDF Generation

`src/lib/pdf/` uses `@react-pdf/renderer` to render proposals as PDFs. The PDF is composed of multiple section components (`src/components/proposal/`): cover page, scope list, payment schedule, notes, etc.

### Server Actions

`src/lib/actions/` contains Next.js server actions for:
- `auth.ts` — login/logout
- `proposals.ts` — CRUD for proposals
- `pipedrive.ts` — sync to Pipedrive CRM
- `change-orders.ts` — change order persistence
- `settings.ts` — integration config

### UI Stack

- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config.ts`)
- **shadcn/ui** components in `src/components/ui/`
- **Sonner** for toast notifications
- **Lucide React** for icons
- **Next Themes** for dark mode
