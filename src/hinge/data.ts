import { staticFile } from "remotion";

// ============================================================
// Tal Reel — 4:5 cut, BOSS-POV data. The hiring manager swipes
// through CANDIDATE cards; three are dismissed, Sanchit settles.
// Then the boss requests his resume and he shares it in chat.
// Cast + copy reused from the HM-side TalReel (remotion-boss-swipe,
// src/reel/data.ts). Order is [...dismissed, hero]; hero settles.
// ============================================================
export type Xp = { logo?: string; title: string; company: string; dates: string; loc?: string };

export type Candidate = {
  id: string;
  name: string;
  role: string; // headline role, e.g. "Software Engineer · Bangalore"
  heroPhoto: string;
  heroPos?: string; // object-position to frame the face
  heroZoom?: number;
  facePhoto: string; // clean face square for the chat-header avatar
  verified?: boolean;
  topMatch?: boolean; // "Top 1% of all candidates for you" badge (hero only)
  lastSeen: string; // "Today" / "2d ago"
  ctc: string; // "₹25 LPA"
  location: string; // "BLR"
  expHeader?: string; // "5+ years of work experience"
  xps: Xp[]; // work-experience rows (card + profile depth)
  working: { q: string; a: string }; // "what am I working on" segment
  chatSubtitle: string; // compact header subtitle
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
  working: {
    q: "What am I currently working on at CRED?",
    a: "Rebuilding the rewards engine on UPI rails — sub-100ms payouts for 12M members.",
  },
  chatSubtitle: "Software Engineer · Bangalore",
};

export const codeforces = { handle: "@sanchittripathi", rating: "1,259", max: "pupil, 1259" };

// Three candidates the boss dismisses (✕) before Sanchit settles.
export const dismissed: Candidate[] = [
  {
    id: "d1",
    name: "Ananya S.",
    role: "AI Engineer at Groww",
    heroPhoto: staticFile("reel/person1.jpg"),
    facePhoto: staticFile("reel/person1.jpg"),
    heroPos: "42% 30%",
    lastSeen: "2d ago",
    ctc: "₹34 LPA",
    location: "BLR",
    expHeader: "4+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-groww.png"), title: "AI Engineer", company: "Groww", dates: "Jan 2024 · 2 y 6 mo · Now", loc: "Bengaluru, India" },
    ],
    working: { q: "What am I currently working on at Groww?", a: "Recommendation models for the discovery feed — 4M daily rankings." },
    chatSubtitle: "AI Engineer · Bangalore",
  },
  {
    id: "d2",
    name: "Priya M.",
    role: "Backend Engineer at Meesho",
    heroPhoto: staticFile("reel/person2.jpg"),
    facePhoto: staticFile("reel/person2.jpg"),
    heroPos: "48% 28%",
    lastSeen: "5d ago",
    ctc: "₹30 LPA",
    location: "IND",
    expHeader: "3+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-meesho.png"), title: "Software Engineer (Backend)", company: "Meesho", dates: "Nov 2024 · 1 y 8 mo · Now", loc: "Bengaluru, India" },
    ],
    working: { q: "What am I currently working on at Meesho?", a: "Scaling order APIs — cut p99 latency in half during festive sales." },
    chatSubtitle: "Backend Engineer · Bangalore",
  },
  {
    id: "d3",
    name: "Rohan K.",
    role: "AI Engineer at Zerodha",
    heroPhoto: staticFile("reel/person3.jpg"),
    facePhoto: staticFile("reel/person3.jpg"),
    heroPos: "50% 28%",
    lastSeen: "1d ago",
    ctc: "₹42 LPA",
    location: "BLR",
    expHeader: "3+ years of work experience",
    xps: [
      { logo: staticFile("reel/logo-kite.png"), title: "AI Engineer", company: "Kite by Zerodha", dates: "Jun 2024 · 2 y 1 mo · Now", loc: "Bengaluru, India" },
    ],
    working: { q: "What am I currently working on at Zerodha?", a: "Ranking models for market-depth signals — 40M events a day." },
    chatSubtitle: "AI Engineer · Bangalore",
  },
];

// Scene-2 stack order: dismissed first, hero settles last.
export const stack: Candidate[] = [...dismissed, hero];

// ---- copy strings ----
// Scene 1 — "NO" holds; these nouns cycle one at a time and get flicked off.
export const NOUNS = ["AGENCIES", "RECRUITERS", "JOB BOARDS", "APPLICATIONS"] as const;

// Boss-POV stack headline — mirror of "chat with your next boss" flipped to hire.
export const headlineLines: string[][] = [
  ["CHAT", "WITH", "YOUR"],
  ["NEXT", "HIRE,", "DIRECTLY"],
];

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
