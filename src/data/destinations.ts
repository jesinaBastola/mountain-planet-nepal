export type Area = 'Mountains' | 'Culture' | 'Wildlife';
export interface Destination { name: string; area: Area; img: string; alt: string; fact: string; best: string; q: string }

export const destinations: Destination[] = [
  { name: 'Everest', area: 'Mountains', img: '/img/ebc.jpg', alt: '5,364 m', fact: 'Base camp of the world’s highest peak, reached through Sherpa villages and Tengboche Monastery.', best: 'Mar–May, Sep–Nov', q: 'everest' },
  { name: 'Annapurna', area: 'Mountains', img: '/img/annapurna.jpg', alt: '4,130 m', fact: 'Annapurna Base Camp sits inside a ring of giant peaks, with teahouses and hot springs on the way.', best: 'Mar–May, Oct–Nov', q: 'annapurna' },
  { name: 'Poon Hill', area: 'Mountains', img: '/img/poonhill.jpg', alt: '3,210 m', fact: 'A short trek known for sunrise over Dhaulagiri and Annapurna.', best: 'Mar–May, Oct–Nov', q: 'poon hill' },
  { name: 'Langtang', area: 'Mountains', img: '/img/langtang.jpg', alt: '3,870 m', fact: 'Kyanjin Gompa valley, the closest big trek to Kathmandu.', best: 'Mar–May, Oct–Nov', q: 'langtang' },
  { name: 'Gokyo Lakes', area: 'Mountains', img: '/img/gokyo.jpg', alt: '5,357 m', fact: 'Turquoise glacial lakes and the view from Gokyo Ri.', best: 'Mar–May, Sep–Nov', q: 'gokyo' },
  { name: 'Manaslu', area: 'Mountains', img: '/img/manaslu.jpg', alt: '5,106 m', fact: 'Larkya La pass on a permit-only circuit around the eighth-highest peak on Earth.', best: 'Mar–May, Sep–Nov', q: 'manaslu' },
  { name: 'Upper Mustang', area: 'Mountains', img: '/img/mustang.jpg', alt: '3,840 m', fact: 'Lo Manthang, a walled Tibetan-style town. A special permit is required.', best: 'Apr–Oct', q: 'mustang' },
  { name: 'Kathmandu', area: 'Culture', img: '/img/kathmandu.jpg', alt: '1,400 m', fact: 'Boudhanath, Swayambhunath, Pashupatinath and Durbar Square, all UNESCO World Heritage sites.', best: 'Oct–Nov, Mar–Apr', q: 'kathmandu' },
  { name: 'Bhaktapur', area: 'Culture', img: '/img/bhaktapur.jpg', alt: '1,400 m', fact: 'A medieval Newar city of brick temples, pottery squares and Nyatapola Temple.', best: 'Oct–Apr', q: 'bhaktapur' },
  { name: 'Pokhara', area: 'Culture', img: '/img/pokhara.jpg', alt: '822 m', fact: 'Phewa Lake with the Annapurna range behind it. Base for paragliding and rafting.', best: 'Oct–Apr', q: 'pokhara' },
  { name: 'Lumbini', area: 'Culture', img: '/img/lumbini.jpg', alt: '150 m', fact: 'The birthplace of the Buddha, a UNESCO site with monasteries built by many countries.', best: 'Oct–Mar', q: 'lumbini' },
  { name: 'Chitwan', area: 'Wildlife', img: '/img/chitwan.jpg', alt: '150 m', fact: 'Jungle safaris for one-horned rhinos and Bengal tigers in a UNESCO-listed national park.', best: 'Oct–Mar', q: 'chitwan' },
];

export const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-');
