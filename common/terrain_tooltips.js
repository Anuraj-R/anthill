/**
 * Terrain tooltips - show terrain type and defensive/offensive info on hover (1 second delay)
 */
/* global $, GRIDNAME */

(function () {
  'use strict';

  var TERRAIN_INFO = {
    PLAINStile: {
      name: 'Plains',
      text: 'Open terrain. No special bonuses.'
    },
    WOODStile: {
      name: 'Forest',
      text: 'Forest cover. +60% ranged defence. 50% melee vulnerability.'
    },
    HEIGHTStile: {
      name: 'Mountain',
      text: 'Mountain. +2 range to ranged units.'
    },
    BOGtile: {
      name: 'Bog',
      text: 'Swamp. Difficult terrain.'
    },
    HIDDENtile: {
      name: 'Hidden',
      text: 'Hidden terrain.'
    },
    impassable: {
      name: 'Impassable',
      text: 'Impassable'
    }
  };

  var hoverTimer = null;
  var tooltipEl = null;

  function getTerrainForTile($tile) {
    var classes = ['PLAINStile', 'WOODStile', 'HEIGHTStile', 'BOGtile', 'HIDDENtile', 'impassable'];
    for (var i = 0; i < classes.length; i++) {
      if ($tile.hasClass(classes[i])) {
        return TERRAIN_INFO[classes[i]];
      }
    }
    return TERRAIN_INFO.PLAINStile;
  }

  function ensureTooltipEl() {
    if (!tooltipEl) {
      tooltipEl = $('<div id="terrainTooltip"></div>');
      tooltipEl.hide().appendTo('#container');
    }
    return tooltipEl;
  }

  function showTooltip($tile, info) {
    var $tt = ensureTooltipEl();
    $tt.html('<strong>' + info.name + '</strong><br>' + info.text);
    $tt.show();

    var pos = $tile.position();
    var tileW = $tile.outerWidth();
    var tileH = $tile.outerHeight();
    $tt.css({
      position: 'absolute',
      left: pos.left,
      top: pos.top - $tt.outerHeight() - 4,
      'z-index': 200
    });
    var ttLeft = pos.left;
    if (ttLeft + $tt.outerWidth() > $('#container').width()) {
      ttLeft = pos.left + tileW - $tt.outerWidth();
    }
    if (ttLeft < 0) ttLeft = 0;
    $tt.css('left', ttLeft);
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.hide();
  }

  function setupTerrainTooltips() {
    var delay = 1000;
    $(document).off('mouseenter.terrainTooltip mouseleave.terrainTooltip', '.mapTile');

    $(document).on('mouseenter.terrainTooltip', '.mapTile', function () {
      var $tile = $(this);
      hoverTimer = setTimeout(function () {
        var info = getTerrainForTile($tile);
        showTooltip($tile, info);
      }, delay);
    });

    $(document).on('mouseleave.terrainTooltip', '.mapTile', function () {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      hideTooltip();
    });
  }

  window.setupTerrainTooltips = setupTerrainTooltips;
})();
