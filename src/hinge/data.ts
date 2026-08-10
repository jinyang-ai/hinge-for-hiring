import { staticFile } from "remotion";

// ============================================================
// Tal Reel — 4:5 cut, BOSS-POV data. The hiring manager swipes through
// CANDIDATE cards; each is a rich, scrollable profile (experience, skills,
// "what I'm working on", coding stat). Three are browsed + dismissed, Sanchit
// settles and gets his resume requested. Order is [...dismissed, hero].
// ============================================================
export type Xp = { logo?: string; title: string; company: string; dates: string; loc?: string };
export type Code = { kind: "codeforces" | "github"; handle: string; a: string; b: string };

export type Candidate = {
  id: string;
  name: string;
  role: string; // headline role, e.g. "Software Engineer · Bangalore"
  heroPhoto: string;
  heroPos?: string;
  heroZoom?: number;
  facePhoto: string; // clean face square for the chat-header avatar
  verified?: boolean;
  topMatch?: boolean; // "Top 1% of all candidates for you" badge
  lastSeen: string;
  ctc: string;
  location: string;
  expHeader: string; // "5+ years of work experience"
  xps: Xp[]; // 2 work-experience rows
  moreXp?: number; // "Show N more experiences"
  skills: string[]; // top-skill chips
  working: { q: string; a: string }; // "what am I working on" segment
  code: Code; // Codeforces / GitHub depth
  chatSubtitle: string;
};

// Hero candidate — Sanchit settles and gets his resume requested.
export const hero: Candidate = {
  id: "sanchit",
  name: "Sanchit Tripathi",
  role: "Software Engineer · Bangalore",
  heroPhoto: staticFile("reel/sanchit-hero.jpg"),
  facePhoto: staticFile("reel/sanchit-face.jpg"),
  verified: true,
  topMatch: true,
  lastSeen: "Today",
  ctc: "₹25 LPA",
  location: "BLR",
  expHeader: "5+ years of work experience",
  xps: [
    { logo: staticFile("reel/logo-cred.png"), title: "Software Engineer (Backend)", company: "CRED", dates: "Sep 2025 · 9 mo · Now", loc: "Bengaluru, India" },
    { logo: staticFile("reel/logo-phonepe.png"), title: "Backend Engineer", company: "PhonePe", dates: "May 2023 · 2 y 4 mo", loc: "Bengaluru, India · Hybrid" },
  ],
  moreXp: 2,
  skills: ["Java", "Go", "UPI Rails", "Redis", "Kafka", "Postgres"],
  working: {
    q: "What am I currently working on at CRED?",
    a: "Rebuilding the rewards engine on UPI rails — sub-100ms payouts for 12M members.",
  },
  code: { kind: "codeforces", handle: "@sanchittripathi", a: "Rating 1,259", b: "Pupil · 340 solved" },
  chatSubtitle: "Software Engineer · Bangalore",
};

