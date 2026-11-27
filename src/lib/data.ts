export type CityZone = "South Delhi" | "Gurgaon" | "Noida" | "West Delhi";
export type MatchFormat = "5v5" | "6v6" | "7v7" | "9v9";
export type SkillTier = "Casual" | "Intermediate" | "Competitive" | "Women's Only";
export type DayGroup = "Tonight" | "Tomorrow" | "This Weekend";
export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface RosterPlayer {
  name: string;
  initials: string;
  pos: Position;
  team: "Volt" | "Chalk";
  matches: number;
}

export interface GameMatch {
  id: string;
  title: string;
  venue: string;
  neighborhood: string;
  zone: CityZone;
  dayGroup: DayGroup;
  dateLabel: string;
  timeLabel: string;
  durationMins: number;
  format: MatchFormat;
  skill: SkillTier;
  price: number;
  capacity: number;
  filled: number;
  hostName: string;
  hostTag: string;
  surface: string;
  amenities: string[];
  featured?: boolean;
  coordinates: string;
  vibeNote: string;
  roster: RosterPlayer[];
}

export interface MatchPass {
  id: string;
  gameId: string;
  gameTitle: string;
  venue: string;
  dateLabel: string;
  timeLabel: string;
  format: MatchFormat;
  playerName: string;
  phone: string;
  position: Position;
  spots: number;
  totalPaid: number;
  promoApplied?: string;
  createdAt: string;
  ticketCode: string;
}

export interface TournamentItem {
  id: string;
  name: string;
  season: string;
  tagline: string;
  zone: CityZone;
  venue: string;
  format: string;
  teamsCount: number;
  prizePool: string;
  status: "Quarterfinals Live" | "Registration Open" | "Next Sunday" | "Entries Closing";
  dates: string;
  highlightStat: { label: string; value: string };
  topScorer: { name: string; team: string; goals: number };
  standings: { pos: number; team: string; p: number; gd: string; pts: number }[];
  perks: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  zone: CityZone;
  pos: Position;
  goals: number;
  cleanSheets: number;
  appearances: number;
  rating: string;
}

