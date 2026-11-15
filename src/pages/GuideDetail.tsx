import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { getGuide, guides, tours } from '../data/tours';
import { GuidePin, TourPin, Masonry } from '../components/PinCard';
import { useStore } from '../lib/store';
import NotFound from './NotFound';

export default function GuideDetail() {
  const { slug = '' } = useParams();
  const g = getGuide(slug);
  const { askAgent } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (g) document.title = `${g.title} · Mountain Planet Nepal`;
  }, [g]);
  if (!g) return <NotFound />;

  return (
    <div>
      <section className="relative h-[56vh] min-h-[380px] overflow-hidden bg-night">
        <img src={g.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-3xl flex-col justify-end px-5 pb-12 text-white">
          <Link to="/explore?cat=Guides" className="mb-auto mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>
          <span className="w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-night">{g.kicker}</span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">{g.title}</motion.h1>
          <span className="mt-3 flex items-center gap-1.5 text-sm text-white/70"><Clock className="h-4 w-4" /> {g.minutes} min read · Mountain Planet Nepal</span>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-display text-2xl leading-relaxed text-ink">{g.intro}</p>
        {g.sections.map((s, i) => (
          <section key={s.h} className="mt-10 flex gap-5">
            <span className="font-display text-4xl font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.p}</p>
            </div>
          </section>
        ))}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-paper p-8 text-center ring-1 ring-line">
          <Sparkles className="h-8 w-8 text-gold-deep" />
          <p className="font-display text-2xl">Still have questions?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => askAgent(g.title)} className="rounded-full bg-forest px-6 py-3 font-bold text-white">Ask Planet AI</button>
            <Link to="/plan" className="rounded-full bg-ember px-6 py-3 font-bold text-white">Talk to our team</Link>
          </div>
        </div>
      </article>
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5">
        <h2 className="mb-6 text-center font-display text-3xl font-semibold">Keep exploring</h2>
        <Masonry>
          {guides.filter((x) => x.slug !== g.slug).map((x, i) => <GuidePin key={x.slug} guide={x} index={i} />)}
          {tours.slice(0, 8).map((t, i) => <TourPin key={t.slug} tour={t} index={i} />)}
        </Masonry>
      </div>
    </div>
  );
}
