'use client';

import Pusher from 'pusher-js';
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseRealTimeDashboardOptions {
  agency: 'gis' | 'mfa' | 'admin';
  missionId?: string | number | null;
  onMetricsUpdate?: (metrics: any) => void;
  onApplicationStatusChange?: (update: any) => void;
  onPaymentUpdate?: (update: any) => void;
}

interface UseRealTimeDashboardReturn {
  isConnected: boolean;
  metrics: any | null;
}

export function useRealTimeDashboard({
  agency,
  missionId,
  onMetricsUpdate,
  onApplicationStatusChange,
  onPaymentUpdate,
}: UseRealTimeDashboardOptions): UseRealTimeDashboardReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const callbacksRef = useRef({ onMetricsUpdate, onApplicationStatusChange, onPaymentUpdate });
  callbacksRef.current = { onMetricsUpdate, onApplicationStatusChange, onPaymentUpdate };

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'eu';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

    if (!key || !apiUrl) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('Pusher: NEXT_PUBLIC_PUSHER_APP_KEY or NEXT_PUBLIC_API_URL not set; real-time dashboard disabled.');
      }
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: `${apiUrl.replace(/\/$/, '')}/broadcasting/auth`,
      auth: {
        headers: { Accept: 'application/json' },
        params: {},
      },
    });
    pusherRef.current = pusher;

    pusher.connection.bind('connected', () => setIsConnected(true));
    pusher.connection.bind('disconnected', () => setIsConnected(false));
    pusher.connection.bind('error', () => setIsConnected(false));

    const channelName = missionId
      ? `private-dashboard.${agency}.${missionId}`
      : `private-dashboard.${agency}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('metrics.updated', (data: any) => {
      setMetrics(data);
      callbacksRef.current.onMetricsUpdate?.(data);
    });

    channel.bind('application.status.changed', (data: any) => {
      callbacksRef.current.onApplicationStatusChange?.(data);
    });

    channel.bind('payment.received', (data: any) => {
      callbacksRef.current.onPaymentUpdate?.(data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [agency, missionId]);

  return { isConnected, metrics };
}
