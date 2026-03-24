export interface ProjectType {
  id: string;
  label: string;
}

export const DEFAULT_PROJECT_TYPES: ProjectType[] = [
  { id: "interior_remodel", label: "Interior Remodel" },
  { id: "kitchen_remodel", label: "Kitchen Remodel" },
  { id: "bathroom_remodel", label: "Bathroom Remodel" },
  { id: "new_bathroom", label: "New Bathroom" },
  { id: "addition_1st", label: "1st Story Addition" },
  { id: "addition_2nd", label: "2nd Story Addition" },
  { id: "adu_jadu", label: "ADU / JADU" },
  { id: "garage_conv", label: "Garage Conversion" },
  { id: "flooring", label: "Flooring" },
  { id: "roofing", label: "Roofing" },
  { id: "windows_doors", label: "Windows & Doors" },
  { id: "painting_ext", label: "Exterior Painting" },
  { id: "painting_int", label: "Interior Painting" },
  { id: "landscaping", label: "Landscaping" },
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing" },
  { id: "hvac", label: "HVAC" },
  { id: "foundation", label: "Foundation" },
  { id: "framing", label: "Framing" },
  { id: "stucco_siding", label: "Stucco / Siding" },
  { id: "patio_deck", label: "Patio / Deck" },
  { id: "pool_spa", label: "Pool / Spa" },
  { id: "solar", label: "Solar" },
  { id: "ev_charger", label: "EV Charger" },
  { id: "house_rewire", label: "House Rewire" },
  { id: "panel_upgrade", label: "Panel Upgrade" },
  { id: "recessed_lighting", label: "Recessed Lighting" },
  { id: "demolition", label: "Demolition" },
  { id: "custom", label: "Custom" },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "SFR",
  "Condo",
  "Multi-Family",
  "Commercial",
] as const;

export const REFERRAL_SOURCE_OPTIONS = [
  "Google",
  "Yelp",
  "Realm",
  "Referral",
  "Instagram",
  "Facebook",
  "HomeAdvisor",
  "Angi",
  "Houzz",
  "Other",
] as const;

export const FINANCING_TYPES = [
  "Cash",
  "Construction Loan",
  "HELOC",
  "FHA 203k",
  "VA Renovation",
  "Personal Loan",
  "Other",
] as const;

export const CLIENT_PRIORITY_OPTIONS = [
  "Price",
  "Communication",
  "Timeline",
  "Quality",
  "Design",
  "Flexibility",
] as const;
