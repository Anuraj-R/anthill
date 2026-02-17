/**
 * Map Selection Page
 * Fantasy map with rice-grain markers along a winding path.
 */
(function () {
  'use strict';

  var MAP_LEVEL_MAX = 20;
  var MAPS_TO_UNLOCK = 3;

  var LEVEL_NAMES = [
    'The Starting Grove', 'First Tunnel', 'Mossy Hollow', 'Creek Crossing',
    'Grain Storage', 'Nursery Chambers', 'Stone Clearing', 'Bog Crossing',
    'Forest Floor', 'Mountain Pass', 'Twilight Ridge', "Queen's Approach",
    'The Deep Chamber', "Spider's Web", 'Ancient Mound', 'Hidden Vale',
    'Frosted Glen', 'The Summit', 'Final Nest', 'Crown of the Hill'
  ];

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

  function getPathPoints() {
    var path = document.querySelector('.route-path');
    if (!path) return [];
    var len = path.getTotalLength();
    var points = [];
    var delta = 2;
    for (var i = 0; i < MAP_LEVEL_MAX; i++) {
      var t = (i + 0.5) / MAP_LEVEL_MAX;
      var pt = path.getPointAtLength(t * len);
      var ptNext = path.getPointAtLength(Math.min(t * len + delta, len));
      var angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);
      points.push({ x: pt.x, y: pt.y, angle: angle * 180 / Math.PI });
    }
    return points;
  }

  function renderMapCards() {
    var highestCompleted = getHighestCompleted();
    var $container = $('#mapCards');
    $container.empty();

    var points = getPathPoints();
    var path = document.querySelector('.route-path');
    var viewBox = path ? path.closest('svg').getAttribute('viewBox') : '0 0 280 520';
    var vb = viewBox.split(' ');
    var vbWidth = parseFloat(vb[2]) || 280;
    var vbHeight = parseFloat(vb[3]) || 520;

    for (var level = 1; level <= MAP_LEVEL_MAX; level++) {
      var state = getMapState(level, highestCompleted);
      var pt = points[level - 1] || { x: 140, y: 26 * level, angle: 0 };
      var name = LEVEL_NAMES[level - 1] || 'Map ' + level;
      var $grain = $('<a href="#" class="map-grain map-grain--' + state + '" data-level="' + level + '" data-name="' + name + '" title="' + name + '"></a>');
      $grain.css({
        left: (pt.x / vbWidth * 100) + '%',
        top: (pt.y / vbHeight * 100) + '%',
        '--grain-angle': pt.angle + 'deg',
        transform: 'translate(-50%, -50%) rotate(' + pt.angle + 'deg)'
      });
      if (state === 'locked') {
        $grain.on('click', function (e) { e.preventDefault(); });
      } else {
        $grain.on('click', function (e) {
          e.preventDefault();
          selectMap(parseInt($(this).data('level'), 10));
        });
      }
      $container.append($grain);
    }
  }

  function initTooltip() {
    var $tooltip = $('#mapTooltip');
    $('.map-grain').on('mouseenter', function () {
      var $g = $(this);
      var name = $g.data('name');
      var rect = this.getBoundingClientRect();
      $tooltip.text(name).css({
        left: rect.left + rect.width / 2,
        top: rect.top - 4,
        opacity: 1
      });
    }).on('mouseleave', function () {
      $tooltip.css('opacity', 0);
    });
  }

  $(document).ready(function () {
    renderMapCards();
    initTooltip();
  });
})();
