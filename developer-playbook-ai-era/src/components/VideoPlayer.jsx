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

// Preload strategy: preload next 3 videos in the queue
const preloadQueue = new Set();
const preloadedBlobs = new Map();

const preloadVideo = async (videoUrl) => {
  if (preloadedBlobs.has(videoUrl) || preloadQueue.has(videoUrl)) {
    return;
  }

  preloadQueue.add(videoUrl);

  try {
    const response = await fetch(videoUrl);
    if (response.ok) {
      const blob = await response.blob();
      preloadedBlobs.set(videoUrl, blob);
    }
  } catch (error) {
    console.warn(`Failed to preload video: ${videoUrl}`, error);
  } finally {
    preloadQueue.delete(videoUrl);
  }
};

const getVideoUrl = (videoPath) => {
  if (preloadedBlobs.has(videoPath)) {
    return URL.createObjectURL(preloadedBlobs.get(videoPath));
  }
  return videoPath;
};

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
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {
          // Handle autoplay policy restrictions
        });
        setIsPlaying(true);
      }
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
    }, 2000);
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
      const videoUrl = getVideoUrl(videos[currentVideoIndex]);
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }

    // Preload next 3 videos in the queue
    for (let i = 1; i <= 3; i++) {
      const nextIndex = (currentVideoIndex + i) % videos.length;
      preloadVideo(videos[nextIndex]);
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
        aspectRatio: '640 / 480',
      }}
    >
      {/* Video element - shown when playing */}
      <video
        ref={videoRef}
        className={`w-full h-auto object-cover cursor-pointer ${
          isPlaying ? 'block' : 'hidden'
        }`}
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

      {/* Play/Pause overlay on hover - only show when hovering/paused */}
      {showControls && !isPlaying && (
        <>
          {/* Center play/pause icon with darker background */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-6">
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

      {/* Next video button - only visible when showing controls */}
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

      {/* Play button on load - no background, always clickable */}
      {!isPlaying && !showControls && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <svg
            className="w-20 h-20 text-white opacity-60 hover:opacity-100 transition-opacity duration-300"
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
