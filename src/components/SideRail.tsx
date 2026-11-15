import { NavLink } from 'react-router-dom';
import { Compass, Heart, Home, MountainSnow, Send } from 'lucide-react';

const items = [
  { to: '/', Icon: Home, label: 'Home' },
  { to: '/explore', Icon: Compass, label: 'Explore' },
  { to: '/destinations', Icon: MountainSnow, label: 'Destinations' },
  { to: '/saved', Icon: Heart, label: 'Saved' },
  { to: '/plan', Icon: Send, label: 'Plan a trip' },
];

export default function SideRail() {
  return (
    <nav aria-label="Quick menu" className="group fixed left-0 top-0 z-40 hidden h-full w-[72px] flex-col gap-1 overflow-hidden border-r border-[#d3dcdf] bg-[#EAF0F2] px-3 pt-32 transition-[width,box-shadow] duration-300 ease-out hover:w-[232px] hover:shadow-[10px_0_30px_rgba(15,61,54,.14)] focus-within:w-[232px] lg:flex">
      {items.map(({ to, Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} aria-label={label} className={({ isActive }) => `relative flex h-12 items-center gap-4 whitespace-nowrap rounded-xl px-3 font-semibold transition-colors ${isActive ? 'bg-forest text-white shadow-md' : 'text-ink-soft hover:bg-white hover:text-forest'}`}>
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute -left-3 top-3 h-6 w-1 rounded-r bg-gold" />}
              <Icon className="h-6 w-6 shrink-0" />
              <span className="opacity-0 transition-opacity delay-75 duration-200 group-hover:opacity-100 group-focus-within:opacity-100">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
