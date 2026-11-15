import { MapPin, Navigation, Footprints, Bus } from 'lucide-react';
import { CONTACT } from '../data/tours';

const modes = [
  { m: 'driving', label: 'Drive', Icon: Navigation },
  { m: 'walking', label: 'Walk', Icon: Footprints },
  { m: 'transit', label: 'Bus', Icon: Bus },
];

export default function OfficeMap({ className = '' }: { className?: string }) {
  const q = encodeURIComponent(CONTACT.coords || CONTACT.address);
  const dir = (m: string) => `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=${m}`;
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/15 bg-white ${className}`}>
      <iframe title="Mountain Planet Nepal office on the map" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-60 w-full border-0 sm:h-72" />
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 text-sm text-ink">
        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ember" /> {CONTACT.address}</span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-forest">Get directions:</span>
          {modes.map(({ m, label, Icon }) => (
            <a key={m} href={dir(m)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 font-semibold text-white hover:bg-forest-deep"><Icon className="h-4 w-4" /> {label}</a>
          ))}
        </span>
      </div>
    </div>
  );
}
