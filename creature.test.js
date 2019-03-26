/**
 * @jest-environment jsdom
 */

import Creature from './common/creature';

test('Creating various Creature objects succeed', () => {

    var unit = Creature.create("DebutAnt")
    expect(unit.name).toMatch(/DebutAnt/);
    unit = Creature.create("KidSlinger")
    expect(unit.name).toMatch(/KidSlinger/);
    unit = Creature.create("Spidlings")
    expect(unit.name).toMatch(/Spidlings/);
  });

  test('throws NoSuchCreature on creating an invalid creature', () => {
    function CreateInvalidCreature() {
      expect(new Creature.create("NoSuchCreature")).toThrow();
    }
    expect(CreateInvalidCreature).toThrow();
  });

  test('teamColor() returns approproiate color', () => {
    var unit = Creature.create("DebutAnt");
    unit.team = 1;
    expect(unit.teamColor()).toMatch(/#0000ff/);
    unit.team = 2;
    expect(unit.teamColor()).toMatch(/#ff0000/);
  });
