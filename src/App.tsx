import { useEffect, useState } from 'react';
import Intro, { introSeen } from './components/Intro';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import Header from './components/Header';
import Footer from './components/Footer';
import SherpaAI from './components/SherpaAI';
import Home from './pages/Home';
import Explore from './pages/Explore';
import TourDetail from './pages/TourDetail';
import GuideDetail from './pages/GuideDetail';
import Saved from './pages/Saved';
import About from './pages/About';
import Destinations from './pages/Destinations';
import Place from './pages/Place';
import SideRail from './components/SideRail';
import Plan from './pages/Plan';
import NotFound from './pages/NotFound';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!pathname.startsWith('/tour') && !pathname.startsWith('/guide')) document.title = 'Mountain Planet Nepal · Treks, Tours & Himalayan Adventures';
  }, [pathname]);
  return null;
}

export default function App() {
  const [ready, setReady] = useState(introSeen);
  return (
    <BrowserRouter>
      <StoreProvider>
        <Intro ready={ready} setReady={setReady} />
        <ScrollTop />
        <SideRail />
        <div className="lg:pl-[72px]">
        <Header />
        <main className="min-h-[60vh]">
          {ready && <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:slug" element={<Place />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/tour/:slug" element={<TourDetail />} />
            <Route path="/guide/:slug" element={<GuideDetail />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/about" element={<About />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>}
        </main>
        <Footer />
        </div>
        <SherpaAI />
      </StoreProvider>
    </BrowserRouter>
  );
}
