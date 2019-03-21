

function combatGeneric(attacker, defender){
    
    tlog( attacker.name + " Vs "+defender.name);
    if (attacker.type == "infantry") combatMelee(attacker, defender);
    if (attacker.type == "ranged") combatMelee(attacker, defender);
}

function combatMelee(attacker, defender){
    
    tlog( attacker.name + " Vs "+defender.name);
    animateNewObject( attacker.position, defender.position, 400, 'common/images/melee.png');
    playAudio('common/audio/anthill_melee.wav');
    
    var impact = attacker.attack * (0.5 + 0.5 * (attacker.health/attacker.maxHealth)) * (1 - (defender.defence/1000));

        if (impact < defender.health){
            defender.health -= impact;
            defender.refreshGraphics();
        }
        else
        {
            defender.health = 0;
            defender.refreshGraphics();
            defender.die();
            var winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                tlog("Team "+winner+" has won");
            }
        }
}

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




/*
 * 
 * 
 * 
 * function combatAttack(boxName){
    
    //Get the unit name from the selection
    prevSq = document.getElementById("selectedBox").innerHTML;
    uname = getUnitName(prevSq);
    
    dist = parseFloat(distance (prevSq , boxName));
    range = parseFloat(getUnitRange(uname));
    
    if (range < 2){ //melee unit, melee attack
        //alert ("melee attack");
        meleeAttackAnimation(prevSq , boxName);
        
        attack = parseFloat(getUnitAttack(uname));
        health = parseFloat(getUnitHealth(uname));
        maxHealth = parseFloat(getUnitMaxHealth(uname));
        
        defense = parseFloat(getUnitDefense(boxName));
        impact = parseFloat(attack* ((health+maxHealth)/(maxHealth+maxHealth)) * ((100-defense)/100));
        defHealth = parseFloat(getUnitHealth(boxName));
        
        if (impact < defHealth){
            defHealth -= impact;
            setUnitHealth(boxName, defHealth);
            healthBar(getUnitName(boxName));
        }
        else
        {
            defHealth = 0;
            //code for destroying the unit
            setUnitHealth(boxName, defHealth);
            healthBar(getUnitName(boxName));
            
            combatKill(boxName);
            
            //check if won
            winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                if (LOGGING > 0){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"</br>"+"Team "+winner+" has won";
                    document.getElementById("logsheet").innerHTML=log;
                }
            }
        }
    }
    else{//ranged attack
    
        rangedAttackAnimation(prevSq , boxName);
        
        attack = parseFloat(getUnitAttack(uname));
        health = parseFloat(getUnitHealth(uname));
        maxHealth = parseFloat(getUnitMaxHealth(uname));
        
        defense = parseFloat(getUnitRangedDefense(boxName));
        impact = parseFloat(attack* ((health+maxHealth)/(maxHealth+maxHealth)) * ((100-defense)/100));
        defHealth = parseFloat(getUnitHealth(boxName));
        
        if (impact < defHealth){
            defHealth -= impact;
            setUnitHealth(boxName, defHealth);
            healthBar(getUnitName(boxName));
        }
        else
        {
            defHealth = 0;
            //code for destroying the unit
            setUnitHealth(boxName, defHealth);
            healthBar(getUnitName(boxName));
            
            combatKill(boxName);
            
            //check if won
            winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                if (LOGGING > 0){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"</br>"+"Team "+winner+" has won";
                    document.getElementById("logsheet").innerHTML=log;
                }
            }
        }
    }
}
 * */



