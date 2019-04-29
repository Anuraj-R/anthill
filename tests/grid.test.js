/**
 * @jest-environment jsdom
 */

window.$ = require('../common/jquery-2.1.4');
//window.$ = require('../common/perlin');

import Creature from '../common/creature';
import Grid from '../common/grid';

test('Creating a grid succeeds', () => {

    var container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var mapLevel = 4;
    var grid = new Grid(8, 12, "testgrid", mapLevel);
    //Grid has movable tiles
    expect(grid.getHtml()).toMatch(/selectForMove/);

    //perlin.js gives error on
    //var module = global.noise = {};
    //need to rectify this to enable the below test

    //Grid has some tiles painted with terrains
    //$("#container").append(grid.getHtml());
    //grid.paint();
    //expect(grid.getHtml()).toMatch(/images/);
    //expect(grid.getHtml()).toMatch(/terrains/);


  });


