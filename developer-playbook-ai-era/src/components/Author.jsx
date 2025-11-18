import React from 'react';

export default function Author() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Albino Tonnina',
    jobTitle: 'Full-Stack Developer',
    url: 'https://www.albinotonnina.com',
    sameAs: ['https://www.linkedin.com/in/albinotonnina/', 'https://twitter.com/albinotonnina'],
    knowsAbout: ['Web Development', 'AI', 'Software Architecture', 'Full-Stack Development'],
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-playbook-dark">
          About the Author
        </h2>

        <article className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Author Bio */}
          <div className="flex-1 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-playbook-dark">
              Albino Tonnina
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              Full-stack developer with a passion for clean code, AI, and human-centered design. 
              I believe the future of software development is about mastering thinking over typing—
              leveraging AI as a tool to amplify our cognitive abilities, not replace them.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-8">
              Through years of experience building scalable applications and working with emerging 
              technologies, I've learned that the most valuable skill isn't knowing how to code faster, 
              but knowing what to build and why.
            </p>

            {/* Links */}
            <nav className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.albinotonnina.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-playbook-red text-white font-semibold rounded-lg hover:bg-playbook-red/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label="Visit Albino Tonnina's Portfolio"
              >
                Visit My Portfolio
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/albinotonnina/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-playbook-dark text-playbook-dark font-semibold rounded-lg hover:bg-playbook-dark/5 transition-colors duration-300"
                aria-label="Connect on LinkedIn"
              >
                Follow on LinkedIn
              </a>
            </nav>
          </div>
        </article>
      </div>
    </section>
  );
}
