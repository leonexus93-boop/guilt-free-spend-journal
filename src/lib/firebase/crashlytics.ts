// Firebase Crashlytics initialization
// Note: Crashlytics for web is primarily useful when deployed to Firebase Hosting
// For local development, errors will be logged to console

import { logEvent } from 'firebase/analytics';
import { getAnalytics } from './config';

/**
 * Log a custom error event to Analytics
 * This provides basic error tracking without full Crashlytics
 */
export function logError(
  error: Error,
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    [key: string]: string | undefined;
  }
) {
  const analytics = getAnalytics();
  if (!analytics) {
    console.error('Analytics not available:', error);
    return;
  }

  try {
    logEvent(analytics, 'exception', {
      event_category: 'error',
      event_label: error.name,
      description: error.message,
      stack: error.stack,
      ...context,
    });
  } catch (logError) {
    console.error('Failed to log error to analytics:', logError);
  }
}

/**
 * Log a custom event for debugging
 */
export function logDebugEvent(eventName: string, params?: Record<string, any>) {
  const analytics = getAnalytics();
  if (!analytics) {
    console.debug('[Debug]', eventName, params);
    return;
  }

  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.error('Failed to log debug event:', error);
  }
}

/**
 * Initialize error tracking
 * Call this once on app startup
 */
export function initializeErrorTracking() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logError(event.error || new Error(event.message), {
        component: 'global',
        action: 'unhandled_error',
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      logError(new Error(`Unhandled promise rejection: ${event.reason}`), {
        component: 'global',
        action: 'unhandled_promise_rejection',
      });
    });
  }
}
