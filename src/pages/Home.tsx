import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, animate, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Users, Leaf, HeartHandshake, Quote } from 'lucide-react';
import { tours, guides, categories, boards } from '../data/tours';
import { TourPin, GuidePin, Masonry } from '../components/PinCard';
import { useStore } from '../lib/store';
import BookingWidget from '../components/BookingWidget';
import ServicesStrip from '../components/ServicesStrip';
import { DestinationGrid, Journey } from '../components/Destinations';

const ladder = [
  { name: 'Everest Base Camp', m: 5364, img: '/img/ebc.jpg', q: 'everest', note: 'Khumbu' },
  { name: 'Annapurna Base Camp', m: 4130, img: '/img/annapurna.jpg', q: 'annapurna', note: 'Annapurna' },
  { name: 'Poon Hill', m: 3210, img: '/img/poonhill.jpg', q: 'poon hill', note: 'Ghorepani' },
  { name: 'Kathmandu', m: 1400, img: '/img/kathmandu.jpg', q: 'kathmandu', note: 'Valley of temples' },
  { name: 'Pokhara', m: 822, img: '/img/pokhara.jpg', q: 'pokhara', note: 'Lakeside' },
];

function Altimeter({ m }: { m: number }) {
  const [v, setV] = useState(0);
  const last = useRef(0);
  useEffect(() => {
    const c = animate(last.current, m, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => { last.current = x; setV(Math.round(x)); } });
    return () => c.stop();
  }, [m]);
  return <span className="tabular-nums">{v.toLocaleString()}</span>;
}

