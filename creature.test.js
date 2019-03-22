


/**
 * @jest-environment jsdom
 */

 /*
test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});
*/

const creature = require('./common/creature');
import Creature from './common/creature';

var Creatures = [
    //0                1        2        3          4      5       6      7             8           9       10              11
    //name             attack,  defence, Location, moves, Health, Team, unit_type,  initiative, range, rangedDefence, maxHealth
    ["DebutAnt",       50,      40,      "-1x-1",   3.0,   120,    0,    "infantry",   99,         1.5,    20,             120 ],
    ["KidSlinger",     20,      -40,     "-1x-1",   1.5,   80,     0,    "ranged",     97,         2.24,   0,              80  ],
    ["WarrAnt",        35,      15,      "-1x-1",   4.5,   100,    0,    "infantry",   90,         1.5,    20,             100 ],
    ["FormicArcher",   45,      -30,     "-1x-1",   2.0,   80,     0,    "ranged",     98,         3.4,    20,             80  ],
    ["Spidlings",      20,      0,       "-1x-1",   2.0,   40,     0,    "ranged",     50,         2.0,    5,              40  ],
    ["Spider",         35,      5,       "-1x-1",   2.0,   70,     0,    "infantry",   40,         1.5,    30,             70  ],
    ["GreySpider",     45,      40,      "-1x-1",   3.0,   100,    0,    "infantry",   30,         1.5,    5,              100 ],
    ["MutAnt",         35,      0,       "-1x-1",   3.5,   90,     0,    "infantry",   90,         1.5,    0,              90  ],
    ["BlackWidow",     40,      40,      "-1x-1",   4.0,   140,    0,    "infantry",   30,         1.5,    20,             140 ],
    ["RedTailSpider",  40,      -15,     "-1x-1",   2.5,   80,     0,    "ranged",     30,         2.4,    10,             80  ],
    ["BogTroll",       150,     70,      "-1x-1",   2.0,   140,    0,    "infantry",   10,         1.5,    -30,            140 ],
    ["SpiderQueen",    120,     40,      "-1x-1",   3.5,   400,    0,    "ranged",     30,         2.2,    30,             400 ]
    ];

test('Creating a class Creature succeeds', () => {
    var i = 1
    //name, 			attack, 	defence, 			moves, 			type, 		initiative, 	range, 			rangedDefence, 	maxHealth
    var unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);
    expect(unit.name).toMatch(/KidSlinger/);
  });

