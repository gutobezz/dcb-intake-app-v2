// ── Proposal data types ──

export type PipelineStatus = "active" | "sent" | "follow_up" | "won" | "lost";
export type LeadScore = "hot" | "warm" | "cool" | "cold";
export type PropertyType =
  | "Single Family"
  | "Condo / Townhome"
  | "Multi-Family"
  | "Commercial"
  | "Vacant Lot"
  | "Other";

export type FinancingType =
  | "Cash"
  | "HELOC"
  | "Construction Loan"
  | "Conventional Loan"
  | "FHA 203k"
  | "VA Loan"
  | "Not Sure"
  | "Other";

export type ReferralSource =
  | "Google Search"
  | "Google Ads"
  | "Yelp"
  | "Instagram"
  | "Facebook"
  | "TikTok"
  | "Houzz"
  | "Nextdoor"
  | "Angi / HomeAdvisor"
  | "Thumbtack"
  | "Zillow"
  | "Realm"
  | "Block Renovation"
  | "Referral - Past Client"
  | "Referral - Friend/Family"
  | "Referral - Realtor"
  | "Referral - Contractor"
  | "Drive-By / Yard Sign"
  | "Home Show / Event"
  | "Repeat Client"
  | "Builder Network"
  | "Architect Referral"
  | "Other";

export type Advisor =
  | "David"
  | "Chris"
  | "Kayley"
  | "Ben"
  | "Dylan"
  | "Kerry"
  | "Sean"
  | "Claire"
  | "Tanzin";

export interface AdditionalOwner {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface Allowance {
  description: string;
  amount: string;
}

export interface PaymentMilestone {
  milestone: string;
  amount: string;
  percentage: string;
  fixed?: boolean;
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
  additionalOwners: AdditionalOwner[];

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
  rti: boolean;
  lotSize: string;
  estimatedValue: string;
  lastSoldPrice: string;
  conditionNotes: string;

  // Scope
  projectTypes: string[];
  scopeItems: Record<string, boolean>;
  scopeNotes: Record<string, string>;
  descOverrides: Record<string, string>;
  finishSelections: Record<string, string>;
  scopeCounts: Record<string, number>;

  // Details
  projectPrice: string;
  downPayment: string;
  budgetRange: string;
  timeline: string;
  desiredStartDate: string;
  startDate: string;
  completionDate: string;
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
  additionalOwners: [],

  address: "",
  propertyType: "",
  yearBuilt: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  stories: "",
  hoa: false,
  hasPlans: false,
  rti: false,
  lotSize: "",
  estimatedValue: "",
  lastSoldPrice: "",
  conditionNotes: "",

  projectTypes: [],
  scopeItems: {},
  scopeNotes: {},
  descOverrides: {},
  finishSelections: {},
  scopeCounts: {},

