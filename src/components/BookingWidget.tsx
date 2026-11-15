import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Plane, Car, Ticket, Mountain, MapPin, CalendarDays, Users, Search } from 'lucide-react';

const TABS = [
  { id: 'tours', label: 'Travel & Activities', icon: Mountain, loc: 'Everest, Annapurna, Chitwan…' },
  { id: 'stay', label: 'Stay', icon: BedDouble, loc: 'Kathmandu, Pokhara, Nagarkot…' },
  { id: 'flight', label: 'Flight', icon: Plane, loc: 'Kathmandu → Lukla, Pokhara…' },
  { id: 'vehicle', label: 'Vehicle Rentals', icon: Car, loc: 'Pickup city (e.g. Kathmandu)' },
  { id: 'tickets', label: 'Tickets & Events', icon: Ticket, loc: 'Festival, show or attraction' },
];

const field = 'h-12 w-full rounded-xl border border-line bg-paper pl-10 pr-3 text-[15px] outline-none focus:border-forest focus:ring-4 focus:ring-forest/15';

export default function BookingWidget() {
  const [tab, setTab] = useState('tours');
  const [loc, setLoc] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [guests, setGuests] = useState('2 Adults');
  const navigate = useNavigate();
  const t = TABS.find((x) => x.id === tab)!;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'tours') {
      navigate(loc.trim() ? `/explore?q=${encodeURIComponent(loc.trim())}` : '/explore');
      return;
    }
    const msg = `Booking request — ${t.label}\nLocation: ${loc || 'Flexible'}\nDates: ${from || '?'} to ${to || '?'}\nGuests: ${guests}`;
    navigate(`/plan?msg=${encodeURIComponent(msg)}`);
  };

  return (
    <section className="relative z-20 mx-auto -mt-4 max-w-6xl px-3 sm:px-5 lg:-mt-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-[28px] bg-paper p-4 shadow-[0_20px_60px_rgba(10,26,51,.15)] ring-1 ring-line sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl font-semibold sm:text-2xl">For every trip and stay, there’s Mountain Planet</p>
            <p className="text-sm text-muted">Book tours, hotels, flights, vehicles and tickets in one place</p>
          </div>
          <img src="/logo-mark.png" alt="Mountain Planet" className="hidden h-14 w-auto sm:block" />
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-b border-line pb-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${tab === id ? 'bg-forest text-white' : 'bg-chip text-ink hover:bg-line'}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Location</span>
            <MapPin className="absolute bottom-3.5 left-3 h-5 w-5 text-forest" />
            <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder={t.loc} className={field} />
          </label>
          <label className="relative">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">{tab === 'stay' ? 'Check-in' : 'From'}</span>
            <CalendarDays className="absolute bottom-3.5 left-3 h-5 w-5 text-forest" />
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
          </label>
          <label className="relative">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">{tab === 'stay' ? 'Check-out' : 'To'}</span>
            <CalendarDays className="absolute bottom-3.5 left-3 h-5 w-5 text-forest" />
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={field} />
          </label>
          <label className="relative">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Guests</span>
            <Users className="absolute bottom-3.5 left-3 h-5 w-5 text-forest" />
            <select value={guests} onChange={(e) => setGuests(e.target.value)} className={field}>
              {['1 Adult', '2 Adults', '3 Adults', '4 Adults', '2 Adults, 1 Child', '2 Adults, 2 Children', '5+ Guests'].map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <button type="submit" className="flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-forest px-6 font-bold text-white transition hover:bg-forest-deep">
            <Search className="h-5 w-5" /> Search
          </button>
        </form>
      </motion.div>
    </section>
  );
}