function Hero() {
  const [a, setA] = useState(0);
  const [paused, setPaused] = useState(false);
  const calm = useReducedMotion();
  const { setAgentOpen } = useStore();
  useEffect(() => {
    if (paused || calm) return;
    const id = setInterval(() => setA((i) => (i + 1) % ladder.length), 5500);
    return () => clearInterval(id);
  }, [paused, calm]);
  const cur = ladder[a];
  const words = 'Heaven is a myth. The Himalayas are real.'.split(' ');
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <AnimatePresence>
        <motion.img key={cur.img} src={cur.img} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: calm ? 1 : 1.12 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.2 }, scale: { duration: 12, ease: 'linear' } }} />
      </AnimatePresence>
      <div className="mist -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/55 to-night/10" />
      <div className="mx-auto grid min-h-[88svh] max-w-[1400px] items-end gap-8 px-4 pb-12 pt-16 sm:px-5 lg:gap-12 lg:px-10 lg:pb-16 lg:pt-24 lg:grid-cols-[1.2fr_1fr] lg:px-10">
        <div>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="font-script text-3xl text-gold">Mountain Planet Nepal</motion.p>
          <h1 className="mt-3 max-w-3xl font-display text-[40px] font-extrabold leading-[1] tracking-tight sm:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.09, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">Treks, peak climbs, hotels, flights, vehicles and guides. One Kathmandu team plans and runs your whole trip, from airport pickup to your flight home.</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore" className="rounded-full bg-gold px-7 py-4 font-bold text-night transition hover:scale-105 hover:bg-white">Browse journeys</Link>
            <button onClick={() => setAgentOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 font-bold transition hover:bg-white/10"><Sparkles className="h-5 w-5 text-gold" /> Plan with Planet AI</button>
          </motion.div>
        </div>
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="font-display text-5xl font-extrabold leading-none sm:text-8xl"><Altimeter m={cur.m} /><span className="ml-2 text-3xl text-gold">m</span></div>
          <p className="mb-5 mt-2 text-white/80">{cur.name}, {cur.note}</p>
          <ol className="space-y-2">
            {ladder.map((l, i) => (
              <motion.li key={l.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.12 }}>
                <Link to={`/destinations/${l.q.replace(' ', '-')}`} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} className={`block rounded-xl px-4 py-3 backdrop-blur transition focus-visible:outline-2 focus-visible:outline-gold ${i === a ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}>
                  <span className="flex items-baseline justify-between gap-3"><b className="font-display text-lg">{l.name}</b><span className="text-sm tabular-nums text-white/70">{l.m.toLocaleString()} m</span></span>
                  <span className="mt-2 block h-1 rounded-full bg-white/15"><motion.span className={`block h-full rounded-full transition-colors ${i === a ? 'bg-gold' : 'bg-white/40'}`} initial={{ width: 0 }} animate={{ width: `${(l.m / 5364) * 100}%` }} transition={{ delay: 1 + i * 0.12, duration: 1.2, ease: 'easeOut' }} /></span>
                </Link>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
      <div className="flags h-1.5" />
    </section>
  );
}

const testimonials = [
  { name: 'Sophie L.', from: 'Lyon, France', trip: 'Everest Base Camp', text: 'Our guide Pasang felt like family by Namche. Every detail — permits, flights, lodges — was handled perfectly. Standing at Kala Patthar at sunrise was unreal.' },
  { name: 'Daniel & Mei', from: 'Singapore', trip: 'Annapurna Base Camp', text: 'Tailored the pace for us as first-time trekkers. Hot springs on the way down were the cherry on top. Already planning Manaslu!' },
  { name: 'Rahul S.', from: 'Mumbai, India', trip: 'Chitwan Safari', text: 'Smooth transfer from Kathmandu to Chitwan and a jungle safari we will never forget. Highly professional team.' },
];

export default function Home() {
  const [cat, setCat] = useState<string>('All');
  const { setAgentOpen } = useStore();

  const feed = useMemo(() => {
    if (cat === 'Guides') return guides.map((g) => ({ kind: 'guide' as const, g }));
    const t = tours.filter((x) => cat === 'All' || x.category === cat).map((x) => ({ kind: 'tour' as const, t: x }));
    if (cat !== 'All') return t;
    const out: ({ kind: 'tour'; t: (typeof tours)[number] } | { kind: 'guide'; g: (typeof guides)[number] })[] = [];
    t.forEach((x, i) => {
      out.push(x);
      if (i % 6 === 3 && guides[Math.floor(i / 6)]) out.push({ kind: 'guide', g: guides[Math.floor(i / 6)] });
    });
    return out;
  }, [cat]);

  return (
    <div>
      <Hero />

      <BookingWidget />
      <div className="mt-10 overflow-hidden border-y border-forest/15 bg-forest py-3 text-white">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.18em]">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {['Heaven is a myth, Himalayas are real', 'Climb higher, live deeper', 'Where the trail ends, the story begins', 'Walk slowly, see more', 'Your Himalayan story starts here', 'Born in Nepal, built for explorers'].map((t) => (
                <span key={t} className="flex items-center gap-10">{t}<span className="text-gold">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ServicesStrip />
      <DestinationGrid limit={6} />
      <Journey />

      {/* FEED */}
      <section id="ideas" className="mx-auto max-w-[1600px] scroll-mt-20 px-3 pt-12 sm:px-5">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">Ideas for you</p>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Pin your Himalayan dreams</h2>
            <p className="mt-1 text-muted">Save what moves you. We’ll take you there.</p>
          </div>
          <Link to="/explore" className="inline-flex items-center gap-1.5 rounded-full bg-chip px-5 py-3 text-sm font-bold hover:bg-line">
            See all journeys <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="no-scrollbar sticky top-[84px] z-30 -mx-3 mb-6 flex gap-2 overflow-x-auto bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-6">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCat(c.name)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === c.name ? 'bg-forest text-white' : 'bg-chip text-ink hover:bg-line'}`}
            >
              <span className="mr-1.5">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
        <Masonry>
          {feed.map((f, i) =>
            f.kind === 'tour' ? <TourPin key={f.t.slug} tour={f.t} index={i} /> : <GuidePin key={f.g.slug} guide={f.g} index={i} />,
          )}
        </Masonry>
      </section>

      {/* BOARDS */}
      <section className="mx-auto mt-20 max-w-[1600px] px-5">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">Curated boards</p>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight">Collections by our guides</h2>
            <p className="mt-1 text-muted">Hand-picked by people who were born beneath these peaks.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
          {boards.map((b) => {
            const items = tours.filter(b.match);
            const imgs = items.slice(0, 3).map((t) => t.img);
            while (imgs.length < 3) imgs.push(items[0]?.img ?? '/img/hero.jpg');
            return (
              <Link key={b.id} to={`/explore?board=${b.id}`} className="group">
                <div className="grid aspect-[4/3] grid-cols-[2fr_1fr] grid-rows-2 gap-0.5 overflow-hidden rounded-2xl transition group-hover:opacity-90">
                  <img src={imgs[0]} alt="" className="row-span-2 h-full w-full object-cover" />
                  <img src={imgs[1]} alt="" className="h-full w-full object-cover" />
                  <img src={imgs[2]} alt="" className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-2.5 font-display text-[17px] font-bold">{b.title}</h3>
                <p className="text-sm text-muted">{items.length} pins · Mountain Planet</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto mt-24 max-w-[1600px] px-3 sm:px-5">
        <div className="grain relative overflow-hidden rounded-[36px] bg-night text-white">
          <img src="/img/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
          <div className="relative grid gap-12 p-8 sm:p-14 lg:grid-cols-2">
            <div>
              <img src="/logo-mark.png" alt="" className="h-16 w-auto" />
              <h2 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Local hearts.<br />
                <span className="gold-text italic">Himalayan expertise.</span>
              </h2>
              <p className="mt-5 max-w-lg text-white/75">
                Mountain Planet Nepal is born in Kathmandu and raised on the trails. Our guides grew up beneath these peaks — we know which teahouse has the best dal bhat, and which ridge catches first light.
              </p>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-6">
                {[
                  ['20+', 'Signature journeys'],
                  ['4.9★', 'Traveller rating'],
                  ['24/7', 'On-trip support'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-3xl font-semibold text-gold">{n}</div>
                    <div className="mt-1 text-xs text-white/60">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 self-end sm:grid-cols-2">
              {[
                { i: ShieldCheck, h: 'Licensed & insured', p: 'Government-registered agency with certified, first-aid trained guides.' },
                { i: Users, h: 'Small groups', p: 'Private or small-group trips with flexible dates that fit you.' },
                { i: Leaf, h: 'Responsible travel', p: 'Fair wages, porter welfare and leave-no-trace on every trail.' },
                { i: HeartHandshake, h: 'Tailor-made', p: 'Every itinerary can be customised — pace, comfort, budget.' },
              ].map(({ i: Icon, h, p }) => (
                <div key={h} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <Icon className="h-6 w-6 text-gold" />
                  <h3 className="mt-3 font-display font-bold">{h}</h3>
                  <p className="mt-1 text-sm text-white/65">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-24 max-w-7xl px-5">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">Traveller stories</p>
        <h2 className="mt-1 text-center font-display text-4xl font-semibold tracking-tight">Pinned to their hearts</h2>
        <p className="mt-2 text-center text-muted">Come as a traveller, leave as family.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl bg-paper p-7 ring-1 ring-line ${i === 1 ? 'md:-translate-y-6' : ''}`}
            >
              <Quote className="h-8 w-8 text-gold" />
              <blockquote className="mt-4 font-display text-lg leading-relaxed text-ink">{t.text}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm">
                <span>
                  <b>{t.name}</b>
                  <span className="block text-muted">{t.from}</span>
                </span>
                <span className="rounded-full bg-chip px-3 py-1 text-xs font-semibold">{t.trip}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* AI CTA */}
      <section className="mx-auto mt-24 max-w-5xl px-5">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-forest via-[#245a4e] to-forest-deep p-10 text-center text-white sm:p-14">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <Sparkles className="mx-auto h-10 w-10" />
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">Not sure where to start?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Tell Planet AI your days, budget and dream — get instant trip matches, seasonal advice and permit info. Then our team turns it into a real itinerary.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => setAgentOpen(true)} className="rounded-full bg-night px-7 py-4 font-bold text-white hover:bg-black">Chat with Planet AI</button>
            <Link to="/plan" className="rounded-full bg-white px-7 py-4 font-bold text-night hover:bg-canvas">Request a free quote</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
