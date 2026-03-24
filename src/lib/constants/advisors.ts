// ── Advisors & Team ──

export interface Advisor {
  id: string;
  name: string;
}

export const DEFAULT_ADVISORS: Advisor[] = [
  { id: "david", name: "David" },
  { id: "chris", name: "Chris" },
  { id: "kayley", name: "Kayley" },
  { id: "ben", name: "Ben" },
  { id: "dylan", name: "Dylan" },
  { id: "kerry", name: "Kerry" },
  { id: "sean", name: "Sean" },
  { id: "claire", name: "Claire" },
  { id: "tanzin", name: "Tanzin" },
] as const;

export const DEFAULT_ADVISORS_LIST = [
  "David",
  "Chris",
  "Kayley",
  "Ben",
  "Dylan",
  "Kerry",
  "Sean",
  "Claire",
  "Tanzin",
] as const;

export const DEFAULT_TEAM_MEMBERS = [
  "Nadeer G.",
  "Ivanna G.",
  "Ron Tal",
  "David",
  "Chris",
] as const;

// ── Lead Source to Advisor Auto-Mapping ──

export const DEFAULT_SOURCE_ADVISOR_MAP: Record<string, string[]> = {
  Realm: ["Kayley", "Ben", "Dylan", "Kerry", "Sean"],
  "Block Renovation": ["Claire", "Tanzin"],
};

// ── Referral Sources ──

export const DEFAULT_REFERRAL_SOURCES = [
  "Google Search",
  "Google Ads",
  "Yelp",
  "Instagram",
  "Facebook",
  "TikTok",
  "Houzz",
  "Nextdoor",
  "Angi / HomeAdvisor",
  "Thumbtack",
  "Zillow",
  "Realm",
  "Block Renovation",
  "Referral - Past Client",
  "Referral - Friend/Family",
  "Referral - Realtor",
  "Referral - Contractor",
  "Drive-By / Yard Sign",
  "Home Show / Event",
  "Repeat Client",
  "Builder Network",
  "Architect Referral",
  "Other",
] as const;

// ── Budget Ranges ──

export const BUDGET_RANGES = [
  "Under $50K",
  "$50K-$100K",
  "$100K-$150K",
  "$150K-$200K",
  "$200K-$250K",
  "$250K-$300K",
  "$300K-$350K",
  "$350K-$400K",
  "$400K-$450K",
  "$450K-$500K",
  "$500K-$600K",
  "$600K-$750K",
  "$750K-$1M",
  "$1M-$1.5M",
  "$1.5M-$2M",
  "$2M+",
] as const;

// ── Timeline Options ──

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1-2 months",
  "3-6 months",
  "6-12 months",
  "12+ months",
  "Flexible",
] as const;

// ── Financing Options ──

export const FINANCING_OPTIONS = [
  "Cash",
  "HELOC",
  "Construction Loan",
  "Conventional Loan",
  "FHA 203k",
  "VA Loan",
  "Not Sure",
  "Other",
] as const;

// ── Lead Scores ──

export interface LeadScoreConfig {
  value: string;
  label: string;
  color: string;
}

export const LEAD_SCORES: LeadScoreConfig[] = [
  { value: "hot", label: "HOT", color: "#e74c3c" },
  { value: "warm", label: "Warm", color: "#f39c12" },
  { value: "cool", label: "Cool", color: "#3498db" },
  { value: "cold", label: "Cold", color: "#95a5a6" },
];

// ── Property Types ──

export const PROPERTY_TYPES = [
  "Single Family",
  "Condo / Townhome",
  "Multi-Family",
  "Commercial",
  "Vacant Lot",
  "Other",
] as const;

export const STORIES_OPTIONS = ["1", "1.5", "2", "2.5", "3+"] as const;
export const HOA_OPTIONS = ["Yes", "No", "Not Sure"] as const;

// ── Client Priorities ──

export const DEFAULT_PRIORITIES = [
  "Price / Budget",
  "Communication",
  "Timeline / Speed",
  "Quality / Craftsmanship",
  "Stay in Home During Construction",
  "Minimal Disruption",
  "Design Flexibility",
  "Warranty / Guarantee",
  "Specific Material Preferences",
  "Energy Efficiency",
  "Resale Value",
  "Accessibility / ADA",
  "Other",
] as const;

// ── Notes Tags ──

export const DEFAULT_NOTES_TAGS = [
  "Great client - easy to work with",
  "Difficult - manage expectations",
  "Win it at any cost",
  "High referral potential",
  "Budget-sensitive",
  "Needs a lot of hand-holding",
  "Very decisive - fast mover",
  "Shopping multiple contractors",
  "Has existing plans/architect",
  "Permit challenges expected",
  "Other",
] as const;

// ── Follow-Up Options (days) ──

export const FOLLOWUP_OPTIONS = ["1", "2", "3", "5", "7"] as const;

// ── Default Payment Milestones ──

export const DEFAULT_PAYMENT_MILESTONES = [
  { milestone: "Down Payment", percent: "", fixed: true, amount: "$1,000" },
  { milestone: "Upon Start / Mobilization", percent: "10", fixed: false, amount: "" },
  { milestone: "Upon Demolition Complete", percent: "10", fixed: false, amount: "" },
  { milestone: "Upon Foundation Pour", percent: "9", fixed: false, amount: "" },
  { milestone: "Upon Order Framing Materials", percent: "9", fixed: false, amount: "" },
  { milestone: "Upon Framing Complete", percent: "9", fixed: false, amount: "" },
  { milestone: "Upon Rough Electrical Complete", percent: "8", fixed: false, amount: "" },
  { milestone: "Upon Rough Plumbing Complete", percent: "8", fixed: false, amount: "" },
  { milestone: "Upon Insulation & Drywall Complete", percent: "7", fixed: false, amount: "" },
  { milestone: "Upon Cabinets Installed", percent: "7", fixed: false, amount: "" },
  { milestone: "Upon Countertops & Tile Complete", percent: "6", fixed: false, amount: "" },
  { milestone: "Upon Flooring Complete", percent: "6", fixed: false, amount: "" },
  { milestone: "Upon Paint & Trim Complete", percent: "6", fixed: false, amount: "" },
  { milestone: "Upon Final Punch List & Completion", percent: "5", fixed: false, amount: "" },
] as const;
