export interface ProjectType {
  id: string;
  label: string;
  icon?: string;
}

export const DEFAULT_PROJECT_TYPES: ProjectType[] = [
  { id: "interior_remodel", label: "Interior Remodel", icon: "\uD83C\uDFE0" },
  { id: "kitchen_remodel", label: "Kitchen Remodel", icon: "\uD83C\uDF73" },
  { id: "bathroom_remodel", label: "Bathroom Remodel", icon: "\uD83D\uDEBF" },
  { id: "new_bathroom", label: "New Bathroom / Powder Room", icon: "\uD83D\uDEBF\u2728" },
  { id: "addition_1st", label: "1st Story Addition", icon: "\uD83D\uDCD0" },
  { id: "addition_2nd", label: "2nd Story Addition", icon: "\uD83C\uDFD7\uFE0F" },
  { id: "adu_jadu", label: "ADU / JADU", icon: "\uD83C\uDFE1" },
  { id: "garage_conv", label: "Garage Conversion", icon: "\uD83D\uDE97" },
  { id: "garage_conv_1st", label: "Garage Conv + 1st Story Addition", icon: "\uD83D\uDE97\uD83D\uDCD0" },
  { id: "garage_conv_2nd", label: "Garage Conv + 2nd Story Addition", icon: "\uD83D\uDE97\uD83C\uDFD7\uFE0F" },
  { id: "interior_per_bedroom", label: "Interior (Per Bedroom)", icon: "\uD83D\uDECF\uFE0F" },
  { id: "new_construction", label: "New Construction", icon: "\uD83C\uDFD7\uFE0F" },
  { id: "roofing", label: "Roofing", icon: "\uD83C\uDFE0" },
  { id: "exterior_siding", label: "Exterior / Siding", icon: "\uD83E\uDDF1" },
  { id: "flooring", label: "Flooring", icon: "\uD83E\uDEB5" },
  { id: "painting", label: "Painting", icon: "\uD83C\uDFA8" },
  { id: "windows_doors", label: "Windows & Doors", icon: "\uD83E\uDE9F" },
  { id: "deck_patio", label: "Deck / Patio", icon: "\uD83E\uDEB4" },
  { id: "sunroom", label: "Sunroom (Kit Install)", icon: "\uD83C\uDF1E" },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "Single Family",
  "Condo / Townhome",
  "Multi-Family",
  "Commercial",
  "Vacant Lot",
  "Other",
] as const;

export const REFERRAL_SOURCE_OPTIONS = [
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

export const FINANCING_TYPES = [
  "Cash",
  "HELOC",
  "Construction Loan",
  "Conventional Loan",
  "FHA 203k",
  "VA Loan",
  "Not Sure",
  "Other",
] as const;

export const CLIENT_PRIORITY_OPTIONS = [
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
