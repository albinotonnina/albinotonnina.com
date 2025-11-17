import React from 'react';

const themes = [
  {
    title: 'Foundation (Chapters 1-3)',
    points: [
      'Why the shift matters',
      'How we got here through programming abstractions',
      'Conceptual foundations that remain constant',
    ],
  },
  {
    title: 'Technical Domains (Chapters 4-6)',
    points: [
      'Frontend development reimagined',
      'Backend evolution with AI assistance',
      'Timeless architecture patterns accelerated',
    ],
  },
  {
    title: 'Process & Practice (Chapters 7-10)',
    points: [
      'AI-enhanced development lifecycle',
      'Why QA becomes more important, not less',
      'Your specific role in the AI era',
    ],
  },
  {
    title: 'Looking Forward (Chapters 11-12)',
    points: [
      'Where AI struggles and why',
      'What remains fundamentally human',
      'Positioning yourself at the forefront',
    ],
  },
];

export default function ThemesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-playbook-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-playbook-red/10 rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-playbook-red/5 rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          What's Inside
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme, index) => (
            <div
              key={theme.title}
              className="card-3d group"
              style={{
                '--delay': `${index * 0.15}s`,
              }}
            >
              <div className="card-3d-inner relative p-6 h-full">
                {/* Card background with gradient */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-white/2 to-transparent border border-playbook-red/20 group-hover:border-playbook-red/60 transition-all duration-300 overflow-hidden">
                  {/* Animated background glow */}
                  <div className="absolute -inset-full bg-gradient-to-r from-playbook-red/0 via-playbook-red/10 to-playbook-red/0 rotate-45 group-hover:animate-pulse" />
                </div>

                {/* Border glow effect */}
                <div className="border-glow absolute inset-0 rounded-xl" />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-playbook-red mb-4 flex items-start gap-2 group-hover:text-white transition-colors duration-300">
                    <span className="inline-block w-1.5 h-1.5 bg-playbook-red rounded-full mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    <span>{theme.title}</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {theme.points.map((point, idx) => (
                      <li
                        key={point}
                        className="text-gray-300 group-hover:text-gray-100 flex items-start text-sm leading-relaxed transition-colors duration-300 opacity-80 group-hover:opacity-100"
                        style={{
                          transitionDelay: `${idx * 50}ms`,
                        }}
                      >
                        <span className="text-playbook-red font-bold mr-2.5 flex-shrink-0">›</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
