import { Link } from 'react-router-dom';
import { BedDouble, Plane, Car, Ticket, Mountain, Headphones, BadgeCheck, Wallet, ShieldCheck } from 'lucide-react';

const services = [
  { icon: Mountain, h: 'Tours & Treks', p: 'Everest, Annapurna & beyond', to: '/explore' },
  { icon: BedDouble, h: 'Hotels & Stays', p: 'Hand-picked hotels & lodges', to: '/plan?msg=' + encodeURIComponent('Booking request — Stay') },
  { icon: Plane, h: 'Domestic Flights', p: 'Lukla, Pokhara, Jomsom…', to: '/plan?msg=' + encodeURIComponent('Booking request — Flight') },
  { icon: Car, h: 'Vehicle Rentals', p: 'Cars, jeeps & tourist buses', to: '/plan?msg=' + encodeURIComponent('Booking request — Vehicle Rental') },
  { icon: Ticket, h: 'Tickets & Events', p: 'Festivals, rafting, paragliding', to: '/explore?cat=Adventure' },
];

export default function ServicesStrip() {
  return (
    <>
      <section className="mx-auto mt-12 max-w-[1600px] px-3 sm:px-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {services.map(({ icon: Icon, h, p, to }) => (
            <Link key={h} to={to} className="group flex items-center gap-3 rounded-2xl bg-paper p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-forest">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest transition group-hover:bg-forest group-hover:text-white"><Icon className="h-6 w-6" /></span>
              <span>
                <b className="block font-display text-[15px] leading-tight">{h}</b>
                <span className="text-xs text-muted">{p}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-[1600px] px-3 sm:px-5">
        <div className="grid gap-3 rounded-[28px] bg-night p-6 text-white sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
          {[
            { i: BadgeCheck, h: 'Best price guarantee', p: 'Transparent local pricing' },
            { i: Wallet, h: 'Pay in NPR or USD', p: 'Flexible, secure payments' },
            { i: ShieldCheck, h: 'Trusted & licensed', p: 'Registered Nepal operator' },
            { i: Headphones, h: '24/7 support', p: 'Real people + Planet AI' },
          ].map(({ i: Icon, h, p }) => (
            <div key={h} className="flex items-center gap-3">
              <Icon className="h-8 w-8 shrink-0 text-gold" />
              <span><b className="block">{h}</b><span className="text-sm text-white/60">{p}</span></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
