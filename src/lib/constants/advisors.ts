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
  { id: "kerr", name: "Kerr" },
] as const;
