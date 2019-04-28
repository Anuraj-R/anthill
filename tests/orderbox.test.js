/**
 * @jest-environment jsdom
 */

window.$ = require('../common/jquery-2.1.4');

import Creature from '../common/creature';
import OrderBox from '../common/orderbox';

test('Creating the orderbox succeed', () => {

    var BLOCKSIZE = 31;
    var GRIDNAME="container"+1;

    var container = document.createElement('div');
    var gridPlacer = document.createElement('div');
    container.id = "container";
    gridPlacer.id = GRIDNAME+"orderList";
    document.body.appendChild(container);
    document.body.appendChild(gridPlacer);
    
    var SEQUENCE = [];
    SEQUENCE.push(Creature.create("DebutAnt"));
    SEQUENCE.push(Creature.create("KidSlinger"));
    SEQUENCE.push(Creature.create("Spidlings"));

    var orderBox = new OrderBox(GRIDNAME, BLOCKSIZE);
    orderBox.addToContainer("container");
    orderBox.fillOrderBox(SEQUENCE);

    expect($(orderBox.get(0)).prop("src")).toMatch(/DebutAnt/);
    expect($(orderBox.get(0)).css("height")).toMatch(/31px/);

    //First call to progress only changes the size of the first element
    orderBox.progress();
    expect($(orderBox.get(0)).prop("src")).toMatch(/DebutAnt/);
    expect($(orderBox.get(0)).css("height")).toMatch(/37px/);

    //Subsequent calls move the first elemt to the last.
    //However, the movement occurs with an animation and has a delay.
    //Only change in size is being tested here, to avoid waiting for the animations.
    //The below 'expect' calls gets executed before the first element is moved to the end.    
    orderBox.progress();
    expect($(orderBox.get(0)).prop("src")).toMatch(/DebutAnt/);
    expect($(orderBox.get(0)).css("height")).toMatch(/31px/);
    expect($(orderBox.get(1)).css("height")).toMatch(/37px/);

  });


