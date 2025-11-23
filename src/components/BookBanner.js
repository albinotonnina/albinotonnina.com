import React, { useState, useEffect } from "react";
import "../styles/book-banner.css";

export default function BookBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="book-banner">
      <a
        href="https://albinotonnina.com/developer-playbook-ai-era"
        target="_blank"
        rel="noopener noreferrer"
      >
        23 November 2025: I wrote a book! 📕
      </a>
    </div>
  );
}
