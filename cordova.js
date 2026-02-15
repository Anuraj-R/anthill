/**
 * Cordova stub for browser environment.
 * When running in a real Cordova/PhoneGap build, this file is replaced
 * by the Cordova platform's cordova.js. In the browser, we provide a no-op
 * so the script reference doesn't 404 and the app works without Cordova.
 */
(function () {
  'use strict';

  // Fire deviceready for any listeners (e.g. index.html)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireDeviceReady);
  } else {
    fireDeviceReady();
  }

  function fireDeviceReady() {
    // Small delay to mimic Cordova behavior
    setTimeout(() => {
      const event = new Event('deviceready');
      document.dispatchEvent(event);
    }, 0);
  }
})();
