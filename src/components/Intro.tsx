import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const KEY = 'mpn-intro-seen';
const dots = [['12%', '22%'], ['80%', '18%'], ['88%', '66%'], ['20%', '78%']];

export function introSeen() {
  try { return !!sessionStorage.getItem(KEY); } catch { return true; }
}

export default function Intro({ ready, setReady }: { ready: boolean; setReady: (v: boolean) => void }) {
  const calm = useReducedMotion();
  const finish = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ } setReady(true); };
  useEffect(() => {
    if (ready) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(finish, calm ? 1200 : 4200);
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, [ready, calm]);
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div key="intro" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }} className="fixed inset-0 z-[100] flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,#1c5a4d_0%,#0f3d36_45%,#071f1b_100%)] px-6 text-center text-white">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M0 470 C 250 570, 450 380, 700 300 S 950 190, 1000 210" fill="none" stroke="rgba(227,161,58,.55)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: calm ? 0.5 : 3, ease: 'easeInOut' }} />
          </svg>
          {dots.map(([x, y], i) => (
            <motion.span key={i} aria-hidden="true" className="absolute h-2 w-2 rounded-full bg-gold/80" style={{ left: x, top: y }} animate={calm ? undefined : { y: [0, -14, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3 + i, repeat: Infinity }} />
          ))}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <img src="/logo-mark.png" alt="Mountain Planet Nepal" className="h-24 w-auto drop-shadow-xl sm:h-32" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} className="relative mt-8 font-script text-4xl text-gold sm:text-6xl">Welcome to Mountain Planet</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.8 }} className="relative mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/75 sm:text-base">Heart of the Mountains</motion.p>
          <motion.div initial={{ width: 0 }} animate={{ width: 'min(60vw, 280px)' }} transition={{ duration: calm ? 1 : 3.6, ease: 'easeInOut' }} className="flags relative mt-10 h-1.5 rounded-full" />
          <button onClick={finish} className="absolute bottom-8 text-sm text-white/60 underline-offset-4 hover:text-white hover:underline">Skip</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
