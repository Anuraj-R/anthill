/**
 * @jest-environment jsdom
 */

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

test('Creating various Creature objects succeed', () => {
    var i = 0
    //name, 			attack, 	defence, 			moves, 			type, 		initiative, 	range, 			rangedDefence, 	maxHealth
    var unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);
    expect(unit.name).toMatch(/DebutAnt/);

    i = 1
    unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);
    expect(unit.name).toMatch(/KidSlinger/);

    i = 4
    unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);
    expect(unit.name).toMatch(/Spidlings/);
  });


  test('throws NoSuchCreature on creating an invalid creature', () => {
    function CreateInvalidCreature() {
      var i = 0;
      expect(new Creature("NoSuchCreature", Creatures[i][1], Creatures[i][2],
      Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10],
      Creatures[i][11])).toThrow();
    }
    expect(CreateInvalidCreature).toThrow();
  });

  test('teamColor() returns approproiate color', () => {
    var i = 0
    var unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4],
      Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);

    unit.team = 1;
    expect(unit.teamColor()).toMatch(/#0000ff/);
    unit.team = 2;
    expect(unit.teamColor()).toMatch(/#ff0000/);
  });
