"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.1,
  rootMargin = "100px",
  className = "",
  loader = (
    <div className="flex justify-center py-4">
      <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
    </div>
  ),
  endMessage = (
    <div className="text-center py-4 text-gray-500 text-sm">
      No more items to load
    </div>
  )
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setIsIntersecting(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasMore, loading]);

  useEffect(() => {
    if (isIntersecting) {
      loadMore();
      setIsIntersecting(false);
    }
  }, [isIntersecting, loadMore]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={observerRef} className="w-full">
          {loading && loader}
        </div>
      )}
      
      {!hasMore && endMessage}
    </div>
  );
}
