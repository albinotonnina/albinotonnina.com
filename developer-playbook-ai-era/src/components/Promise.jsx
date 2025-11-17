import React from 'react';

const promises = [
  {
    title: 'Clarity',
    description: "Understanding what's actually changing vs. hype",
  },
  {
    title: 'Confidence',
    description: "Realizing your skills remain valuable in a different context",
  },
  {
    title: 'Direction',
    description: "Concrete guidance on adapting your skills and career",
  },
  {
    title: 'Strategy',
    description: "A framework for understanding industry-wide evolution",
  },
  {
    title: 'Reassurance',
    description: "This shift elevates the profession, not diminishes it",
  },
  {
    title: 'Future-Ready',
    description: "Positioned ahead of the curve for what comes next",
  },
];

export default function Promise() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-playbook-dark relative overflow-hidden">
      {/* Background gradient orb */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-playbook-red/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-playbook-red/5 rounded-full blur-3xl" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          What You'll Gain
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <div
              key={promise.title}
              className="card-3d relative"
              style={{
                '--delay': `${index * 0.1}s`,
              }}
            >
              <div className="card-3d-inner relative p-8 bg-gradient-to-br from-white/8 to-white/3 rounded-lg backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 h-full overflow-hidden card-float">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-playbook-red/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                
                {/* Left accent bar with glow */}
                <div className="card-accent-glow absolute left-0 top-0 bottom-0 w-1 rounded-full" />
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-playbook-red mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-playbook-red rounded-full" />
                    {promise.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{promise.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
