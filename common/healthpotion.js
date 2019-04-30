class HealthPotion extends Effect{
    constructor(healAmount) {
        super("HealthPotion", 0);
        this.healAmount = healAmount;
    }
    
    applySpecific(creature){
        if (creature.health == creature.maxHealth){
            alert("Creature already at maximum health");
            return false;
        }
        else{
            creature.setHealth(creature.health + this.healAmount);
            return true;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    removeSpecific(){}
}

window.module = window.module || {};
module.exports = HealthPotion;