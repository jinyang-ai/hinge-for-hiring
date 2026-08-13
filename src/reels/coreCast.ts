// ============================================================
// The CoreLoop cast. Scoped to this reel so the other cuts keep their own
// people: three fresh Bengaluru engineers, real photos, startup-fit signals.
// Meera is the hero (the one the boss reads, asks and books).
// ============================================================
import { staticFile } from "remotion";
import { type Candidate } from "../hinge/data";

export const KARTHIK: Candidate = {
  id: "karthik",
  name: "Karthik Rao",
  role: "AI Engineer · Bengaluru",
  heroPhoto: staticFile("reel/cand-karthik.jpg"),
  facePhoto: staticFile("reel/cand-karthik.jpg"),
  heroPos: "36% 26%",
  verified: true,
  lastSeen: "2d ago",
  ctc: "₹34 LPA",
  location: "HSR Layout",
  expHeader: "4+ years of work experience",
  xps: [
    { logo: staticFile("reel/logo-groww.png"), title: "AI Engineer", company: "Groww", dates: "Jan 2024 · 2 y 6 mo · Now", loc: "Bengaluru, India" },
    { logo: staticFile("reel/logo-sharechat.png"), title: "ML Engineer", company: "ShareChat", dates: "Jun 2022 · 1 y 6 mo", loc: "Bengaluru, India" },
  ],
  moreXp: 1,
  skills: ["Python", "PyTorch", "Recsys", "Spark", "Airflow"],
  working: { q: "What am I currently working on at Groww?", a: "Built Groww's discovery feed from scratch. 4M rankings a day with a team of 3." },
  code: { kind: "github", handle: "@karthikrao", a: "512 contributions", b: "recsys-serving · 1.2k ★" },
  chatSubtitle: "AI Engineer · Bengaluru",
  intent: "Wants to build 0→1",
};

export const ADITYA: Candidate = {
  id: "aditya",
  name: "Aditya Nair",
  role: "Backend Engineer · Bengaluru",
  heroPhoto: staticFile("reel/cand-aditya.jpg"),
  facePhoto: staticFile("reel/cand-aditya.jpg"),
  heroPos: "52% 22%",
  verified: true,
  lastSeen: "1d ago",
  ctc: "₹42 LPA",
  location: "Whitefield",
  expHeader: "3+ years of work experience",
  xps: [
    { logo: staticFile("reel/logo-kite.png"), title: "Backend Engineer", company: "Kite by Zerodha", dates: "Jun 2024 · 2 y 1 mo · Now", loc: "Bengaluru, India" },
    { logo: staticFile("reel/logo-swiggy.png"), title: "Software Engineer", company: "Swiggy", dates: "Mar 2023 · 1 y", loc: "Bengaluru, India" },
  ],
  moreXp: 2,
  skills: ["Go", "Kafka", "ClickHouse", "gRPC", "Postgres"],
  working: { q: "What am I currently working on at Zerodha?", a: "Shipped Zerodha's market-depth ranking solo. 40M events a day, 0→1." },
  code: { kind: "codeforces", handle: "@adityanair", a: "Rating 1,712", b: "Expert · 610 solved" },
  chatSubtitle: "Backend Engineer · Bengaluru",
  intent: "Ex-seed startup",
};

// the hero: read, asked, booked
export const MEERA: Candidate = {
  id: "meera",
  name: "Meera Iyer",
  role: "Software Engineer · Bengaluru",
  heroPhoto: staticFile("reel/cand-meera.jpg"),
  facePhoto: staticFile("reel/cand-meera.jpg"),
  heroPos: "46% 24%",
  verified: true,
  topMatch: true,
  lastSeen: "Today",
  ctc: "₹28 LPA",
  location: "Indiranagar",
  expHeader: "5+ years of work experience",
  xps: [
    { logo: staticFile("reel/logo-cred.png"), title: "Software Engineer (Backend)", company: "CRED", dates: "Sep 2025 · 9 mo · Now", loc: "Bengaluru, India" },
    { logo: staticFile("reel/logo-phonepe.png"), title: "Backend Engineer", company: "PhonePe", dates: "May 2023 · 2 y 4 mo", loc: "Bengaluru, India · Hybrid" },
  ],
  moreXp: 2,
  skills: ["Java", "Go", "UPI Rails", "Redis", "Kafka", "Postgres"],
  working: {
    q: "What am I currently working on at CRED?",
    a: "Took CRED's rewards engine from 0→1 on UPI rails. Sub-100ms payouts for 12M members.",
  },
  code: { kind: "codeforces", handle: "@meeraiyer", a: "Rating 1,259", b: "Pupil · 340 solved" },
  chatSubtitle: "Software Engineer · Bengaluru",
  intent: "Open to meet · this week",
};

export const CORE_STACK: Candidate[] = [KARTHIK, ADITYA, MEERA];