export const GAMES: GameMatch[] = [
  {
    id: "saket-floodlight-7v7",
    title: "Friday Floodlight 7v7",
    venue: "Saket Sports Complex · Turf A",
    neighborhood: "Saket",
    zone: "South Delhi",
    dayGroup: "Tonight",
    dateLabel: "Tonight",
    timeLabel: "8:30 PM",
    durationMins: 90,
    format: "7v7",
    skill: "Intermediate",
    price: 399,
    capacity: 14,
    filled: 11,
    hostName: "Kabir Verma",
    hostTag: "Verified Host · 142 games",
    surface: "FIFA Pro 50mm Turf",
    amenities: ["Floodlights", "Match Bibs", "Chilled Water", "Free Parking"],
    featured: true,
    coordinates: "28.5245° N, 77.2066° E",
    vibeNote: "Balanced squads drafted 10 mins pre-kickoff. High tempo, zero slide tackles.",
    roster: [
      { name: "Kabir V.", initials: "KV", pos: "MID", team: "Volt", matches: 48 },
      { name: "Rohan M.", initials: "RM", pos: "FWD", team: "Volt", matches: 22 },
      { name: "Aryan S.", initials: "AS", pos: "DEF", team: "Volt", matches: 31 },
      { name: "Dev K.", initials: "DK", pos: "GK", team: "Volt", matches: 19 },
      { name: "Siddharth", initials: "SG", pos: "MID", team: "Volt", matches: 14 },
      { name: "Zaid A.", initials: "ZA", pos: "DEF", team: "Volt", matches: 27 },
      { name: "Vikram P.", initials: "VP", pos: "FWD", team: "Chalk", matches: 35 },
      { name: "Nikhil R.", initials: "NR", pos: "MID", team: "Chalk", matches: 41 },
      { name: "Tarun B.", initials: "TB", pos: "DEF", team: "Chalk", matches: 16 },
      { name: "Karan J.", initials: "KJ", pos: "MID", team: "Chalk", matches: 29 },
      { name: "Yash D.", initials: "YD", pos: "DEF", team: "Chalk", matches: 12 },
    ],
  },
  {
    id: "galleria-rooftop-5v5",
    title: "Skyline Rooftop Cage 5v5",
    venue: "Galleria Roof Arena · DLF Phase 4",
    neighborhood: "DLF Phase 4",
    zone: "Gurgaon",
    dayGroup: "Tonight",
    dateLabel: "Tonight",
    timeLabel: "9:30 PM",
    durationMins: 60,
    format: "5v5",
    skill: "Casual",
    price: 449,
    capacity: 10,
    filled: 8,
    hostName: "Meera Kapoor",
    hostTag: "Verified Host · 86 games",
    surface: "Shock-Absorb Cage Turf",
    amenities: ["Skyline View", "Music System", "Bibs & Balls", "Lockers"],
    coordinates: "28.4675° N, 77.0819° E",
    vibeNote: "Fast 5-minute winner-stays rotations. Perfect post-work sweat session.",
    roster: [
      { name: "Meera K.", initials: "MK", pos: "MID", team: "Volt", matches: 33 },
      { name: "Arjun N.", initials: "AN", pos: "FWD", team: "Volt", matches: 18 },
      { name: "Sahil T.", initials: "ST", pos: "DEF", team: "Volt", matches: 21 },
      { name: "Pranav", initials: "PK", pos: "GK", team: "Volt", matches: 15 },
      { name: "Ishaan", initials: "IM", pos: "MID", team: "Chalk", matches: 24 },
      { name: "Rishabh", initials: "RS", pos: "FWD", team: "Chalk", matches: 19 },
      { name: "Anmol", initials: "AG", pos: "DEF", team: "Chalk", matches: 9 },
      { name: "Vansh", initials: "VB", pos: "MID", team: "Chalk", matches: 11 },
    ],
  },
  {
    id: "vasant-kunj-dawn-7v7",
    title: "Dawn Patrol Competitive 7v7",
    venue: "Vasant Kunj Sports Arena · Pitch 2",
    neighborhood: "Vasant Kunj",
    zone: "South Delhi",
    dayGroup: "Tomorrow",
    dateLabel: "Tomorrow",
    timeLabel: "7:00 AM",
    durationMins: 90,
    format: "7v7",
    skill: "Competitive",
    price: 349,
    capacity: 14,
    filled: 14,
    hostName: "Reyansh Gill",
    hostTag: "Verified Host · 190 games",
    surface: "Pro Hybrid Turf",
    amenities: ["Dedicated Ref", "Electrolytes", "Match Stats", "Parking"],
    coordinates: "28.5293° N, 77.1537° E",
    vibeNote: "Full-intensity 90-minute match with rolling subs and dedicated match official.",
    roster: [
      { name: "Reyansh", initials: "RG", pos: "MID", team: "Volt", matches: 64 },
      { name: "Farhan", initials: "FK", pos: "FWD", team: "Volt", matches: 42 },
      { name: "Gaurav", initials: "GS", pos: "DEF", team: "Volt", matches: 38 },
      { name: "Manav", initials: "MP", pos: "GK", team: "Volt", matches: 29 },
      { name: "Chirag", initials: "CB", pos: "MID", team: "Volt", matches: 31 },
      { name: "Harsh", initials: "HV", pos: "DEF", team: "Volt", matches: 25 },
      { name: "Aditya", initials: "AT", pos: "FWD", team: "Volt", matches: 19 },
      { name: "Neil", initials: "ND", pos: "GK", team: "Chalk", matches: 30 },
      { name: "Samar", initials: "SK", pos: "DEF", team: "Chalk", matches: 44 },
      { name: "Varun", initials: "VM", pos: "MID", team: "Chalk", matches: 52 },
      { name: "Kunal", initials: "KC", pos: "FWD", team: "Chalk", matches: 37 },
      { name: "Dhruv", initials: "DP", pos: "MID", team: "Chalk", matches: 28 },
      { name: "Shaurya", initials: "SR", pos: "DEF", team: "Chalk", matches: 21 },
      { name: "Lakshay", initials: "LN", pos: "FWD", team: "Chalk", matches: 16 },
    ],
  },
  {
    id: "chhatarpur-bigpitch-9v9",
    title: "Chhatarpur Under Lights 9v9",
    venue: "Southpoint Turf Club · North Pitch",
    neighborhood: "Chhatarpur",
    zone: "South Delhi",
    dayGroup: "Tomorrow",
    dateLabel: "Tomorrow",
    timeLabel: "8:00 PM",
    durationMins: 90,
    format: "9v9",
    skill: "Intermediate",
    price: 499,
    capacity: 18,
    filled: 14,
    hostName: "Kabir Verma",
    hostTag: "Verified Host · 142 games",
    surface: "60mm Cushioned Turf",
    amenities: ["HD Highlights", "Referee", "Chilled Water", "Cafe Lounge"],
    coordinates: "28.4963° N, 77.1855° E",
    vibeNote: "Wide wings, full offside-free flow, and 4K tripod highlight reel sent next morning.",
    roster: [
      { name: "Kabir V.", initials: "KV", pos: "MID", team: "Volt", matches: 48 },
      { name: "Uday S.", initials: "US", pos: "FWD", team: "Volt", matches: 26 },
      { name: "Armaan", initials: "AM", pos: "MID", team: "Volt", matches: 31 },
      { name: "Raghav", initials: "RT", pos: "DEF", team: "Volt", matches: 20 },
      { name: "Tanishq", initials: "TG", pos: "DEF", team: "Volt", matches: 14 },
      { name: "Parth", initials: "PB", pos: "GK", team: "Volt", matches: 18 },
      { name: "Mohit", initials: "MC", pos: "FWD", team: "Volt", matches: 23 },
      { name: "Shubham", initials: "SD", pos: "MID", team: "Chalk", matches: 29 },
      { name: "Kshitij", initials: "KR", pos: "DEF", team: "Chalk", matches: 17 },
      { name: "Omkar", initials: "OP", pos: "GK", team: "Chalk", matches: 22 },
      { name: "Tushar", initials: "TN", pos: "FWD", team: "Chalk", matches: 34 },
      { name: "Akash", initials: "AK", pos: "MID", team: "Chalk", matches: 19 },
      { name: "Naman", initials: "NJ", pos: "DEF", team: "Chalk", matches: 15 },
      { name: "Vivek", initials: "VS", pos: "MID", team: "Chalk", matches: 28 },
    ],
  },
  {
    id: "noida-104-social-6v6",
    title: "Noida Night Social 6v6",
    venue: "Sector 104 Kickoff Hub · Court 1",
    neighborhood: "Sector 104",
    zone: "Noida",
    dayGroup: "Tomorrow",
    dateLabel: "Tomorrow",
    timeLabel: "9:00 PM",
    durationMins: 75,
    format: "6v6",
    skill: "Casual",
    price: 299,
    capacity: 12,
    filled: 7,
    hostName: "Ananya Roy",
    hostTag: "Verified Host · 61 games",
    surface: "FIFA Quality Turf",
    amenities: ["Beginner Friendly", "Bibs & Balls", "Metro Nearby", "Water"],
    coordinates: "28.5355° N, 77.3672° E",
    vibeNote: "Super welcoming first-timer friendly session. Come solo, leave with a squad.",
    roster: [
      { name: "Ananya R.", initials: "AR", pos: "MID", team: "Volt", matches: 39 },
      { name: "Devansh", initials: "DS", pos: "FWD", team: "Volt", matches: 12 },
      { name: "Ritik", initials: "RK", pos: "DEF", team: "Volt", matches: 8 },
      { name: "Sohail", initials: "SA", pos: "GK", team: "Volt", matches: 14 },
      { name: "Mayank", initials: "MG", pos: "MID", team: "Chalk", matches: 11 },
      { name: "Prateek", initials: "PS", pos: "FWD", team: "Chalk", matches: 17 },
      { name: "Harshit", initials: "HT", pos: "DEF", team: "Chalk", matches: 10 },
    ],
  },
  {
    id: "cyberhub-womens-7v7",
    title: "HerPitch Floodlight 7v7",
    venue: "CyberHub SkyTurf · DLF Phase 2",
    neighborhood: "DLF Phase 2",
    zone: "Gurgaon",
    dayGroup: "This Weekend",
    dateLabel: "Saturday",
    timeLabel: "7:30 PM",
    durationMins: 90,
    format: "7v7",
    skill: "Women's Only",
    price: 349,
    capacity: 14,
    filled: 10,
    hostName: "Tanya Malhotra",
    hostTag: "Community Lead · 78 games",
    surface: "Soft-Touch Cushion Turf",
    amenities: ["Women Only", "Coach Warmup", "Refreshments", "Changing Room"],
    coordinates: "28.4950° N, 77.0895° E",
    vibeNote: "All skill levels welcome! 15-min guided rondo warm-up followed by 75 mins of match play.",
    roster: [
      { name: "Tanya M.", initials: "TM", pos: "MID", team: "Volt", matches: 51 },
      { name: "Rhea S.", initials: "RS", pos: "FWD", team: "Volt", matches: 29 },
      { name: "Nandini", initials: "NP", pos: "DEF", team: "Volt", matches: 22 },
      { name: "Kavya", initials: "KB", pos: "GK", team: "Volt", matches: 18 },
      { name: "Sanya", initials: "SD", pos: "MID", team: "Volt", matches: 15 },
      { name: "Ira G.", initials: "IG", pos: "FWD", team: "Chalk", matches: 27 },
      { name: "Aditi", initials: "AV", pos: "DEF", team: "Chalk", matches: 31 },
      { name: "Niharika", initials: "NK", pos: "MID", team: "Chalk", matches: 14 },
      { name: "Pooja", initials: "PM", pos: "DEF", team: "Chalk", matches: 19 },
      { name: "Zoya", initials: "ZK", pos: "FWD", team: "Chalk", matches: 21 },
    ],
  },
  {
    id: "sirifort-sat-7v7",
    title: "Siri Fort Prime Time 7v7",
    venue: "Siri Fort Sports Turf · South",
    neighborhood: "Hauz Khas",
    zone: "South Delhi",
    dayGroup: "This Weekend",
    dateLabel: "Saturday",
    timeLabel: "8:30 PM",
    durationMins: 90,
    format: "7v7",
    skill: "Competitive",
    price: 429,
    capacity: 14,
    filled: 12,
    hostName: "Reyansh Gill",
    hostTag: "Verified Host · 190 games",
    surface: "FIFA Pro 50mm Turf",
    amenities: ["Floodlights", "Match Referee", "GPS Vests", "Water"],
    coordinates: "28.5503° N, 77.2156° E",
    vibeNote: "Fast-paced Saturday flagship game. Rotating keepers if fewer than 2 GKs book.",
    roster: [
      { name: "Reyansh", initials: "RG", pos: "MID", team: "Volt", matches: 64 },
      { name: "Aravind", initials: "AK", pos: "DEF", team: "Volt", matches: 40 },
      { name: "Karan M.", initials: "KM", pos: "FWD", team: "Volt", matches: 35 },
      { name: "Vikrant", initials: "VS", pos: "MID", team: "Volt", matches: 29 },
      { name: "Samir", initials: "SN", pos: "DEF", team: "Volt", matches: 23 },
      { name: "Rohan G.", initials: "RG", pos: "GK", team: "Volt", matches: 18 },
      { name: "Aakash", initials: "AP", pos: "FWD", team: "Chalk", matches: 41 },
      { name: "Nitin", initials: "NS", pos: "MID", team: "Chalk", matches: 33 },
      { name: "Shreyas", initials: "SB", pos: "DEF", team: "Chalk", matches: 28 },
      { name: "Deepak", initials: "DJ", pos: "MID", team: "Chalk", matches: 24 },
      { name: "Anshul", initials: "AC", pos: "DEF", team: "Chalk", matches: 19 },
      { name: "Piyush", initials: "PT", pos: "FWD", team: "Chalk", matches: 22 },
    ],
  },
  {
    id: "punjabi-bagh-sun-5v5",
    title: "Sunday Evening Mixer 5v5",
    venue: "West Turf Arena · Punjabi Bagh",
    neighborhood: "Punjabi Bagh",
    zone: "West Delhi",
    dayGroup: "This Weekend",
    dateLabel: "Sunday",
    timeLabel: "7:00 PM",
    durationMins: 60,
    format: "5v5",
    skill: "Casual",
    price: 329,
    capacity: 10,
    filled: 6,
    hostName: "Jatin Oberoi",
    hostTag: "Verified Host · 54 games",
    surface: "45mm Multi-Sport Turf",
    amenities: ["All Levels", "Free Bibs", "Parking", "Cold Drinks"],
    coordinates: "28.6692° N, 77.1311° E",
    vibeNote: "Wind down Sunday evening with clean passing football and chai post-match.",
    roster: [
      { name: "Jatin O.", initials: "JO", pos: "MID", team: "Volt", matches: 30 },
      { name: "Keshav", initials: "KG", pos: "FWD", team: "Volt", matches: 14 },
      { name: "Manish", initials: "MB", pos: "DEF", team: "Volt", matches: 19 },
      { name: "Gagan", initials: "GS", pos: "MID", team: "Chalk", matches: 17 },
      { name: "Sumit", initials: "SR", pos: "FWD", team: "Chalk", matches: 21 },
      { name: "Raghav", initials: "RV", pos: "DEF", team: "Chalk", matches: 13 },
    ],
  },
];

