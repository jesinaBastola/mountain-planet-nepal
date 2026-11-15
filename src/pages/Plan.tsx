import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { tours, CONTACT } from '../data/tours';
import { useStore } from '../lib/store';

const field = 'h-12 w-full rounded-2xl border border-line bg-paper px-4 text-[15px] outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20';

export default function Plan() {
  const [params] = useSearchParams();
  const { setAgentOpen } = useStore();
  const initial = useMemo(() => (params.get('tour') ?? '').split(',').filter((s) => tours.some((t) => t.slug === s)), [params]);
  const [picked, setPicked] = useState<string[]>(initial);
  const [form, setForm] = useState({ name: '', email: '', country: '', date: '', travellers: '2', budget: 'Not sure', message: params.get('msg') ?? '' });
  const [sent, setSent] = useState(false);

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const mailto = () => {
    const trips = picked.map((s) => tours.find((t) => t.slug === s)?.title).join(', ') || 'Custom trip';
    const body = `Name: ${form.name}\nEmail: ${form.email}\nCountry: ${form.country}\nTrips: ${trips}\nStart date: ${form.date}\nTravellers: ${form.travellers}\nBudget: ${form.budget}\n\n${form.message}`;
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent('Trip enquiry: ' + trips)}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
        </motion.div>
        <h1 className="mt-5 font-display text-4xl font-semibold">Dhanyabad, {form.name.split(' ')[0] || 'traveller'}!</h1>
        <p className="mt-3 text-ink-soft">Your trip request is ready. Our Kathmandu team replies within 24 hours with a free, tailor-made itinerary.</p>
        <a href={mailto()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3.5 font-bold text-white hover:bg-ember-deep">
          <Mail className="h-5 w-5" /> Send via email now
        </a>
        <div className="mt-4"><Link to="/explore" className="text-sm font-semibold text-muted underline">Keep exploring</Link></div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">Plan a trip</p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Let’s craft your journey</h1>
        <p className="mt-3 max-w-xl text-ink-soft">Tell us a little about your dream trip. It’s free and there’s no obligation — you’ll get a personalised itinerary and price.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            window.scrollTo(0, 0);
          }}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-bold">Which journeys interest you?</label>
            <div className="flex flex-wrap gap-2">
              {tours.map((t) => (
                <button
                  type="button"
                  key={t.slug}
                  onClick={() => toggle(t.slug)}
                  className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[13px] font-semibold transition ${picked.includes(t.slug) ? 'bg-forest text-white' : 'bg-chip hover:bg-line'}`}
                >
                  <img src={t.img} alt="" className="h-7 w-7 rounded-full object-cover" /> {t.title}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Full name *</span><input required value={form.name} onChange={upd('name')} className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Email *</span><input required type="email" value={form.email} onChange={upd('email')} className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Country</span><input value={form.country} onChange={upd('country')} className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Preferred start date</span><input type="date" value={form.date} onChange={upd('date')} className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Travellers</span>
              <select value={form.travellers} onChange={upd('travellers')} className={field}>
                {['1', '2', '3–4', '5–8', '9+'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">Budget per person</span>
              <select value={form.budget} onChange={upd('budget')} className={field}>
                {['Not sure', 'Under $500', '$500 – $1,000', '$1,000 – $2,000', '$2,000 – $3,500', '$3,500+'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
          </div>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">Anything else?</span>
            <textarea value={form.message} onChange={upd('message')} rows={4} placeholder="Fitness level, special interests, hotel preferences…" className={`${field} h-auto py-3`} />
          </label>
          <button type="submit" className="rounded-full bg-ember px-8 py-4 text-base font-bold text-white transition hover:bg-ember-deep">Send trip request</button>
        </form>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl bg-night text-white">
          <img src="/img/annapurna.jpg" alt="" className="h-40 w-full object-cover" />
          <div className="space-y-4 p-6 text-sm">
            <h3 className="font-display text-xl">Contact Mountain Planet</h3>
            <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold" /> {CONTACT.address}</p>
            <p className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-gold" /> <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">{CONTACT.email}</a></p>
            <p className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold" /> Replies within 24 hours, 7 days a week</p>
          </div>
        </div>
        <button onClick={() => setAgentOpen(true)} className="flex w-full items-center gap-4 rounded-3xl bg-paper p-5 text-left ring-1 ring-line transition hover:ring-gold">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-ember text-white"><Sparkles className="h-6 w-6" /></span>
          <span>
            <b className="block">Need ideas first?</b>
            <span className="text-sm text-muted">Planet AI matches trips to your days & budget instantly.</span>
          </span>
        </button>
      </aside>
    </div>
  );
}
