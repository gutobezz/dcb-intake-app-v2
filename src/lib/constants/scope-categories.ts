// ============================================================
// SCOPE CATEGORIES — Trade-based categories from master sheet
// Extracted from intake.jsx lines 6-247
// ============================================================

export interface ScopeCategoryDef {
  label: string;
  icon: string;
  items: string[];
}

export const SCOPE_CATEGORIES: Record<string, ScopeCategoryDef> = {
  foundations_concrete: {
    label: "Foundations & Concrete", icon: "\u{1F3D7}\uFE0F",
    items: [
      "Slab-on-Grade Foundation", "Raised / Crawl Space Foundation", "Basement Foundation",
      "Foundation Repair", "Stem Wall Repair or Replacement", "Concrete Flatwork (Driveways, Walkways, Patios)",
      "Concrete Cutting & Demolition", "Vapor Barrier / Crawl Space Encapsulation",
      "Crawl Space Waterproofing & Drainage", "Sump Pump Installation or Replacement",
      "French Drain Installation", "Retaining Walls"
    ]
  },
  framing_structural: {
    label: "Framing & Structural", icon: "\uD83D\uDD28",
    items: [
      "Wood Stud Framing", "Metal Stud Framing", "Structural Beam Replacement",
      "Header Installation or Upsizing", "Load-Bearing Wall Removal", "Non-Load-Bearing Wall Removal or Addition",
      "Shear Wall Installation", "Floor Joist Repair or Sistering", "Subfloor Replacement",
      "Roof Rafter Repair or Replacement", "Ridge Beam Installation", "Engineered Floor System (TJI / I-Joists)",
      "Post & Column Installation", "Seismic / Hurricane Strapping", "Cripple Wall Bolting"
    ]
  },
  roofing: {
    label: "Roofing", icon: "\uD83C\uDFE0",
    items: [
      "Asphalt Shingle Roof", "Metal Roofing", "Tile Roofing (Clay, Concrete)",
      "Flat Roofing (TPO, EPDM, Modified Bitumen)", "Wood Shake / Shingle Roof",
      "Synthetic Shake or Slate", "Roof Tear-Off and Full Replacement", "Roof Overlay (Re-Roof Over Existing)",
      "Roof Repair (Localized)", "Attic Ventilation", "Skylight Installation or Replacement",
      "Chimney Flashing Repair", "Gutters", "Gutter Guards / Leaf Protection",
      "Downspout Replacement or Rerouting", "Roof Decking Replacement", "Valley Flashing Replacement",
      "Fascia and Soffit Replacement", "Ice and Water Shield Installation"
    ]
  },
  exterior_siding: {
    label: "Exterior & Siding", icon: "\uD83E\uDDF1",
    items: [
      "Wood Siding", "Fiber Cement Siding (Hardie Board)", "Vinyl Siding", "Stucco",
      "Brick Veneer", "Stone Veneer", "Cedar Shingle or Shake Siding", "Metal Siding",
      "Exterior Painting", "Exterior Staining or Sealing", "Soffit Replacement",
      "Exterior Caulking and Weatherstripping", "Exterior Insulation Wrap / House Wrap",
      "Exterior Trim (Fascia, Rake, Corner Boards)"
    ]
  },
  windows_doors: {
    label: "Windows & Doors", icon: "\uD83E\uDE9F",
    items: [
      "Window Replacement (Full-Frame)", "Window Replacement (Insert / Pocket)",
      "Egress Window Installation", "Exterior Door Replacement", "Interior Door Replacement",
      "Sliding Glass Door Replacement", "French Door Installation", "Patio Door Installation",
      "Garage Door Replacement", "Garage Door Opener", "Storm Door Installation",
      "Door Frame Repair", "Pre-Hung Door Installation", "Slab-Only Door Installation",
      "Window Well Installation", "Door Weatherstripping Replacement", "Exterior Door Threshold Replacement"
    ]
  },
  insulation: {
    label: "Insulation", icon: "\uD83E\uDDE4",
    items: [
      "Batt Insulation (Fiberglass, Mineral Wool)", "Blown-In Insulation (Cellulose, Fiberglass)",
      "Spray Foam Insulation (Open-Cell, Closed-Cell)", "Rigid Foam Board Insulation",
      "Radiant Barrier (Attic)", "Crawl Space Insulation", "Basement Wall Insulation"
    ]
  },
  drywall_plaster: {
    label: "Drywall & Plaster", icon: "\uD83E\uDEB5",
    items: [
      "Drywall Installation", "Drywall Taping and Finishing", "Drywall Repair",
      "Skim Coat / Veneer Plaster", "Traditional 3-Coat Plaster", "Plaster Repair",
      "Ceiling Texture Application", "Popcorn / Acoustic Ceiling Removal",
      "Coffered or Tray Ceiling", "Soundproof Drywall (QuietRock / Green Glue)"
    ]
  },
  flooring: {
    label: "Flooring", icon: "\uD83E\uDEB5",
    items: [
      "Hardwood Flooring (Solid)", "Engineered Hardwood", "Laminate Flooring", "LVP / LVT",
      "Ceramic / Porcelain Tile", "Natural Stone Tile", "Carpet Installation",
      "Concrete Floor Polishing or Staining", "Epoxy Flooring", "Sheet Vinyl Flooring",
      "Carpet Tile", "Cork or Bamboo Flooring", "Subfloor Repair and Leveling",
      "Radiant Heat Under Flooring", "Stair Treads and Risers", "Floor Transition Strips"
    ]
  },
  trim_millwork: {
    label: "Interior Trim & Millwork", icon: "\uD83D\uDCD0",
    items: [
      "Baseboard Installation", "Crown Molding", "Wainscoting", "Built-In Shelving",
      "Fireplace Surround and Mantel", "Shiplap Accent Walls", "Door Casing Installation",
      "Window Casing / Apron / Stool", "Chair Rail", "Board & Batten Accent Wall",
      "Picture Molding / Rail", "Built-In Window Seat", "Coffered Ceiling Beams",
      "Interior Column Installation"
    ]
  },
  kitchens: {
    label: "Kitchens", icon: "\uD83C\uDF73",
    items: [
      "Cabinet Installation", "Cabinet Refacing", "Cabinet Painting / Refinishing",
      "Countertop Installation", "Kitchen Sink Replacement", "Kitchen Faucet Replacement",
      "Range Hood / Exhaust Fan", "Dishwasher Installation", "Garbage Disposal",
      "Range / Oven Installation", "Cooktop Installation", "Refrigerator Installation",
      "Microwave Installation", "Under-Cabinet Lighting", "Kitchen Island Addition",
      "Kitchen Exhaust Ductwork", "Kitchen Layout Reconfiguration", "Cabinet Hardware Replacement",
      "Countertop Edge Profiling"
    ]
  },
  bathrooms: {
    label: "Bathrooms", icon: "\uD83D\uDEBF",
    items: [
      "Bathtub Replacement", "Bathtub Liner / Acrylic Overlay", "Bathtub Refinishing",
      "Shower Pan Installation", "Curbless / Barrier-Free Shower", "Shower Door Installation",
      "Toilet Replacement", "Bathroom Vanity Replacement", "Tub-to-Shower Conversion",
      "Shower Enclosure (Prefab)", "Shower Niche / Built-In Shelf", "Walk-In Shower Addition",
      "Jetted / Soaking Tub", "Bidet Seat Installation", "Bathroom Sink Replacement",
      "Bathroom Faucet Replacement", "Bathroom Exhaust Fan", "Bathroom Mirror Replacement",
      "Medicine Cabinet Installation", "Towel Bar and Accessories", "Heated Floor (Electric Mat)",
      "Bathroom Layout Reconfiguration"
    ]
  },
  plumbing: {
    label: "Plumbing", icon: "\uD83D\uDD27",
    items: [
      "Water Supply Line Replacement", "DWV Pipe Repair or Replacement", "Whole-House Repipe",
      "Water Heater Replacement (Tank)", "Tankless Water Heater", "Water Softener Installation",
      "Sewer Line Repair or Replacement", "Gas Line Installation or Extension",
      "Whole-House Water Filtration", "Pressure Regulator Replacement",
      "Main Shutoff Valve Replacement", "Hose Bib Replacement", "Drain Cleaning",
      "Sewer Camera Inspection", "Gas Appliance Connection", "Sewage Ejector Pump"
    ]
  },
  electrical: {
    label: "Electrical", icon: "\u26A1",
    items: [
      "Main Panel Upgrade", "Circuit Addition", "Outlet Addition or Relocation",
      "Light Fixture Installation", "EV Charger Installation", "Whole-House Surge Protector",
      "Whole-House Generator", "Solar Panel System", "Subpanel Installation",
      "Whole-House Rewire", "Switch Addition or Relocation", "Recessed Lighting Conversion",
      "Smoke / CO Detector Installation", "Battery Storage System",
      "Low-Voltage Wiring (Data, Coax, Speaker)", "Structured Wiring / Home Network Panel",
      "Smart Home System Wiring", "Exterior Lighting", "Pool / Spa Electrical"
    ]
  },
  hvac: {
    label: "HVAC", icon: "\u2744\uFE0F",
    items: [
      "Forced Air Furnace Replacement", "Central Air Conditioner Replacement",
      "Mini Split / Ductless System", "Heat Pump Installation", "Heat Pump Water Heater",
      "Dual-Fuel System", "Packaged HVAC Unit", "Geothermal Heat Pump",
      "Boiler Replacement", "Radiant Floor Heating (Hydronic)", "Electric Baseboard Heating",
      "Ductwork Install / Repair / Sealing", "Smart / Programmable Thermostat",
      "Gas Fireplace Installation", "Fireplace Insert Installation",
      "Whole-House Humidifier or Dehumidifier", "ERV / HRV Installation",
      "Attic or Whole-House Fan", "Bathroom and Kitchen Exhaust Ducting",
      "Air Filtration Upgrade", "HVAC Zoning System", "Wood-Burning Stove",
      "Pellet Stove", "Dryer Vent Cleaning or Rerouting"
    ]
  },
  painting: {
    label: "Painting & Coatings", icon: "\uD83C\uDFA8",
    items: [
      "Interior Painting (Walls, Ceilings, Trim)", "Wallpaper Removal", "Wallpaper Installation",
      "Interior Walls (Prime, 2-Coat)", "Interior Ceilings", "Cabinet Painting (Spray or Brush)",
      "Faux Finish / Decorative Painting", "Concrete Staining or Sealing",
      "Masonry Paint / Elastomeric Coating", "Deck Waterproofing Membrane"
    ]
  },
  decks_outdoor: {
    label: "Decks & Outdoor Structures", icon: "\uD83E\uDEB5",
    items: [
      "Wood Deck", "Composite Deck", "PVC Deck", "Aluminum Deck System",
      "Deck Refinishing", "Deck Demolition and Rebuild", "Deck Ledger Attachment and Flashing",
      "Deck Railing", "Deck Stairs", "Pergola", "Arbor / Trellis",
      "Fence Installation", "Fence Repair or Staining", "Screened-In Porch",
      "Three-Season Room", "Four-Season Room / Sunroom (Kit Install)", "Gazebo",
      "Carport", "Detached Garage", "Storage Shed", "Outdoor Kitchen",
      "Outdoor Fireplace or Fire Pit", "Gate Installation", "Driveway Gate"
    ]
  },
  landscaping: {
    label: "Landscaping & Hardscape", icon: "\uD83C\uDF3F",
    items: [
      "Paver Driveway / Patio / Walkway", "Concrete Driveway", "Asphalt Driveway",
      "Stamped Concrete Patio", "Natural Stone Patio", "Decomposed Granite / Gravel Pathway",
      "Concrete Walkway", "Stepping Stone Path", "Irrigation System", "Landscape Lighting",
      "Swimming Pool Installation", "Pool Resurfacing", "Pool Equipment Replacement",
      "Pool Deck Resurfacing", "Above-Ground Pool", "Spa / Hot Tub Installation",
      "Outdoor Shower", "Outdoor Drainage", "Grading and Lot Regrading",
      "Erosion Control", "Lawn Installation", "Tree Removal or Trimming",
      "Stump Grinding", "Planting (Shrubs, Trees, Groundcover)",
      "Artificial Turf Installation", "Rainwater Harvesting System"
    ]
  },
  garage: {
    label: "Garage", icon: "\uD83D\uDE97",
    items: [
      "Garage Floor Epoxy Coating", "Garage Drywalling / Insulation / Heating",
      "Garage Storage (Panels, Racks, Cabinets)", "Garage Door Spring or Cable Replacement",
      "Garage Conversion to ADU or Living Space"
    ]
  },
  basement: {
    label: "Basement", icon: "\uD83C\uDFDA\uFE0F",
    items: [
      "Basement Finishing", "Radon Mitigation System", "Basement Waterproofing",
      "Basement Egress Window", "Basement Bathroom Addition", "Basement Bar or Kitchenette",
      "Basement Underpinning", "Basement Window Well Installation"
    ]
  },
  accessibility: {
    label: "Accessibility & ADA", icon: "\u267F",
    items: [
      "Wheelchair Ramp", "Grab Bar Installation", "Doorway Widening",
      "Stair Lift Installation", "Platform Lift", "Roll-In Shower Conversion",
      "Curbless Entry Modification", "Lever Door Handle Conversion",
      "Handrail Installation or Upgrade", "Non-Slip Flooring Application"
    ]
  },
  smart_home: {
    label: "Smart Home & Low-Voltage", icon: "\uD83D\uDCF1",
    items: [
      "Whole-Home Wi-Fi", "Smart Lock Installation", "Video Doorbell",
      "Security Camera System", "Alarm System Installation", "Whole-Home Audio",
      "Home Theater Wiring", "Motorized Window Shade Wiring",
      "Smart Irrigation Controller", "Intercom System", "Smart Panel / Load Controller"
    ]
  },
  adu_additions: {
    label: "ADU & Additions", icon: "\uD83C\uDFE1",
    items: [
      "Detached ADU - New Construction", "Attached ADU Addition",
      "Attic Conversion to Living Space", "Room Addition (Bump-Out, Second Story, Rear)",
      "Mudroom Addition or Conversion", "Home Office Addition or Conversion",
      "In-Law Suite / Granny Flat"
    ]
  },
  specialty: {
    label: "Specialty Systems", icon: "\u2699\uFE0F",
    items: [
      "Residential Elevator", "Central Vacuum System", "Propane Tank Installation",
      "Well Pump Replacement", "Septic System Installation or Repair",
      "Septic Tank Pumping and Inspection", "Greywater Recycling System",
      "Rainwater Harvesting System"
    ]
  },
} as const;
