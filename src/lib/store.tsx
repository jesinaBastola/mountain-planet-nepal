import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StoreCtx {
  saved: string[];
  isSaved: (slug: string) => boolean;
  toggleSave: (slug: string) => void;
  toast: (msg: string) => void;
  agentOpen: boolean;
  setAgentOpen: (v: boolean) => void;
  askAgent: (msg: string) => void;
  pendingAsk: string | null;
  clearPendingAsk: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);
const KEY = 'mpn-saved';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [agentOpen, setAgentOpen] = useState(false);
  const [pendingAsk, setPendingAsk] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  const toggleSave = useCallback(
    (slug: string) => {
      setSaved((s) => {
        const has = s.includes(slug);
        toast(has ? 'Removed from your board' : 'Saved to your Himalaya board');
        return has ? s.filter((x) => x !== slug) : [slug, ...s];
      });
    },
    [toast],
  );

  const askAgent = useCallback((msg: string) => {
    setPendingAsk(msg);
    setAgentOpen(true);
  }, []);

  return (
    <Ctx.Provider
      value={{
        saved,
        isSaved: (s) => saved.includes(s),
        toggleSave,
        toast,
        agentOpen,
        setAgentOpen,
        askAgent,
        pendingAsk,
        clearPendingAsk: () => setPendingAsk(null),
      }}
    >
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 md:bottom-8">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-2xl"
            >
              <Check className="h-4 w-4 text-gold" /> {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

export async function shareLink(path: string, title: string, toast: (m: string) => void) {
  const url = window.location.origin + path;
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
  } catch {
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copied to clipboard');
  } catch {
    toast('Could not copy link');
  }
}
