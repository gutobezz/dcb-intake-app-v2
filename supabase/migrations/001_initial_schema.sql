-- ============================================================
-- DCB Intake App — Initial Database Schema
-- Migration 001: Users, Proposals, Leads, Scope Templates
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. UTILITY: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. USERS table — team members
-- ============================================================
CREATE TABLE public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL UNIQUE,
  name        text NOT NULL,
  role        text NOT NULL DEFAULT 'advisor' CHECK (role IN ('admin', 'advisor', 'readonly')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all team members
CREATE POLICY "users_select_authenticated"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can insert new users
CREATE POLICY "users_insert_admin"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete users
CREATE POLICY "users_delete_admin"
  ON public.users FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 3. PROPOSALS table — main entity
-- ============================================================
CREATE TABLE public.proposals (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sent', 'follow_up', 'won', 'lost')),

  -- Client fields
  first_name            text,
  last_name             text,
  email                 text,
  phone                 text,
  referral_source       text,

  -- Property fields
  address               text,
  property_type         text,
  year_built            int,
  sqft                  int,
  bedrooms              int,
  bathrooms             int,
  stories               text,
  hoa                   boolean DEFAULT false,
  has_plans             boolean DEFAULT false,

  -- Scope fields
  project_types         text[],
  scope_items           jsonb DEFAULT '{}'::jsonb,
  scope_notes           jsonb DEFAULT '{}'::jsonb,
  desc_overrides        jsonb DEFAULT '{}'::jsonb,
  finish_selections     jsonb DEFAULT '{}'::jsonb,
  scope_counts          jsonb DEFAULT '{}'::jsonb,

  -- Pricing
  project_price         text,
  budget_range          text,
  financing             text,
  allowances            jsonb DEFAULT '[]'::jsonb,
  payment_schedule      jsonb DEFAULT '[]'::jsonb,

  -- Internal
  lead_score            text CHECK (lead_score IS NULL OR lead_score IN ('hot', 'warm', 'cool', 'cold')),
  salespersons          text[],
  follow_up             boolean DEFAULT false,
  follow_up_days        int,
  priorities            text[],
  additional_notes      text,
  notes_tags            text[],

  -- Proposal customization
  design_page_sections  jsonb DEFAULT '[]'::jsonb,
  general_notes         text[],
  show_toc              boolean DEFAULT true,

  -- Versioning
  version               int NOT NULL DEFAULT 1,
  revisions             jsonb DEFAULT '[]'::jsonb,

  -- Contracts
  docusign_envelope_id  text,
  contract_signed_at    timestamptz,

  -- Timestamps
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_advisor_id ON public.proposals(advisor_id);
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);
CREATE INDEX idx_proposals_lead_score ON public.proposals(lead_score);
CREATE INDEX idx_proposals_last_name ON public.proposals(last_name);

-- RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all proposals
CREATE POLICY "proposals_select_authenticated"
  ON public.proposals FOR SELECT
  TO authenticated
  USING (true);

-- Admins and advisors can insert proposals
CREATE POLICY "proposals_insert_authenticated"
  ON public.proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'advisor'))
  );

-- Admins can update any proposal; advisors can update their own
CREATE POLICY "proposals_update_own_or_admin"
  ON public.proposals FOR UPDATE
  TO authenticated
  USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can delete proposals
CREATE POLICY "proposals_delete_admin"
  ON public.proposals FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 4. LEADS table — CRM pipeline
-- ============================================================
CREATE TABLE public.leads (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id     uuid REFERENCES public.proposals(id) ON DELETE SET NULL,
  client_name     text,
  email           text,
  phone           text,
  address         text,
  source          text,
  advisor         text,
  status          text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  lead_score      text CHECK (lead_score IS NULL OR lead_score IN ('hot', 'warm', 'cool', 'cold')),
  notes           text,
  next_follow_up  date,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_advisor ON public.leads(advisor);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_next_follow_up ON public.leads(next_follow_up);
CREATE INDEX idx_leads_proposal_id ON public.leads(proposal_id);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all leads
CREATE POLICY "leads_select_authenticated"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

-- Admins and advisors can insert leads
CREATE POLICY "leads_insert_authenticated"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'advisor'))
  );

-- Admins and advisors can update leads
CREATE POLICY "leads_update_authenticated"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'advisor'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'advisor'))
  );

-- Only admins can delete leads
CREATE POLICY "leads_delete_admin"
  ON public.leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 5. SCOPE_TEMPLATES table — reusable scope items
-- ============================================================
CREATE TABLE public.scope_templates (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_type  text NOT NULL,
  scope_key     text NOT NULL,
  title         text NOT NULL,
  description   text,
  category      text,
  sort_order    int NOT NULL DEFAULT 0,
  is_default    boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER scope_templates_updated_at
  BEFORE UPDATE ON public.scope_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX idx_scope_templates_project_type ON public.scope_templates(project_type);
CREATE INDEX idx_scope_templates_category ON public.scope_templates(category);
CREATE UNIQUE INDEX idx_scope_templates_type_key ON public.scope_templates(project_type, scope_key);

-- RLS
ALTER TABLE public.scope_templates ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read scope templates
CREATE POLICY "scope_templates_select_authenticated"
  ON public.scope_templates FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify scope templates
CREATE POLICY "scope_templates_insert_admin"
  ON public.scope_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "scope_templates_update_admin"
  ON public.scope_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "scope_templates_delete_admin"
  ON public.scope_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
