// Analytics and performance monitoring utilities

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

// Web Vitals types
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class Analytics {
  private enabled: boolean = false;

  constructor() {
    // Only enable in production
    this.enabled = process.env.NODE_ENV === 'production';
  }

  // Track page views
  trackPageView(url: string) {
    if (!this.enabled) return;
    
    // Add your analytics provider here (e.g., Google Analytics, Plausible)
    console.log('Page view:', url);
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.enabled) return;
    
    console.log('Event:', event.name, event.properties);
  }

  // Track Web Vitals
  trackWebVitals(metric: WebVitalsMetric) {
    if (!this.enabled) return;
    
    console.log('Web Vitals:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });

    // Send to analytics
    this.trackEvent({
      name: 'web_vitals',
      properties: {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    console.error('Error tracked:', error, context);
    
    this.trackEvent({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  // Track user actions
  trackAction(action: string, properties?: Record<string, any>) {
    this.trackEvent({
      name: action,
      properties,
    });
  }
}

export const analytics = new Analytics();

// Helper to track note operations
export const trackNoteOperation = (operation: 'create' | 'update' | 'delete' | 'archive' | 'pin') => {
  analytics.trackAction(`note_${operation}`);
};