  projectPrice: "",
  downPayment: "",
  budgetRange: "",
  timeline: "",
  desiredStartDate: "",
  startDate: "",
  completionDate: "",
  financing: "",
  allowances: [],
  paymentSchedule: [
    { milestone: "Down Payment", amount: "$1,000", percentage: "", fixed: true },
    { milestone: "Upon Start / Mobilization", amount: "", percentage: "10" },
    { milestone: "Upon Demolition Complete", amount: "", percentage: "10" },
    { milestone: "Upon Foundation Pour", amount: "", percentage: "9" },
    { milestone: "Upon Order Framing Materials", amount: "", percentage: "9" },
    { milestone: "Upon Framing Complete", amount: "", percentage: "9" },
    { milestone: "Upon Rough Electrical Complete", amount: "", percentage: "8" },
    { milestone: "Upon Rough Plumbing Complete", amount: "", percentage: "8" },
    { milestone: "Upon Insulation & Drywall Complete", amount: "", percentage: "7" },
    { milestone: "Upon Cabinets Installed", amount: "", percentage: "7" },
    { milestone: "Upon Countertops & Tile Complete", amount: "", percentage: "6" },
    { milestone: "Upon Flooring Complete", amount: "", percentage: "6" },
    { milestone: "Upon Paint & Trim Complete", amount: "", percentage: "6" },
    { milestone: "Upon Final Punch List & Completion", amount: "", percentage: "5" },
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
  /** Standard item -- pre-checked when project type is selected */
  std?: boolean;
  /** Optional add-on -- shown with "Optional" badge */
  opt?: boolean;
  /** Key into FINISH_OPTIONS for a finish-selection dropdown */
  finishKey?: string;
  /** Second finish key (e.g. drywall level + texture) */
  finishKey2?: string;
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
      { id: "i1", title: "Design, Architectural & Engineering Plans", std: true, description: "Conduct multiple in-depth meetings with the client to fully understand their design preferences, lifestyle needs, and aesthetic goals.\nDiscuss design styles and explore functional priorities.\nAllow time for multiple rounds of feedback, revisions, and updates.\nDevelop detailed architectural plans including floor plans, elevations, sections, and construction documents.\nAssist in the permit acquisition process through the local building department.\nWork with a structural engineer to ensure design feasibility and structural integrity." },
      { id: "i2", title: "Demolition & Haul Away", description: "Protect all surfaces, fixtures, and finishes outside the work area with coverings and dust barriers.\nDemo according to approved demolition plan.\nHaul and dump all debris and trash throughout the duration of the project.\nMaintain a clean and safe work environment at all times." },
      { id: "i3", title: "Bearing Wall Removal & Layout Change", description: "Install temporary support walls to ensure structural stability before demolition.\nDemo existing walls per engineering and architectural plans.\nFrame and install support beams, headers, and posts per structural engineer's specifications.\nInstall bearing pads and posts per engineering plan.\nDrywall, tape, mud, texture, and paint all exposed areas to match existing wall finishes." },
      { id: "i4", title: "Framing & Structural", description: "Frame new walls, hallways, and door openings per approved architectural plans.\nFrame new closets, niches, and built-in areas as specified.\nInstall blocking for cabinets, handrails, TV mounts, and other wall-mounted fixtures.\nPass all required framing inspections to ensure compliance with building codes." },
      { id: "i5", title: "Electrical -- Rough", description: "Run all new electrical circuits, outlets, and switch locations per approved plans.\nInstall dedicated circuits for appliances, HVAC, and other high-draw equipment.\nInstall all junction boxes, conduit, and wiring.\nPass rough electrical inspection." },
      { id: "i5b", title: "Electrical -- Finish", description: "Install recessed lighting, pendant fixtures, under-cabinet lighting, and decorative fixtures.\nInstall all switches, dimmers, outlets, and cover plates.\nInstall smoke detectors and CO detectors per code.\nTest all circuits and verify operation.\nPass final electrical inspection." },
      { id: "i6", title: "Plumbing -- Rough", description: "Rough-in all new plumbing supply and drain lines per approved plans.\nRelocate or add plumbing fixtures as required by the new layout.\nInstall shut-off valves at all new fixture locations.\nPass rough plumbing inspection." },
      { id: "i6b", title: "Plumbing -- Finish", description: "Connect and test all fixtures including sinks, faucets, and supply lines.\nInstall garbage disposal and appliance hookups.\nInstall all plumbing trim and accessories.\nTest for leaks and verify operation.\nPass final plumbing inspection." },
      { id: "i7", title: "HVAC / Mini Split", finishKey: "mini_split", description: "Extend or modify existing HVAC ductwork to serve new or reconfigured spaces.\nInstall new supply and return vents per approved mechanical plan.\nInstall mini split system(s) for supplemental or primary heating/cooling if specified.\nEnsure proper airflow and climate control throughout the remodeled areas.\nPass all required HVAC inspections." },
      { id: "i8", title: "Insulation", finishKey: "insulation_type", description: "Install insulation in all new and opened per Title 24 energy requirements.\nInsulate ceiling cavities and any exposed floor areas per code.\nPass all required insulation and energy inspections." },
      { id: "i9", title: "Drywall, Tape, Mud & Texture", finishKey: "drywall_level", finishKey2: "drywall_texture", description: "Hang drywall on all new and opened framed walls and ceilings.\nTape, mud, and sand all joints and seams to specified finish level.\nApply texture to match existing or per client selection.\nPrepare all surfaces for primer and paint." },
      { id: "i10", title: "Interior Doors & Hardware", finishKey: "doors", description: "Install new interior doors per plan -- style and material selected by client.\nInstall all door hardware including handles, hinges, and stops.\nApply trim and casing around all new door openings to match existing or new trim profile.\nAdjust and align all doors for proper fit and operation." },
      { id: "i11", title: "Flooring Installation", finishKey: "flooring", description: "Remove existing flooring as needed and prep subfloor for new material.\nInstall new flooring throughout specified areas.\nInstall baseboards, shoe molding, and transition strips at all thresholds and material changes.\nEnsure all seams, edges, and transitions are clean and properly finished." },
      { id: "i12", title: "Interior Paint", finishKey: "specialty_paint", description: "Prep all surfaces including patching, sanding, caulking, and priming as needed.\nApply two coats of premium interior paint to all new and existing walls within the scope.\nPaint all new trim, doors, and casings to match client's selected color scheme.\nProtect all flooring, fixtures, and finished surfaces during painting." },
      { id: "i13", title: "Trim, Baseboards & Millwork", description: "Install new baseboards and window/door casings per design plan.\nInstall wainscoting, chair rail, or accent molding where specified.\nFill all nail holes, caulk joints, and sand smooth before paint." },
      { id: "i14", title: "Bedroom Reconfiguration", description: "Create new room layout per approved architectural plan.\nFrame new walls, closets, and door openings.\nSplit or reconfigure rooms including framing, blocking, and headers.\nReroute electrical circuits, switches, and outlets per new layout.\nInstall drywall, tape, mud, texture, and paint to match.\nInstall new doors, hardware, and trim." },
      { id: "i15", title: "Window Replacement", finishKey: "windows", description: "Remove existing windows and prepare openings for new units.\nInstall new energy-efficient windows -- style and material selected by client.\nFlash, seal, and weatherproof all window openings per manufacturer specs.\nInstall interior and exterior trim and casing.\nPass all required inspections." },
      { id: "i16", title: "Closet Build-Out", description: "Frame new closet spaces per approved plans.\nInstall closet shelving systems, rods, and organizer components.\nInstall closet doors -- sliding, bifold, or hinged per client selection.\nDrywall, paint, and trim interior of all new closet spaces." },
      { id: "i18", title: "Hardwood Floor Restoration", finishKey: "flooring", description: "Inspect and assess condition of existing hardwood floors -- identify damage, wear, stains, and gaps.\nSand all hardwood surfaces using progressive grits to remove old finish and level the surface.\nFill gaps, cracks, and nail holes with matching wood filler.\nRepair or replace damaged boards as needed.\nApply wood stain if specified by client.\nApply 3 coats of polyurethane finish (water-based or oil-based per client preference).\nLight sand between coats for proper adhesion.\nProtect finished floors during remaining construction phases." },
      { id: "i19", title: "Roof Tear-Off & Demo", opt: true, description: "Set up temporary weather protection before roof removal.\nRemove all existing roofing material down to the roof deck.\nInspect roof deck/sheathing for rot, damage, or deterioration.\nReplace any damaged plywood or OSB sheathing with new material.\nHaul and dump all old roofing materials.\nInstall protective tarps and barriers during tear-off." },
      { id: "i20", title: "Roof Deck Inspection & Repair", opt: true, description: "Inspect entire roof deck for rot, soft spots, and structural damage.\nReplace any rotted or damaged plywood/OSB sheathing.\nRe-nail or re-secure any loose sheathing to rafters.\nInstall additional blocking or framing reinforcement where needed.\nEnsure entire roof deck is solid, level, and ready for new roofing." },
      { id: "i21", title: "New Roof Installation", opt: true, finishKey: "roofing", description: "Install synthetic underlayment over entire roof deck.\nInstall ice & water shield at critical areas per code.\nInstall new roofing material per approved plan.\nInstall starter course, field material, and ridge cap.\nFlash all roof-to-wall transitions, valleys, and penetrations.\nInstall drip edge at all eaves and rakes.\nInstall ridge vent for proper attic ventilation.\nInstall gutters and downspouts per plan.\nPerform magnetic nail sweep and clean-up." },
      { id: "int_ka1", title: "Kitchen -- Cabinets", std: true, finishKey: "cabinets", description: "Install all base and upper cabinets per approved kitchen layout.\nLevel, shim, and secure to wall studs and blocking.\nInstall all hardware -- handles, pulls, knobs, hinges." },
      { id: "int_ka2", title: "Kitchen -- Countertops", std: true, finishKey: "countertops", description: "Template countertops after cabinets are installed.\nFabricate with specified edge profile.\nInstall with proper support and seams.\nCut sink and cooktop cutouts." },
      { id: "int_ka3", title: "Kitchen -- Backsplash", std: true, finishKey: "backsplash", description: "Prep wall surfaces and install backsplash per design.\nGrout, seal, and clean all surfaces.\nInstall edge trim at all exposed edges." },
      { id: "int_ka4", title: "Kitchen -- Flooring", std: true, finishKey: "flooring", description: "Remove existing kitchen flooring and prep subfloor.\nInstall new kitchen flooring.\nInstall baseboards and transition strips." },
      { id: "int_ka5", title: "Kitchen -- Plumbing Fixtures", std: true, description: "Install kitchen sink -- undermount, farmhouse, or other per design.\nInstall faucet, sprayer, soap dispenser, and accessories.\nInstall and wire garbage disposal.\nConnect dishwasher drain and supply." },
      { id: "int_ka6", title: "Kitchen -- Range Hood & Venting", std: true, description: "Install range hood with ductwork vented to exterior.\nEnsure adequate supply and return air to kitchen." },
      { id: "int_ka7", title: "Kitchen -- Appliance Installation", std: true, description: "Receive and install all client-purchased appliances.\nEnsure proper electrical, gas, and plumbing connections.\nVerify all appliances are level, secured, and operational.\nNote: Company will not install high-end appliances -- to be installed by distributor/manufacturer." },
      { id: "int_ka8", title: "Kitchen -- Lighting", std: true, description: "Install recessed lights, pendants, and under-cabinet LEDs.\nInstall all switches, dimmers, and smart controls." },
      { id: "int_ba1", title: "Bathroom -- Tub/Shower", std: true, finishKey: "tub_shower", description: "Install tub or shower base per design.\nWaterproof all wet areas with membrane system.\nInstall cement board or tile backer on all wet walls.\nBuild bench, curb, and niche per design.\nFlood test to verify waterproofing." },
      { id: "int_ba2", title: "Bathroom -- Tile Work", std: true, description: "Install wall tile in shower/tub surround -- floor to ceiling or per design.\nInstall floor tile with proper slope to drain.\nInstall accent tile and niche tile per design.\nGrout, seal, and clean all surfaces." },
      { id: "int_ba3", title: "Bathroom -- Vanity & Countertop", std: true, finishKey: "vanity", description: "Install vanity cabinet and countertop.\nInstall undermount or vessel sink per design.\nInstall faucet, drain assembly, and mirror.\nConnect plumbing supply and drain." },
      { id: "int_ba4", title: "Bathroom -- Shower Glass", std: true, description: "Measure and order frameless or semi-frameless glass enclosure per design.\nInstall glass door and panels with proper hardware and seals.\nAlign, adjust, and silicone all glass components." },
      { id: "int_ba5", title: "Bathroom -- Toilet & Fixtures", std: true, description: "Install toilet with wax ring, bolts, and supply line.\nInstall all plumbing trim and escutcheons.\nInstall towel bars, TP holder, robe hooks, and all accessories." },
      { id: "int_ba6", title: "Bathroom -- Lighting & Exhaust", std: true, description: "Install vanity light fixture, recessed lights, and accent lighting.\nInstall exhaust fan -- standard or combination fan/light/heater unit.\nInstall all switches, dimmers, and cover plates." },
      { id: "i17", title: "Final Clean & Punch List", description: "Perform thorough final cleaning of all work areas including dusting, vacuuming, and wiping all surfaces.\nConduct detailed walk-through with client to identify any remaining punch list items.\nComplete all punch list items.\nRemove all construction materials, tools, and debris from the property." },
    ],
  },
  {
    id: "kitchen_remodel",
    label: "Kitchen Remodel",
    items: [
      { id: "k1", title: "Design, Architectural & Engineering Plans", std: true, description: "Conduct initial consultation and follow-up meetings to understand client's kitchen workflow, storage needs, and design preferences.\nDevelop detailed kitchen layout including cabinet placement, appliance locations, island configuration, and lighting plan.\nPrepare architectural drawings and construction documents for permit submission.\nCoordinate with structural engineer if bearing walls are being modified.\nAssist in permit acquisition through local building department." },
      { id: "k0a", title: "Layout Change / Plumbing Reroute", finishKey: "layout_change", description: "Determine if the kitchen layout is changing and whether plumbing fixtures need to be rerouted.\nIdentify sink, dishwasher, and island plumbing relocation requirements.\nAssess impact on existing drain lines, venting, and supply routing.\nCoordinate with structural engineer if slab work or foundation penetrations are needed." },
      { id: "k2", title: "Demolition & Haul Away", description: "Remove all existing cabinets, countertops, backsplash, flooring, and fixtures within the kitchen scope.\nCap and protect all plumbing and electrical during demolition.\nSet up dust barriers and floor protection to contain debris.\nHaul and dump all demolition materials throughout the project." },
      { id: "k3", title: "Bearing Wall Removal / Layout Change", description: "Install temporary shoring and support before any structural demolition.\nRemove bearing walls or partial walls per structural engineer's plan.\nInstall engineered beams, headers, posts, and connection hardware per approved plans.\nFrame new wall locations, pass-throughs, or openings per architectural plan.\nPatch and finish all affected ceiling and wall surfaces." },
      { id: "k4", title: "Framing & Structural", description: "Frame new walls, soffits, and openings per approved kitchen layout.\nInstall blocking for upper cabinets, range hood, TV mount, and shelving.\nFrame island base and any peninsula or bar areas.\nEnsure all framing meets code and passes required inspections." },
      { id: "k5", title: "Electrical", description: "Install dedicated 20-amp circuits for countertop receptacles per code (GFCI protected).\nInstall dedicated circuits for range/oven, dishwasher, disposal, microwave, and refrigerator.\nRough-in wiring for recessed lighting, pendant lights.\nInstall all switches, dimmers, outlets, and cover plates.\nPass all required electrical inspections." },
      { id: "k6", title: "Plumbing", description: "Rough-in supply and drain lines for kitchen sink in new or relocated position.\nInstall dedicated supply lines for dishwasher, refrigerator water line, and pot filler if specified.\nInstall new shut-off valves at all fixture locations.\nConnect and test all plumbing fixtures, garbage disposal, and appliance hookups.\nPass all required plumbing inspections." },
      { id: "k7", title: "HVAC / Range Hood Venting", finishKey: "mini_split", description: "Install range hood ductwork and vent to exterior per manufacturer specifications.\nModify existing HVAC ductwork if kitchen layout has changed.\nEnsure adequate supply and return air to the kitchen area.\nPass all required mechanical inspections." },
      { id: "k8", title: "Insulation & Drywall", finishKey: "drywall_level", finishKey2: "drywall_texture", description: "Insulate any new or opened per Title 24 energy code.\nHang, tape, mud, and sand all joints to specified finish level.\nApply texture to match existing or per client selection.\nPrepare all surfaces for primer and paint." },
      { id: "k9", title: "Cabinet Installation", finishKey: "cabinets", description: "Install all base and upper cabinets per approved kitchen layout.\nLevel, shim, and secure all cabinets to wall studs and blocking.\nInstall all cabinet hardware -- handles, pulls, knobs, and hinges per client selection.\nAdjust all doors and drawers for proper alignment and operation." },
      { id: "k10", title: "Countertop Fabrication & Installation", finishKey: "countertops", description: "Template countertops after cabinets are installed and level.\nFabricate countertops from client-selected material with specified edge profile.\nInstall countertops with proper support, seams, and adhesion.\nCut and finish sink cutout and cooktop cutout if applicable.\nInstall backsplash return or waterfall edge if specified." },
      { id: "k11", title: "Backsplash Installation", finishKey: "backsplash", description: "Prep wall surfaces behind countertop for backsplash installation.\nInstall backsplash per design layout -- material and pattern selected by client.\nGrout, seal, and clean all tile/slab surfaces.\nInstall edge trim or finishing pieces at all exposed edges." },
      { id: "k12", title: "Flooring Installation", finishKey: "flooring", description: "Remove existing kitchen flooring and prep subfloor for new material.\nInstall new flooring throughout kitchen.\nInstall baseboards, shoe molding, and transition strips at all doorways and material changes.\nEnsure proper expansion gaps and moisture barriers where required." },
      { id: "k13", title: "Plumbing Fixtures & Connections", description: "Install kitchen sink -- style and material per client selection (undermount, farmhouse, etc.).\nInstall faucet, sprayer, soap dispenser, and accessories.\nInstall and wire garbage disposal unit.\nConnect dishwasher drain, supply, and electrical.\nTest all connections for leaks and proper operation." },
      { id: "k14", title: "Appliance Installation", description: "Receive and install all client-purchased appliances.\nEnsure proper electrical, gas, and plumbing connections.\nVerify all appliances are level, secured, and operational.\nNote: Appliances are owner-supplied unless otherwise agreed. Company will not install high-end appliances -- to be installed by distributor/manufacturer." },
      { id: "k15", title: "Interior Paint", finishKey: "specialty_paint", description: "Prep and prime all new drywall surfaces, patched areas, and trim.\nApply two coats of premium paint to kitchen walls and ceiling.\nPaint all trim, casings, and door frames to match client's color scheme.\nPerform final touch-ups after all trades are complete." },
      { id: "k16", title: "Lighting & Fixtures", description: "Install all recessed lights, pendant fixtures, and chandeliers per lighting plan.\nInstall under-cabinet LED lighting with switch or dimmer control.\nInstall all decorative fixtures, sconces, and accent lighting.\nProgram and test all dimmers and smart switches if applicable." },
      { id: "k17", title: "Final Clean & Punch List", description: "Perform detailed final clean of all kitchen surfaces, cabinets, appliances, and fixtures.\nConduct walk-through with client to review all completed work.\nAddress and complete all punch list items.\nRemove all construction materials and debris from the property." },
    ],
  },
  {
    id: "bathroom_remodel",
    label: "Bathroom Remodel",
    items: [
      { id: "b1", title: "Design & Plans", std: true, description: "Consult with client on bathroom layout, fixture placement, tile design, and storage needs.\nPrepare detailed bathroom floor plan and elevation drawings.\nSelect and specify all fixtures, finishes, and materials with client.\nSubmit for permits if required by scope of work." },
      { id: "b0a", title: "Layout Change / Fixture Reroute", finishKey: "layout_change", description: "Determine if the bathroom layout is changing and whether fixtures need to be rerouted.\nIdentify toilet, vanity, tub/shower relocation requirements.\nAssess impact on existing drain lines, venting, and supply routing.\nCoordinate with structural engineer if slab work is needed for drain relocation." },
      { id: "b2", title: "Demolition & Haul Away", description: "Remove all existing fixtures including vanity, toilet, tub/shower, mirrors, and accessories.\nDemo existing tile, flooring, and wall surfaces within scope.\nCap all plumbing and protect electrical during demo.\nSet up dust barriers and haul all debris throughout the project." },
      { id: "b3", title: "Framing & Layout Changes", description: "Frame new walls, niches, or half-walls per approved bathroom layout.\nFrame shower bench, curb, and niche openings.\nInstall blocking for grab bars, shower glass, vanity mirror, and accessories.\nRelocate door opening if specified in the plan." },
      { id: "b4", title: "Plumbing Rough-In", description: "Relocate or install new supply and drain lines for tub/shower, vanity, and toilet.\nInstall new shut-off valves at all fixture locations.\nInstall shower valve and diverter per client's fixture selection.\nRough-in for body sprays, handheld shower, or rain head if specified.\nPass all required plumbing inspections." },
      { id: "b5", title: "Electrical", description: "Install GFCI-protected outlets per code -- vanity area and general use.\nRun circuits for exhaust fan, towel warmer, and lighting.\nRough-in wiring for vanity lights, recessed lights, and any accent lighting.\nInstall exhaust fan rated for bathroom size and duct to exterior.\nPass all required electrical inspections." },
      { id: "b6", title: "Tub / Shower Installation", finishKey: "tub_shower", description: "Install new tub or shower base/pan -- type selected by client.\nWaterproof all shower walls and floor using membrane system (Kerdi, RedGard, or equivalent).\nInstall cement board or tile backer on all wet-area walls.\nBuild shower bench, curb, and recessed niche per design.\nPerform flood test to verify waterproofing before tile." },
      { id: "b7", title: "Tile Work", description: "Install wall tile in shower/tub surround.\nInstall floor tile throughout bathroom with proper slope to drain.\nInstall accent tile, listello, or mosaic niche tile per design.\nGrout all tile joints with specified grout color.\nSeal all grout lines and natural stone surfaces.\nInstall tile edge trim at all exposed edges and transitions." },
      { id: "b8", title: "Vanity, Countertop & Mirror", finishKey: "countertops", finishKey2: "vanity", description: "Install bathroom vanity -- single or double per client selection.\nInstall countertop with sink cutout(s).\nSecure vanity to wall studs and level.\nInstall all vanity hardware, soft-close hinges, and drawer slides.\nConnect plumbing supply and drain." },
      { id: "b9", title: "Plumbing Fixtures & Trim", description: "Install faucet(s), drain assemblies, and pop-up stops at vanity.\nInstall shower valve trim, shower head, and hand-held sprayer.\nInstall toilet -- style per client selection.\nConnect and test all fixtures for leaks and proper operation.\nInstall toilet accessories (seat, supply line, etc.)." },
      { id: "b10", title: "Shower Glass / Enclosure", description: "Measure and order frameless or semi-frameless glass enclosure per design.\nInstall shower glass door and fixed panels with proper hardware.\nSeal all glass-to-tile connections with silicone.\nVerify smooth operation of door and hardware.\nNote: Lead time for custom glass is typically 2-4 weeks." },
      { id: "b11", title: "Drywall, Interior Paint", finishKey: "specialty_paint", description: "Hang, tape, mud, and texture all new and repaired drywall surfaces.\nUse moisture-resistant drywall (green board or purple board) in all wet areas.\nPrime and apply two coats of premium paint.\nPaint all trim, door, and casings to match." },
      { id: "b12", title: "Accessories & Final", description: "Install mirrors, medicine cabinets, and vanity lighting.\nInstall towel bars, robe hooks, toilet paper holder, and shower accessories.\nInstall grab bars if specified (ADA or aging-in-place).\nCaulk all fixtures, trim, and transitions.\nPerform final walk-through and complete punch list items." },
      { id: "b13", title: "Flooring", finishKey: "flooring", description: "Remove existing bathroom flooring and prep subfloor.\nInstall waterproof membrane under floor tile if applicable.\nInstall floor tile with proper slope and grout.\nInstall baseboards and transition strips." },
    ],
  },
  {
    id: "new_bathroom",
    label: "New Bathroom",
    items: [
      { id: "nb0", title: "Layout & Plumbing Planning", std: true, finishKey: "layout_change", description: "Consult with client on bathroom location, size, layout, and intended use (full bath, 3/4 bath, half bath / powder room).\nDevelop architectural plans showing new bathroom layout with fixture placement, dimensions, and door swing.\nCoordinate with structural engineer if any load-bearing modifications are required.\nPrepare Title 24 energy calculations if applicable.\nSubmit for permit and manage plan check process." },
      { id: "nb1", title: "Demolition & Prep", description: "Protect all existing surfaces and finishes outside the work area with coverings and dust barriers.\nRemove existing wall finishes, flooring, and ceiling in the area designated for the new bathroom.\nSaw-cut and remove slab or subfloor sections for new drain lines.\nCap and protect existing utilities during demolition.\nHaul and dump all debris throughout the project." },
      { id: "nb2", title: "Framing", description: "Frame all new partition walls for the bathroom per approved plan.\nFrame door opening with proper header and cripple studs.\nInstall blocking in all walls for vanity, mirrors, grab bars, shower glass, towel bars, and accessories.\nFrame shower niche(s) and any built-in shelving per design.\nFrame for exhaust fan, lighting, and any ceiling details.\nPass all required framing inspections." },
      { id: "nb3", title: "Plumbing -- Rough", description: "Rough-in all new plumbing supply and drain lines per approved plans.\nInstall toilet flange, vanity supply/drain, and shower/tub supply and drain in proper locations.\nInstall shut-off valves at all fixture locations.\nInstall shower valve rough-in at proper height per plan.\nVent all fixtures per plumbing code.\nPass all required rough plumbing inspections." },
      { id: "nb4", title: "Plumbing -- Finish", description: "Install toilet and connect to flange with proper wax ring and bolts.\nInstall vanity faucet, drain assembly, and supply lines.\nInstall shower valve trim, diverter, shower head, and hand shower per client selection.\nInstall all plumbing trim, escutcheons, and accessories.\nTest all connections for leaks and verify proper drainage.\nPass all required final plumbing inspections." },
      { id: "nb5", title: "Electrical -- Rough", description: "Run all new electrical circuits per approved plans.\nInstall dedicated circuit for exhaust fan.\nInstall outlet, switch, and lighting boxes per plan.\nInstall GFCI protection for all bathroom outlets per code.\nPass rough electrical inspection." },
      { id: "nb6", title: "Electrical -- Finish", description: "Install all outlets, switches, dimmers, and cover plates.\nInstall vanity light fixture, recessed lights, and any decorative lighting.\nInstall exhaust fan -- standard or combination fan/light/heater unit.\nTest all circuits and pass final electrical inspection." },
      { id: "nb7", title: "Insulation & Drywall", finishKey: "insulation_type", description: "Install insulation in all new and exterior walls per Title 24.\nHang moisture-resistant drywall (green board or purple board) on all walls and ceiling.\nTape, mud, and sand all joints to specified finish level.\nApply texture per client selection." },
      { id: "nb8", title: "Waterproofing & Tile", finishKey: "tub_shower", description: "Apply waterproofing membrane to all shower walls, floor, curb, and niche(s).\nInstall shower pan with proper slope to drain -- prefab base or custom mud bed.\nInstall wall tile in shower area -- floor to ceiling or per design.\nInstall floor tile throughout bathroom with proper slope and non-slip surface.\nInstall tile on shower curb, niche, and any accent areas.\nGrout, seal, and caulk all tile joints and transitions." },
      { id: "nb9", title: "Vanity, Countertop & Mirror", finishKey: "countertops", finishKey2: "vanity", description: "Install vanity cabinet -- single or double per plan and client selection.\nInstall countertop -- prefab quartz, marble, or other per client selection.\nInstall undermount or vessel sink per design.\nInstall mirror -- framed or frameless per client selection.\nSecure all components to wall with proper blocking and hardware." },
      { id: "nb10", title: "Shower Glass", description: "Measure and order shower glass enclosure per design -- frameless, semi-frameless, or framed.\nInstall glass door and panels with proper hardware and seals.\nAlign, adjust, and silicone all glass components." },
      { id: "nb11", title: "Interior Paint", finishKey: "specialty_paint", description: "Prep all surfaces including patching, sanding, caulking, and priming.\nApply two coats of premium moisture-resistant paint to all walls and ceiling.\nPaint door, trim, and casings to match client selection." },
      { id: "nb12", title: "Door, Trim & Accessories", finishKey: "doors", description: "Install bathroom door with hardware -- privacy lock set per client selection.\nInstall baseboards, door casing, and any crown molding.\nInstall towel bars, toilet paper holder, robe hooks, and all accessories.\nInstall shower shelf, corner caddy, or other storage accessories." },
      { id: "nb13", title: "Final Clean & Punch List", description: "Perform thorough final cleaning of the new bathroom.\nConduct detailed walk-through with client to identify punch list items.\nComplete all punch list items." },
    ],
  },
  {
    id: "addition_1st",
    label: "1st Story Addition",
    items: [
      { id: "a1_1", title: "Design, Architectural & Engineering Plans", std: true, description: "Meet with client to define the addition scope, room types, and design goals.\nDevelop architectural plans including floor plans, elevations, sections, roof plan, and construction details.\nCoordinate structural engineering for foundation, framing, and connection to existing structure.\nPrepare Title 24 energy calculations and any required soils/geotechnical reports.\nSubmit plans for permit and assist through plan check revisions." },
      { id: "a1_2", title: "Site Prep & Excavation", description: "Survey and stake addition footprint per approved site plan.\nExcavate for foundation per geotechnical and structural engineer's specifications.\nGrade and compact soil to proper bearing capacity.\nInstall temporary shoring if required to protect existing structure.\nManage soil export and debris removal." },
      { id: "a1_3", title: "Foundation", finishKey: "foundation", description: "Form and pour continuous or spread footings per structural plan.\nInstall anchor bolts, hold-downs, and connection hardware per engineering.\nPour stem walls and/or slab on grade per approved foundation plan.\nInstall moisture barrier and underslab insulation per code.\nPass all required foundation inspections before backfill." },
      { id: "a1_4", title: "Framing", description: "Frame all exterior and interior walls per approved architectural plans.\nInstall floor framing, joists, and subfloor.\nFrame roof structure including rafters, ridge beam, and ceiling joists per structural plan.\nInstall engineered beams, headers, and posts per structural engineer's specifications.\nInstall shear wall, hold-down, and tie-down hardware per engineering.\nFrame connection between new addition and existing structure per approved details.\nInstall all blocking for cabinets, fixtures, and mechanical.\nPass all required framing inspections." },
      { id: "a1_5", title: "Roofing", finishKey: "roofing", description: "Install roof sheathing, underlayment, and ice & water shield at all critical areas.\nInstall roofing material per client selection.\nFlash and seal all roof-to-wall transitions, valleys, and penetrations.\nInstall gutters and downspouts per plan.\nTie new roof into existing roof structure with proper flashing and waterproofing.\nPass all required roofing inspections." },
      { id: "a1_6", title: "Windows & Exterior Doors", finishKey: "windows", description: "Install all new windows per approved plans -- style and material selected by client.\nFlash and weatherproof all window and door openings per manufacturer specs.\nInstall exterior doors including entry, sliding, or French doors as specified.\nInstall all hardware, locks, and weatherstripping.\nPass energy compliance inspections." },
      { id: "a1_7", title: "Exterior Finish", finishKey: "siding", description: "Install exterior sheathing, house wrap, and flashing per code.\nInstall exterior finish material per approved plan.\nMatch exterior finish of existing home for seamless transition.\nInstall exterior trim, fascia boards, and soffit vents.\nApply exterior paint or finish coats." },
      { id: "a1_8", title: "Electrical", description: "Run all new electrical circuits per approved electrical plan.\nInstall all outlets, switches, dimmers, and dedicated appliance circuits.\nInstall recessed lights, fixture boxes, and exterior lighting.\nInstall smoke detectors, CO detectors, and arc-fault breakers per current code.\nPass all required electrical inspections." },
      { id: "a1_9", title: "Plumbing", description: "Install new plumbing supply and drain lines per approved plans.\nConnect new plumbing to existing house main lines.\nInstall shut-off valves at all new fixture locations.\nInstall hose bibs and exterior cleanouts as required.\nPass all required plumbing inspections." },
      { id: "a1_10", title: "HVAC", finishKey: "mini_split", description: "Extend existing HVAC system or install new dedicated unit for the addition.\nInstall all ductwork, supply vents, and return air per mechanical plan.\nPerform Manual J load calculation to ensure proper system sizing.\nInstall new thermostat or zone controller as needed.\nPass all required HVAC inspections." },
      { id: "a1_11", title: "Insulation", finishKey: "insulation_type", description: "Install wall insulation in all exterior and interior shared per Title 24.\nInstall ceiling/roof insulation per energy code requirements.\nPass all required energy and insulation inspections." },
      { id: "a1_12", title: "Drywall & Paint", finishKey: "drywall_level", finishKey2: "drywall_texture", description: "Hang drywall on all walls and ceilings throughout the addition.\nTape, mud, sand, and texture all surfaces to match existing or per client selection.\nPrime and apply two coats of premium interior paint throughout.\nPaint all trim, doors, and casings." },
      { id: "a1_13", title: "Flooring", finishKey: "flooring", description: "Install subfloor prep, leveling, and moisture barriers as needed.\nInstall flooring throughout addition.\nInstall baseboards, shoe molding, and transition strips at all thresholds." },
      { id: "a1_14", title: "Interior Doors, Trim & Millwork", finishKey: "doors", description: "Install all interior doors with hardware per client selection.\nInstall baseboards, window casings, and door trim per design.\nInstall closet shelving, rods, and organizer systems.\nFill, caulk, sand, and paint all trim." },
      { id: "add_ka1", title: "Kitchen -- Cabinets", opt: true, finishKey: "cabinets", description: "Install all base and upper cabinets per approved kitchen layout.\nLevel, shim, and secure to wall studs and blocking.\nInstall all hardware -- handles, pulls, knobs, hinges." },
      { id: "add_ka2", title: "Kitchen -- Countertops", opt: true, finishKey: "countertops", description: "Template countertops after cabinets are installed.\nFabricate with specified edge profile.\nInstall with proper support and seams.\nCut sink and cooktop cutouts." },
      { id: "add_ka3", title: "Kitchen -- Backsplash", opt: true, finishKey: "backsplash", description: "Prep wall surfaces and install backsplash per design.\nGrout, seal, and clean all surfaces.\nInstall edge trim at all exposed edges." },
      { id: "add_ka4", title: "Kitchen -- Flooring", opt: true, finishKey: "flooring", description: "Remove existing kitchen flooring and prep subfloor.\nInstall new kitchen flooring.\nInstall baseboards and transition strips." },
      { id: "add_ka5", title: "Kitchen -- Plumbing Fixtures", opt: true, description: "Install kitchen sink -- undermount, farmhouse, or other per design.\nInstall faucet, sprayer, soap dispenser, and accessories.\nInstall and wire garbage disposal.\nConnect dishwasher drain and supply." },
      { id: "add_ka6", title: "Kitchen -- Range Hood & Venting", opt: true, description: "Install range hood with ductwork vented to exterior.\nEnsure adequate supply and return air to kitchen." },
      { id: "add_ka7", title: "Kitchen -- Appliance Installation", opt: true, description: "Receive and install all client-purchased appliances.\nEnsure proper electrical, gas, and plumbing connections.\nVerify all appliances are level, secured, and operational.\nNote: Company will not install high-end appliances -- to be installed by distributor/manufacturer." },
      { id: "add_ka8", title: "Kitchen -- Lighting", opt: true, description: "Install recessed lights, pendants, and under-cabinet LEDs.\nInstall all switches, dimmers, and smart controls." },
      { id: "add_ba1", title: "Bathroom -- Tub/Shower", opt: true, finishKey: "tub_shower", description: "Install tub or shower base per design.\nWaterproof all wet areas with membrane system.\nInstall cement board or tile backer on all wet walls.\nBuild bench, curb, and niche per design.\nFlood test to verify waterproofing." },
      { id: "add_ba2", title: "Bathroom -- Tile Work", opt: true, description: "Install wall tile in shower/tub surround -- floor to ceiling or per design.\nInstall floor tile with proper slope to drain.\nInstall accent tile and niche tile per design.\nGrout, seal, and clean all surfaces." },
      { id: "add_ba3", title: "Bathroom -- Vanity & Countertop", opt: true, finishKey: "vanity", description: "Install vanity cabinet and countertop.\nInstall undermount or vessel sink per design.\nInstall faucet, drain assembly, and mirror.\nConnect plumbing supply and drain." },
      { id: "add_ba4", title: "Bathroom -- Shower Glass", opt: true, description: "Measure and order frameless or semi-frameless glass enclosure per design.\nInstall glass door and panels with proper hardware and seals.\nAlign, adjust, and silicone all glass components." },
      { id: "add_ba5", title: "Bathroom -- Toilet & Fixtures", opt: true, description: "Install toilet with wax ring, bolts, and supply line.\nInstall all plumbing trim and escutcheons.\nInstall towel bars, TP holder, robe hooks, and all accessories." },
      { id: "add_ba6", title: "Bathroom -- Lighting & Exhaust", opt: true, description: "Install vanity light fixture, recessed lights, and accent lighting.\nInstall exhaust fan -- standard or combination fan/light/heater unit.\nInstall all switches, dimmers, and cover plates." },
      { id: "a1_15", title: "Final Clean & Punch List", description: "Perform thorough final cleaning of all areas.\nConduct walk-through with client to compile punch list.\nComplete all punch list items.\nRemove all construction materials and debris from property." },
    ],
  },
  {
    id: "addition_2nd",
    label: "2nd Story Addition",
    items: [
      { id: "a2_1", title: "Design, Architectural & Engineering Plans", std: true, description: "Meet with client to define the second-story addition scope, room types, and design.\nDevelop architectural plans with floor plans, elevations, sections, and roof plan.\nCoordinate structural engineering for new floor framing, load path to foundation, and any required retrofits to existing first-story structure.\nPrepare Title 24 energy calculations and soils report if needed.\nSubmit for permit and assist through plan check process." },
      { id: "a2_2", title: "Existing Roof Removal & Shoring", description: "Set up temporary weather protection (tarps, temporary roof) before roof removal.\nRemove existing roof framing, sheathing, and roofing materials.\nInstall temporary shoring to support existing first-floor structure during construction.\nProtect interior of existing home from weather during open-roof phase.\nHaul and dump all demolition debris." },
      { id: "a2_3", title: "Foundation & First-Floor Retrofit", finishKey: "foundation", description: "Reinforce existing foundation per structural engineer's retrofit plan.\nInstall new hold-downs, anchor bolts, and shear transfer hardware at first-floor level.\nSister or reinforce existing first-floor framing members if required to carry second-story loads.\nPour new footings or grade beams if required by engineering.\nPass all required foundation and structural retrofit inspections." },
      { id: "a2_4", title: "Second-Floor Framing", description: "Frame second-floor deck including joists, rim board, and subfloor per structural plan.\nFrame all second-story walls, headers, and openings per architectural plans.\nFrame new roof structure including rafters, ridge, and ceiling joists.\nInstall engineered beams, LVL headers, and steel connections per engineering.\nInstall all hold-down and shear wall hardware.\nFrame staircase opening and install stair stringers per code.\nPass all required framing inspections." },
      { id: "a2_5", title: "Staircase Construction", description: "Build staircase connecting first and second floors per code -- minimum width, headroom, and tread/riser dimensions.\nInstall stair stringers, treads, and risers.\nInstall handrail and guardrail per code height and baluster spacing requirements.\nFinish staircase with client-selected materials (hardwood treads, painted risers, etc.).\nDrywall, trim, and paint stairwell walls." },
      { id: "a2_6", title: "Roofing", finishKey: "roofing", description: "Install roof sheathing, underlayment, and ice & water shield at all valleys and penetrations.\nInstall new roofing material per client selection.\nFlash and seal all roof-to-wall transitions and penetrations.\nInstall gutters and downspouts per plan.\nPass all required roofing inspections." },
      { id: "a2_7", title: "Windows & Exterior Doors", finishKey: "windows", description: "Install all second-story windows per approved plans -- style and material selected by client.\nFlash and weatherproof all openings per manufacturer specifications.\nInstall any exterior doors (balcony, deck access) as specified.\nPass energy compliance inspections." },
      { id: "a2_8", title: "Exterior Finish", finishKey: "siding", description: "Install exterior sheathing, house wrap, and flashing on all new walls.\nApply exterior finish material to match existing first-story exterior.\nInstall fascia, soffit, and trim to match existing home.\nBlend new and existing exterior finishes for a seamless look." },
      { id: "a2_9", title: "Electrical", description: "Run all new electrical circuits per approved plans.\nInstall sub-panel on second floor if required.\nInstall all outlets, switches, dimmers, and dedicated circuits.\nInstall lighting, smoke detectors, CO detectors, and arc-fault breakers per code.\nPass all required electrical inspections." },
      { id: "a2_10", title: "Plumbing", description: "Run new plumbing supply and drain lines for second-floor bathrooms, kitchen, or laundry.\nConnect second-floor plumbing to existing main stack and supply lines.\nInstall shut-off valves at all fixture locations.\nEnsure proper venting per code.\nPass all required plumbing inspections." },
      { id: "a2_11", title: "HVAC", finishKey: "mini_split", description: "Install dedicated HVAC system or extend existing system to second floor.\nRun ductwork through walls, chases, or floor cavities per mechanical plan.\nInstall supply vents, return air, and thermostat/zone controller.\nPerform load calculation to ensure proper sizing.\nPass all required HVAC inspections." },
      { id: "a2_12", title: "Insulation, Drywall & Paint", finishKey: "insulation_type", finishKey2: "drywall_texture", description: "Insulate all exterior walls, ceiling/roof, and floor cavities per Title 24.\nHang, tape, mud, and texture all drywall surfaces.\nPrime and apply two coats of paint throughout second floor.\nPaint all trim, doors, and casings.\nMatch finishes at transition between first and second floors." },
      { id: "a2_13", title: "Flooring", finishKey: "flooring", description: "Install subfloor prep, leveling, and sound-deadening underlayment.\nInstall flooring throughout second floor.\nInstall baseboards and transition strips.\nConsider sound transmission between floors (STC rating)." },
      { id: "a2_14", title: "Interior Doors, Trim & Millwork", finishKey: "doors", description: "Install all interior doors with hardware per client selection.\nInstall baseboards, crown molding, casings, and trim throughout.\nInstall closet systems and built-ins as specified.\nFill, caulk, sand, and paint all trim." },
      { id: "add_ka1", title: "Kitchen -- Cabinets", opt: true, finishKey: "cabinets", description: "Install all base and upper cabinets per approved kitchen layout.\nLevel, shim, and secure to wall studs and blocking.\nInstall all hardware -- handles, pulls, knobs, hinges." },
      { id: "add_ka2", title: "Kitchen -- Countertops", opt: true, finishKey: "countertops", description: "Template countertops after cabinets are installed.\nFabricate with specified edge profile.\nInstall with proper support and seams.\nCut sink and cooktop cutouts." },
      { id: "add_ka3", title: "Kitchen -- Backsplash", opt: true, finishKey: "backsplash", description: "Prep wall surfaces and install backsplash per design.\nGrout, seal, and clean all surfaces.\nInstall edge trim at all exposed edges." },
      { id: "add_ka4", title: "Kitchen -- Flooring", opt: true, finishKey: "flooring", description: "Remove existing kitchen flooring and prep subfloor.\nInstall new kitchen flooring.\nInstall baseboards and transition strips." },
      { id: "add_ka5", title: "Kitchen -- Plumbing Fixtures", opt: true, description: "Install kitchen sink -- undermount, farmhouse, or other per design.\nInstall faucet, sprayer, soap dispenser, and accessories.\nInstall and wire garbage disposal.\nConnect dishwasher drain and supply." },
      { id: "add_ka6", title: "Kitchen -- Range Hood & Venting", opt: true, description: "Install range hood with ductwork vented to exterior.\nEnsure adequate supply and return air to kitchen." },
      { id: "add_ka7", title: "Kitchen -- Appliance Installation", opt: true, description: "Receive and install all client-purchased appliances.\nEnsure proper electrical, gas, and plumbing connections.\nVerify all appliances are level, secured, and operational.\nNote: Company will not install high-end appliances -- to be installed by distributor/manufacturer." },
      { id: "add_ka8", title: "Kitchen -- Lighting", opt: true, description: "Install recessed lights, pendants, and under-cabinet LEDs.\nInstall all switches, dimmers, and smart controls." },
      { id: "add_ba1", title: "Bathroom -- Tub/Shower", opt: true, finishKey: "tub_shower", description: "Install tub or shower base per design.\nWaterproof all wet areas with membrane system.\nInstall cement board or tile backer on all wet walls.\nBuild bench, curb, and niche per design.\nFlood test to verify waterproofing." },
      { id: "add_ba2", title: "Bathroom -- Tile Work", opt: true, description: "Install wall tile in shower/tub surround -- floor to ceiling or per design.\nInstall floor tile with proper slope to drain.\nInstall accent tile and niche tile per design.\nGrout, seal, and clean all surfaces." },
      { id: "add_ba3", title: "Bathroom -- Vanity & Countertop", opt: true, finishKey: "vanity", description: "Install vanity cabinet and countertop.\nInstall undermount or vessel sink per design.\nInstall faucet, drain assembly, and mirror.\nConnect plumbing supply and drain." },
      { id: "add_ba4", title: "Bathroom -- Shower Glass", opt: true, description: "Measure and order frameless or semi-frameless glass enclosure per design.\nInstall glass door and panels with proper hardware and seals.\nAlign, adjust, and silicone all glass components." },
      { id: "add_ba5", title: "Bathroom -- Toilet & Fixtures", opt: true, description: "Install toilet with wax ring, bolts, and supply line.\nInstall all plumbing trim and escutcheons.\nInstall towel bars, TP holder, robe hooks, and all accessories." },
      { id: "add_ba6", title: "Bathroom -- Lighting & Exhaust", opt: true, description: "Install vanity light fixture, recessed lights, and accent lighting.\nInstall exhaust fan -- standard or combination fan/light/heater unit.\nInstall all switches, dimmers, and cover plates." },
      { id: "a2_15", title: "Final Clean & Punch List", description: "Perform thorough final cleaning of all areas.\nConduct walk-through with client to compile punch list.\nComplete all punch list items.\nRemove all construction materials and debris from property." },
    ],
  },
  {
    id: "adu_jadu",
    label: "ADU / JADU",
    items: [
      { id: "adu_design", title: "Design & Plans", std: true, description: "Full architectural and engineering plans for ADU / JADU." },
      { id: "adu_permits", title: "Permits", description: "City permits, plan check, and utility connections." },
      { id: "adu_demo", title: "Demo", description: "Site preparation and demolition as required." },
      { id: "adu_framing", title: "Framing", description: "Complete structural framing -- foundation, walls, and roof." },
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
      { id: "gc_design", title: "Design & Plans", std: true, description: "Architectural plans for garage conversion to living space." },
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
      { id: "gc1_design", title: "Design & Plans", std: true, description: "Architectural plans for 1st floor garage conversion." },
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
      { id: "gc2_design", title: "Design & Plans", std: true, description: "Architectural and structural plans for 2nd floor above garage." },
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
      { id: "ipb_design", title: "Design & Plans", std: true, description: "Design plans for bedroom renovation." },
      { id: "ipb_demo", title: "Demo", description: "Demolition of existing finishes." },
      { id: "ipb_framing", title: "Framing", description: "Framing modifications as needed." },
      { id: "ipb_electrical", title: "Electrical", description: "Electrical updates -- outlets, switches, lighting." },
      { id: "ipb_finishing", title: "Finishing", finishKey: "flooring", description: "Drywall, paint, flooring, and trim." },
      { id: "ipb_cleanup", title: "Clean-up", description: "Final clean-up." },
    ],
  },
  {
    id: "new_construction",
    label: "New Construction",
    items: [
      { id: "nc_design", title: "Design & Plans", std: true, description: "Full architectural and engineering plans for new construction." },
      { id: "nc_permits", title: "Permits", description: "All required city permits and inspections." },
      { id: "nc_demo", title: "Demo", description: "Site clearing and demolition of existing structures." },
      { id: "nc_framing", title: "Framing", description: "Complete structural framing -- foundation through roof." },
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
      { id: "rf_design", title: "Design & Plans", std: true, description: "Roofing design and material specifications." },
      { id: "rf_permits", title: "Permits", description: "Roofing permits as required." },
      { id: "rf_demo", title: "Demo", description: "Tear-off of existing roofing materials." },
      { id: "rf_framing", title: "Framing", description: "Roof deck repair and structural reinforcement." },
      { id: "rf_finishing", title: "Finishing", finishKey: "roofing", description: "New roofing installation -- material per client selection." },
      { id: "rf_cleanup", title: "Clean-up", description: "Debris haul-off and site clean-up." },
    ],
  },
  {
    id: "exterior_siding",
    label: "Exterior & Siding",
    items: [
      { id: "es_design", title: "Design & Plans", std: true, description: "Exterior design and siding material specifications." },
      { id: "es_permits", title: "Permits", description: "Permits as required." },
      { id: "es_demo", title: "Demo", description: "Removal of existing siding or exterior materials." },
      { id: "es_framing", title: "Framing", description: "Sheathing and weather barrier installation." },
      { id: "es_finishing", title: "Finishing", finishKey: "siding", description: "New siding installation and trim -- material per selection." },
      { id: "es_cleanup", title: "Clean-up", description: "Debris haul-off and site clean-up." },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    items: [
      { id: "fl_design", title: "Design & Plans", std: true, description: "Flooring layout and material specifications." },
      { id: "fl_demo", title: "Demo", description: "Removal of existing flooring and prep." },
      { id: "fl_framing", title: "Framing", description: "Subfloor repair and leveling as needed." },
      { id: "fl_finishing", title: "Finishing", finishKey: "flooring", description: "New flooring installation -- LVP, tile, or hardwood per selection." },
      { id: "fl_cleanup", title: "Clean-up", description: "Final clean-up." },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    items: [
      { id: "pt_design", title: "Design & Plans", std: true, description: "Color selection and paint specifications." },
      { id: "pt_demo", title: "Demo", description: "Surface preparation, patching, and priming." },
      { id: "pt_finishing", title: "Finishing", finishKey: "specialty_paint", description: "Two coats of premium paint -- interior and/or exterior." },
      { id: "pt_cleanup", title: "Clean-up", description: "Final clean-up and touch-ups." },
    ],
  },
  {
    id: "windows_doors",
    label: "Windows & Doors",
    items: [
      { id: "wd_design", title: "Design & Plans", std: true, description: "Window and door specifications and layout." },
      { id: "wd_permits", title: "Permits", description: "Permits as required for new openings." },
      { id: "wd_demo", title: "Demo", description: "Removal of existing windows and/or doors." },
      { id: "wd_framing", title: "Framing", description: "Framing modifications and header installation." },
      { id: "wd_finishing", title: "Finishing", finishKey: "windows", description: "Installation of new windows and doors with trim." },
      { id: "wd_cleanup", title: "Clean-up", description: "Debris haul-off and clean-up." },
    ],
  },
  {
    id: "deck_patio",
    label: "Deck / Patio",
    items: [
      { id: "dp_design", title: "Design & Plans", std: true, description: "Deck or patio design and structural plans." },
      { id: "dp_permits", title: "Permits", description: "City permits for outdoor structure." },
      { id: "dp_demo", title: "Demo", description: "Removal of existing deck or patio if applicable." },
      { id: "dp_framing", title: "Framing", description: "Foundation, posts, and structural framing." },
      { id: "dp_electrical", title: "Electrical", description: "Outdoor electrical for lighting and outlets." },
      { id: "dp_finishing", title: "Finishing", finishKey: "deck", description: "Decking, railing, and finish work." },
      { id: "dp_cleanup", title: "Clean-up", description: "Final clean-up and landscaping restoration." },
    ],
  },
  {
    id: "sunroom",
    label: "Sunroom",
    items: [
      { id: "sr_design", title: "Design & Plans", std: true, description: "Sunroom architectural and engineering plans." },
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
];

export const ADVISORS: Advisor[] = [
  "David",
  "Chris",
  "Kayley",
  "Ben",
  "Dylan",
  "Kerry",
  "Sean",
  "Claire",
  "Tanzin",
];

export const CLIENT_PRIORITIES = [
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
];

// ── Finish Options ──

export const FINISH_OPTIONS: Record<string, string[]> = {
  roofing: ["Asphalt Shingles", "Concrete Tile", "Clay Tile", "Standing Seam Metal", "Flat Roof (TPO/Modified Bitumen)", "Synthetic Slate", "Wood Shake"],
  flooring: ["Engineered Hardwood", "LVP (Luxury Vinyl Plank)", "Laminate", "Porcelain Tile", "Ceramic Tile", "Natural Stone Tile", "Restore Existing Hardwood", "Polished Concrete", "Carpet"],
  countertops: ["Prefabricated Quartz", "Quartz", "Granite", "Marble", "Butcher Block", "Laminate", "Solid Surface (Corian)", "Concrete", "Porcelain Slab"],
  cabinets: ["Prefabricated Cabinets", "Custom Cabinets", "Semi-Custom Cabinets", "Stock Cabinets", "Reface Existing Cabinets", "Paint Existing Cabinets"],
  siding: ["Stucco", "Smooth Stucco", "Hardie Board (Fiber Cement)", "Wood Siding", "Vinyl Siding", "Board & Batten", "Stone Veneer", "Brick Veneer"],
  windows: ["Vinyl Windows", "Aluminum Windows", "Wood-Clad Windows", "Fiberglass Windows"],
  doors: ["Solid Core Interior", "Hollow Core Interior", "Fiberglass Entry", "Wood Entry", "Steel Entry", "Sliding Glass", "French Doors", "Barn Door"],
  paint_finish: ["Flat/Matte", "Eggshell", "Satin", "Semi-Gloss", "High Gloss"],
  foundation: ["Raised Foundation (Cripple Wall)", "Slab on Grade", "Pier & Beam"],
  tub_shower: ["Tub/Shower Combo", "Walk-In Shower", "Freestanding Tub", "Alcove Tub", "Walk-In Tub", "Shower Pan (Tile-Ready)", "Prefab Shower Base"],
  deck: ["Composite Decking (Trex/TimberTech)", "Pressure-Treated Wood", "Redwood", "Cedar", "PVC Decking", "Ipe Hardwood"],
  mini_split: ["Wall-Mounted Mini Split", "Ceiling Cassette", "Floor-Mounted", "Ducted Mini Split", "Multi-Zone System", "Central HVAC"],
  insulation_type: ["Batt (Fiberglass)", "Batt (Mineral Wool/Rockwool)", "Blown-In Cellulose", "Blown-In Fiberglass", "Spray Foam (Open Cell)", "Spray Foam (Closed Cell)", "Rigid Board Foam", "Radiant Barrier"],
  drywall_level: ["Level 3 -- Tape & Coat (for tile/texture)", "Level 4 -- Standard Finish (paint-ready)", "Level 5 -- Skim Coat (smooth/high-end)"],
  drywall_texture: ["Smooth (No Texture)", "Knockdown", "Orange Peel", "Skip Trowel", "Hand Texture", "Match Existing"],
  specialty_paint: ["Standard Interior Paint (Default)", "Limewash", "Venetian Plaster", "Roman Clay", "Microcement", "Suede/Faux Finish", "Chalk Paint", "Cabinet Lacquer"],
  backsplash: ["Tile", "Ceramic Tile", "Porcelain Tile", "Glass Tile", "Natural Stone Tile", "Mosaic Tile", "Prefabricated Quartz Slab", "Full Slab (Marble/Quartz/Granite)", "Stainless Steel", "Brick Veneer"],
  layout_change: ["No Layout Change -- Same Footprint", "Minor Layout Change -- Fixtures Stay", "Major Layout Change -- Rerouting Plumbing/Fixtures"],
  vanity: ["Prefabricated Vanity", "Custom Vanity", "Floating Vanity", "Freestanding Vanity", "Double Vanity"],
};

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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  type: "increase" | "decrease";
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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  project_price: string;
  project_types: string[];
  scope_items: Record<string, boolean>;
  allowances: Allowance[];
  payment_schedule: PaymentMilestone[];
  confidence: number;
  warnings: string[];
}
