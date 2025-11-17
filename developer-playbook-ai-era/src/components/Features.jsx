import React from 'react';

const chapters = [
  {
    section: 'Foundation',
    description: 'Why the shift matters. How we got here. Conceptual foundations.',
  },
  {
    section: 'Technical Domains',
    description: 'Frontend reimagined. Backend evolution. Architecture patterns.',
  },
  {
    section: 'Process & Practice',
    description: 'AI-enhanced lifecycle. Quality and testing. Your new role.',
  },
  {
    section: 'Looking Forward',
    description: 'Challenges. Where AI struggles. How to position yourself.',
  },
];\n\nexport default function Features() {\n  return (\n    <section className=\"py-20 px-4 sm:px-6 lg:px-8 bg-playbook-dark border-t-4 border-playbook-red\">\n      <div className=\"max-w-6xl mx-auto\">\n        <h2 className=\"text-5xl font-bold text-center mb-16 text-white\">12 Chapters, 46,000+ Words</h2>\n        <div className=\"grid md:grid-cols-2 lg:grid-cols-4 gap-8\">\n          {chapters.map((chapter) => (\n            <div\n              key={chapter.section}\n              className=\"p-8 border-l-4 border-playbook-red hover:bg-white/5 transition\"\n            >\n              <h3 className=\"text-2xl font-semibold mb-4 text-playbook-red\">{chapter.section}</h3>\n              <p className=\"text-gray-300 leading-relaxed\">{chapter.description}</p>\n            </div>\n          ))}\n        </div>\n      </div>\n    </section>\n  );\n}
