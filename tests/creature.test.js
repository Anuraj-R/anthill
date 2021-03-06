
/**
 * @jest-environment jsdom
 */
//require('../common/effect');/////////////////////////////////// NOT WORKING
import Creature from '../common/creature';
//import Effect from '../common/effect';/////////////////////////////////// NOT WORKING
//import StrengthPotion from '../common/strengthpotion';/////////////////////////////////// NOT WORKING
//import Combat from '../common/combat';/////////////////////////////////// NOT WORKING

/* eslint-disable no-console */

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


test('Setting health works as expected', () => {
  var unit = Creature.create("DebutAnt");
  unit.team = 1;

  unit.setHealthToNumber(unit.maxHealth - 5);
  expect(unit.health).toBe(unit.maxHealth - 5);

  unit.setHealthToNumber(unit.maxHealth + 5);
  expect(unit.health).toBe(unit.maxHealth);

  //mock the die & refreshGraphics methods before setting health below 0
  unit.die = function(){this.mockDead = true;};
  unit.refreshGraphics = function(){this.mockGraphicsRefreshed = true;};
  unit.setHealth(-15);
  expect(unit.health).toBe(0);
  expect(unit.mockDead).toBeTruthy();
  expect(unit.mockGraphicsRefreshed).toBeTruthy();

});

test('Logging', () => {
  global.LOGGINGSCOPE = "TEST";
  var unit = Creature.create("DebutAnt");

  var consoleBackup = console.log;
  console.log = function(x){this.logPut=x};

  unit.log("logtest")
  expect(console.logPut).toBe(undefined);

  global.LOGGINGSCOPE = "CREATURE";
  //test that a string is output
  unit.log("logtest")
  expect(console.logPut).toMatch(/logtest/);

  //test that objects are output as is
  unit.log(unit)
  expect(console.logPut).toBe(unit);

  console.log = consoleBackup;

});

/*
test('Combat works as expected', () => {
  var attacker = Creature.create("DebutAnt");
  attacker.team = 1;

  var defender = Creature.create("GreySpider");
  defender.team = 2;

  expect(defender.health).toBe(defender.maxHealth);
  attacker.combat(defender);
  expect(defender.health).toBeNot(defender.maxHealth);

  //unit.setHealth(0);
  //expect(unit.health).toBe(0);

  unit.team = 2;
  expect(unit.teamColor()).toMatch(/#ff0000/);
});
*/

/*
//some issues with importing effect
//If I add import statements in other javascript files, they would start throwing
//errors with the browser.
//I need to find a way to handle both together before i can enable 
//tests for the newly added effect classes.

test('Effects are applied to a creature correctly', () => {
  var unit = Creature.create("DebutAnt");
  expect(unit.attack).toBe(unit.baseAttack);
  expect((new StrengthPotion(3)).applyEffect(unit)).toBeTruthy();
});
*/