export const TOURNAMENTS: TournamentItem[] = [
  {
    id: "ncr-night-league",
    name: "NCR Night League",
    season: "Season 04",
    tagline: "16 squads battling every Thursday under Saket floodlights.",
    zone: "South Delhi",
    venue: "Saket Sports Complex",
    format: "7v7 League + Knockout Playoffs",
    teamsCount: 16,
    prizePool: "₹1,20,000",
    status: "Quarterfinals Live",
    dates: "Oct 18 — Dec 14",
    highlightStat: { label: "Goals Scored", value: "214" },
    topScorer: { name: "Farhan Khan", team: "Saket Athletic", goals: 16 },
    standings: [
      { pos: 1, team: "Saket Athletic", p: 7, gd: "+18", pts: 19 },
      { pos: 2, team: "Hauz Khas FC", p: 7, gd: "+14", pts: 17 },
      { pos: 3, team: "DLF Royals", p: 7, gd: "+9", pts: 14 },
      { pos: 4, team: "Vasant Rovers", p: 7, gd: "+5", pts: 12 },
    ],
    perks: ["4K Match Film + Analytics", "Official Refs & Linesmen", "Custom Matchday Jerseys", "Live Table & Golden Boot"],
  },
  {
    id: "monsoon-cup",
    name: "Floodlight Knockout Cup",
    season: "Winter Edition",
    tagline: "Two intense nights. Sudden-death penalties. One trophy.",
    zone: "Gurgaon",
    venue: "DLF Phase 4 Rooftop & Turf",
    format: "6v6 Group + Sudden Death",
    teamsCount: 12,
    prizePool: "₹50,000",
    status: "Registration Open",
    dates: "Dec 06 — Dec 07",
    highlightStat: { label: "Spots Remaining", value: "3 Teams" },
    topScorer: { name: "Defending: Kabir V.", team: "Volt XI", goals: 9 },
    standings: [
      { pos: 1, team: "Volt XI (Holders)", p: 0, gd: "0", pts: 0 },
      { pos: 2, team: "CyberCity Ballers", p: 0, gd: "0", pts: 0 },
      { pos: 3, team: "Galleria United", p: 0, gd: "0", pts: 0 },
      { pos: 4, team: "Your Squad?", p: 0, gd: "0", pts: 0 },
    ],
    perks: ["Guaranteed 3 Group Matches", "Winner-Takes-All Trophy", "Pro Photographer On Pitch", "Post-Final Courtyard Social"],
  },
  {
    id: "sunday-coed-classic",
    name: "Sunday Morning Co-Ed Classic",
    season: "Vol. 09",
    tagline: "High vibes, balanced mixed squads, live acoustic sets & cold brew.",
    zone: "South Delhi",
    venue: "Vasant Kunj Sports Arena",
    format: "7v7 Co-Ed Social Cup",
    teamsCount: 8,
    prizePool: "Trophies + Kits",
    status: "Next Sunday",
    dates: "Dec 01 · 8:00 AM",
    highlightStat: { label: "Solo Signups", value: "Open" },
    topScorer: { name: "Tanya Malhotra", team: "Chalk Collective", goals: 7 },
    standings: [
      { pos: 1, team: "Chalk Collective", p: 3, gd: "+7", pts: 9 },
      { pos: 2, team: "Green Park Mix", p: 3, gd: "+4", pts: 7 },
      { pos: 3, team: "Mehrauli Sunrisers", p: 3, gd: "+1", pts: 4 },
      { pos: 4, team: "Noida Nomads", p: 3, gd: "-2", pts: 3 },
    ],
    perks: ["Sign Up Solo or As Squad", "Specialty Coffee Pop-Up", "Minimum 2 Women On Pitch", "Zero Ego Fair-Play Award"],
  },
  {
    id: "corporate-turf-showdown",
    name: "NCR Corporate Turf Showdown",
    season: "Q4 Championship",
    tagline: "Startups, studios & tech teams settle scores outside Slack.",
    zone: "Noida",
    venue: "Sector 104 Kickoff Hub",
    format: "6v6 Friday League",
    teamsCount: 12,
    prizePool: "₹75,000 + Shield",
    status: "Entries Closing",
    dates: "Dec 12 — Jan 16",
    highlightStat: { label: "Company Squads", value: "10 / 12" },
    topScorer: { name: "Prateek Sharma", team: "Zomato Striker XI", goals: 11 },
    standings: [
      { pos: 1, team: "Zomato Striker XI", p: 5, gd: "+12", pts: 15 },
      { pos: 2, team: "Razorpay United", p: 5, gd: "+8", pts: 12 },
      { pos: 3, team: "Design Studio FC", p: 5, gd: "+3", pts: 9 },
      { pos: 4, team: "Noida Labs", p: 5, gd: "-1", pts: 6 },
    ],
    perks: ["Company Branding On Broadcast", "Friday 8 PM Prime Slots", "Physio & First Aid On Site", "GST Invoice Available"],
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Farhan Khan", handle: "@farhan9", zone: "South Delhi", pos: "FWD", goals: 24, cleanSheets: 0, appearances: 19, rating: "9.4" },
  { rank: 2, name: "Tanya Malhotra", handle: "@tanya_m", zone: "Gurgaon", pos: "MID", goals: 19, cleanSheets: 3, appearances: 21, rating: "9.2" },
  { rank: 3, name: "Kabir Verma", handle: "@kabir_v", zone: "South Delhi", pos: "MID", goals: 17, cleanSheets: 5, appearances: 24, rating: "9.0" },
  { rank: 4, name: "Dev Kapoor", handle: "@dev_gk", zone: "South Delhi", pos: "GK", goals: 0, cleanSheets: 14, appearances: 22, rating: "8.9" },
  { rank: 5, name: "Ananya Roy", handle: "@ananyar", zone: "Noida", pos: "MID", goals: 15, cleanSheets: 2, appearances: 18, rating: "8.8" },
  { rank: 6, name: "Neil D'Souza", handle: "@neil_saves", zone: "Gurgaon", pos: "GK", goals: 1, cleanSheets: 12, appearances: 20, rating: "8.7" },
];

export const COMMUNITY_VOICES = [
  {
    quote: "Moved to Gurgaon knowing nobody. Booked a Tuesday 7v7 solo, now we have a 14-man WhatsApp group that hasn't missed a week in 8 months.",
    author: "Arjun Nair",
    role: "Product Designer · 47 games played",
    zone: "Gurgaon",
  },
  {
    quote: "No flaky last-minute cancellations. Teams are actually balanced before kickoff and the floodlit pitches in Saket are immaculate.",
    author: "Tanya Malhotra",
    role: "HerPitch Captain · 78 games played",
    zone: "South Delhi",
  },
  {
    quote: "The 4K highlight clips from the Night League are ridiculous. My dad still watches the volley I scored at Chhatarpur.",
    author: "Rohan Malhotra",
    role: "Saket Regular · 34 games played",
    zone: "South Delhi",
  },
];
