export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type Gtag = (command: "event", eventName: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

const toStringProps = (payload: AnalyticsPayload) =>
  Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const normalizedPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...normalizedPayload });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, normalizedPayload);
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: toStringProps(payload) });
  }

  if (window.umami?.track) {
    window.umami.track(eventName, normalizedPayload);
  }
}
