/**
 * Default allowances that auto-populate based on project scope.
 * Allowance amounts are included within the project price for client-selected materials/fixtures.
 */

export interface DefaultAllowance {
  label: string;
  amount: string;
}

/** Standard allowances applied to most remodel/addition projects */
export const DEFAULT_ALLOWANCES: DefaultAllowance[] = [
  {
    label: "Tile installation (backsplash, shower, bathroom, kitchen)",
    amount: "Up to $5/sqft",
  },
  { label: "Backsplash tile", amount: "Up to $3/sqft" },
  { label: "Windows", amount: "Up to $350/window" },
  { label: "Interior doors", amount: "Up to $300/door" },
  {
    label: "Shower fixtures, bath accessories, toilets, vanities & mirrors",
    amount: "Up to $1,000",
  },
  {
    label: "Prefab shaker cabinets & quartz countertops (kitchen)",
    amount: "Included",
  },
  { label: "Tankless water heater", amount: "$1,500" },
];

/**
 * Project types that should auto-populate default allowances when selected.
 * Any project containing these types in its scope will get the standard allowances.
 */
export const ALLOWANCE_ELIGIBLE_PROJECT_TYPES = [
  "interior_remodel",
  "kitchen_remodel",
  "bathroom_remodel",
  "new_bathroom",
  "addition_1st",
  "addition_2nd",
  "adu_jadu",
  "garage_conv",
  "garage_conv_1st",
  "garage_conv_2nd",
  "new_construction",
] as const;

/**
 * Given a list of selected project type IDs, returns the default allowances
 * if any of the eligible types are selected.
 */
export function getDefaultAllowances(
  selectedProjectTypes: string[]
): DefaultAllowance[] {
  const hasEligible = selectedProjectTypes.some((pt) =>
    (ALLOWANCE_ELIGIBLE_PROJECT_TYPES as readonly string[]).includes(pt)
  );
  return hasEligible ? [...DEFAULT_ALLOWANCES] : [];
}
