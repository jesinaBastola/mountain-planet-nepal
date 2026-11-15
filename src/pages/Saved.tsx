import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { tours } from '../data/tours';
import { TourPin, Masonry } from '../components/PinCard';
import { useStore } from '../lib/store';

export default function Saved() {
  const { saved, askAgent } = useStore();
  const items = saved.map((s) => tours.find((t) => t.slug === s)).filter(Boolean) as typeof tours;
  const totalDays = items.reduce((a, t) => a + t.days, 0);

  return (
    <div className="mx-auto max-w-[1600px] px-3 pt-10 sm:px-5">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-night ring-4 ring-gold/30">
          <img src="/logo-mark.png" alt="" className="h-12 w-auto" />
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">My Himalaya Board</h1>
        <p className="mt-2 text-muted">
          {items.length} saved {items.length === 1 ? 'journey' : 'journeys'}
          {items.length > 0 && <> · {totalDays} days of adventure</>}
        </p>
        {items.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to={`/plan?tour=${items.map((t) => t.slug).join(',')}`} className="rounded-full bg-ember px-6 py-3 font-bold text-white hover:bg-ember-deep">Request quote for these</Link>
            <button onClick={() => askAgent(`Compare and recommend: ${items.map((t) => t.title).join(', ')}`)} className="inline-flex items-center gap-2 rounded-full bg-chip px-6 py-3 font-bold hover:bg-line">
              <Sparkles className="h-4 w-4 text-gold-deep" /> Ask Planet AI
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-3xl bg-paper p-10 text-center ring-1 ring-line">
          <Heart className="mx-auto h-10 w-10 text-ember" />
          <h2 className="mt-4 font-display text-2xl font-semibold">Your board is empty</h2>
          <p className="mt-2 text-muted">Tap the <Link to="/explore" className="font-bold text-ember underline underline-offset-2">Save</Link> button on any journey to pin it here and build your dream Himalayan itinerary.</p>
          <Link to="/explore" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 font-bold text-white">Start exploring</Link>
        </div>
      ) : (
        <div className="mt-10">
          <Masonry>
            {items.map((t, i) => <TourPin key={t.slug} tour={t} index={i} />)}
          </Masonry>
        </div>
      )}
    </div>
  );
}
