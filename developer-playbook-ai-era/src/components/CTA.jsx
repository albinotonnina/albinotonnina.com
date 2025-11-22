import React from 'react';
import useAmazonLink, { ASINS } from '../hooks/useAmazonLink';
import koalaImg from '../assets/book/koala.jpg';

/**
 * UniversalBookLink Component
 * Generates a geo-localized Amazon affiliate link for a specific book format (ASIN).
 * 
 * @param {string} asin - The Amazon Standard Identification Number (e.g., ASINS.KINDLE, ASINS.PAPERBACK, ASINS.HARDCOVER)
 * @returns {string} The geo-localized Amazon affiliate URL
 * 
 * @example
 * <UniversalBookLink asin={ASINS.KINDLE} />
 * <UniversalBookLink asin={ASINS.PAPERBACK} />
 * <UniversalBookLink asin={ASINS.HARDCOVER} />
 */
export function UniversalBookLink({ asin }) {
  const { url, loading } = useAmazonLink(asin);
  return loading ? '#' : url;
}

export default function CTA() {
  const { url: kindleUrl } = useAmazonLink(ASINS.KINDLE);
  const { url: paperbackUrl } = useAmazonLink(ASINS.PAPERBACK);
  const { url: hardcoverUrl } = useAmazonLink(ASINS.HARDCOVER);

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



            {/* Purchase Options */}
            <div className="w-full mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Choose Your Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ebook Option */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
                  <div className="text-sm text-gray-400 mb-2">Format</div>
                  <div className="font-bold text-white mb-3">Ebook</div>
                  <div className="text-2xl font-bold text-playbook-red mb-4">£17.99</div>
                  <a
                    href={kindleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded text-center transition-all"
                  >
                    Buy Now
                  </a>
                </div>

                {/* Paperback Option - Highlighted */}
                <div className="relative md:scale-105 z-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-playbook-red text-white text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    BEST VALUE
                  </div>
                  <div className="bg-gradient-to-b from-playbook-red/20 to-playbook-red/10 border-2 border-playbook-red rounded-lg p-6 shadow-xl shadow-playbook-red/20">
                    <div className="text-sm text-gray-300 mb-2">Format</div>
                    <div className="font-bold text-white mb-3 text-lg">Paperback</div>
                    <div className="text-2xl font-bold text-white mb-4">£23.99</div>
                    <a
                      href={paperbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-playbook-red hover:bg-playbook-red/90 text-white font-semibold py-2 px-4 rounded transition-all"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>

                {/* Hardcover Option */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
                  <div className="text-sm text-gray-400 mb-2">Format</div>
                  <div className="font-bold text-white mb-3">Hardcover</div>
                  <div className="text-2xl font-bold text-playbook-red mb-4">£29.99</div>
                  <a
                    href={hardcoverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded text-center transition-all"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
