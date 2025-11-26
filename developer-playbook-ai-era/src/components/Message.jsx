import React from 'react';

export default function Message() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-playbook-dark">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-2xl sm:text-3xl font-serif leading-relaxed mb-4">
          Your brain is not obsolete.
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-playbook-red mb-8">
          AI is just better at typing.
        </p>
        <div className="text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            The future of software development isn't about writing more code faster.
          </p>
          <p>
            It's about thinking more clearly and focusing on what machines can't do:
            <span className="block font-semibold text-playbook-dark mt-2">
              architecture, judgement, domain expertise, and strategic problem-solving.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
