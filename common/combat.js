
class Combat {
    constructor(attacker, defender) {
        this.attacker = attacker;
        this.defender = defender;
    }

    start(){
        console.log( this.attacker.name + " Vs "+this.defender.name);
        if (this.attacker.type == "infantry") this.combatMelee();
        if (this.attacker.type == "ranged") this.combatRanged();
        this.defender.refreshGraphics();
    }

    combatMelee(){
        var animationObject = 'common/images/melee.png';
        var audioObject = 'common/audio/anthill_melee.wav';
        var defenceCoefficient = 1 - (this.defender.defence/100);

        this.doCombat(animationObject, audioObject, defenceCoefficient);
    }

    combatRanged(){
        var animationObject = 'common/images/ranged.png';
        var audioObject = 'common/audio/anthill_ranged.wav';
        var defenceCoefficient = 1 - (this.defender.rangedDefence/100);

        this.doCombat(animationObject, audioObject, defenceCoefficient);
    }

    doCombat(animationObject, audioObject, defenceCoefficient){
        animateNewObject( this.attacker.position, this.defender.position, 400, animationObject);
        playAudio(audioObject);

        var impact = this.attacker.attack * (0.5 + 0.5 * (this.attacker.health/this.attacker.maxHealth)) * defenceCoefficient;

        if (impact < this.defender.health){
            this.defender.health -= impact;
            //defender.refreshGraphics();
        }
        else
        {
            this.defender.health = 0;
            //this.defender.refreshGraphics();
            this.defender.die();
            var winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                console.log("Team "+winner+" has won");
            }
        }
    }



}

window.module = window.module || {};
module.exports = Combat;



function checkIfWon(){
    
    var totalUnits = SEQUENCE.length;
    var playerUnits = 0;
    var AIUnits = 0;

    for (var i=0;i<SEQUENCE.length;i++){
        if ( SEQUENCE[i].team == 1 ){
            playerUnits++;
        }
        else{
            AIUnits++;
        }
    }
    
    if (totalUnits == playerUnits){
        doWinStuff();
        showWinMessage();
        return 1;
    }
    else if (totalUnits == AIUnits){
        showFailMessage();
        return 2;
    }
    return 0;
}

function doWinStuff(){
    
    //Update the highest level of map won
    if (localStorage["winlevel"] == null || (localStorage["winlevel"] < MAPLEVEL)){
        localStorage["winlevel"] = MAPLEVEL;
    }
    
    //save the player inventory
    saveInventory();
}
