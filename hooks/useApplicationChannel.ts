'use client';

import Pusher from 'pusher-js';
import { useEffect, useRef } from 'react';

export interface ApplicationStatusChangedPayload {
  application_id: number;
  new_status: string;
  new_status_label: string;
  updated_at: string;
  message: string;
}

export interface PaymentConfirmedPayload {
  application_id: number;
  payment_id: number;
  amount_formatted: string;
  paid_at: string;
  next_step: string;
}

export interface OfficerAssignedPayload {
  application_id: number;
  officer_id: number;
  assigned_at: string;
}

export interface BorderVerificationResultPayload {
  application_id: number;
  verification_status: string;
  port_of_entry: string;
  verified_at: string;
}

/** Simple form: subscribe to one application and handle status changes only */
export function useApplicationChannel(
  applicationId: number,
  onStatusChange: (data: ApplicationStatusChangedPayload) => void
): void;

/** Full form: subscribe with all event callbacks */
export function useApplicationChannel(
  applicationId: number | null,
  callbacks: {
    onStatusChange?: (data: ApplicationStatusChangedPayload) => void;
    onPaymentConfirmed?: (data: PaymentConfirmedPayload) => void;
    onOfficerAssigned?: (data: OfficerAssignedPayload) => void;
    onBorderVerification?: (data: BorderVerificationResultPayload) => void;
  }
): void;

export function useApplicationChannel(
  applicationId: number | null,
  callbacksOrOnStatusChange:
    | ((data: ApplicationStatusChangedPayload) => void)
    | {
        onStatusChange?: (data: ApplicationStatusChangedPayload) => void;
        onPaymentConfirmed?: (data: PaymentConfirmedPayload) => void;
        onOfficerAssigned?: (data: OfficerAssignedPayload) => void;
        onBorderVerification?: (data: BorderVerificationResultPayload) => void;
      }
) {
  const callbacks =
    typeof callbacksOrOnStatusChange === 'function'
      ? { onStatusChange: callbacksOrOnStatusChange }
      : callbacksOrOnStatusChange;
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Pusher.Channel | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (applicationId == null) return;

    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'eu';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

    if (!key || !apiUrl) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('Pusher: NEXT_PUBLIC_PUSHER_APP_KEY or NEXT_PUBLIC_API_URL not set; real-time updates disabled.');
      }
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: `${apiUrl.replace(/\/$/, '')}/api/broadcasting/auth`,
      auth: {
        headers: { Accept: 'application/json' },
        params: {},
      },
      // Send cookies for Sanctum auth
      ...(typeof window !== 'undefined' && { authTransport: 'ajax' as const }),
    });
    pusherRef.current = pusher;

    const channelName = `private-application.${applicationId}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    channel.bind('application.status.changed', (data: ApplicationStatusChangedPayload) => {
      callbacksRef.current?.onStatusChange?.(data);
    });

    channel.bind('payment.confirmed', (data: PaymentConfirmedPayload) => {
      callbacksRef.current?.onPaymentConfirmed?.(data);
    });

    channel.bind('officer.assigned', (data: OfficerAssignedPayload) => {
      callbacksRef.current?.onOfficerAssigned?.(data);
    });

    channel.bind('border.verification.result', (data: BorderVerificationResultPayload) => {
      callbacksRef.current?.onBorderVerification?.(data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusherRef.current = null;
      channelRef.current = null;
    };
  }, [applicationId]);
}

