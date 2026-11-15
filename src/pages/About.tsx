import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ShieldCheck, Leaf, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="bg-night text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} src="/logo-full.png" alt="Mountain Planet logo" className="w-full max-w-xl justify-self-center drop-shadow-2xl" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Our story</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight">
              Born beneath the <span className="gold-text italic">world’s highest peaks</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Mountain Planet Nepal is a Kathmandu-based trekking and tour company built by people who call the Himalaya home. We believe heaven might be a myth — but the Himalayas are real, and everyone deserves to stand among them.
            </p>
            <p className="mt-4 leading-relaxed text-white/60">
              From first-time hikers on Poon Hill to climbers chasing their first 6,000m summit, we design journeys that are safe, personal and deeply connected to the people and cultures of Nepal.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-4xl font-semibold">What we stand for</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Compass, h: 'Local expertise', p: 'Native guides who know every trail, teahouse and festival.' },
            { i: ShieldCheck, h: 'Safety first', p: 'Licensed, first-aid trained guides, acclimatisation built in, 24/7 support.' },
            { i: Leaf, h: 'Responsible tourism', p: 'Fair porter wages, proper gear for staff, and zero-waste practices.' },
            { i: HeartHandshake, h: 'Truly tailor-made', p: 'Your dates, your pace, your comfort level — every trip is personal.' },
          ].map(({ i: Icon, h, p }, k) => (
            <motion.div key={h} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.08 }} className="rounded-3xl bg-paper p-7 ring-1 ring-line">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15"><Icon className="h-6 w-6 text-gold-deep" /></span>
              <h3 className="mt-4 text-lg font-bold">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3">
        <img src="/img/people.jpg" alt="Local Himalayan people" className="h-80 w-full rounded-3xl object-cover md:h-[460px]" />
        <img src="/img/bridge.jpg" alt="Trekker on suspension bridge" className="h-80 w-full rounded-3xl object-cover md:mt-12 md:h-[460px]" />
        <img src="/img/kathmandu.jpg" alt="Boudhanath stupa" className="h-80 w-full rounded-3xl object-cover md:h-[460px]" />
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="font-script text-4xl text-gold-deep">Ready when you are</p>
        <h2 className="mt-2 font-display text-4xl font-semibold">Let’s plan your Himalayan story</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/plan" className="rounded-full bg-ember px-7 py-4 font-bold text-white hover:bg-ember-deep">Plan a trip</Link>
          <Link to="/explore" className="rounded-full bg-chip px-7 py-4 font-bold hover:bg-line">Browse journeys</Link>
        </div>
      </section>
    </div>
  );
}
