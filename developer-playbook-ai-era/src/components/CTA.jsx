import React from 'react';
import useAmazonLink from '../hooks/useAmazonLink';
import koalaImg from '../assets/book/koala.jpg';

export default function CTA() {
  const { url, countryName } = useAmazonLink();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-playbook-dark to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6 text-white font-serif">
            Ready to Master the AI Era?
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Join thousands of developers transforming their careers
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Book Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-playbook-red/20 blur-2xl rounded-lg"></div>
              <img
                src={koalaImg}
                alt="Developer's Playbook for the AI Era"
                className="relative w-80 h-80 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Right: CTA Section */}
          <div className="flex flex-col items-start justify-center space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Transform Your Development Career
              </h3>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start">
                  <span className="text-playbook-red text-2xl mr-3 mt-[-2px]">✓</span>
                  <span>Master AI integration in modern development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-playbook-red text-2xl mr-3 mt-[-2px]">✓</span>
                  <span>Learn practical strategies for the AI era</span>
                </li>
                <li className="flex items-start">
                  <span className="text-playbook-red text-2xl mr-3 mt-[-2px]">✓</span>
                  <span>Get actionable insights from industry experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-playbook-red text-2xl mr-3 mt-[-2px]">✓</span>
                  <span>Build a competitive edge in your career</span>
                </li>
              </ul>
            </div>

            {/* Premium Amazon Button */}
            <div className="w-full">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2
                  w-full
                  bg-gradient-to-b from-yellow-400 to-yellow-500 
                  hover:from-yellow-300 hover:to-yellow-400
                  text-black
                  font-bold text-xl py-5 px-8 rounded-lg
                  shadow-xl hover:shadow-2xl
                  transition-all duration-300
                  border-b-4 border-yellow-600 hover:border-yellow-500
                  active:translate-y-1 active:border-b-2
                  group
                "
              >
                <span>🛒</span>
                <span>Buy on Amazon Now</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <p className="text-gray-400 text-sm mt-3 text-center">
                Available for {countryName} • One-click checkout
              </p>
            </div>

            {/* Trust Badges */}
            {/* <div className="flex items-center gap-6 text-gray-400 text-sm pt-4 border-t border-gray-700 w-full">
              <div className="flex-1">
                <div className="font-semibold text-white">⭐ 4.8/5 Stars</div>
                <div>Rated by 1,200+ readers</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">🚀 Instant Access</div>
                <div>eBook + PDF formats</div>
              </div>
            </div> */}
          </div>
        </div>


      </div>
    </section>
  );
}
