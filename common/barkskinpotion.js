
class BarkSkinPotion extends Effect{
    constructor(turns) {
        super("BarkSkinPotion", turns);
    }
    
    applySpecific(creature){
        creature.defence = creature.defence + (creature.baseDefence * 0.5);
        creature.rangedDefence = creature.rangedDefence + (creature.baseRangedDefence * 0.5);
        creature.applyEffect(this);
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    removeSpecific(creature){
        creature.defence = creature.defence - (creature.baseDefence * 0.5);
        creature.rangedDefence = creature.rangedDefence - (creature.baseRangedDefence * 0.5);
        return true;
    }
}

window.module = window.module || {};
module.exports = BarkSkinPotion;
