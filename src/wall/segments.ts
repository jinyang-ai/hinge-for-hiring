// ============================================================
// Company wall segments. Each entry is one creative variation, cut by the
// peer group a Bangalore boss actually identifies with. Adding a variant is
// a config entry here, not new code.
//
// ON THE NUMBERS: `count` is a PLACEHOLDER in the 500-1000 range, derived
// deterministically from the segment id. It must be deterministic rather
// than Math.random() because Remotion renders frames across separate worker
// processes - a random call would produce a different number on different
// frames of the same video and the headline would visibly flicker.
// Swap `count` for the real Mixpanel figure per segment before anything
// ships publicly; it is a claim about the business, so it should be true.
// ============================================================

// deterministic 500-1000 from a string, stable across render workers
function seededCount(id: string, lo = 500, hi = 1000): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return lo + (Math.abs(h) % (hi - lo + 1));
}

export type Segment = {
  id: string;
  /** the peer group, as it reads in the headline */
  noun: string;
  /** companies shown scrolling, drawn from the real Mixpanel pull */
  companies: string[];
  /** names rendered in the accent colour */
  highlight: string[];
  sub: string;
  count: number;
};

const seg = (s: Omit<Segment, "count">): Segment => ({ ...s, count: seededCount(s.id) });

export const SEGMENTS: Segment[] = [
  seg({
    id: "fintech",
    noun: "fintech bosses",
    companies: [
      "Razorpay", "PhonePe", "CRED", "Paytm", "slice", "Zeta", "Cashfree Payments",
      "smallcase", "Angel One", "Plum", "Jupiter", "Navi", "ClearTax", "Khatabook",
      "Stripe", "PayPal", "Revolut", "JPMorganChase", "Bureau", "PowerUp Money",
      "Aurm", "Setu", "Perfios", "Yubi", "Fi Money", "Groww",
    ],
    highlight: ["Razorpay", "CRED", "PhonePe", "Stripe", "Groww", "Paytm", "Navi"],
    sub: "The people building payments in this city are hiring here.",
  }),
  seg({
    id: "commerce",
    noun: "commerce bosses",
    companies: [
      "Meesho", "Flipkart", "Zepto", "Blinkit", "Lenskart", "Purplle", "Swiggy",
      "Amazon", "Walmart Global Tech", "Nykaa", "Myntra", "Porter", "Ninjacart",
      "Deliveroo", "Booking Holdings", "Zomato", "BigBasket", "Udaan", "DealShare",
      "Country Delight", "Licious", "boAt",
    ],
    highlight: ["Meesho", "Flipkart", "Zepto", "Swiggy", "Blinkit", "Nykaa", "Myntra"],
    sub: "The people who scaled Indian commerce are hiring here.",
  }),
  seg({
    id: "ai",
    noun: "AI bosses",
    companies: [
      "NVIDIA", "Databricks", "xAI", "Atlan", "Bridgetown Research", "RevRag.AI",
      "Pixxel", "Sarvam AI", "Krutrim", "Fractal", "Observe.AI", "Mad Street Den",
      "Google", "Microsoft", "Adobe", "Wadhwani AI", "Niramai", "SigTuple",
      "Haptik", "Gupshup", "Yellow.ai", "Uniphore",
    ],
    highlight: ["NVIDIA", "Databricks", "xAI", "Sarvam AI", "Google", "Krutrim"],
    sub: "The people shipping models in this city are hiring here.",
  }),
  seg({
    id: "saas",
    noun: "SaaS bosses",
    companies: [
      "Chargebee", "Rippling", "Okta", "Red Hat", "Docusign", "Cloudflare", "Twilio",
      "Keka HR", "PubMatic", "Atlan", "Tekion Corp", "Bentley Systems", "Freshworks",
      "Zoho", "Postman", "BrowserStack", "Hasura", "Whatfix", "MoEngage", "CleverTap",
      "Darwinbox", "Icertis",
    ],
    highlight: ["Freshworks", "Postman", "BrowserStack", "Zoho", "Chargebee", "Cloudflare"],
    sub: "The people building software for the world are hiring here.",
  }),
  seg({
    id: "consumer",
    noun: "consumer bosses",
    companies: [
      "LinkedIn", "ShareChat", "Uber", "Duolingo", "Swiggy", "Zepto", "Headout",
      "Schmooze", "eBay", "Spotify", "Netflix", "Airbnb", "Dream11", "Games24x7",
      "Josh", "Moj", "Pratilipi", "Kuku FM", "Cult.fit", "Urban Company",
      "Rapido", "Ather Energy",
    ],
    highlight: ["LinkedIn", "Uber", "Spotify", "Netflix", "Dream11", "Cult.fit"],
    sub: "The people building what this city uses daily are hiring here.",
  }),
];

export const SEGMENT_BY_ID = Object.fromEntries(SEGMENTS.map((s) => [s.id, s]));
