import { tours, guides, CONTACT, type Tour } from '../data/tours';

export interface Prefs {
  days?: number;
  budget?: number;
  level?: 1 | 2 | 3;
  interests: string[];
}

export interface AgentReply {
  text: string;
  tours?: string[];
  guides?: string[];
  chips?: string[];
  link?: { label: string; to: string };
}

const levelOf: Record<Tour['difficulty'], number> = { Easy: 1, Moderate: 2, Challenging: 3, Strenuous: 3 };

const INTEREST_WORDS = Array.from(
  new Set(
    tours
      .flatMap((t) => [...t.tags, t.region.toLowerCase(), t.category.toLowerCase()])
      .concat(['everest', 'annapurna', 'culture', 'wildlife', 'climb', 'heli', 'luxury', 'spiritual', 'lake']),
  ),
).filter((w) => w.length > 2);

const SYN: Record<string, string> = {
  climb: 'climbing',
  peak: 'climbing',
  summit: 'summit',
  helicopter: 'helicopter',
  heli: 'helicopter',
  animals: 'wildlife',
  animal: 'wildlife',
  rhino: 'rhino',
  tiger: 'tiger',
  temple: 'temples',
  temples: 'temples',
  heritage: 'culture',
  cultural: 'culture',
  monastery: 'monastery',
  buddhist: 'buddha',
  honeymoon: 'honeymoon',
  romantic: 'couple',
  relax: 'relax',
  kids: 'family',
  children: 'family',
  remote: 'remote',
  quiet: 'quiet',
  crowd: 'quiet',
};

