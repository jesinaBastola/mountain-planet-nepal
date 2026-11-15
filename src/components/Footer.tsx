import { Link } from 'react-router-dom';
import OfficeMap from './OfficeMap';
import { MapPin } from 'lucide-react';
import { CONTACT } from '../data/tours';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest pb-28 text-white/80 md:pb-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src="/logo-full.png" alt="Mountain Planet — Heaven is a myth, Himalayas are real" className="w-72" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            A Kathmandu-based travel company crafting treks, climbs, tours and adventures across Nepal. Climb higher, live deeper.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Journeys</h4>
          <ul className="space-y-2.5 text-sm">
            {['Trekking', 'Peak Climbing', 'Culture', 'Wildlife', 'Adventure'].map((c) => (
              <li key={c}><Link to={`/explore?cat=${encodeURIComponent(c)}`} className="hover:text-gold">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold">About us</Link></li>
            <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
            <li><Link to="/explore?cat=Guides" className="hover:text-gold">Travel guides</Link></li>
            <li><Link to="/saved" className="hover:text-gold">Your saved trips</Link></li>
            <li><Link to="/plan" className="hover:text-gold">Plan a custom trip</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold" /> {CONTACT.address}</li>
          </ul>
          <Link to="/plan" className="mt-6 inline-block rounded-full bg-gold px-5 py-3 text-sm font-bold text-night hover:bg-white">Request a free itinerary</Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-10"><OfficeMap /></div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Mountain Planet Nepal. All rights reserved.</span>
          <span className="font-script text-lg text-gold/80">Heaven is a myth, Himalayas are real</span>
        </div>
      </div>
    </footer>
  );
}
