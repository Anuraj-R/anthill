/**
 * Map Selection Page
 * Shows all maps. Locked maps are unclickable. Completed and unlocked maps are color coded.
 */
(function () {
  'use strict';

  var MAPLEVELMAX = 20;
  var MAPS_TO_UNLOCK = 3;

  function getHighestCompleted() {
    var winlevel = localStorage.getItem('winlevel');
    return winlevel ? parseInt(winlevel, 10) : 0;
  }

  function getMapState(level, highestCompleted) {
    if (level <= highestCompleted) return 'completed';
    if (level <= highestCompleted + MAPS_TO_UNLOCK) return 'unlocked';
    return 'locked';
  }

  function selectMap(level) {
    localStorage.setItem('MAPLEVEL', level);
    window.location.href = 'map.html';
  }

  function renderMapCards() {
    var highestCompleted = getHighestCompleted();
    var $container = $('#mapCards');
    $container.empty();

    for (var level = 1; level <= MAPLEVELMAX; level++) {
      var state = getMapState(level, highestCompleted);
      var $card = $('<a href="#" class="map-card map-card--' + state + '" data-level="' + level + '"></a>');
      $card.text('Map ' + level);
      if (state === 'locked') {
        $card.append(' <span class="map-card-lock">🔒</span>');
        $card.on('click', function (e) { e.preventDefault(); });
      } else {
        $card.on('click', function (e) {
          e.preventDefault();
          selectMap(parseInt($(this).data('level'), 10));
        });
      }
      $container.append($card);
    }
  }

  $(document).ready(function () {
    renderMapCards();
  });
})();
