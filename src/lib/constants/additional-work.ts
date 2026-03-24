// ============================================================
// ADDITIONAL WORK TYPES — Standalone / upsell work types
// Extracted from intake.jsx lines 275-298, 863-982
// ============================================================

import type { ScopeItemDef } from "./project-scopes";

export interface AdditionalWorkType {
  id: string;
  label: string;
  icon: string;
}

export const ADDITIONAL_WORK_TYPES: AdditionalWorkType[] = [
  { id: "aw_hvac",          label: "HVAC System",                    icon: "\u2744\uFE0F" },
  { id: "aw_rewire",        label: "House Rewire",                   icon: "\u26A1" },
  { id: "aw_panel",         label: "Panel Upgrade",                  icon: "\uD83D\uDD0C" },
  { id: "aw_recessed",      label: "Recessed Lighting (Whole House)", icon: "\uD83D\uDCA1" },
  { id: "aw_repipe",        label: "House Repipe",                   icon: "\uD83D\uDD27" },
  { id: "aw_cabinetry",     label: "Cabinetry",                      icon: "\uD83D\uDDC4\uFE0F" },
  { id: "aw_closets",       label: "Closet Build-Out",               icon: "\uD83D\uDEAA" },
  { id: "aw_solar",         label: "Solar",                          icon: "\u2600\uFE0F" },
  { id: "aw_waterheater",   label: "Water Heater Replacement",       icon: "\uD83C\uDF21\uFE0F" },
  { id: "aw_softwater",     label: "Water Softener / Filtration",    icon: "\uD83D\uDCA7" },
  { id: "aw_drywall",       label: "Drywall Repair / Texture",       icon: "\uD83E\uDEE3" },
  { id: "aw_insulation",    label: "Insulation Upgrade",             icon: "\uD83E\uDDF1" },
  { id: "aw_garage_door",   label: "Garage Door Replacement",        icon: "\uD83D\uDE97" },
  { id: "aw_ev_charger",    label: "EV Charger Installation",        icon: "\uD83D\uDD0B" },
  { id: "aw_bbq",           label: "Outdoor Kitchen / BBQ",          icon: "\uD83D\uDD25" },
  { id: "aw_fence",         label: "Fencing",                        icon: "\uD83C\uDF3F" },
  { id: "aw_concrete",      label: "Concrete / Flatwork",            icon: "\u2B1C" },
  { id: "aw_drainage",      label: "Drainage / French Drain",        icon: "\uD83C\uDF0A" },
  { id: "aw_seismic",       label: "Seismic Retrofit",               icon: "\uD83C\uDFDB\uFE0F" },
  { id: "aw_duct_clean",    label: "Duct Cleaning / Sealing",        icon: "\uD83C\uDF2C\uFE0F" },
  { id: "aw_sqft_addition", label: "Sq Ft Addition (Additional)",    icon: "\uD83D\uDCCF" },
  { id: "aw_fire_sprinklers", label: "Fire Sprinklers",              icon: "\uD83D\uDEBF" },
];

// ============================================================
// ADDITIONAL WORK SCOPE ITEMS
// ============================================================

