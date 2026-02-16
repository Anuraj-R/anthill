/**
 * Ant Hill - Map/Game Page
 * Initializes the battleground, grid, units, and UI.
 */
/* global $, BLOCKSIZE, MAPLEVEL, MAPLEVELMAX, MAPLEVEL, GRIDNAME, SEQUENCE,
   localStorageGetOrSetVar, InitAudio, loadInventory, showStartMessage,
   OrderBox, Grid, placeUnitsOnGrid, ORDERBOX, GRID */

(function () {
  'use strict';

  // Game constants (exposed globally for other modules)
  window.HEIGHT = 13;
  window.WIDTH = 8;
  window.RULE = 0;
  window.BLOCKSIZE = 31;
  window.SLECTEDBOX = '';
  window.NEXTINDEX = -1;
  window.ANTHILL_MUSIC = 'OFF';
  window.LOGLEVEL = 1;
  window.LOGGINGSCOPE = 'MAP INVENTORY SETTINGS';
  window.ORDERBOX = null;
  window.GRID = null;

  function loadMapLevelFromLocalStorage() {
    window.MAPLEVEL = localStorageGetOrSetVar('MAPLEVEL', 3);
    window.MAPLEVELMAX = localStorageGetOrSetVar('MAPLEVELMAX', 20);
    window.GRIDNAME = `container${window.MAPLEVEL}`;
  }

  function addDropDownForLevels() {
    $('#container').append(createDropDown());
  }

  function createDropDown() {
    const max = window.MAPLEVELMAX;
    let items = '';
    for (let i = 1; i <= max; i++) {
      items += `<li onclick="selectLevel(${i})"><a href="#">Level ${i}</a></li>`;
    }
    return `
      <div class="dropdown" id="mapList">
        <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
          Level ${window.MAPLEVEL} <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" id="dropdownList">${items}</ul>
      </div>
    `;
  }

  window.selectLevel = function (i) {
    localStorage.setItem('MAPLEVEL', i);
    location.reload();
  };

  function createGridAndAddToContainer() {
    const grid = new Grid(window.WIDTH, window.HEIGHT, window.GRIDNAME, window.MAPLEVEL);
    $('#container').append(grid.getHtml());
    grid.paint();
    window.GRID = grid;
    return grid;
  }

  function addMapAndInventoryButtons() {
    const blockSize = window.BLOCKSIZE;
    const size = blockSize * 1.4;

    $('#container').append(
      `<button id="${window.GRIDNAME}mapbutton" class="menuButton" onclick="showMenu()"></button>`
    );
    $(`#${window.GRIDNAME}mapbutton`).css({ width: size, height: size });

    $('#container').append(
      `<button id="${window.GRIDNAME}inventorybutton" class="inventorybutton" onclick="showInventory()"></button>`
    );
    $(`#${window.GRIDNAME}inventorybutton`).css({
      width: size,
      height: size,
      'margin-left': size
    });
  }

  window.showHelp = function () {
    window.location = 'common/help.html';
  };

  function populateTheUIContainer() {
    addDropDownForLevels();
    addMapAndInventoryButtons();

    const orderBox = new OrderBox(window.GRIDNAME, window.BLOCKSIZE);
    orderBox.addToContainer('container');

    const grid = createGridAndAddToContainer();
    placeUnitsOnGrid(grid);

    orderBox.fillOrderBox(window.SEQUENCE);
    orderBox.progress();
    window.ORDERBOX = orderBox;

    showStartMessage();
  }

  function loadFunc() {
    loadMapLevelFromLocalStorage();
    InitAudio();
    loadInventory();
    populateTheUIContainer();
  }

  $(document).ready(loadFunc);
})();
