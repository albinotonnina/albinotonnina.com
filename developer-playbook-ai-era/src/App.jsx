import React from 'react';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import Message from './components/Message';
import Overview from './components/Overview';
import ThemesSection from './components/ThemesSection';
import WhoShouldRead from './components/WhoShouldRead';
import Promise from './components/Promise';
import CTA from './components/CTA';

export default function App() {
  return (
    <div className="bg-playbook-dark text-white">
      <Hero />
      <Carousel />
      <Message />
      <Overview />
      <ThemesSection />
      <WhoShouldRead />
      <Promise />
      <CTA />
    </div>
  );
}
