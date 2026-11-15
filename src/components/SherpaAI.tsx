import { useEffect, useRef, useState, Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, X, Send, RotateCcw, Star, ArrowRight, BookOpen } from 'lucide-react';
import { useStore } from '../lib/store';
import { respond, type AgentReply, type Prefs } from '../lib/agentBrain';
import { getTour, getGuide } from '../data/tours';

interface Msg extends Partial<AgentReply> {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const WELCOME: Msg = {
  id: 0,
  role: 'bot',
  text: 'Namaste! 🙏 I’m **Planet AI** — Mountain Planet’s travel assistant. I can recommend trips, explain seasons, permits & altitude, and help you request a quote.',
  chips: ['Plan my trip', 'Best time to visit', 'Easy treks for beginners', '2 weeks, Everest, $1500'],
};

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith('**') ? <strong key={j} className="font-bold text-ink">{part.slice(2, -2)}</strong> : <span key={j}>{part}</span>,
          )}
        </Fragment>
      ))}
    </>
  );
}

export default function SherpaAI() {
  const { agentOpen, setAgentOpen, pendingAsk, clearPendingAsk } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const prefs = useRef<Prefs>({ interests: [] });
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { id: Date.now(), role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    const { reply, prefs: next } = respond(t, prefs.current);
    prefs.current = next;
    setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, role: 'bot', ...reply }]);
      setTyping(false);
    }, 650 + Math.min(reply.text.length * 4, 900));
  };

  useEffect(() => {
    if (agentOpen && pendingAsk) {
      send(pendingAsk);
      clearPendingAsk();
    }
    if (agentOpen) setTimeout(() => inputRef.current?.focus(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentOpen, pendingAsk]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const reset = () => {
    prefs.current = { interests: [] };
    setMsgs([WELCOME]);
  };

  return (
    <>
      <AnimatePresence>
        {!agentOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setAgentOpen(true)}
            className="fixed bottom-6 right-6 z-[60] hidden items-center gap-3 rounded-full bg-night py-2 pl-2 pr-5 text-white shadow-[0_12px_40px_rgba(0,0,0,.35)] transition hover:-translate-y-0.5 md:flex"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-ember">
              <Sparkles className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-night bg-emerald-400" />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold">Ask Planet AI</span>
              <span className="block text-xs text-white/60">Your trip planner · online</span>
              <span className="block text-[10px] text-white/45">Powered by BoticxLabs LLP</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {agentOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAgentOpen(false)}
              className="fixed inset-0 z-[69] bg-black/30 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[70] flex h-[88vh] flex-col overflow-hidden rounded-t-[28px] bg-paper shadow-[0_20px_80px_rgba(0,0,0,.35)] md:inset-x-auto md:bottom-6 md:right-6 md:h-[640px] md:max-h-[calc(100vh-48px)] md:w-[410px] md:rounded-[28px]"
            >
              <div className="relative overflow-hidden bg-night px-5 pb-5 pt-5 text-white">
                <img src="/img/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-night/40 to-night" />
                <div className="relative flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-black ring-1 ring-gold/40">
                    <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-display text-lg font-semibold">
                      Planet AI <Sparkles className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/70">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" /> Mountain Planet travel assistant
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/50">Powered by BoticxLabs LLP</div>
                  </div>
                  <button onClick={reset} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Restart conversation" title="Restart">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button onClick={() => setAgentOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto bg-canvas px-4 py-5">
                {msgs.map((m, idx) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={m.role === 'user' ? 'flex justify-end' : ''}>
                    {m.role === 'user' ? (
                      <div className="max-w-[80%] rounded-3xl rounded-br-md bg-forest px-4 py-2.5 text-[14px] text-white">{m.text}</div>
                    ) : (
                      <div className="max-w-[92%]">
                        <div className="rounded-3xl rounded-bl-md bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink-soft shadow-sm ring-1 ring-line">
                          <Rich text={m.text} />
                        </div>
                        {m.tours && m.tours.length > 0 && (
                          <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                            {m.tours.map((s) => {
                              const t = getTour(s);
                              if (!t) return null;
                              return (
                                <Link key={s} to={`/tour/${s}`} onClick={() => window.innerWidth < 768 && setAgentOpen(false)} className="group w-40 shrink-0 overflow-hidden rounded-2xl bg-paper ring-1 ring-line transition hover:ring-gold">
                                  <img src={t.img} alt="" className="h-24 w-full object-cover" />
                                  <div className="p-2.5">
                                    <div className="line-clamp-2 text-[13px] font-semibold leading-snug">{t.title}</div>
                                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
                                      <span>{t.days}d · ${t.price.toLocaleString()}</span>
                                      <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-gold text-gold" />{t.rating}</span>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                        {m.guides?.map((g) => {
                          const gd = getGuide(g);
                          return gd ? (
                            <Link key={g} to={`/guide/${g}`} className="mt-2 flex items-center gap-3 rounded-2xl bg-paper p-2 ring-1 ring-line hover:ring-gold">
                              <img src={gd.img} alt="" className="h-12 w-12 rounded-xl object-cover" />
                              <span className="flex-1 text-[13px] font-semibold leading-snug">{gd.title}</span>
                              <BookOpen className="mr-2 h-4 w-4 text-gold-deep" />
                            </Link>
                          ) : null;
                        })}
                        {m.link && (
                          <Link to={m.link.to} onClick={() => setAgentOpen(false)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-[13px] font-bold text-white hover:bg-ember-deep">
                            {m.link.label} <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                        {m.chips && idx === msgs.length - 1 && !typing && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {m.chips.map((c) => (
                              <button key={c} onClick={() => send(c)} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink transition hover:border-gold hover:bg-gold/10">
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                {typing && (
                  <div className="inline-flex gap-1 rounded-3xl rounded-bl-md bg-paper px-4 py-3.5 ring-1 ring-line">
                    <span className="dot h-2 w-2 rounded-full bg-gold-deep" />
                    <span className="dot h-2 w-2 rounded-full bg-gold-deep" />
                    <span className="dot h-2 w-2 rounded-full bg-gold-deep" />
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 border-t border-line bg-paper p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 10 days, moderate, under $1200…"
                  className="h-12 flex-1 rounded-full bg-chip px-5 text-[14px] outline-none ring-gold/40 focus:ring-4"
                />
                <button type="submit" disabled={!input.trim() || typing} className="grid h-12 w-12 place-items-center rounded-full bg-ember text-white transition hover:bg-ember-deep disabled:opacity-40" aria-label="Send">
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
