/**
 * Ant Hill - Landing Page
 * Handles Cordova device events and credits/contact toggles.
 */
(function () {
  'use strict';

  const CREDITS_TEXT = 'Credits: Many of the images used in the game are from pixabay.com, which is a great site for images for free use without attribution. If you find an image in the game that violates a copyright, please notify me.';
  const CONTACT_TEXT = 'Please send your feedback, suggestions and complaints to anurajr@gmail.com.';

  const BoardState = {
    DEFAULT: 1,
    CREDITS: 2,
    CONTACT: 3
  };

  let boardValue = BoardState.DEFAULT;

  function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
  }

  function onBackKeyDown() {
    if (typeof navigator !== 'undefined' && navigator.app) {
      navigator.app.exitApp();
    }
  }

  function showCredits() {
    const blackBoard = document.getElementById('blackBoard');
    if (!blackBoard) return;

    if (boardValue !== BoardState.CREDITS) {
      blackBoard.textContent = CREDITS_TEXT;
      boardValue = BoardState.CREDITS;
    } else {
      blackBoard.textContent = '';
      boardValue = BoardState.DEFAULT;
    }
  }

  function showContact() {
    const blackBoard = document.getElementById('blackBoard');
    if (!blackBoard) return;

    if (boardValue !== BoardState.CONTACT) {
      blackBoard.textContent = CONTACT_TEXT;
      boardValue = BoardState.CONTACT;
    } else {
      blackBoard.textContent = '';
      boardValue = BoardState.DEFAULT;
    }
  }

  function init() {
    // Cordova: listen for device ready (no-op in browser)
    document.addEventListener('deviceready', onDeviceReady, false);

    // Event delegation for footer buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action="credits"]');
      if (target) {
        e.preventDefault();
        showCredits();
        return;
      }

      const contactBtn = e.target.closest('[data-action="contact"]');
      if (contactBtn) {
        e.preventDefault();
        showContact();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
