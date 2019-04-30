
class StrengthPotion extends Effect{
    constructor(turns) {
        super("StrengthPotion", turns);
    }
    
    applySpecific(creature){
        creature.attack = creature.attack + (creature.baseAttack * 0.5);
        creature.applyEffect(this);
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    removeSpecific(creature){
        creature.attack = creature.attack - (creature.baseAttack * 0.5);
        return true;
    }
}

window.module = window.module || {};
module.exports = StrengthPotion;
