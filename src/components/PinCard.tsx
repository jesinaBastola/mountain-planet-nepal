import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Star, Clock, BookOpen, Mountain } from 'lucide-react';
import type { Tour, Guide } from '../data/tours';
import { useStore, shareLink } from '../lib/store';

export function SaveButton({ slug, className = '' }: { slug: string; className?: string }) {
  const { isSaved, toggleSave } = useStore();
  const saved = isSaved(slug);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(slug);
      }}
      className={`rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
        saved ? 'bg-forest text-white' : 'bg-ember text-white hover:bg-ember-deep'
      } ${className}`}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}

export function TourPin({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const { toast } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.06 }}
      className="mb-5 break-inside-avoid"
    >
      <Link to={`/tour/${tour.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-chip" style={{ aspectRatio: `1 / ${tour.ratio}` }}>
          <img
            src={tour.img}
            alt={tour.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/35" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
              {tour.days === 1 ? '1 day' : `${tour.days} days`}
            </span>
          </div>
          <div className="absolute right-3 top-3">
            <SaveButton slug={tour.slug} />
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between opacity-0 transition group-hover:opacity-100">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink">
              <Mountain className="h-3.5 w-3.5" /> {tour.maxAlt.toLocaleString()}m
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                shareLink(`/tour/${tour.slug}`, tour.title, toast);
              }}
              aria-label="Share"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="px-1 pt-2.5">
          <h3 className="font-display text-[15px] font-bold leading-snug text-ink">{tour.title}</h3>
          <div className="mt-1 flex items-center justify-between text-[13px] text-muted">
            <span className="truncate">{tour.region}</span>
            <span className="flex shrink-0 items-center gap-1 font-semibold text-ink-soft">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {tour.rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-1 text-[13px] text-ink-soft">
            from <span className="font-bold text-ink">${tour.price.toLocaleString()}</span>
            <span className="text-muted"> · {tour.difficulty}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function GuidePin({ guide, index = 0 }: { guide: Guide; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.06 }}
      className="mb-5 break-inside-avoid"
    >
      <Link to={`/guide/${guide.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-night" style={{ aspectRatio: `1 / ${guide.ratio}` }}>
          <img src={guide.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 text-white">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-night">
              <BookOpen className="h-3 w-3" /> {guide.kicker}
            </span>
            <h3 className="mt-2 font-display text-xl leading-tight">{guide.title}</h3>
            <span className="mt-2 flex items-center gap-1 text-xs text-white/75">
              <Clock className="h-3 w-3" /> {guide.minutes} min read
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Masonry({ children }: { children: React.ReactNode }) {
  return <div className="columns-2 gap-4 sm:columns-3 sm:gap-5 lg:columns-4 xl:columns-5">{children}</div>;
}
