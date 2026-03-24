// ── Proposal data types ──

export type PipelineStatus = "active" | "sent" | "follow_up" | "won" | "lost";
export type LeadScore = "hot" | "warm" | "cool" | "cold";
export type PropertyType = "SFR" | "Condo" | "Multi-Family" | "Commercial";
export type FinancingType = "Cash" | "Loan" | "HELOC" | "Other";

export type ReferralSource =
  | "Google"
  | "Yelp"
  | "Realm"
  | "Referral"
  | "Instagram"
  | "Facebook"
  | "Yard Sign"
  | "Repeat Client"
  | "Other";

export type Advisor =
  | "David"
  | "Chris"
  | "Kayley"
  | "Ben"
  | "Dylan"
  | "Kerr";

export interface Allowance {
  description: string;
  amount: string;
}

export interface PaymentMilestone {
  milestone: string;
  amount: string;
  percentage: string;
}

export interface DesignSection {
  title: string;
  content: string;
}

export interface Proposal {
  id?: string;
  status: PipelineStatus;

  // Client
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referralSource: ReferralSource | "";
  advisor: Advisor | "";

  // Property
  address: string;
  propertyType: PropertyType | "";
  yearBuilt: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  stories: string;
  hoa: boolean;
  hasPlans: boolean;

  // Scope
  projectTypes: string[];
  scopeItems: Record<string, boolean>;
  scopeNotes: Record<string, string>;
  descOverrides: Record<string, string>;
  finishSelections: Record<string, string>;
  scopeCounts: Record<string, number>;

  // Details
  projectPrice: string;
  budgetRange: string;
  desiredStartDate: string;
  financing: FinancingType | "";
  allowances: Allowance[];
  paymentSchedule: PaymentMilestone[];
  salespersons: string[];
  leadScore: LeadScore | "";
  followUp: boolean;
  followUpDays: string;
  priorities: string[];
  additionalNotes: string;
  notesTags: string[];

  // Proposal customisation
  designPageSections: DesignSection[];
  generalNotes: string[];
  showToc: boolean;
}

export const INITIAL_PROPOSAL: Proposal = {
  status: "active",

  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  referralSource: "",
  advisor: "",

  address: "",
  propertyType: "",
  yearBuilt: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  stories: "",
  hoa: false,
  hasPlans: false,

  projectTypes: [],
  scopeItems: {},
  scopeNotes: {},
  descOverrides: {},
  finishSelections: {},
  scopeCounts: {},

  projectPrice: "",
  budgetRange: "",
  desiredStartDate: "",
  financing: "",
  allowances: [],
  paymentSchedule: [
    { milestone: "Down Payment", amount: "", percentage: "10" },
    { milestone: "Rough Stage", amount: "", percentage: "30" },
    { milestone: "Finish Stage", amount: "", percentage: "30" },
    { milestone: "Final Payment", amount: "", percentage: "30" },
  ],
  salespersons: [],
  leadScore: "",
  followUp: false,
  followUpDays: "7",
  priorities: [],
  additionalNotes: "",
  notesTags: [],

  designPageSections: [],
  generalNotes: [],
  showToc: true,
};

// ── Scope catalogue ──

export interface ScopeItemDef {
  id: string;
  title: string;
  description: string;
}

export interface ProjectTypeDef {
  id: string;
  label: string;
  items: ScopeItemDef[];
}

