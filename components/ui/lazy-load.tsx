"use client";

import { useState, useEffect, useRef } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  fallback?: React.ReactNode;
}

export function LazyLoad({ 
  children, 
  className = "", 
  rootMargin = "100px", 
  threshold = 0.1,
  fallback = <div className="animate-pulse bg-gray-200 h-32 w-full rounded-lg" />
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  );
}
