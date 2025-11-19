import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoPlay from 'embla-carousel-autoplay';
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
import astronautImg from '../assets/astronaut.jpg';
import babyImg from '../assets/baby.jpg';
import monkImg from '../assets/monk.jpg';
import grumpyManImg from '../assets/grumpy_man.jpg';
import gymBroImg from '../assets/gym_bro.jpg';
import alienImg from '../assets/alien.jpg';
import timeTravelerImg from '../assets/time_traveler.jpg';
import runnerImg from '../assets/runner.jpg';
import grandmaImg from '../assets/grandma.jpg';
import sleepyDeveloperImg from '../assets/sleepy_developer.jpg';

const testimonials = [
  { src: engineerImg, alt: 'Engineer', testimonial: 'Finally, a technical guide that actually makes sense. No hype, just facts. *chef\'s kiss*', stars: 5 },
  { src: girlImg, alt: 'Little Girl', testimonial: 'My big sister said this book is like having a superpower. I believe her!', stars: 5 },
  { src: grandmaImg, alt: 'Confused Grandma', testimonial: 'My grandson says I should read this. I still don\'t know how to turn it on, but it smells nice!', stars: 2 },
  { src: pirateImg, alt: 'Pirate', testimonial: 'Arr, aye! This be the treasure map fer them developers. Shiver me timbers, it\'s brilliant!', stars: 4 },
  { src: robotImg, alt: 'Robot', testimonial: '01010100 01101000 01101001 01110011 00100000 01100010 01101111 01101111 01101011 = Highly recommend!', stars: 5 },
  { src: sleepyDeveloperImg, alt: 'Sleepy Developer', testimonial: 'Read this at 3 AM during a deadline... somehow everything clicked. Also I may have hallucinated half of it.', stars: 3 },
  { src: pharaohImg, alt: 'Pharaoh', testimonial: 'Hail! This ancient wisdom for the modern era shall guide thy kingdom through the AI transformation!', stars: 5 },
  { src: grinchImg, alt: 'Grinch', testimonial: 'Even my small heart grew three sizes reading this. You mean... AI isn\'t stealing Christmas? Wonderful!', stars: 2 },
  { src: engineer2Img, alt: 'Engineer 2', testimonial: 'My colleague kept hogging this book. Had to buy my own copy. Worth every penny!', stars: 5 },
  { src: medievalLadyImg, alt: 'Medieval Lady', testimonial: 'Verily, this tome doth illuminate the path forward with grace and wisdom most profound, good sire!', stars: 5 },
  { src: managerWomanImg, alt: 'Manager Woman', testimonial: 'As a team lead, this helped me understand how to better support my developers in the AI era. Essential reading!', stars: 5 },
  { src: cavemanImg, alt: 'Caveman', testimonial: 'Gruk not understand all words, but Gruk learn much! AI future bright. Book make sense of fire... and code!', stars: 3 },
  { src: nobleLadyImg, alt: 'Noble Lady', testimonial: 'Most exquisite! A treatise worthy of the finest libraries. This shall elevate discourse among the learned!', stars: 5 },
  { src: grumpyManImg, alt: 'Grumpy Man', testimonial: 'Worst book ever. Completely ruined my day. I laughed, I cried, I actually learned things. Absolutely terrible!', stars: 1 },
  { src: astronautImg, alt: 'Astronaut', testimonial: 'Houston, we have a breakthrough! This guide navigated me through the AI cosmos. Truly out of this world!', stars: 4 },
  { src: babyImg, alt: 'Baby', testimonial: 'Goo goo ga ga! Even babies know this book is genius. *babbles excitedly* Best recommendation ever!', stars: 5 },
  { src: monkImg, alt: 'Monk', testimonial: 'Namaste. This book has brought me inner peace and outer clarity on AI. The path to enlightenment is now clear.', stars: 5 },
  { src: gymBroImg, alt: 'Gym Bro', testimonial: 'BRO. This book PUMPED me UP! Now I\'m SHREDDING code and crushing AI gains. LET\'S GOOOO! 💪', stars: 4 },
  { src: alienImg, alt: 'Alien', testimonial: '🛸 Greetings. Your species\' understanding of AI is... acceptable. Will report to command. 5 Earth stars.', stars: 5 },
  { src: timeTravelerImg, alt: 'Time Traveler', testimonial: 'I read this book in 2050 and it changed my past. Wait... paradox? Anyway, highly recommend!', stars: 5 },
  { src: runnerImg, alt: 'Tuner', testimonial: 'Wait, I actually read another book. I\'m here by mistake. But honestly? This one is better anyway. 1 star!', stars: 1 },
  { src: bearImg, alt: 'Bear', testimonial: 'This book is un-BEAR-ably good! Helped me hibernate through the AI winter with confidence.', stars: 4 },
];

const StarRating = ({ stars }) => (
  <div className="flex justify-center gap-1">
    {[...Array(stars)].map((_, i) => (
      <svg
        key={i}
        className="w-4 h-4 text-playbook-red fill-current"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

export default function Carousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const autoPlayRef = React.useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 2,
    },
    []
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi?.off('select', onSelect);
      emblaApi?.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-playbook-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          What Readers Are Saying
        </h2>

        {/* Carousel wrapper */}
        <div className="relative group">
          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 min-w-0 w-full sm:w-full lg:w-1/3 lg:pr-2"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-playbook-red/50 transition-all duration-300 hover:shadow-lg hover:shadow-playbook-red/20 flex flex-col h-full">
                    {/* Image - full 600x900 */}
                    <div className="overflow-hidden bg-black/20 flex items-center justify-center" style={{ aspectRatio: '2/3' }}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Testimonial content - fixed space below */}
                    <div className="p-4 flex flex-col justify-center min-h-32">
                      <p className="text-gray-300 text-xs leading-relaxed italic">
                        "{item.testimonial}"
                      </p>
                      <div className="mt-3">
                        <StarRating stars={item.stars} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/3 -translate-y-1/2 z-20 bg-playbook-red/80 hover:bg-playbook-red text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110 -translate-x-4 sm:-translate-x-6"
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
            onClick={scrollNext}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-20 bg-playbook-red/80 hover:bg-playbook-red text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110 translate-x-4 sm:translate-x-6"
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
        </div>

        {/* Dots/indicators */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-playbook-red w-8'
                  : 'bg-white/30 hover:bg-white/50 w-2.5'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