// Three candidates the boss browses + dismisses (✕) before Sanchit settles.
export const dismissed: Candidate[] = [
  {
    id: "d1",
    name: "Ananya S.",
    role: "AI Engineer · Bangalore",
    heroPhoto: staticFile("reel/person1.jpg"),
    facePhoto: staticFile("reel/person1.jpg"),
    heroPos: "42% 30%",
    verified: true,
    lastSeen: "2d ago",
    ctc: "₹34 LPA",
    location: "BLR",
    expHeader: "4+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-groww.png"), title: "AI Engineer", company: "Groww", dates: "Jan 2024 · 2 y 6 mo · Now", loc: "Bengaluru, India" },
      { logo: staticFile("reel/logo-sharechat.png"), title: "ML Engineer", company: "ShareChat", dates: "Jun 2022 · 1 y 6 mo", loc: "Bengaluru, India" },
    ],
    moreXp: 1,
    skills: ["Python", "PyTorch", "Recsys", "Spark", "Airflow"],
    working: { q: "What am I currently working on at Groww?", a: "Recommendation models for the discovery feed — 4M daily rankings." },
    code: { kind: "github", handle: "@ananya-s", a: "512 contributions", b: "recsys-serving · 1.2k ★" },
    chatSubtitle: "AI Engineer · Bangalore",
  },
  {
    id: "d2",
    name: "Priya M.",
    role: "Backend Engineer · Bangalore",
    heroPhoto: staticFile("reel/person2.jpg"),
    facePhoto: staticFile("reel/person2.jpg"),
    heroPos: "48% 28%",
    verified: true,
    lastSeen: "5d ago",
    ctc: "₹30 LPA",
    location: "IND",
    expHeader: "3+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-meesho.png"), title: "Software Engineer (Backend)", company: "Meesho", dates: "Nov 2024 · 1 y 8 mo · Now", loc: "Bengaluru, India" },
      { logo: staticFile("reel/logo-razorpay.png"), title: "SDE Intern", company: "Razorpay", dates: "Jun 2023 · 6 mo", loc: "Bengaluru, India" },
    ],
    moreXp: 1,
    skills: ["Go", "Kafka", "PostgreSQL", "Kubernetes", "gRPC"],
    working: { q: "What am I currently working on at Meesho?", a: "Scaling order APIs — cut p99 latency in half during festive sales." },
    code: { kind: "github", handle: "@priyam", a: "689 contributions", b: "order-gateway · 840 ★" },
    chatSubtitle: "Backend Engineer · Bangalore",
  },
  {
    id: "d3",
    name: "Rohan K.",
    role: "AI Engineer · Bangalore",
    heroPhoto: staticFile("reel/person3.jpg"),
    facePhoto: staticFile("reel/person3.jpg"),
    heroPos: "50% 28%",
    verified: true,
    lastSeen: "1d ago",
    ctc: "₹42 LPA",
    location: "BLR",
    expHeader: "3+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-kite.png"), title: "AI Engineer", company: "Kite by Zerodha", dates: "Jun 2024 · 2 y 1 mo · Now", loc: "Bengaluru, India" },
      { logo: staticFile("reel/logo-swiggy.png"), title: "Software Engineer", company: "Swiggy", dates: "Mar 2023 · 1 y", loc: "Bengaluru, India" },
    ],
    moreXp: 2,
    skills: ["Python", "Ray", "Kafka", "ClickHouse", "Feast"],
    working: { q: "What am I currently working on at Zerodha?", a: "Ranking models for market-depth signals — 40M events a day." },
    code: { kind: "codeforces", handle: "@rohank", a: "Rating 1,712", b: "Expert · 610 solved" },
    chatSubtitle: "AI Engineer · Bangalore",
  },
];

// Randomized dismissed order, with a MALE candidate guaranteed first. Uses a
// seeded shuffle (not Math.random) so every Remotion render worker agrees on the
// same order — otherwise frames would disagree. Bump SHUFFLE_SEED to re-roll.
export const SHUFFLE_SEED = 3;
const MALE_IDS = new Set(["d3", "sanchit"]); // Rohan + Sanchit are the men
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = (seed % 2147483647) || 1;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const shuffled = seededShuffle(dismissed, SHUFFLE_SEED);
const firstMale = shuffled.findIndex((c) => MALE_IDS.has(c.id));
if (firstMale > 0) [shuffled[0], shuffled[firstMale]] = [shuffled[firstMale], shuffled[0]];

// Scene-2 stack order: shuffled dismissed (male first) → the hero settles last.
export const stack: Candidate[] = [...shuffled, hero];

// Scene 4 chat — the boss requested the resume on the profile; the chat opens
// with that request in place, then Sanchit replies with his resume.
export const chat = {
  requestEmoji: "📋",
  requestPre: "You sent a request to check out ",
  requestNameBold: "Sanchit",
  requestPost: "’s resume",
  requestTime: "11:36 PM",
  resume: { file: "Sanchit_Resume.pdf", kind: "PDF", text: "Here’s my resume 🙌", time: "11:46 PM" },
};
