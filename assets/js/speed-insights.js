/**
 * Vercel Speed Insights Initialization
 * 
 * This script initializes Vercel Speed Insights for tracking
 * web vitals and performance metrics.
 * 
 * For static HTML sites, Vercel automatically injects the tracking
 * script when deployed. This initialization ensures the queue is set up.
 */

(function() {
  // Initialize the Speed Insights queue
  // This prepares the site to receive Speed Insights tracking
  if (typeof window !== 'undefined' && !window.si) {
    window.si = window.si || function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }
})();
