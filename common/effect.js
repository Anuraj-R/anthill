/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */


class Effect {
    constructor(name, turns) {
        this.name = name;
        this.turns = turns;
    }

    applyEffect(creature){
        
        if(! creature.effectExists(this)){
            console.log(this.name+" effect being applied");
            return this.applySpecific(creature);
        }
        else{
            alert(this.name+" effect already exists. Skipping...");
            return false;
        }
    }

    removeEffect(creature){
        if(creature.effectExists(this)){
            console.log(this.name+" effect being removed");
            return this.removeSpecific(creature);
        }
        else{
            console.log(this.name+" effect does not exist. Skipping...");
            return false;
        }
        
    }

    applySpecific(creature){}

    removeSpecific(creature){}

    updateTurns(creature, changeInTurns){
        this.turns = this.turns + changeInTurns;
        if (this.turns <= 0) this.removeEffect(creature);
    }
}

window.module = window.module || {};
module.exports = Effect;
