'use client';

import { useEffect, useState } from 'react';

interface LoadingOracleProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export default function LoadingOracle({
  message = 'The Oracle is reading your chart...',
  showProgress = false,
  progress = 0,
}: LoadingOracleProps) {
  const [dots, setDots] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  // Typing animation for message
  useEffect(() => {
    let idx = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (idx < message.length) {
        setDisplayedText(message.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [message]);

  // Pulsing dots
  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      {/* Yin-Yang spinning animation */}
      <div className="relative w-24 h-24">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-spin"
          style={{ animationDuration: '3s' }}
        >
          {/* Outer circle */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
          {/* Yin (dark) half */}
          <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2" fill="currentColor" className="text-foreground" />
          {/* Yang (light) half */}
          <path d="M50 2 A48 48 0 0 0 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="currentColor" className="text-muted" />
          {/* Yang dot */}
          <circle cx="50" cy="26" r="6" fill="currentColor" className="text-muted" />
          {/* Yin dot */}
          <circle cx="50" cy="74" r="6" fill="currentColor" className="text-foreground" />
        </svg>

        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-primary/20 blur-lg" />
      </div>

      {/* Message with typing animation */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">
          {displayedText}
          <span className="text-muted-foreground">{dots}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Analyzing celestial alignments
        </p>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="w-64 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
