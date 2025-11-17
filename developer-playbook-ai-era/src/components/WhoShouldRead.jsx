import React from 'react';

const audiences = [
  {
    type: 'Primary',
    groups: [
      'Professional developers transitioning to AI-assisted development',
      'Technical leaders and managers understanding new paradigms',
      'Computer science students entering an evolving profession',
      'Career changers curious about software development viability',
    ],
  },
  {
    type: 'Secondary',
    groups: [
      'Product managers understanding developer productivity changes',
      'Technical recruiters evaluating what skills matter most',
      'Entrepreneurs considering team productivity impacts',
      'Anyone interested in the future of human-machine collaboration',
    ],
  },
];

export default function WhoShouldRead() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-playbook-dark border-t-4 border-playbook-red">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          Who Should Read This
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {audiences.map((section) => (
            <div key={section.type}>
              <h3 className="text-2xl font-bold text-playbook-red mb-8">{section.type} Audiences</h3>
              <ul className="space-y-4">
                {section.groups.map((group) => (
                  <li
                    key={group}
                    className="text-gray-300 flex items-start"
                  >
                    <span className="text-playbook-red font-bold mr-4 text-xl mt-1">✓</span>
                    <span className="text-lg leading-relaxed">{group}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