export function extractPrefs(raw: string, prev: Prefs): Prefs {
  const m = raw.toLowerCase();
  const out: Prefs = { ...prev, interests: [...prev.interests] };

  const d = m.match(/(\d+)\s*(?:-|to)?\s*(days?|nights?|d\b|weeks?|wks?)/);
  if (d) out.days = /week|wk/.test(d[2]) ? Number(d[1]) * 7 : Number(d[1]);
  else if (/\b(a|one) week\b/.test(m)) out.days = 7;
  else if (/\btwo weeks|fortnight\b/.test(m)) out.days = 14;
  else if (/\bweekend\b/.test(m)) out.days = 2;

  const b =
    m.match(/\$\s?(\d[\d,]*)/) ||
    m.match(/(\d[\d,]*)\s*(?:usd|dollars|\$|bucks)/) ||
    m.match(/(?:budget|under|below|max|less than)\s*(?:of|is)?\s*\$?\s?(\d[\d,]{2,})/);
  if (b) out.budget = Number(b[1].replace(/,/g, ''));
  if (/\b(cheap|budget|affordable|low cost)\b/.test(m) && !out.budget) out.budget = 800;

  if (/\b(easy|beginner|first[- ]time|family|kids|senior|elderly|relax|gentle|no trek)/.test(m)) out.level = 1;
  else if (/\b(moderate|medium|average|some experience|fit)\b/.test(m)) out.level = 2;
  else if (/\b(hard|challeng|difficult|strenuous|experienced|extreme|tough|high pass)/.test(m)) out.level = 3;

  const fresh: string[] = [];
  const words = m.split(/[^a-z']+/).filter(Boolean);
  for (const w of words) {
    const s = SYN[w];
    if (s && !fresh.includes(s)) fresh.push(s);
    else if (INTEREST_WORDS.includes(w) && !fresh.includes(w)) fresh.push(w);
  }
  for (const phrase of INTEREST_WORDS.filter((x) => x.includes(' '))) {
    if (m.includes(phrase) && !fresh.includes(phrase)) fresh.push(phrase);
  }
  if (fresh.length) out.interests = fresh;
  return out;
}

export function recommend(p: Prefs, n = 3): Tour[] {
  const scored = tours.map((t) => {
    let s = t.rating;
    const hay = [t.title, t.region, t.category, ...t.tags].join(' ').toLowerCase();
    for (const i of p.interests) if (hay.includes(i)) s += 4;
    if (p.days) s -= Math.min(Math.abs(t.days - p.days) * 0.6, 8) + (t.days > p.days + 1 ? 4 : 0);
    if (p.budget) s -= t.price > p.budget ? 9 + (t.price - p.budget) / 150 : 0;
    if (p.level) s -= Math.abs(levelOf[t.difficulty] - p.level) * 2.5;
    return { t, s };
  });
  return scored.sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.t);
}

function findTourMention(m: string): Tour | undefined {
  const keys: [RegExp, string][] = [
    [/three pass|3 pass/, 'everest-three-passes'],
    [/everest base camp|\bebc\b/, 'everest-base-camp-trek'],
    [/gokyo/, 'gokyo-lakes-trek'],
    [/annapurna base camp|\babc\b|sanctuary/, 'annapurna-base-camp'],
    [/poon ?hill|ghorepani/, 'ghorepani-poon-hill'],
    [/annapurna circuit|thorong/, 'annapurna-circuit'],
    [/manaslu/, 'manaslu-circuit'],
    [/langtang/, 'langtang-valley'],
    [/mustang|lo manthang/, 'upper-mustang'],
    [/island peak|imja/, 'island-peak-climbing'],
    [/heli(copter)? tour|everest heli|everest by helicopter/, 'everest-heli-tour'],
    [/chitwan|safari/, 'chitwan-jungle-safari'],
    [/paraglid/, 'pokhara-paragliding'],
    [/raft/, 'trishuli-rafting'],
    [/lumbini/, 'lumbini-pilgrimage'],
    [/bhaktapur|nagarkot/, 'bhaktapur-nagarkot'],
    [/kathmandu (tour|heritage|sightseeing)|heritage tour/, 'kathmandu-heritage-tour'],
    [/pokhara (tour|retreat)|phewa/, 'pokhara-lakeside-retreat'],
  ];
  for (const [re, slug] of keys) if (re.test(m)) return tours.find((t) => t.slug === slug);
}

const fmt = (n: number) => '$' + n.toLocaleString();

export function respond(input: string, prev: Prefs): { reply: AgentReply; prefs: Prefs } {
  const m = input.toLowerCase().trim();
  const prefs = extractPrefs(m, prev);
  const prefChanged = JSON.stringify(prefs) !== JSON.stringify(prev);
  const tour = findTourMention(m);

  const r = (reply: AgentReply) => ({ reply, prefs });

  if (/^(hi|hello|hey|namaste|namaskar|good (morning|evening|afternoon))\b/.test(m) && m.length < 30) {
    return r({
      text: 'Namaste! 🙏 I’m **Planet AI**, your Mountain Planet travel assistant. Tell me how many days you have, your budget and what excites you — I’ll match you with the perfect Himalayan journey.',
      chips: ['Plan my trip', 'Best time to visit', 'Easy treks for beginners', 'Everest Base Camp details'],
    });
  }
  if (/\b(thank|thanks|thx|dhanyabad|dhanyavad)\b/.test(m)) {
    return r({ text: 'Dhanyabad! 🏔️ Anything else I can help you plan? When you’re ready, our team can send a free tailor-made quote.', chips: ['Get a free quote', 'Show popular trips'] });
  }
  if (/\b(book|booking|reserve|quote|contact|email|call|phone|whatsapp|talk to (a )?human|agent)\b/.test(m) && !tour) {
    return r({
      text: `Our Kathmandu-based team replies within 24 hours. Send a trip request and we’ll craft a **free, no-obligation itinerary**.\n\n✉️ ${CONTACT.email}\n📍 ${CONTACT.address}`,
      link: { label: 'Open trip request form', to: '/plan' },
      chips: ['Plan my trip', 'What’s included?'],
    });
  }

  if (tour && /\b(book|quote|reserve|enquir|inquir)/.test(m)) {
    return r({ text: `Great choice! Let’s get **${tour.title}** booked. Fill in your dates and group size and we’ll confirm availability.`, link: { label: `Request ${tour.title}`, to: `/plan?tour=${tour.slug}` }, tours: [tour.slug] });
  }

  if (/\b(best time|when (should|to|is)|season|weather|month|monsoon|winter|spring|autumn|fall|rain|cold|temperature)\b/.test(m) && !/\b(trips?|treks?|tours?)\b/.test(m)) {
    const extra = tour ? `\n\nFor **${tour.title}** specifically: best in **${tour.season}**.` : '';
    return r({
      text: `**Autumn (Sep–Nov)** — clearest skies, the classic season.\n**Spring (Mar–May)** — rhododendrons in bloom, warmer days.\n**Winter (Dec–Feb)** — quiet & crisp; great for lower treks.\n**Monsoon (Jun–Aug)** — head to rain-shadow Upper Mustang.${extra}`,
      guides: ['best-time-to-trek-nepal'],
      chips: ['Monsoon trips', 'Easy winter treks', 'Plan my trip'],
    });
  }
  if (/\b(altitude|ams|sick|oxygen|acclimati|headache|breath)/.test(m)) {
    return r({
      text: 'Altitude sickness can affect anyone above ~3,000m. Our itineraries include built-in **acclimatisation days**, guides carry **pulse oximeters**, and we follow “climb high, sleep low”. Hydrate (3–4L/day), go slow and always tell your guide about symptoms.',
      guides: ['altitude-sickness-guide'],
      chips: ['Low-altitude treks', 'Is EBC safe for beginners?'],
    });
  }
  if (/\b(permit|visa|tims|passport|entry)\b/.test(m)) {
    return r({
      text: 'Most nationalities get a **Nepal visa on arrival** (15/30/90 days). Trekking regions need park or conservation permits, and areas like Manaslu & Upper Mustang need **restricted-area permits** with a licensed guide. Good news: **we arrange every permit for you.**',
      guides: ['nepal-trekking-permits'],
      chips: ['Nepal visa?', 'Plan my trip'],
    });
  }
  if (/\b(insurance|insured|rescue|evacuat|safe|safety)\b/.test(m)) {
    return r({
      text: 'Safety comes first. All guides are **government-licensed and first-aid trained**. For treks we require **travel insurance covering helicopter rescue up to 6,000m** (or higher for peak climbing). We coordinate evacuations 24/7 if ever needed.',
      chips: ['Altitude sickness tips', 'Easy treks'],
    });
  }
  if (/\b(pack|packing|gear|bring|equipment|clothes|boots|sleeping bag)\b/.test(m)) {
    return r({
      text: '**Essentials:** broken-in hiking boots, down jacket, fleece, waterproof shell, thermal layers, 4-season sleeping bag (we can rent one), trekking poles, sunglasses, SPF 50, headlamp, water purification, and a small first-aid kit. Duffel bags are provided for porters (max 10kg per trekker).',
      chips: ['Can I rent gear in Kathmandu?', 'Best time to visit'],
    });
  }
  if (/rent gear/.test(m)) {
    return r({ text: 'Yes! Thamel in Kathmandu has excellent rental shops. We’ll take you to trusted ones on arrival day — down jackets and sleeping bags are just a few dollars per day.' });
  }
  if (/\b(include|included|inclusion|price include|what do i get)\b/.test(m) && !tour) {
    return r({ text: 'Typical trek packages include: airport transfers, licensed guide, porters, teahouse lodging, 3 meals a day on the trail, all permits, domestic flights where needed, and a welcome dinner. International flights, visa fees, insurance, tips and personal gear are not included.', chips: ['Plan my trip'] });
  }
  if (/\b(fit|fitness|train|training|prepare)\b/.test(m)) {
    return r({
      text: 'For moderate treks, aim for **4–6 weeks of cardio** (hiking, stairs, cycling) and a few long weekend walks with a daypack. For high passes or peaks, add strength training and back-to-back hiking days. No technical skills needed except on climbing trips — we teach you.',
      chips: ['Easy treks for beginners', 'Challenging adventures'],
    });
  }
  if (/\b(group|solo|alone|private|single)\b/.test(m) && !prefChanged) {
    return r({ text: 'Both! Solo travellers can join small group departures or go **private with just a guide** — every Mountain Planet trip can be tailor-made with your own dates.', chips: ['Plan my trip', 'Get a free quote'] });
  }

  if (tour && !/\b(recommend|suggest|similar|alternative)\b/.test(m)) {
    return r({
      text: `**${tour.title}** — ${tour.days} day${tour.days > 1 ? 's' : ''}, ${tour.difficulty.toLowerCase()}, max altitude ${tour.maxAlt.toLocaleString()}m, from **${fmt(tour.price)}** pp.\n\n${tour.summary}\n\n**Best season:** ${tour.season}`,
      tours: [tour.slug],
      chips: [`Book ${tour.title}`, 'Best time to visit', 'Show popular trips'],
    });
  }

  const wantsPlan = /\b(plan|recommend|suggest|trip|tour|trek|holiday|vacation|itinerary|what should|where should|ideas?|similar|show|popular|options?)\b/.test(m);
  const hasPrefs = prefs.days || prefs.budget || prefs.level || prefs.interests.length;

  if (/^plan my trip$/.test(m) || (wantsPlan && !hasPrefs)) {
    if (/popular/.test(m)) {
      return r({ text: 'Here are our most-loved journeys this season:', tours: ['everest-base-camp-trek', 'annapurna-base-camp', 'ghorepani-poon-hill'], chips: ['Something shorter', 'Something off the beaten path'] });
    }
    return r({
      text: 'Let’s design your Himalayan story! ✨ Tell me:\n• **How many days** do you have?\n• Your **budget** per person?\n• **Fitness level** — easy, moderate or challenging?\n• What excites you — Everest, culture, wildlife, adventure?',
      chips: ['5 days, easy, culture', '2 weeks, Everest, $1500', 'Family trip with kids', 'Adventure under $500'],
    });
  }

  if (hasPrefs && (wantsPlan || prefChanged)) {
    const rec = recommend(prefs);
    const bits: string[] = [];
    if (prefs.days) bits.push(`${prefs.days} days`);
    if (prefs.budget) bits.push(`budget ~${fmt(prefs.budget)}`);
    if (prefs.level) bits.push(['easy', 'moderate', 'challenging'][prefs.level - 1]);
    if (prefs.interests.length) bits.push(prefs.interests.slice(0, 3).join(', '));
    return r({
      text: `Based on **${bits.join(' · ')}**, here are my top picks for you:`,
      tours: rec.map((t) => t.slug),
      chips: ['Something shorter', 'Something cheaper', 'More challenging', 'Start over'],
    });
  }

  if (/shorter/.test(m)) {
    const p = { ...prefs, days: Math.max(1, (prefs.days ?? 10) - 5) };
    return { reply: { text: `Here are shorter options (~${p.days} days):`, tours: recommend(p).map((t) => t.slug) }, prefs: p };
  }
  if (/cheaper/.test(m)) {
    const p = { ...prefs, budget: Math.round(((prefs.budget ?? 1500) * 0.6) / 50) * 50 };
    return { reply: { text: `Great value picks under ~${fmt(p.budget!)}:`, tours: recommend(p).map((t) => t.slug) }, prefs: p };
  }
  if (/more challenging|harder/.test(m)) {
    const p: Prefs = { ...prefs, level: 3 };
    return { reply: { text: 'Ready to push higher? These will test you — and reward you:', tours: recommend(p).map((t) => t.slug) }, prefs: p };
  }
  if (/start over|reset/.test(m)) {
    return { reply: { text: 'Fresh start! 🏔️ How many days do you have and what kind of journey are you dreaming of?', chips: ['5 days, easy, culture', '2 weeks, Everest, $1500', 'Wildlife & adventure'] }, prefs: { interests: [] } };
  }

  if (/\b(how much|cost|price|expensive|cheap)\b/.test(m)) {
    const cheapest = [...tours].sort((a, b) => a.price - b.price).slice(0, 3);
    return r({ text: `Our journeys range from **${fmt(cheapest[0].price)}** (day adventures) to **$2,650** (Island Peak climbing). Classic treks like Annapurna Base Camp start around **$990**. Tell me your budget and I’ll match trips to it.`, tours: cheapest.map((t) => t.slug), chips: ['Under $500', 'Under $1500', 'Plan my trip'] });
  }

  const guide = guides.find((g) => g.title.toLowerCase().split(' ').some((w) => w.length > 5 && m.includes(w)));
  if (guide) return r({ text: `This guide should help: **${guide.title}**`, guides: [guide.slug] });

  return r({
    text: 'I’m still learning that one! I can help with **trip recommendations**, best seasons, permits, altitude, packing and bookings. Or our human team can answer directly.',
    chips: ['Plan my trip', 'Best time to visit', 'Contact the team'],
  });
}