export const ADDITIONAL_WORK_SCOPES: Record<string, ScopeItemDef[]> = {
  aw_hvac: [
    { id: "hvac1", label: "HVAC Assessment", desc: "Evaluate existing HVAC system \u2014 age, capacity, ductwork condition, and efficiency.\nPerform Manual J load calculation to determine proper system sizing.\nPresent options: full replacement, mini-split, or central system." },
    { id: "hvac2", label: "Central HVAC Replacement", desc: "Remove and dispose of existing air handler and condenser unit.\nInstall new high-efficiency central HVAC system sized per load calculation.\nInstall or extend ductwork, supply vents, return air, and plenum as needed.\nInstall programmable/smart thermostat.\nVacuum and charge refrigerant system.\nPass all required HVAC inspections.", finishKey: "mini_split" },
    { id: "hvac3", label: "Ductwork Replacement / Extension", desc: "Remove and replace deteriorated, leaking, or undersized ductwork.\nInstall new insulated flex duct or sheet metal as appropriate.\nSeal all connections with mastic or foil tape.\nBalance airflow to all registers.\nPass mechanical inspection." },
    { id: "hvac4", label: "Mini-Split System", desc: "Install mini-split system \u2014 wall-mount, ceiling cassette, or multi-zone per design.\nRun refrigerant lines, condensate drain, and electrical.\nInstall line set covers on exterior.\nProgram controls and test all modes.\nPass all required HVAC inspections.", finishKey: "mini_split" },
  ],
  aw_rewire: [
    { id: "rw1", label: "Electrical Assessment", desc: "Inspect existing wiring, panel, and distribution throughout home.\nIdentify knob-and-tube, aluminum wiring, or other hazardous conditions.\nDocument scope of rewire needed and prepare permit package." },
    { id: "rw2", label: "Whole-House Rewire", desc: "Pull all permits required for whole-home electrical rewire.\nRemove existing wiring (knob-and-tube, aluminum, or outdated romex) as accessible.\nInstall new 12/2 and 14/2 copper romex throughout \u2014 bedroom circuits, living areas, dedicated appliance circuits.\nInstall new junction boxes and switch boxes throughout.\nInstall AFCI/GFCI protection per current code.\nInstall smoke and CO detectors at all required locations.\nPass rough and final electrical inspections." },
    { id: "rw3", label: "Electrical Finish", desc: "Install all outlets, switches, dimmers, and cover plates.\nInstall all light fixtures, fans, and decorative fixtures.\nTest all circuits and verify operation.\nPass final inspection." },
  ],
  aw_panel: [
    { id: "pan1", label: "Panel Upgrade", desc: "Pull all required electrical permits.\nInstall new main service panel \u2014 200A or size per load calculation.\nTransfer all existing circuits to new panel with proper labeling.\nInstall AFCI/GFCI breakers per current code.\nUpdate grounding and bonding per NEC.\nCoordinate with utility company for service upgrade if needed.\nPass all required inspections." },
    { id: "pan2", label: "Sub-Panel Installation", desc: "Install sub-panel in garage, ADU, or addition as specified.\nRun feeder circuit from main panel \u2014 size per load calculation.\nInstall breakers for new circuits.\nLabel all circuits.\nPass inspection." },
  ],
  aw_recessed: [
    { id: "rl1", label: "Layout & Planning", desc: "Walk home with client to determine recessed light placement in each room.\nMark ceiling layout \u2014 spacing, grid pattern, and quantity per room.\nDevelop switching and dimmer plan." },
    { id: "rl2", label: "Recessed Lighting \u2014 Rough", desc: "Cut all ceiling openings per layout.\nRun new circuits and wiring from panel or junction boxes to each fixture location.\nInstall rough wiring for all dimmers and switches.\nPass rough electrical inspection." },
    { id: "rl3", label: "Recessed Lighting \u2014 Finish", desc: "Install all recessed light cans/trims \u2014 LED wafer or can lights per selection.\nInstall all dimmers, switches, and cover plates.\nPatch and repair all drywall cuts.\nTest all circuits and verify even illumination throughout.\nPass final electrical inspection." },
  ],
  aw_repipe: [
    { id: "rp1", label: "Repipe Assessment", desc: "Inspect existing plumbing \u2014 identify galvanized, polybutylene, or aged copper lines.\nPressure test to identify leaks and weak points.\nDocument full scope and present options (PEX, copper, or PVC)." },
    { id: "rp2", label: "Whole-House Repipe", desc: "Pull all required plumbing permits.\nRemove and replace all supply lines throughout home \u2014 hot and cold.\nInstall new PEX-A or copper supply lines from main shutoff to all fixtures.\nInstall new shut-off valves at all fixtures and appliances.\nRepair and patch all drywall, cabinets, or surfaces opened for access.\nPressure test entire system upon completion.\nPass all required plumbing inspections." },
  ],
  aw_cabinetry: [
    { id: "cab1", label: "Cabinet Design & Selection", desc: "Consult with client on cabinet style, door profile, finish, and hardware.\nDevelop detailed cabinet plan with dimensions and layout.\nOrder cabinets per approved plan.", finishKey: "cabinets" },
    { id: "cab2", label: "Cabinet Installation", desc: "Remove existing cabinets and prepare walls \u2014 patch, level, and clean.\nInstall all base and upper cabinets \u2014 level, shim, and secure to wall studs.\nInstall fillers, end panels, crown molding per design.\nInstall all hardware \u2014 handles, pulls, and hinges per client selection.\nAdjust all doors and drawers for proper alignment." },
    { id: "cab3", label: "Countertop Fabrication & Install", desc: "Template after cabinets are installed.\nFabricate and install countertop in selected material with specified edge profile.\nCut sink and cooktop cutouts as required.\nSeal all perimeter joints.", finishKey: "countertops" },
  ],
  aw_closets: [
    { id: "cl1", label: "Closet Design & Layout", desc: "Consult with client on closet configuration \u2014 hanging zones, shelving, drawers, and accessories.\nDevelop detailed layout per closet dimensions.\nSelect material and finish." },
    { id: "cl2", label: "Closet Build-Out", desc: "Remove existing closet rod and shelf.\nFraming modifications as needed for new configuration.\nInstall closet system \u2014 built-in shelving, hanging rods, drawers, and accessory panels.\nPaint or finish interior to match design.\nInstall lighting if specified." },
  ],
  aw_solar: [
    { id: "sol1", label: "Solar Assessment & Design", desc: "Evaluate roof condition, orientation, and shading for solar feasibility.\nPerform energy usage analysis and system sizing.\nDesign panel layout and electrical configuration.\nSubmit permit application and utility interconnection agreement." },
    { id: "sol2", label: "Roof Preparation", desc: "Inspect and repair any roof deficiencies prior to panel installation.\nInstall flashing and roof penetrations at all mounting locations.\nVerify structural capacity for panel load." },
    { id: "sol3", label: "Solar Panel Installation", desc: "Install mounting hardware and rail system per engineered layout.\nInstall solar panels per approved design.\nRun conduit and DC wiring from panels to inverter location.\nInstall inverter, disconnect, and production meter.\nCoordinate utility inspection and interconnection approval.\nPass all required structural, electrical, and utility inspections." },
    { id: "sol4", label: "Battery Storage (Optional)", desc: "Install battery storage system per client selection.\nInstall transfer switch and automatic backup controls.\nIntegrate with solar system and home electrical panel.\nProgram system settings and test backup operation." },
  ],
  aw_waterheater: [
    { id: "wh1", label: "Water Heater Replacement", desc: "Remove and dispose of existing water heater.\nInstall new water heater \u2014 tank or tankless per client selection.\nConnect gas or electrical supply and water lines.\nInstall seismic strapping and expansion tank per code.\nTest for leaks and verify proper operation.\nPass required inspection." },
  ],
  aw_softwater: [
    { id: "sw1", label: "Water Softener / Filtration Install", desc: "Install whole-house water softener at main water entry.\nInstall pre-filter and bypass valve.\nConnect to drain line for regeneration discharge.\nSet programming and verify operation.\nInstall under-sink reverse osmosis filter at kitchen sink if specified." },
  ],
  aw_drywall: [
    { id: "dw1", label: "Drywall Repair", desc: "Patch all holes, cracks, and damaged sections throughout specified areas.\nApply joint compound and feather edges for seamless repair.\nSand smooth and prime patched areas.\nMatch existing texture throughout." },
    { id: "dw2", label: "Drywall Texture", desc: "Apply consistent texture throughout specified rooms \u2014 type per client selection.\nMatch ceiling and wall texture to adjacent spaces as needed.\nPrime all textured surfaces prior to paint.", finishKey: "drywall_texture" },
  ],
  aw_insulation: [
    { id: "ins1", label: "Insulation Assessment", desc: "Inspect existing insulation in attic, walls, and crawl space.\nMeasure current R-values and identify deficiencies.\nPresent upgrade options and expected energy savings." },
    { id: "ins2", label: "Attic Insulation", desc: "Remove existing insufficient insulation if required.\nAir-seal all attic penetrations \u2014 recessed lights, plumbing, and framing gaps.\nInstall new insulation to code-required R-value for climate zone.", finishKey: "insulation_type" },
    { id: "ins3", label: "Wall Insulation", desc: "Install insulation in exterior walls \u2014 blown-in through small drilled holes or during open-wall scope.\nPatch and repair all access holes.\nVerify coverage and R-value.", finishKey: "insulation_type" },
  ],
  aw_garage_door: [
    { id: "gd1", label: "Garage Door Replacement", desc: "Remove and dispose of existing garage door and hardware.\nInstall new garage door \u2014 style, material, and insulation per client selection.\nInstall new opener, safety sensors, keypad, and remotes.\nBalance and adjust door for proper operation.\nTest all safety reverse functions." },
  ],
  aw_ev_charger: [
    { id: "ev1", label: "EV Charger Installation", desc: "Evaluate panel capacity for dedicated EV circuit.\nInstall dedicated 240V/50A circuit from panel to garage.\nInstall Level 2 EV charger per client selection.\nInstall conduit on exterior or garage wall as needed.\nPass required electrical inspection." },
  ],
  aw_bbq: [
    { id: "bbq1", label: "Outdoor Kitchen Design", desc: "Consult with client on layout, appliances, and finishes.\nDevelop detailed outdoor kitchen plan with utility locations.\nCoordinate gas, electrical, and plumbing rough-in." },
    { id: "bbq2", label: "Outdoor Kitchen Construction", desc: "Build masonry or steel-framed outdoor kitchen structure per approved design.\nApply stucco, tile, or stone veneer finish per client selection.\nInstall countertop per selection.\nInstall BBQ grill, side burner, refrigerator, and sink as specified.\nConnect gas line, electrical, and plumbing.\nPass all required inspections." },
  ],
  aw_fence: [
    { id: "fen1", label: "Fencing", desc: "Remove and dispose of existing fencing as needed.\nLayout and install new fence \u2014 material, height, and style per client selection.\nInstall posts in concrete footings at proper spacing.\nInstall rails, pickets, and gates per design.\nApply stain, paint, or sealer if applicable." },
  ],
  aw_concrete: [
    { id: "con1", label: "Concrete / Flatwork", desc: "Excavate and grade area to specified depth.\nInstall compacted base material.\nForm and pour concrete to specified thickness with reinforcement.\nFinish surface to specified texture \u2014 broom, smooth, or exposed aggregate.\nCut control joints at appropriate spacing.\nAllow proper cure time." },
  ],
  aw_drainage: [
    { id: "dr1", label: "Drainage / French Drain", desc: "Assess drainage issues and identify collection points.\nExcavate trench along drainage path to daylight or sump.\nInstall perforated drain pipe in gravel bed.\nWrap pipe and gravel in filter fabric.\nBackfill and restore surface.\nInstall catch basins and surface drains as needed.\nVerify proper flow and slope." },
  ],
  aw_seismic: [
    { id: "sei1", label: "Seismic Retrofit Assessment", desc: "Inspect foundation, cripple walls, and connections.\nDevelop retrofit plan per FEMA P-1100 or local requirements.\nObtain engineering stamp if required.\nPull all required permits." },
    { id: "sei2", label: "Seismic Retrofit", desc: "Install anchor bolts connecting mudsill to foundation.\nInstall structural plywood sheathing on cripple walls.\nInstall hold-downs and hardware at all required locations.\nBolt water heater and secure other hazards per seismic requirements.\nPass all required inspections." },
  ],
  aw_duct_clean: [
    { id: "dc1", label: "Duct Cleaning & Sealing", desc: "Inspect all supply and return ductwork for leaks, damage, and contamination.\nClean all ducts with high-powered vacuum and rotary brush system.\nSeal all accessible duct leaks with mastic or foil tape.\nReplace HVAC filter and clean registers throughout.\nTest and balance airflow at all registers after cleaning." },
  ],
  aw_sqft_addition: [
    { id: "sqft1", label: "Design & Engineering Plans", std: true, desc: "Develop architectural plans for additional square footage per client direction.\nCoordinate structural engineering for foundation, framing, and connection to existing structure.\nSubmit for permit and assist through plan check." },
    { id: "sqft2", label: "Foundation", desc: "Excavate and form footings per structural engineer\u2019s specifications.\nPour concrete footings and stem walls.\nInstall anchor bolts and all required hardware.\nPass foundation inspections." },
    { id: "sqft3", label: "Framing", desc: "Frame all walls, headers, and roof structure for additional square footage.\nInstall engineered beams and connection hardware per structural plan.\nInstall sheathing, shear wall, and tie-downs.\nPass framing inspection." },
    { id: "sqft4", label: "Roofing & Weatherproofing", desc: "Install roof sheathing, underlayment, and roofing material to match existing.\nFlash and waterproof all connections to existing structure.\nInstall windows and exterior doors per plan.\nInstall exterior siding/stucco to match existing.", finishKey: "roofing" },
    { id: "sqft5", label: "Mechanical, Electrical & Plumbing", desc: "Extend or add electrical circuits, outlets, switches, and lighting per plan.\nExtend plumbing supply and drain if new wet areas included.\nExtend or add HVAC to serve new square footage.\nPass all rough inspections." },
    { id: "sqft6", label: "Insulation & Drywall", desc: "Install insulation in all exterior walls and ceiling per Title 24.\nHang, tape, mud, and texture drywall throughout.\nPass insulation and wallboard inspections.", finishKey: "insulation_type" },
    { id: "sqft7", label: "Flooring & Finishes", desc: "Install flooring throughout new square footage.\nInstall baseboards, casings, and interior doors.\nPrime and paint all walls, ceilings, and trim.", finishKey: "flooring" },
  ],
  aw_fire_sprinklers: [
    { id: "fs1", label: "Fire Sprinkler Design & Permit", std: true, desc: "Engage licensed fire sprinkler contractor for hydraulic calculations and system design.\nSubmit plans to fire authority having jurisdiction (AHJ) for approval.\nCoordinate with general contractor for rough framing schedule." },
    { id: "fs2", label: "Rough-In & Distribution Piping", desc: "Install main water supply connection and backflow preventer.\nRun distribution piping (CPVC, steel, or multiplex) throughout all required areas.\nInstall branch lines and drop heads at all required locations per plan.\nCoordinate with framing and drywall schedule for inspections." },
    { id: "fs3", label: "Sprinkler Head Installation", desc: "Install concealed or exposed sprinkler heads per approved layout.\nInstall escutcheon plates at all head locations.\nPressure test entire system per NFPA 13D requirements.\nPass rough and final fire sprinkler inspections." },
    { id: "fs4", label: "Final Inspection & Certification", desc: "Schedule and pass final fire sprinkler inspection with AHJ.\nProvide homeowner with system documentation and maintenance instructions.\nCoordinate with building department for final building inspection sign-off." },
  ],

  // ── KITCHEN ADD-ON (compact) ──
  kitchen_addon: [
    { id: "ka1", label: "Kitchen Layout & Plumbing Planning", std: true, desc: "Consult with client on kitchen layout, workflow, and design.\nDevelop kitchen plan with cabinet placement, appliance locations, and island configuration.\nCoordinate plumbing reroute if layout is changing.", finishKey: "layout_change" },
    { id: "ka2", label: "Kitchen Electrical", desc: "Install dedicated 20-amp circuits for countertop receptacles (GFCI).\nInstall circuits for range/oven, dishwasher, disposal, microwave, refrigerator.\nRough-in wiring for recessed and pendant lighting.\nInstall all switches, dimmers, outlets, and cover plates." },
    { id: "ka3", label: "Kitchen Plumbing", desc: "Rough-in supply and drain for kitchen sink \u2014 new or relocated position.\nInstall supply lines for dishwasher, fridge water line, and pot filler if specified.\nInstall shut-off valves at all fixtures.\nConnect sink, disposal, and dishwasher." },
    { id: "ka4", label: "Cabinet Installation", desc: "Install all base and upper cabinets per approved layout.\nLevel, shim, and secure to wall studs and blocking.\nInstall all hardware \u2014 handles, pulls, knobs, hinges per client selection.", finishKey: "cabinets" },
    { id: "ka5", label: "Countertop Fabrication & Install", desc: "Template countertops after cabinets are installed.\nFabricate from client-selected material with specified edge profile.\nInstall with proper support and seams.\nCut sink and cooktop cutouts.", finishKey: "countertops" },
    { id: "ka6", label: "Backsplash", desc: "Prep wall surfaces and install backsplash per design.\nGrout, seal, and clean all surfaces.\nInstall edge trim at all exposed edges.", finishKey: "backsplash" },
    { id: "ka7", label: "Kitchen Flooring", desc: "Remove existing flooring and prep subfloor.\nInstall new kitchen flooring.\nInstall baseboards and transition strips.", finishKey: "flooring" },
    { id: "ka8", label: "Range Hood & Venting", desc: "Install range hood with ductwork vented to exterior.\nEnsure adequate supply and return air to kitchen." },
    { id: "ka9", label: "Appliance Installation", desc: "Receive and install all client-purchased appliances.\nEnsure proper electrical, gas, and plumbing connections.\nVerify all appliances are level, secured, and operational.\nNote: Company will not install high-end appliances \u2014 to be installed by distributor/manufacturer." },
    { id: "ka10", label: "Kitchen Lighting & Fixtures", desc: "Install recessed lights, pendants, and under-cabinet LEDs.\nInstall all switches, dimmers, and smart controls.\nInstall sink faucet, sprayer, soap dispenser, and accessories." },
  ],

  // ── BATHROOM ADD-ON (compact) ──
  bathroom_addon: [
    { id: "ba1", label: "Bathroom Layout & Plumbing Planning", std: true, desc: "Consult with client on bathroom layout, fixture placement, and tile design.\nDevelop bathroom plan with dimensions and fixture locations.\nCoordinate plumbing reroute if layout is changing.", finishKey: "layout_change" },
    { id: "ba2", label: "Bathroom Plumbing", desc: "Rough-in supply and drain for tub/shower, vanity, and toilet.\nInstall shut-off valves and shower valve.\nConnect all fixtures and test for leaks." },
    { id: "ba3", label: "Bathroom Electrical", desc: "Install GFCI outlets, exhaust fan circuit,.\nInstall vanity light, recessed lights, and switch boxes.\nPass all inspections." },
    { id: "ba4", label: "Tub / Shower Installation", desc: "Install tub or shower base \u2014 type per client selection.\nWaterproof all wet areas with membrane system.\nInstall cement board or tile backer on all wet walls.\nBuild bench, curb, and niche per design.\nFlood test to verify waterproofing.", finishKey: "tub_shower" },
    { id: "ba5", label: "Bathroom Tile Work", desc: "Install wall tile in shower/tub surround.\nInstall floor tile with proper slope to drain.\nGrout, seal, and clean all surfaces." },
    { id: "ba6", label: "Vanity & Countertop", desc: "Install vanity cabinet and countertop.\nInstall sink, faucet, and mirror.\nConnect plumbing.", finishKey: "vanity" },
    { id: "ba7", label: "Shower Glass", desc: "Measure, order, and install frameless or semi-frameless glass enclosure.\nSeal all glass-to-tile connections." },
    { id: "ba8", label: "Toilet & Fixtures", desc: "Install toilet and all plumbing trim.\nInstall towel bars, TP holder, robe hooks, and accessories.\nInstall grab bars if specified." },
  ],
} as const;
