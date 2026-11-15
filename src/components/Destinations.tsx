import { useState } from 'react';
import { Link } from 'react-router-dom';
import { destinations, slug, type Area } from '../data/destinations';

const AREAS: ('All' | Area)[] = ['All', 'Mountains', 'Culture', 'Wildlife'];

export function DestinationGrid({ limit }: { limit?: number }) {
  const [area, setArea] = useState<'All' | Area>('All');
  const list = destinations.filter((d) => area === 'All' || d.area === area).slice(0, limit);
  return (
    <section id="destinations" className="mx-auto mt-20 max-w-[1400px] scroll-mt-24 px-4 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Real places, real heights</h2>
          <p className="mt-2 max-w-xl text-muted">Every destination below is one we run trips to, with the altitude of its high point and the months it is best visited.</p>
        </div>
        {!limit && (
          <div className="flex gap-2" role="group" aria-label="Filter destinations">
            {AREAS.map((a) => (
              <button key={a} onClick={() => setArea(a)} aria-pressed={area === a} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${area === a ? 'bg-forest text-white' : 'bg-chip hover:bg-line'}`}>{a}</button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d, i) => (
          <Link key={d.name} to={`/destinations/${slug(d.name)}`} className={`group relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white focus-visible:outline-2 focus-visible:outline-gold ${i === 0 ? 'lg:col-span-2' : ''}`}>
            <img src={d.img} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
            <span className="absolute right-5 top-5 font-display text-2xl font-extrabold tabular-nums">{d.alt}</span>
            <h3 className="font-display text-3xl font-extrabold">{d.name}</h3>
            <p className="mt-1 max-w-md text-sm text-white/85">{d.fact}</p>
            <p className="mt-3 text-xs text-gold">Best time: {d.best}</p>
          </Link>
        ))}
      </div>
      {limit && <div className="mt-6"><Link to="/destinations" className="inline-block rounded-full bg-forest px-6 py-3 font-bold text-white hover:bg-forest-deep">See all {destinations.length} destinations</Link></div>}
    </section>
  );
}

const steps = [
  ['Airport pickup', 'We meet you at Tribhuvan International Airport and take you to your hotel.'],
  ['Hotel in Kathmandu', 'Hand-picked stays, with a trip briefing and gear check.'],
  ['Permits sorted', 'TIMS cards, national park and restricted-area permits are arranged for you.'],
  ['Flights and transport', 'Domestic flights to Lukla, Pokhara or Jomsom, plus private vehicles.'],
  ['Your journey', 'A licensed guide and porters take you through the trek, tour or safari.'],
  ['Farewell', 'A farewell dinner and a transfer back to the airport.'],
];

export function Journey() {
  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
      <div className="rounded-3xl bg-forest p-8 text-white sm:p-12">
        <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">From airport to airport</h2>
        <p className="mt-2 max-w-xl text-white/75">One team handles every step of your trip, so you only deal with one company and one price.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([h, p], i) => (
            <li key={h} className="border-t-2 border-gold pt-4">
              <span className="font-display text-sm font-bold text-gold">Step {i + 1}</span>
              <h3 className="mt-1 font-display text-xl font-bold">{h}</h3>
              <p className="mt-1 text-sm text-white/75">{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
