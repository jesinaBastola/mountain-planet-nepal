import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Mountain } from 'lucide-react';
import { destinations, slug } from '../data/destinations';
import { stories } from '../data/placeStories';
import { tours } from '../data/tours';
import NotFound from './NotFound';

export default function Place() {
  const { slug: s } = useParams();
  const d = destinations.find((x) => slug(x.name) === s);
  if (!d) return <NotFound />;
  const info = stories[d.name];
  const here = tours.filter((t) => `${t.title} ${t.region} ${t.tags.join(' ')}`.toLowerCase().includes(d.q));
  const more = destinations.filter((x) => x.name !== d.name && x.area === d.area).slice(0, 3);
  return (
    <div className="pb-10">
      <section className="relative isolate flex min-h-[52svh] items-end overflow-hidden text-white">
        <img src={d.img} alt={d.name} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/30 to-night/10" />
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-6">
          <Link to="/destinations" className="mb-4 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4" /> All destinations</Link>
          <h1 className="font-display text-5xl font-extrabold sm:text-7xl">{d.name}</h1>
          <p className="mt-2 font-display text-2xl text-gold">{d.alt}</p>
        </div>
      </section>
      <div className="mx-auto mt-10 grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold">The story</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{info?.story ?? d.fact}</p>
          <h3 className="mt-8 font-display text-xl font-bold">Don’t miss</h3>
          <ul className="mt-3 space-y-2">
            {(info?.highlights ?? []).map((h) => <li key={h} className="rounded-xl bg-chip px-4 py-3">{h}</li>)}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl bg-forest p-6 text-white lg:sticky lg:top-28">
          <p className="flex items-center gap-2"><Mountain className="h-5 w-5 text-gold" /> High point <b className="ml-auto">{d.alt}</b></p>
          <p className="mt-3 flex items-center gap-2"><Calendar className="h-5 w-5 text-gold" /> Best time <b className="ml-auto">{d.best}</b></p>
          <Link to="/plan" className="mt-6 block rounded-full bg-gold py-3 text-center font-bold text-night hover:bg-white">Plan a trip here</Link>
        </aside>
      </div>
      {here.length > 0 && (
        <section className="mx-auto mt-14 max-w-[1200px] px-4 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold">Journeys in {d.name}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {here.slice(0, 6).map((t) => (
              <Link key={t.slug} to={`/tour/${t.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
                <img src={t.img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition group-hover:scale-105 motion-reduce:transition-none" />
                <div className="p-4"><h3 className="font-display text-lg font-bold">{t.title}</h3><p className="text-sm text-muted">{t.days} days · {t.difficulty}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="mx-auto mt-14 max-w-[1200px] px-4 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold">More like this</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {more.map((m) => <Link key={m.name} to={`/destinations/${slug(m.name)}`} className="rounded-xl bg-chip px-4 py-4 font-display font-bold hover:bg-line">{m.name} <span className="font-normal text-muted">· {m.alt}</span></Link>)}
        </div>
      </section>
    </div>
  );
}
