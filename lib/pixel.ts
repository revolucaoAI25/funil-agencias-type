declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead');
  }
}

export function trackCustom(event: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event);
  }
}

export function getCookieValue(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}
