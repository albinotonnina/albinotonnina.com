import React, { useState, useRef, useEffect } from 'react';
import coverImage from '../assets/cover_paperback.jpg';

// Dynamically import all videos
const videoModules = import.meta.glob('../assets/videos/video*.mp4', { eager: true });
const videos = Object.keys(videoModules)
  .sort((a, b) => {
    const numA = parseInt(a.match(/video(\d+)/)[1]);
    const numB = parseInt(b.match(/video(\d+)/)[1]);
    return numA - numB;
  })
  .map((path) => videoModules[path].default);

export default function VideoPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(true);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentVideoIndex, isPlaying]);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden shadow-2xl bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayPause}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handlePlayPause()}
      aria-label="Video player"
      style={{
        backgroundImage: `url(${coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Video element - shown when playing */}
      <video
        ref={videoRef}
        className={`w-full h-auto object-cover cursor-pointer ${
          isPlaying ? 'block' : 'hidden'
        }`}
        src={videos[currentVideoIndex]}
        onEnded={handleVideoEnd}
      />

      {/* Cover image - shown when paused */}
      {!isPlaying && (
        <img
          src={coverImage}
          alt="The Developer's Playbook for the AI Era"
          className="w-full h-auto object-cover"
        />
      )}

      {/* Play/Pause overlay on hover */}
      {showControls && !isPlaying && (
        <>
          {/* Center play/pause icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-6 hover:bg-white/20 transition-all duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* Next video button - always visible */}
      {showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextVideo();
          }}
          className="absolute bottom-6 right-6 bg-playbook-red/80 hover:bg-playbook-red text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label="Next video"
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
              d="M13 5l7 7m0 0l-7 7m7-7H6"
            />
          </svg>
        </button>
      )}

      {/* Play indicator when not playing - only show on hover */}
      {!isPlaying && showControls && (
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
          <svg
            className="w-20 h-20 text-white opacity-100 transition-all duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Play button on load - no background */}
      {!isPlaying && !showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-20 h-20 text-white opacity-60 transition-opacity duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
