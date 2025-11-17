import React, { useState, useEffect, useRef } from 'react';
import bearImg from '../assets/bear.jpg';
import engineerImg from '../assets/engineer1.jpg';
import girlImg from '../assets/little_girl.jpg';
import pirateImg from '../assets/pirate.jpg';
import robotImg from '../assets/robot.jpg';
import pharaohImg from '../assets/faraon.jpg';
import grinchImg from '../assets/grinch.jpg';
import engineer2Img from '../assets/engineer2.jpg';
import medievalLadyImg from '../assets/medieval_lady.jpg';
import managerWomanImg from '../assets/manager_woman.jpg';
import cavemanImg from '../assets/caveman.jpg';
import nobleLadyImg from '../assets/noble_lady.jpg';

const testimonials = [
  { src: bearImg, alt: 'Bear', testimonial: 'This book is un-BEAR-ably good! Helped me hibernate through the AI winter with confidence.' },
  { src: engineerImg, alt: 'Engineer', testimonial: 'Finally, a technical guide that actually makes sense. No hype, just facts. *chef\'s kiss*' },
  { src: girlImg, alt: 'Little Girl', testimonial: 'My big sister said this book is like having a superpower. I believe her!' },
  { src: pirateImg, alt: 'Pirate', testimonial: 'Arr, aye! This be the treasure map fer them developers. Shiver me timbers, it\'s brilliant!' },
  { src: robotImg, alt: 'Robot', testimonial: '01010100 01101000 01101001 01110011 00100000 01100010 01101111 01101111 01101011 = Highly recommend!' },
  { src: pharaohImg, alt: 'Pharaoh', testimonial: 'Hail! This ancient wisdom for the modern era shall guide thy kingdom through the AI transformation!' },
  { src: grinchImg, alt: 'Grinch', testimonial: 'Even my small heart grew three sizes reading this. You mean... AI isn\'t stealing Christmas? Wonderful!' },
  { src: engineer2Img, alt: 'Engineer 2', testimonial: 'My colleague kept hogging this book. Had to buy my own copy. Worth every penny!' },
  { src: medievalLadyImg, alt: 'Medieval Lady', testimonial: 'Verily, this tome doth illuminate the path forward with grace and wisdom most profound, good sire!' },
  { src: managerWomanImg, alt: 'Manager Woman', testimonial: 'As a team lead, this helped me understand how to better support my developers in the AI era. Essential reading!' },
  { src: cavemanImg, alt: 'Caveman', testimonial: 'Gruk not understand all words, but Gruk learn much! AI future bright. Book make sense of fire... and code!' },
  { src: nobleLadyImg, alt: 'Noble Lady', testimonial: 'Most exquisite! A treatise worthy of the finest libraries. This shall elevate discourse among the learned!' },
];
®
export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const totalItems = testimonials.length;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll effect - continuous scrolling
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000); // Change image every 4 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay]);

  // Scroll to current index
  useEffect(() => {
    if (containerRef.current) {
      const itemWidth = containerRef.current.scrollWidth / (testimonials.length * 2);
      const scrollLeft = currentIndex * itemWidth;
      containerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });

      // Reset to beginning when we hit the duplicate set
      if (currentIndex >= totalItems * 2) {
        setTimeout(() => {
          containerRef.current.scrollTo({
            left: totalItems * itemWidth,
            behavior: 'auto',
          });
          setCurrentIndex(totalItems);
        }, 0);
      }
    }
  }, [currentIndex, totalItems]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDotClick = (index) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndXRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum swipe distance in pixels
    const difference = touchStartXRef.current - touchEndXRef.current;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrev();
      }
    }
  };

  // Get visible items based on screen size
  const itemWidthClass = isMobile ? 'w-full' : 'w-64 sm:w-72 md:w-80';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-playbook-dark relative overflow-hidden">
      <div className={isMobile ? 'mx-auto' : 'max-w-7xl mx-auto'}>
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          What Readers Are Saying
        </h2>

        {/* Container */}
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel wrapper */}
          <div
            ref={containerRef}
            className={`flex overflow-hidden rounded-xl scroll-smooth gap-6 ${isMobile ? 'px-0' : 'px-4'}`}
            style={{
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
            }}
          >
            {/* Original testimonials */}
            {testimonials.map((item, index) => (
              <div
                key={`original-${index}`}
                className={`flex-shrink-0 ${itemWidthClass}`}
                style={{
                  scrollSnapAlign: 'start',
                }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-playbook-red/50 transition-all duration-300 hover:shadow-lg hover:shadow-playbook-red/20 h-full">
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Testimonial text */}
                  <div className="p-5">
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{item.testimonial}"
                    </p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-playbook-red fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicated testimonials for infinite loop */}
            {testimonials.map((item, index) => (
              <div
                key={`duplicate-${index}`}
                className={`flex-shrink-0 ${itemWidthClass}`}
                style={{
                  scrollSnapAlign: 'start',
                }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-playbook-red/50 transition-all duration-300 hover:shadow-lg hover:shadow-playbook-red/20 h-full">
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Testimonial text */}
                  <div className="p-5">
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{item.testimonial}"
                    </p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-playbook-red fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons - hidden on mobile */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/3 -translate-y-1/2 z-20 bg-playbook-red/80 hover:bg-playbook-red text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/3 -translate-y-1/2 z-20 bg-playbook-red/80 hover:bg-playbook-red text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots/indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === (currentIndex % totalItems)
                  ? 'bg-playbook-red w-8'
                  : 'bg-white/30 hover:bg-white/50 w-2.5'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          {(currentIndex % totalItems) + 1} / {testimonials.length}
        </div>
      </div>
    </section>
  );
}
