// Invented placeholder review data — no review/rating entity exists in the
// backend yet. Deterministic and seeded per product so it can be swapped for
// a real Vendure-backed reviews API later without touching the components
// that render it (same intent as the note atop placeholder-data.ts).

export type ReviewBreakdown = Record<5 | 4 | 3 | 2 | 1, number>;

export interface Review {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
}

export interface ProductReviewsData {
  average: number;
  total: number;
  breakdown: ReviewBreakdown;
  reviews: Review[];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Ahmed", "Sara", "Mohammed", "Fatima", "Omar", "Layla", "Yusuf", "Noura",
  "Khalid", "Mariam", "James", "Priya", "Chen", "Elena", "Daniel", "Aisha",
  "Rashid", "Hana", "Karim", "Sophie",
];

const LAST_INITIALS = ["A.", "B.", "H.", "K.", "M.", "R.", "S.", "T.", "Y.", "Z."];

const TITLES = [
  "Great value for the price",
  "Exactly as described",
  "Very happy with this purchase",
  "Solid choice",
  "Works well, minor gripes",
  "Would buy again",
  "Impressive quality",
  "Good but not perfect",
  "Does the job",
  "Highly recommend",
];

const BODIES = [
  "Great build quality, arrived faster than expected.",
  "Battery life is solid for daily use.",
  "Setup was quick and performance has been reliable so far.",
  "Looks premium and feels sturdy day to day.",
  "A bit pricier than expected but the quality justifies it.",
  "Packaging was excellent and it arrived without a scratch.",
  "Does everything I need without any fuss.",
  "Noticeably better than the previous model I had.",
  "Customer support was helpful when I had a setup question.",
  "Performance is smooth, no complaints after a few weeks of use.",
];

const STAR_ORDER = [5, 4, 3, 2, 1] as const;
const BASE_WEIGHTS = [0.52, 0.27, 0.11, 0.06, 0.04];

function pickWeightedRating(random: () => number, breakdown: ReviewBreakdown): number {
  const roll = random() * 100;
  let cumulative = 0;
  for (const star of STAR_ORDER) {
    cumulative += breakdown[star];
    if (roll <= cumulative) return star;
  }
  return 5;
}

export function getProductReviews(productId: string, productName: string): ProductReviewsData {
  const seed = hashString(`${productId}:${productName}`);
  const random = mulberry32(seed);

  const total = 24 + Math.floor(random() * 150);
  const reviewCount = 4 + Math.floor(random() * 3);

  const rawWeights = BASE_WEIGHTS.map((base) => Math.max(0.01, base + (random() - 0.5) * 0.08));
  const weightSum = rawWeights.reduce((sum, weight) => sum + weight, 0);
  const roundedPercents = rawWeights.map((weight) => Math.round((weight / weightSum) * 100));
  const drift = 100 - roundedPercents.reduce((sum, percent) => sum + percent, 0);
  roundedPercents[0] += drift;

  const breakdown: ReviewBreakdown = {
    5: roundedPercents[0],
    4: roundedPercents[1],
    3: roundedPercents[2],
    2: roundedPercents[3],
    1: roundedPercents[4],
  };

  const average = Number(
    (
      (5 * breakdown[5] + 4 * breakdown[4] + 3 * breakdown[3] + 2 * breakdown[2] + 1 * breakdown[1]) /
      100
    ).toFixed(1)
  );

  const reviews: Review[] = Array.from({ length: reviewCount }, (_, index) => {
    const rating = pickWeightedRating(random, breakdown);
    const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const lastInitial = LAST_INITIALS[Math.floor(random() * LAST_INITIALS.length)];
    const title = TITLES[Math.floor(random() * TITLES.length)];
    const body = BODIES[Math.floor(random() * BODIES.length)];

    return {
      id: `${productId}-review-${index}`,
      author: `${firstName} ${lastInitial}`,
      verified: random() < 0.78,
      rating,
      title,
      body,
      daysAgo: 1 + Math.floor(random() * 180),
    };
  }).sort((a, b) => a.daysAgo - b.daysAgo);

  return { average, total, breakdown, reviews };
}
