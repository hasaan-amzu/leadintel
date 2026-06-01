export interface PricingTier {
  leads: number;
  label: string;
  price: number; // USD
}

// Placeholder prices — swap with Hasaan's final numbers
export const TIERS: PricingTier[] = [
  { leads: 25, label: "25 leads", price: 9.99 },
  { leads: 50, label: "50 leads", price: 17.99 },
  { leads: 100, label: "100 leads", price: 29.99 },
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getTier(leads: number): PricingTier | undefined {
  return TIERS.find((t) => t.leads === leads);
}
