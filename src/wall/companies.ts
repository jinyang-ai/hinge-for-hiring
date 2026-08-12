// ============================================================
// Company wall data — unique bosses who browsed the candidate
// deck (last 30d). Source: Mixpanel project 4040199 (Tal Boss),
// app_candidate_profiles_screen_viewed, unique users by
// `userCurrentCompany`. Internal + non-company values removed.
// (Same source as the static company-wall creative.)
// ============================================================
export type Company = { name: string; hot?: boolean };

// Curated purple-highlight set — the instantly-recognisable names.
// Spread across the list so every scrolling lane gets a pop of accent.
const HIGHLIGHT = new Set([
  "LinkedIn", "Google", "Amazon", "Uber", "Stripe", "NVIDIA", "Razorpay",
  "Meesho", "CRED", "Flipkart", "Swiggy", "PhonePe", "PayPal", "Oracle",
  "Zepto", "Paytm", "Lenskart", "Rippling", "Databricks", "Cloudflare",
  "Revolut", "Duolingo", "xAI", "Blinkit", "Intuit",
]);

// Named companies with ≥2 bosses, plus a slice of the long tail
// (1 boss each) to add density and recognisable logos to the wall.
const NAMES: string[] = [
  "LinkedIn", "Zepto", "Razorpay", "Meesho", "Intuit", "Headout", "Amazon",
  "Uber", "slice", "Swish", "Google", "Flipkart", "Swiggy", "PhonePe",
  "CRED", "Oracle", "Infosys", "WeWork India", "Greenlight", "JPMorganChase",
  "NVIDIA", "Stripe", "Okta", "Red Hat", "Docusign", "PayPal", "Paytm",
  "Zeta", "Plum", "Atlan", "Chargebee", "Angel One", "Cashfree Payments",
  "smallcase", "Lenskart", "Rippling", "Leap", "Bureau", "Keka HR",
  "PubMatic", "Deliveroo", "Walmart Global Tech", "Booking Holdings",
  "GoTo Group", "Tekion Corp", "Bentley Systems", "PlatinumRx",
  // long tail (1 boss each) — well-known names for density
  "Databricks", "Cloudflare", "Revolut", "eBay", "Twilio", "Duolingo",
  "xAI", "Ather Energy", "Blinkit", "Porter", "Ninjacart", "Navi",
  "Purplle", "ClearTax", "Pixxel", "Infra.Market",
];

export const COMPANIES: Company[] = NAMES.map((name) => ({
  name,
  hot: HIGHLIGHT.has(name),
}));

// Split into `rows` lanes round-robin, so big names land on every lane
// rather than clustering at the top. Each lane is then long enough that
// a single copy overflows the frame width (needed for a seamless loop).
export function toLanes(items: Company[], rows: number): Company[][] {
  const lanes: Company[][] = Array.from({ length: rows }, () => []);
  items.forEach((c, i) => lanes[i % rows].push(c));
  return lanes;
}