export const PROJECT_TYPES: ProjectTypeDef[] = [
  {
    id: "interior_remodel",
    label: "Interior Remodel",
    items: [
      { id: "ir_design", title: "Design & Plans", description: "Full architectural design and engineering plans for interior remodel." },
      { id: "ir_permits", title: "Permits", description: "City permits and plan check for all applicable work." },
      { id: "ir_demo", title: "Demo & Haul-Off", description: "Complete demolition of designated areas with debris removal." },
      { id: "ir_framing", title: "Framing", description: "Structural and non-structural framing as required." },
      { id: "ir_electrical", title: "Electrical", description: "Electrical rough-in and finish per plan specifications." },
      { id: "ir_plumbing", title: "Plumbing", description: "Plumbing rough-in and finish including fixtures." },
      { id: "ir_finishing", title: "Finishing", description: "Drywall, texture, and interior finish work." },
      { id: "ir_cleanup", title: "Clean-up", description: "Final construction clean-up and debris haul-off." },
    ],
  },
  {
    id: "kitchen_remodel",
    label: "Kitchen Remodel",
    items: [
      { id: "k_demo", title: "Demo & Haul-Off", description: "Full demolition of existing kitchen including cabinets, countertops, flooring, and appliances." },
      { id: "k_framing", title: "Framing", description: "Structural framing modifications including header installations and wall removals as specified." },
      { id: "k_electrical", title: "Electrical", description: "Full electrical rough-in including dedicated circuits for appliances, under-cabinet lighting, and outlets per code." },
      { id: "k_plumbing", title: "Plumbing", description: "Plumbing rough-in and finish for sink, dishwasher, and refrigerator water line." },
      { id: "k_hvac", title: "HVAC", description: "HVAC modifications, ductwork rerouting, and new vent placement as needed." },
      { id: "k_cabinets", title: "Cabinets", description: "Supply and installation of new cabinetry per design specifications." },
      { id: "k_countertops", title: "Countertops", description: "Fabrication and installation of countertops — material per client selection." },
      { id: "k_backsplash", title: "Backsplash", description: "Tile backsplash installation per design — material per client selection." },
      { id: "k_flooring", title: "Flooring", description: "New flooring installation throughout kitchen area — material per client selection." },
      { id: "k_appliances", title: "Appliances", description: "Installation of all kitchen appliances — units supplied by owner or per allowance." },
      { id: "k_paint", title: "Paint", description: "Interior painting of kitchen walls and ceiling — two coats of premium paint." },
      { id: "k_lighting", title: "Lighting", description: "Recessed lighting, pendant lighting, and under-cabinet LED installation." },
    ],
  },
  {
    id: "bathroom_remodel",
    label: "Bathroom Remodel",
    items: [
      { id: "b_demo", title: "Demo & Haul-Off", description: "Full demolition of existing bathroom including tile, fixtures, and vanity." },
      { id: "b_framing", title: "Framing", description: "Wall framing, blocking for fixtures, and niche framing as specified." },
      { id: "b_electrical", title: "Electrical", description: "Electrical rough-in for lighting, exhaust fan, GFCI outlets, and heated floor." },
      { id: "b_plumbing", title: "Plumbing", description: "Plumbing rough-in and finish for shower, tub, toilet, and vanity." },
      { id: "b_tile", title: "Tile", description: "Shower/tub tile, floor tile, and accent tile installation — material per client selection." },
      { id: "b_vanity", title: "Vanity & Sink", description: "Supply and installation of vanity, sink, and faucet per design specifications." },
      { id: "b_shower", title: "Shower / Tub", description: "Shower or tub installation including waterproofing membrane and glass enclosure." },
      { id: "b_toilet", title: "Toilet", description: "Supply and installation of new toilet — model per client selection." },
      { id: "b_accessories", title: "Accessories", description: "Towel bars, toilet paper holder, robe hooks, and mirror installation." },
      { id: "b_paint", title: "Paint", description: "Interior painting of bathroom walls and ceiling — moisture-resistant paint." },
    ],
  },
  {
    id: "new_bathroom",
    label: "New Bathroom",
    items: [
      { id: "nb_design", title: "Design & Plans", description: "Architectural design and engineering plans for new bathroom addition." },
      { id: "nb_permits", title: "Permits", description: "City permits and plan check for new bathroom construction." },
      { id: "nb_demo", title: "Demo", description: "Demolition work to create space for new bathroom." },
      { id: "nb_framing", title: "Framing", description: "Full wall and floor framing for new bathroom layout." },
      { id: "nb_electrical", title: "Electrical", description: "Complete electrical installation for new bathroom." },
      { id: "nb_plumbing", title: "Plumbing", description: "New plumbing lines — supply, drain, and vent installation." },
      { id: "nb_finishing", title: "Finishing", description: "Drywall, tile, vanity, fixtures, and finish work." },
      { id: "nb_cleanup", title: "Clean-up", description: "Final construction clean-up and debris haul-off." },
    ],
  },
  {
    id: "addition_1st",
    label: "1st Story Addition",
    items: [
      { id: "a1_design", title: "Design & Plans", description: "Full architectural and structural engineering plans for 1st story addition." },
      { id: "a1_permits", title: "Permits", description: "City permits, plan check, and all required inspections." },
      { id: "a1_demo", title: "Demo", description: "Demolition of existing walls, roof sections, and foundation as required." },
      { id: "a1_framing", title: "Framing", description: "Complete structural framing including foundation, walls, and roof tie-in." },
      { id: "a1_electrical", title: "Electrical", description: "Full electrical rough-in and finish per plan specifications." },
      { id: "a1_plumbing", title: "Plumbing", description: "Plumbing rough-in and finish as required." },
      { id: "a1_finishing", title: "Finishing", description: "Drywall, texture, trim, paint, and all interior finishes." },
      { id: "a1_cleanup", title: "Clean-up", description: "Final construction clean-up and site restoration." },
    ],
  },
  {
    id: "addition_2nd",
    label: "2nd Story Addition",
    items: [
      { id: "a2_design", title: "Design & Plans", description: "Full architectural and structural engineering plans for 2nd story addition." },
      { id: "a2_permits", title: "Permits", description: "City permits, plan check, and structural inspections." },
      { id: "a2_demo", title: "Demo", description: "Roof removal and structural preparation for 2nd story." },
      { id: "a2_framing", title: "Framing", description: "Complete structural framing including floor system, walls, and new roof." },
      { id: "a2_electrical", title: "Electrical", description: "Full electrical rough-in and finish for 2nd story." },
      { id: "a2_plumbing", title: "Plumbing", description: "Plumbing rough-in and finish for 2nd story." },
      { id: "a2_finishing", title: "Finishing", description: "Drywall, texture, trim, paint, and all interior finishes." },
      { id: "a2_cleanup", title: "Clean-up", description: "Final construction clean-up and site restoration." },
    ],
  },
  {
    id: "adu_jadu",
    label: "ADU / JADU",
    items: [
      { id: "adu_design", title: "Design & Plans", description: "Full architectural and engineering plans for ADU / JADU." },
      { id: "adu_permits", title: "Permits", description: "City permits, plan check, and utility connections." },
      { id: "adu_demo", title: "Demo", description: "Site preparation and demolition as required." },
      { id: "adu_framing", title: "Framing", description: "Complete structural framing — foundation, walls, and roof." },
      { id: "adu_electrical", title: "Electrical", description: "Full electrical installation including new panel and circuits." },
      { id: "adu_plumbing", title: "Plumbing", description: "Complete plumbing installation including new connections." },
      { id: "adu_finishing", title: "Finishing", description: "All interior and exterior finish work." },
      { id: "adu_cleanup", title: "Clean-up", description: "Final construction clean-up and landscaping restoration." },
    ],
  },
  {
    id: "garage_conv",
    label: "Garage Conversion",
    items: [
      { id: "gc_design", title: "Design & Plans", description: "Architectural plans for garage conversion to living space." },
      { id: "gc_permits", title: "Permits", description: "City permits and plan check for change of use." },
      { id: "gc_demo", title: "Demo", description: "Garage door removal and demolition work." },
      { id: "gc_framing", title: "Framing", description: "Wall framing, insulation, and structural modifications." },
      { id: "gc_electrical", title: "Electrical", description: "Electrical rough-in and finish per plan." },
      { id: "gc_plumbing", title: "Plumbing", description: "Plumbing installation if applicable." },
      { id: "gc_finishing", title: "Finishing", description: "Drywall, flooring, paint, and all finish work." },
      { id: "gc_cleanup", title: "Clean-up", description: "Final construction clean-up." },
    ],
  },
  {
    id: "garage_conv_1st",
    label: "1st Floor Garage Conv",
    items: [
      { id: "gc1_design", title: "Design & Plans", description: "Architectural plans for 1st floor garage conversion." },
      { id: "gc1_permits", title: "Permits", description: "City permits and plan check." },
      { id: "gc1_demo", title: "Demo", description: "Demolition and garage door removal." },
      { id: "gc1_framing", title: "Framing", description: "Wall framing and structural modifications." },
      { id: "gc1_electrical", title: "Electrical", description: "Electrical rough-in and finish." },
      { id: "gc1_plumbing", title: "Plumbing", description: "Plumbing installation as needed." },
      { id: "gc1_finishing", title: "Finishing", description: "All interior finish work." },
      { id: "gc1_cleanup", title: "Clean-up", description: "Final construction clean-up." },
    ],
  },
  {
    id: "garage_conv_2nd",
    label: "2nd Floor Garage Conv",
    items: [
      { id: "gc2_design", title: "Design & Plans", description: "Architectural and structural plans for 2nd floor above garage." },
      { id: "gc2_permits", title: "Permits", description: "City permits and plan check." },
      { id: "gc2_demo", title: "Demo", description: "Roof removal and preparation." },
      { id: "gc2_framing", title: "Framing", description: "Floor system and wall framing for 2nd floor." },
      { id: "gc2_electrical", title: "Electrical", description: "Electrical rough-in and finish." },
      { id: "gc2_plumbing", title: "Plumbing", description: "Plumbing installation as needed." },
      { id: "gc2_finishing", title: "Finishing", description: "All interior and exterior finish work." },
      { id: "gc2_cleanup", title: "Clean-up", description: "Final construction clean-up." },
    ],
  },
  {
    id: "interior_per_bedroom",
    label: "Interior Per Bedroom",
    items: [
      { id: "ipb_design", title: "Design & Plans", description: "Design plans for bedroom renovation." },
      { id: "ipb_demo", title: "Demo", description: "Demolition of existing finishes." },
      { id: "ipb_framing", title: "Framing", description: "Framing modifications as needed." },
      { id: "ipb_electrical", title: "Electrical", description: "Electrical updates — outlets, switches, lighting." },
      { id: "ipb_finishing", title: "Finishing", description: "Drywall, paint, flooring, and trim." },
      { id: "ipb_cleanup", title: "Clean-up", description: "Final clean-up." },
    ],
  },
  {
    id: "new_construction",
    label: "New Construction",
    items: [
      { id: "nc_design", title: "Design & Plans", description: "Full architectural and engineering plans for new construction." },
      { id: "nc_permits", title: "Permits", description: "All required city permits and inspections." },
      { id: "nc_demo", title: "Demo", description: "Site clearing and demolition of existing structures." },
      { id: "nc_framing", title: "Framing", description: "Complete structural framing — foundation through roof." },
      { id: "nc_electrical", title: "Electrical", description: "Full electrical installation." },
      { id: "nc_plumbing", title: "Plumbing", description: "Complete plumbing installation." },
      { id: "nc_finishing", title: "Finishing", description: "All interior and exterior finish work." },
      { id: "nc_cleanup", title: "Clean-up", description: "Final construction clean-up and landscaping." },
    ],
  },
  {
    id: "roofing",
    label: "Roofing",
    items: [
      { id: "rf_design", title: "Design & Plans", description: "Roofing design and material specifications." },
      { id: "rf_permits", title: "Permits", description: "Roofing permits as required." },
      { id: "rf_demo", title: "Demo", description: "Tear-off of existing roofing materials." },
      { id: "rf_framing", title: "Framing", description: "Roof deck repair and structural reinforcement." },
      { id: "rf_electrical", title: "Electrical", description: "Electrical for rooftop equipment if applicable." },
      { id: "rf_finishing", title: "Finishing", description: "New roofing installation — material per client selection." },
      { id: "rf_cleanup", title: "Clean-up", description: "Debris haul-off and site clean-up." },
    ],
  },
  {
    id: "exterior_siding",
    label: "Exterior & Siding",
    items: [
      { id: "es_design", title: "Design & Plans", description: "Exterior design and siding material specifications." },
      { id: "es_permits", title: "Permits", description: "Permits as required." },
      { id: "es_demo", title: "Demo", description: "Removal of existing siding or exterior materials." },
      { id: "es_framing", title: "Framing", description: "Sheathing and weather barrier installation." },
      { id: "es_finishing", title: "Finishing", description: "New siding installation and trim — material per selection." },
      { id: "es_cleanup", title: "Clean-up", description: "Debris haul-off and site clean-up." },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    items: [
      { id: "fl_design", title: "Design & Plans", description: "Flooring layout and material specifications." },
      { id: "fl_demo", title: "Demo", description: "Removal of existing flooring and prep." },
      { id: "fl_framing", title: "Framing", description: "Subfloor repair and leveling as needed." },
      { id: "fl_finishing", title: "Finishing", description: "New flooring installation — LVP, tile, or hardwood per selection." },
      { id: "fl_cleanup", title: "Clean-up", description: "Final clean-up." },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    items: [
      { id: "pt_design", title: "Design & Plans", description: "Color selection and paint specifications." },
      { id: "pt_demo", title: "Demo", description: "Surface preparation, patching, and priming." },
      { id: "pt_finishing", title: "Finishing", description: "Two coats of premium paint — interior and/or exterior." },
      { id: "pt_cleanup", title: "Clean-up", description: "Final clean-up and touch-ups." },
    ],
  },
  {
    id: "windows_doors",
    label: "Windows & Doors",
    items: [
      { id: "wd_design", title: "Design & Plans", description: "Window and door specifications and layout." },
      { id: "wd_permits", title: "Permits", description: "Permits as required for new openings." },
      { id: "wd_demo", title: "Demo", description: "Removal of existing windows and/or doors." },
      { id: "wd_framing", title: "Framing", description: "Framing modifications and header installation." },
      { id: "wd_finishing", title: "Finishing", description: "Installation of new windows and doors with trim." },
      { id: "wd_cleanup", title: "Clean-up", description: "Debris haul-off and clean-up." },
    ],
  },
  {
    id: "deck_patio",
    label: "Deck / Patio",
    items: [
      { id: "dp_design", title: "Design & Plans", description: "Deck or patio design and structural plans." },
      { id: "dp_permits", title: "Permits", description: "City permits for outdoor structure." },
      { id: "dp_demo", title: "Demo", description: "Removal of existing deck or patio if applicable." },
      { id: "dp_framing", title: "Framing", description: "Foundation, posts, and structural framing." },
      { id: "dp_electrical", title: "Electrical", description: "Outdoor electrical for lighting and outlets." },
      { id: "dp_finishing", title: "Finishing", description: "Decking, railing, and finish work." },
      { id: "dp_cleanup", title: "Clean-up", description: "Final clean-up and landscaping restoration." },
    ],
  },
  {
    id: "sunroom",
    label: "Sunroom",
    items: [
      { id: "sr_design", title: "Design & Plans", description: "Sunroom architectural and engineering plans." },
      { id: "sr_permits", title: "Permits", description: "City permits and plan check." },
      { id: "sr_demo", title: "Demo", description: "Site preparation and demolition as needed." },
      { id: "sr_framing", title: "Framing", description: "Foundation and structural framing for sunroom." },
      { id: "sr_electrical", title: "Electrical", description: "Electrical installation for lighting and outlets." },
      { id: "sr_plumbing", title: "Plumbing", description: "Plumbing if applicable." },
      { id: "sr_finishing", title: "Finishing", description: "Glass installation, flooring, and interior finishes." },
      { id: "sr_cleanup", title: "Clean-up", description: "Final construction clean-up." },
    ],
  },
];

export const REFERRAL_SOURCES: ReferralSource[] = [
  "Google",
  "Yelp",
  "Realm",
  "Referral",
  "Instagram",
  "Facebook",
  "Yard Sign",
  "Repeat Client",
  "Other",
];

export const ADVISORS: Advisor[] = [
  "David",
  "Chris",
  "Kayley",
  "Ben",
  "Dylan",
  "Kerr",
];

export const CLIENT_PRIORITIES = [
  "Price",
  "Communication",
  "Timeline",
  "Quality",
  "Design",
  "Cleanliness",
];

// ── User types ──

export type UserRole = "admin" | "advisor" | "readonly";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ── Database proposal (snake_case, matches Supabase schema) ──

export type ProposalStatus = PipelineStatus;

export interface DbProposal {
  id: string;
  created_at: string;
  updated_at: string;
  advisor_id: string;
  status: ProposalStatus;

  // Client
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  referral_source: string;

  // Property
  address: string;
  property_type: string;
  year_built: number | null;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  stories: string;
  hoa: boolean;
  has_plans: boolean;

  // Scope
  project_types: string[];
  scope_items: Record<string, boolean>;
  scope_notes: Record<string, string>;
  desc_overrides: Record<string, string>;
  finish_selections: Record<string, string>;
  scope_counts: Record<string, number>;

  // Pricing
  project_price: string;
  budget_range: string;
  financing: string;
  allowances: Allowance[];
  payment_schedule: PaymentMilestone[];

  // Internal
  lead_score: LeadScore | "";
  salespersons: string[];
  follow_up: boolean;
  follow_up_days: number;
  priorities: string[];
  additional_notes: string;
  notes_tags: string[];

  // Proposal customization
  design_page_sections: DesignSection[];
  general_notes: string[];
  show_toc: boolean;

  // Versions
  version: number;
  revisions: RevisionSnapshot[];

  // Contracts
  docusign_envelope_id: string | null;
  contract_signed_at: string | null;
}

export interface RevisionSnapshot {
  version: number;
  date: string;
  notes: string;
  data_snapshot: Record<string, unknown>;
}

export type CreateDbProposalInput = Omit<
  DbProposal,
  "id" | "created_at" | "updated_at"
>;

export type UpdateDbProposalInput = Partial<
  Omit<DbProposal, "id" | "created_at" | "updated_at">
>;

// ── Change Order types ──

export interface ChangeOrderLineItem {
  description: string;
  quantity: number;
  unit_price: string;
  total: string;
}

export interface ChangeOrder {
  id: string;
  created_at: string;
  updated_at: string;
  proposal_id: string;
  client_name: string;
  address: string;
  type: "increased" | "decreased";
  line_items: ChangeOrderLineItem[];
  scope_description: string;
  timeline_extension_days: number;
  total_amount: string;
  docusign_envelope_id: string | null;
  sent_at: string | null;
  signed_at: string | null;
}

// ── AI types ──

export interface FloorPlanAnalysis {
  room_count: number;
  window_count: number;
  door_count: number;
  sqft_estimate: number;
  bedrooms: number;
  bathrooms: number;
  load_bearing_walls: string[];
  removal_candidates: string[];
  plumbing_locations: string[];
  electrical_panel: string;
  hvac_notes: string;
  structural_concerns: string[];
  suggested_scope_items: string[];
  raw_notes: string;
}

export interface RevisionChange {
  action: "add_scope" | "remove_scope" | "update_price" | "add_note";
  scope_type?: string;
  scope_item_id?: string;
  new_price?: string;
  note?: string;
  description: string;
}

export interface RevisionSuggestion {
  summary: string;
  changes: RevisionChange[];
}

export interface PdfImportResult {
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  project_price: string;
  project_types: string[];
  scope_items: Record<string, boolean>;
  allowances: Allowance[];
  payment_schedule: PaymentMilestone[];
  confidence: number;
  warnings: string[];
}
