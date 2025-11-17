import React from 'react';
import useAmazonLink from '../hooks/useAmazonLink';
import koalaImg from '../assets/book/koala.jpg';

export default function CTA() {
  const { url, countryName } = useAmazonLink();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-playbook-red">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-8 text-white">Ready to Level Up?</h2>
        <p className="text-xl text-white/90 mb-12 leading-relaxed">
          Get instant access to the Developer's Playbook and start mastering the AI era today.
          Available in multiple formats: Web, PDF, DOCX, and HTML.
        </p>
        <div className="mb-8">
          <img
            src={koalaImg}
            alt="Koala with Developer's Playbook"
            className="w-96 h-96 object-cover rounded-lg mx-auto"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 bg-white text-playbook-red hover:bg-gray-100 rounded font-bold text-lg transition"
          >
            Get Your Copy on Amazon
          </a>
          {/* <p className="text-white/80 text-sm">
            ({countryName})
          </p> */}
        </div>
      </div>
    </section>
  );
}
