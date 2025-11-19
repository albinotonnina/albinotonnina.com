import React from 'react';

export default function Overview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-playbook-dark border-t-4 border-playbook-red">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          A Clear-Eyed Look at the AI Era
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">60,500+ Words</h3>
              <p className="text-gray-300 leading-relaxed">
                Comprehensive without being overwhelming. 12 chapters covering foundation,
                technical domains, practice, and the future.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">Evidence-Based</h3>
              <p className="text-gray-300 leading-relaxed">
                Real statements from industry leaders. Concrete examples developers encounter.
                Honest discussion of both opportunities and limitations.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">Real Case Studies</h3>
              <p className="text-gray-300 leading-relaxed">
                How teams are adapting right now. Productivity gains. Challenges they face.
                Practical strategies that work in production.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">Language-Agnostic</h3>
              <p className="text-gray-300 leading-relaxed">
                Focus on concepts, not syntax. Whether you use ChatGPT, Claude, Copilot,
                or tomorrow's tool, the principles remain the same.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">Human-Centric</h3>
              <p className="text-gray-300 leading-relaxed">
                Not cheerleading AI. Not doomsaying about job loss. A nuanced exploration
                of how the profession is evolving.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-playbook-red mb-4">Multiple Formats</h3>
              <p className="text-gray-300 leading-relaxed">
                Available as eBook, Paperback, and Hardcover. Read how you want, wherever you want.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
