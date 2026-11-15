import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, Sparkles, Home, Compass, Send, X } from 'lucide-react';
import { useStore } from '../lib/store';

const navCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
    isActive ? 'bg-gold text-forest-deep' : 'text-white hover:bg-white/10'
  }`;

export default function Header() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const navigate = useNavigate();
  const { saved, setAgentOpen } = useStore();
  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname !== '/explore') setQ('');
    else setQ(params.get('q') ?? '');
  }, [loc.pathname, params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : '/explore');
  };

  return (
    <>
      <div className="border-b border-white/10 bg-forest-deep text-[13px] text-white/80">
        <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">
          <span className="hidden font-script text-lg text-gold sm:block">Heaven is a myth, Himalayas are real</span>
          <span className="truncate sm:hidden">📍 Thamel, Kathmandu</span>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/explore?cat=Guides" className="hidden hover:text-gold sm:block">Blog</Link>
            <select aria-label="Currency" className="cursor-pointer bg-transparent outline-none" defaultValue="USD">
              <option className="bg-night text-white" value="USD">🇺🇸 USD</option>
              <option className="bg-night text-white" value="NPR">🇳🇵 NPR</option>
              <option className="bg-night text-white" value="EUR">🇪🇺 EUR</option>
            </select>
            <select aria-label="Language" className="cursor-pointer bg-transparent outline-none" defaultValue="EN">
              <option className="bg-night text-white" value="EN">EN</option>
              <option className="bg-night text-white" value="NE">नेपाली</option>
            </select>
            <Link to={`/plan?msg=${encodeURIComponent('Partnership enquiry (hotel / vehicle / agency)')}`} className="hidden font-semibold text-gold hover:text-white md:block">Partner with Us</Link>
            <Link to="/saved" className="rounded-full border border-white/25 px-3 py-1 font-semibold hover:bg-white/10">Sign In</Link>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-gold/30 bg-forest text-white shadow-[0_6px_30px_rgba(23,61,53,.35)]">
        <div className="mx-auto flex h-[84px] max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 pr-1" aria-label="Mountain Planet home">
            <img src="/logo-mark.png" alt="Mountain Planet logo" className="h-14 w-auto drop-shadow-lg sm:h-16" />
            <span className="hidden leading-none sm:block">
              <span className="gold-text block font-display text-[22px] font-bold tracking-tight">Mountain Planet</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">Nepal · Treks & Tours</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={navCls}>Home</NavLink>
            <NavLink to="/explore" className={navCls}>Explore</NavLink>
            <NavLink to="/destinations" className={navCls}>Destinations</NavLink>
            <NavLink to="/about" className={navCls}>About</NavLink>
          </nav>

          <form onSubmit={submit} className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search treks, peaks, safaris, Chitwan…"
              className="h-12 w-full rounded-full bg-white pl-11 pr-10 text-[15px] text-ink outline-none ring-gold/50 transition placeholder:text-muted focus:bg-paper focus:ring-4"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-line" aria-label="Clear">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <button
            onClick={() => setAgentOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-[15px] font-semibold transition hover:border-gold hover:bg-white/10 lg:flex"
          >
            <Sparkles className="h-4 w-4 text-gold" /> Planet AI
          </button>
          <Link to="/saved" className="relative hidden h-12 w-12 place-items-center rounded-full transition hover:bg-white/10 md:grid" aria-label="Saved">
            <Heart className="h-5 w-5" />
            {saved.length > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-bold text-white">{saved.length}</span>
            )}
          </Link>
          <Link to="/plan" className="hidden shrink-0 rounded-full bg-gold px-5 py-3 text-[15px] font-bold text-forest-deep transition hover:bg-white sm:block">
            Plan a trip
          </Link>
        </div>
      </header>

      {/* mobile bottom bar */}
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full bg-forest px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,.18)] backdrop-blur md:hidden">
        {[
          { to: '/', icon: Home, label: 'Home' },
          { to: '/explore', icon: Compass, label: 'Explore' },
        ].map((it) => (
          <NavLink key={it.to} to={it.to} end className={({ isActive }) => `grid h-11 w-11 place-items-center rounded-full ${isActive ? 'bg-gold text-forest-deep' : 'text-white'}`} aria-label={it.label}>
            <it.icon className="h-5 w-5" />
          </NavLink>
        ))}
        <button onClick={() => setAgentOpen(true)} className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-white shadow-lg" aria-label="Planet AI">
          <Sparkles className="h-5 w-5" />
        </button>
        <NavLink to="/saved" className={({ isActive }) => `relative grid h-11 w-11 place-items-center rounded-full ${isActive ? 'bg-gold text-forest-deep' : 'text-white'}`} aria-label="Saved">
          <Heart className="h-5 w-5" />
          {saved.length > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-ember" />}
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `grid h-11 w-11 place-items-center rounded-full ${isActive ? 'bg-gold text-forest-deep' : 'text-white'}`} aria-label="Plan a trip">
          <Send className="h-5 w-5" />
        </NavLink>
      </nav>
    </>
  );
}
