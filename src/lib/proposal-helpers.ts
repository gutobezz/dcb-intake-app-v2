import { PROJECT_TYPES, type Proposal } from "@/lib/types";

/** Resolve the selected scope sections from proposal state */
export function getSelectedSections(proposal: Proposal) {
  return PROJECT_TYPES.filter((pt) =>
    proposal.projectTypes.includes(pt.id)
  ).map((pt) => ({
    ...pt,
    checkedItems: pt.items.filter(
      (item) => proposal.scopeItems[`${pt.id}::${item.id}`]
    ),
  }));
}

/** Format a raw price string to $X,XXX */
export function formatPrice(raw: string): string {
  if (!raw) return "--";
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return raw;
  return `$${num.toLocaleString("en-US")}`;
}

/** Get today's date formatted as "Month YYYY" */
export function proposalDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/** Build full client name */
export function clientName(proposal: Proposal): string {
  return [proposal.firstName, proposal.lastName].filter(Boolean).join(" ");
}
