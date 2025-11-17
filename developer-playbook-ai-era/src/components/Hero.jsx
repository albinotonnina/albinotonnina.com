import React from 'react';
import heroImage from '../assets/hero/hero1.jpg';

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
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-playbook-red">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight text-white">
              The Developer's
              <br />
              Playbook
            </h1>
            <p className="text-3xl sm:text-4xl font-semibold mb-6 text-white">
              for the AI Era
            </p>
            <p className="text-xl sm:text-2xl mb-12 leading-relaxed text-white/90 max-w-2xl">
              Master Thinking Over Typing
            </p>
            <p className="text-lg sm:text-xl mb-12 leading-relaxed text-white/80 max-w-2xl italic">
              Your brain is not obsolete.
              <br />
              AI is just better at typing.
            </p>

            {/* Hero image - Mobile only, appears after title */}
            <div className="lg:hidden flex items-center justify-center mt-8">
              <div className="rounded-lg overflow-hidden shadow-2xl max-w-sm w-full">
                <img
                  src={heroImage}
                  alt="The Developer's Playbook for the AI Era"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Hero image - Desktop only */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="The Developer's Playbook for the AI Era"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
