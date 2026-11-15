import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Star, CalendarDays, Mountain, Gauge, Sun, Users, Check, Sparkles, MapPin } from 'lucide-react';
import { getTour, tours } from '../data/tours';
import { SaveButton, TourPin, Masonry } from '../components/PinCard';
import { useStore, shareLink } from '../lib/store';
import NotFound from './NotFound';

export default function TourDetail() {
  const { slug = '' } = useParams();
  const tour = getTour(slug);
  const navigate = useNavigate();
  const { toast, askAgent } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tour) document.title = `${tour.title} · Mountain Planet Nepal`;
  }, [tour]);

  if (!tour) return <NotFound />;

  const similar = tours
    .filter((t) => t.slug !== tour.slug)
    .map((t) => ({ t, s: (t.category === tour.category ? 2 : 0) + (t.region === tour.region ? 3 : 0) + t.rating / 10 }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.t);

  const facts = [
    { i: CalendarDays, l: 'Duration', v: tour.days === 1 ? '1 day' : `${tour.days} days` },
    { i: Gauge, l: 'Difficulty', v: tour.difficulty },
    { i: Mountain, l: 'Max altitude', v: `${tour.maxAlt.toLocaleString()} m` },
    { i: Sun, l: 'Best season', v: tour.season },
    { i: Users, l: 'Group size', v: tour.groupSize },
    { i: MapPin, l: 'Region', v: tour.region },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-3 pt-6 sm:px-5">
      <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/explore'))} className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-chip md:fixed md:left-5 md:top-24 md:z-20" aria-label="Back">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid max-w-[1080px] overflow-hidden rounded-[32px] bg-paper shadow-[0_2px_30px_rgba(0,0,0,.08)] md:grid-cols-2"
      >
        <div className="relative md:p-4">
          <img src={tour.img} alt={tour.title} className="h-full max-h-[78vh] w-full object-cover md:rounded-3xl" />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold backdrop-blur md:bottom-8 md:left-8">{tour.category}</span>
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <button onClick={() => shareLink(`/tour/${tour.slug}`, tour.title, toast)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-chip" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
            <SaveButton slug={tour.slug} className="px-6 py-3 text-base" />
          </div>

          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{tour.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-gold text-gold" /> {tour.rating.toFixed(1)}</span>
            <span className="text-muted">({tour.reviews} reviews)</span>
          </div>
          <p className="mt-4 leading-relaxed text-ink-soft">{tour.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map(({ i: Icon, l, v }) => (
              <div key={l} className="rounded-2xl bg-canvas p-3">
                <Icon className="h-4 w-4 text-gold-deep" />
                <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{l}</div>
                <div className="text-sm font-bold leading-snug">{v}</div>
              </div>
            ))}
          </div>

          <h2 className="mt-7 font-bold">Highlights</h2>
          <ul className="mt-2 space-y-2">
            {tour.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-[15px] text-ink-soft"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {h}</li>
            ))}
          </ul>

          <h2 className="mt-7 font-bold">Itinerary at a glance</h2>
          <ol className="relative mt-3 space-y-3 border-l-2 border-dashed border-gold/50 pl-5">
            {tour.itinerary.map((d) => (
              <li key={d.day} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-paper bg-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-gold-deep">{d.day}</span>
                <div className="text-[15px]">{d.title}</div>
              </li>
            ))}
          </ol>

          <h2 className="mt-7 font-bold">What’s included</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {tour.includes.map((x) => (
              <span key={x} className="rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium">{x}</span>
            ))}
          </div>

          <div className="sticky bottom-24 mt-8 rounded-3xl bg-night p-5 text-white md:bottom-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs text-white/60">From, per person</div>
                <div className="font-display text-3xl font-semibold text-gold">${tour.price.toLocaleString()}</div>
              </div>
              <Link to={`/plan?tour=${tour.slug}`} className="rounded-full bg-ember px-6 py-3.5 font-bold transition hover:bg-ember-deep">Enquire now</Link>
            </div>
            <button onClick={() => askAgent(`Tell me about ${tour.title}`)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-2.5 text-sm font-semibold hover:bg-white/10">
              <Sparkles className="h-4 w-4 text-gold" /> Ask Planet AI about this trip
            </button>
          </div>
        </div>
      </motion.article>

      <h2 className="mb-6 mt-16 text-center font-display text-3xl font-semibold">More like this</h2>
      <Masonry>
        {similar.map((t, i) => <TourPin key={t.slug} tour={t} index={i} />)}
      </Masonry>
    </div>
  );
}
