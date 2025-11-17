import React from 'react';
import VideoPlayer from './VideoPlayer';

export default function Hero() {
  return (
    <>
      {/* Navigation bar */}
      <nav className="bg-playbook-red shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">The Developer's Playbook</h3>
            <a
              href="https://www.albinotonnina.com"
              className="text-white hover:text-gray-100 transition-colors font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="min-h-screen sm:min-h-screen lg:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-playbook-red py-8 sm:py-12 lg:py-0">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-3 sm:mb-6 lg:mb-8 leading-tight text-white">
              The Developer's
              <br />
              Playbook
            </h1>
            <p className="text-lg sm:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-4 lg:mb-6 text-white">
              for the AI Era
            </p>
            <p className="text-sm sm:text-lg lg:text-2xl mb-4 sm:mb-8 lg:mb-12 leading-relaxed text-white/90 max-w-2xl">
              Master Thinking Over Typing
            </p>


            {/* Hero video - Mobile only, appears after title */}
            <div className="lg:hidden flex items-center justify-center mt-4 sm:mt-6">
              <div className="w-full max-w-sm">
                <VideoPlayer />
              </div>
            </div>
          </div>

          {/* Hero video - Desktop only */}
          <div className="hidden lg:flex items-center justify-center">
            <VideoPlayer />
          </div>
        </div>
      </section>
    </>
  );
}
