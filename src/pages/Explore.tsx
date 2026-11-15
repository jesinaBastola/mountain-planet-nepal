import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, SearchX } from 'lucide-react';
import { tours, guides, categories, boards } from '../data/tours';
import { TourPin, GuidePin, Masonry } from '../components/PinCard';
import { useStore } from '../lib/store';

const SORTS = [
  { id: 'rec', label: 'Recommended' },
  { id: 'price', label: 'Price: low to high' },
  { id: 'short', label: 'Shortest first' },
  { id: 'rating', label: 'Top rated' },
];
const LEVELS = ['Any', 'Easy', 'Moderate', 'Challenging', 'Strenuous'];
const DUR = [
  { id: 'any', label: 'Any length', f: () => true },
  { id: 'short', label: '1–5 days', f: (d: number) => d <= 5 },
  { id: 'mid', label: '6–12 days', f: (d: number) => d >= 6 && d <= 12 },
  { id: 'long', label: '13+ days', f: (d: number) => d >= 13 },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const { askAgent } = useStore();
  const q = (params.get('q') ?? '').toLowerCase().trim();
  const cat = params.get('cat') ?? 'All';
  const board = params.get('board');
  const sort = params.get('sort') ?? 'rec';
  const level = params.get('level') ?? 'Any';
  const dur = params.get('dur') ?? 'any';

  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params);
    if (v === null || v === '' || v === 'All' || v === 'Any' || v === 'any' || (k === 'sort' && v === 'rec')) p.delete(k);
    else p.set(k, v);
    setParams(p, { replace: true });
  };

  const boardObj = boards.find((b) => b.id === board);

  const list = useMemo(() => {
    const words = q.split(/\s+/).filter(Boolean);
    let r = tours.filter((t) => {
      if (cat !== 'All' && cat !== 'Guides' && t.category !== cat) return false;
      if (boardObj && !boardObj.match(t)) return false;
      if (level !== 'Any' && t.difficulty !== level) return false;
      if (!DUR.find((d) => d.id === dur)!.f(t.days)) return false;
      if (words.length) {
        const hay = [t.title, t.region, t.category, t.summary, ...t.tags].join(' ').toLowerCase();
        return words.every((w) => hay.includes(w));
      }
      return true;
    });
    if (sort === 'price') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'short') r = [...r].sort((a, b) => a.days - b.days);
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return r;
  }, [q, cat, boardObj, level, dur, sort]);

  const guideList = useMemo(() => {
    if (cat !== 'All' && cat !== 'Guides') return [];
    if (board || level !== 'Any' || dur !== 'any') return [];
    return guides.filter((g) => !q || (g.title + g.intro + g.kicker).toLowerCase().includes(q));
  }, [cat, q, board, level, dur]);

  const showTours = cat !== 'Guides';
  const total = (showTours ? list.length : 0) + guideList.length;
  const title = q ? `“${params.get('q')}”` : boardObj ? boardObj.title : cat === 'All' ? 'Explore every journey' : cat;

  return (
    <div className="mx-auto max-w-[1600px] px-3 pt-8 sm:px-5">
      <div className="px-1">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">{q ? 'Search results' : boardObj ? 'Board' : 'Explore'}</p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-2 text-muted">{total} {total === 1 ? 'pin' : 'pins'}</p>
      </div>

      <div className="no-scrollbar sticky top-[84px] z-30 -mx-3 mt-6 flex gap-2 overflow-x-auto bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-6">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => set('cat', c.name)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === c.name ? 'bg-forest text-white' : 'bg-chip text-ink hover:bg-line'}`}
          >
            <span className="mr-1.5">{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 px-1">
        <SlidersHorizontal className="mr-1 h-4 w-4 text-muted" />
        <select value={level} onChange={(e) => set('level', e.target.value)} className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold outline-none focus:border-gold">
          {LEVELS.map((l) => <option key={l} value={l}>{l === 'Any' ? 'Any difficulty' : l}</option>)}
        </select>
        <select value={dur} onChange={(e) => set('dur', e.target.value)} className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold outline-none focus:border-gold">
          {DUR.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => set('sort', e.target.value)} className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold outline-none focus:border-gold">
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {boardObj && (
          <button onClick={() => set('board', null)} className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-2 text-sm font-semibold text-gold-deep">
            Board: {boardObj.title} <X className="h-3.5 w-3.5" />
          </button>
        )}
        {q && (
          <button onClick={() => set('q', null)} className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-2 text-sm font-semibold text-gold-deep">
            “{params.get('q')}” <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {total === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <SearchX className="mx-auto h-12 w-12 text-muted" />
          <h2 className="mt-4 font-display text-2xl font-semibold">No pins match yet</h2>
          <p className="mt-2 text-muted">Try a different filter — or let Planet AI find something close to what you want.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/explore" className="rounded-full bg-chip px-5 py-3 text-sm font-bold">Clear filters</Link>
            <button onClick={() => askAgent(q ? `Recommend a trip for: ${q}` : 'Plan my trip')} className="rounded-full bg-ember px-5 py-3 text-sm font-bold text-white">Ask Planet AI</button>
          </div>
        </div>
      ) : (
        <Masonry>
          {showTours && list.map((t, i) => <TourPin key={t.slug} tour={t} index={i} />)}
          {guideList.map((g, i) => <GuidePin key={g.slug} guide={g} index={i} />)}
        </Masonry>
      )}
    </div>
  );
}
