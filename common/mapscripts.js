

var SHOWINDEX = 0;

function addEffects(unit, effect, turns){
	//check if the effect exists on the unit (1__DebutAnt_effects)
	var eff = $('#'+unit+'_effects').val();
	
	if(eff.indexOf(effect) != -1){
    	console.log("Effect "+effect+" already exists for "+unit+".");
    	//Exit for now. Later, if decided to do it that way, the turns could be reset.
    	
    	return 1;
    	
    	//var idx1 = eff.indexOf(effect);
    	//var str = eff.substr(idx1);
   
   		//get the remaining turns
    	//var turns = str.match(/[0-9]*/);
    	//turn = turns[0];
    	
	}
	else{
		//add if doesnt exist
		eff = eff+" "+effect+"_"+turns;
		$('#'+unit+'_effects').val(eff);
		console.log("Effect "+effect+" set for "+unit);
		
		return 0;
	}
}

function addGraphics(){

    //alert("in addgraphics");
    //set up the selection sequence boxes
    
    if (LOGGING > 4){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>Inside addGraphics";
        document.getElementById("logsheet").innerHTML=log;
    }
    
    setupOrderBox();
    
    var xNum = document.getElementById("xxNum").value;
    var yNum = document.getElementById("yyNum").value;
    
    if (LOGGING > 4){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>xxNum and yyNum are "+xNum+" and "+yNum;
        document.getElementById("logsheet").innerHTML=log;
    }
    
    var i=0;
    var    j=0;
    for (j=1;j<=xNum;j++)
    {
        for (i=1;i<=yNum;i++)
    	{
            if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>iteration at "+j+"x"+i;
                    document.getElementById("logsheet").innerHTML=log;
            }
            var unit = document.getElementById(j+"x"+i+"station").value;
            if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>unit at "+j+"x"+i+" is "+unit;
                    document.getElementById("logsheet").innerHTML=log;
            }
                        
            if ( unit != "none" )
            {
                //alert("unit found ");
                
                if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>unit found  "+unit+" at "+j+"x"+i;
                    document.getElementById("logsheet").innerHTML=log;
                }
                
                // Fill up with the unit's division
                document.getElementById(j+"x"+i+"display").innerHTML = document.getElementById ("unit_"+unit).innerHTML;
                
                //Empty the unit_ div to avoid duplicate elements with same id
                document.getElementById ("unit_"+unit).innerHTML = "";
                
                //update its location - used as a connecting handle for actions based on coordinates
                document.getElementById(unit).getElementsByTagName("input")[3].value = j+"x"+i;
                
                healthBar(unit);
            }
	    }
    }
    
    //Add the pictures
    for (i=0; i<SEQUENCE.length; i++)
    {
        uname=getArmyId(SEQUENCE[i]);
        var position = $("#"+uname).position();
        $("#"+uname+"Pic").offset({left:position.left,top:position.top});
    }
    
    addBonusGraphics();
}

function addBonusGraphics(){
    if (LOGGING > 4){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>Inside addBonusGraphics";
        document.getElementById("logsheet").innerHTML=log;
    }
    
    var xNum = document.getElementById("xxNum").value;
    var yNum = document.getElementById("yyNum").value;
    var i=0;
    var j=0;
    for (j=1;j<=xNum;j++)
    {
		for (i=1;i<=yNum;i++)
		{
            if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>addBonusGraphics iteration at "+j+"x"+i;
                    document.getElementById("logsheet").innerHTML=log;
            }
            var bonus = document.getElementById(j+"x"+i+"bonus").value;
            if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>bonus at "+j+"x"+i+" is "+bonus;
                    document.getElementById("logsheet").innerHTML=log;
            }
                        
            if ( bonus != "0" )
            {
                
                if (LOGGING > 4){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>bonus found  "+bonus+" at "+j+"x"+i;
                    document.getElementById("logsheet").innerHTML=log;
                }
                
                var position = $("#"+j+"x"+i).position();
                $("#"+bonus+"Pic").offset({left:position.left,top:position.top});
            }
	    }
    }
}

function applyBonus(uname, bonus){
    if (LOGGING > 3){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>applying bonus "+bonus+" on "+uname;
        document.getElementById("logsheet").innerHTML=log;
    }
    var bonusEffect=document.getElementById(bonus).getElementsByTagName("input")[1].value;
    if (LOGGING > 3){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>Bonus Effect is "+bonusEffect;
        document.getElementById("logsheet").innerHTML=log;
    }
    if (bonusEffect === "HEAL" ){ //Heal Fully!
        setUnitHealth(uname , getUnitMaxHealth(uname) );
        healthBar(uname);
        
        /*document.getElementById(boxName+"display").style.backgroundImage = "url(\"\")";*/
        //remove bonus and its animation                    
        
        var boxName=getLocation(uname);
        if (LOGGING > 3){
            var log = document.getElementById("logsheet").innerHTML;
            log = log+"<br>Removing bonus "+bonus+" from "+boxName;
            document.getElementById("logsheet").innerHTML=log;
        }
        document.getElementById(boxName+"bonus").value = 0;
        $("#"+bonus+"Pic").fadeOut(300);
        //$("#3x4bonusPic").fadeOut(600);
        
        $("#"+uname+"Pic").animate({opacity:'0.4'}, 200);
        $("#"+uname+"Pic").animate({opacity:'1.0'}, 200);
    }
}

function applyEffectsOnAttack(val, effects){
	var finVal = val;
	if(effects.indexOf("strengthPotion") != -1){
		finVal = parseInt(val*1.3);
	}

	return finVal;
}

function applyEffectsOnDefence(val, effects){
	var finVal = val;
	if(effects.indexOf("barkSkinPotion") != -1){
		finVal = parseInt(val+30);
	}

	return finVal;
}

function applyEffectsOnRangedDefence(val, effects){
	var finVal = val;
	if(effects.indexOf("barkSkinPotion") != -1){
		finVal = parseInt(val+30);
	}

	return finVal;
}

function checkIfWon(){

    team=getUnitTeam(SEQUENCE[0]);
    for (i=0;i<SEQUENCE.length;i++){
        if ( team != getUnitTeam(SEQUENCE[i])){
            team=0;
        }
    }
    
    
    if (team == 1){
    	doWinStuff();
        showWinMessage();
    }
    else if (team != 0){
        showFailMessage(); //neither 1 nor 0; must be an AI team
    }
    return team;
}

function doWinStuff(){
	
	var pathname = window.location.pathname;
	
	//get only the folder name before /index.html
	var pos1 = pathname.lastIndexOf("/");
	pathname=pathname.substr(0, pos1);
	var pos2 = pathname.lastIndexOf("/");
	pathname=pathname.substr(pos2+1, pos1);
	
	
	if (localStorage[pathname]) {
    	//do nothing; this map was already won
	} else {
		//mark the map as won
	    localStorage[pathname] = '1';
	    
	    //increase the wincount by 1
	    if (localStorage.wincount) {
	    localStorage.wincount = Number(localStorage.wincount) + 1;
		} else {
			//something wrong if wincount is not present. probably first map
			//initialize to 1 if value not present
		    localStorage.wincount = 1;
		    
		    //then increase by 1
		    localStorage.wincount = Number(localStorage.wincount) + 1;		    
		}
	}
	
	
	//save the player inventory
	saveInventory();
}

function combat(boxName){
    //Get the unit name from the selection
    prevSq = document.getElementById("selectedBox").innerHTML;
    uname = getArmyId(prevSq);
    
    dist = parseFloat(distance (prevSq , boxName));
    range = parseFloat(getUnitRange(uname));
    
    team1=getUnitTeam(uname);
    team2=getUnitTeam(boxName);
    if (team1 != team2){
        combatAttack(boxName);
    }
}

function combatAttack(boxName){
    
    //Get the unit name from the selection
    prevSq = document.getElementById("selectedBox").innerHTML;
    uname = getArmyId(prevSq);
    
    dist = parseFloat(distance (prevSq , boxName));
    range = parseFloat(getUnitRange(uname));
    
    if (range < 2){ //melee unit, melee attack
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
            healthBar(getArmyId(boxName));
        }
        else
        {
            defHealth = 0;
            //code for destroying the unit
            setUnitHealth(boxName, defHealth);
            healthBar(getArmyId(boxName));
            
            combatKill(boxName);
            
            //check if won
            winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                if (LOGGING > 0){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>"+"Team "+winner+" has won";
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
            healthBar(getArmyId(boxName));
        }
        else
        {
            defHealth = 0;
            //code for destroying the unit
            setUnitHealth(boxName, defHealth);
            healthBar(getArmyId(boxName));
            
            combatKill(boxName);
            
            //check if won
            winner=checkIfWon();
            if ( winner != 0){
                GAMEOVER=1;
                if (LOGGING > 0){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>"+"Team "+winner+" has won";
                    document.getElementById("logsheet").innerHTML=log;
                }
            }
        }
    }
}

function combatKill(boxName){
    
    
    //get the unit name that got destroyed
    var uname = getUnitNameFromBox(boxName);
    
    //get the unit team that got destroyed
    var uteam = getUnitTeam(uname).trim();
  
    $("#"+uname+"Pic").fadeOut(600);
    document.getElementById(boxName+"station").value = "none";
    
    //drop items if it is an enemy unit that got killed
    if (uteam != "1"){
    	//drop Items based on DROPCHANCE
    	dropItems(boxName);
    }
    
    //remove the unit from SEQUENCE
    index = SEQUENCE.indexOf(uname);
    SEQUENCE.splice(index,1);
    
    //remove the unit from the orderBox    
    //id orderBox+uname
    $("#orderBox"+uname).remove();
    
    //If the dead unit's index is less than NEXTINDEX, reduce NEXTINDEX by 1
    //so that the very next unit in turn is not skipped
    if (index < NEXTINDEX){
        NEXTINDEX -= 1;
    }
    
    
}



function dropItems(boxName){
	console.log("Inside DropItems");;
	for (var i=1; i<DROPCHANCE.length; i++){
		var x = parseInt(100*Math.random());
		
		//get enemy unit numbers.
		var eNum = 0;
		for ( var j=0; j<SEQUENCE.length ;  j++){
			if ( getUnitTeam(SEQUENCE[j]).trim() != "1" ){
				eNum++;
			}
		}
		
		console.log(eNum+ " enemies detected");
		console.log("dropchance is "+ DROPCHANCE[i]/eNum );
		console.log("random dice value is "+ x );
		
		if (eNum != 0){
			if (x <= DROPCHANCE[i]/eNum){
				dropItem(i, boxName);
			}
		}
	}
}

function dropItem(i, boxName){
	console.log("dropping item "+i);
	//increase the count in inventory and save the inventory
	INVENTORY[i] += 1;
	saveInventory();
	
	animateDrop(i, boxName);
}

function animateDrop(i, boxName){
	
	console.log("animate dropping item "+i);
	
	var oImg=document.createElement("img");
	oImg.setAttribute('id', 'droppy');
	oImg.setAttribute('alt', 'na');
	oImg.setAttribute('height', '30px');
	oImg.setAttribute('width', '30px');
	oImg.style.position="absolute";
	
	document.body.appendChild(oImg);
	
	switch ( i ){
		case 1:
			oImg.setAttribute('src', '../../common/images/healthPotion.png');
			break;
		case 2:
			oImg.setAttribute('src', '../../common/images/strengthPotion.png');
			break;
		case 3:
			oImg.setAttribute('src', '../../common/images/barkSkinPotion.png');
			break;
		default:
			break;
	}
	
	var strt=$("#"+boxName).position();
    var dest=$("#inventorybutton").position();
    
    //alert(strt.top+"/"+strt.left+"/"+dest.top+"/"+dest.left);
    
    $("#droppy").show();
    $("#droppy").offset({ top: strt.top , left: strt.left });
    $("#droppy").animate({
        left: dest.left + 48, 
        top: dest.top, 
        opacity:'0.5' 
        }, 800 , function() { 
        	$(this).hide(); 
        	var elem = document.getElementById('droppy');
        	document.body.removeChild(elem);
        });
    
    $("#inventorybutton").animate({opacity:'0.4'}, 400);
    $("#inventorybutton").animate({opacity:'1.0'}, 400);
}


function findClosestEnemy(boxName){
    
    pathFind (boxName, "");
    
    team1=getUnitTeam(boxName);
    position=getLocation(boxName);
    
    var closestDist=100;
    var closestEn="0x0";
    
    xNum = document.getElementById("xxNum").value;
    yNum = document.getElementById("yyNum").value;

    //see if any units are within range. return closest one within range.
    var range = getUnitRange(boxName);
    for (j=1;j<=xNum;j++)
    {
        for (i=1;i<=yNum;i++)
        {
            var testBox=j+"x"+i;
            //unit present
            if (document.getElementById(testBox+"station").value != "none"){
                //of a different team
                if ( getUnitTeam(testBox) != team1 ){
                    //and within range
                    if ( distance(testBox,boxName) <= range){
                        
                        //and closer than last unit within range
                        if ( distance(testBox,boxName) < closestDist){
                            closestDist = distance(testBox,boxName);
                            closestEn = testBox;
                            
                            if (LOGGING > 3){
                                var log = document.getElementById("logsheet").innerHTML;
                                log = log+"<br>"+boxName+" found enemy within range "+closestEn;
                                document.getElementById("logsheet").innerHTML=log;
                            }
                        }
                    }
                }
            }
    	}
	}
    
    //No units found within range. Return closest enemy.
    if (closestEn === "0x0"){
        for (var j=1;j<=xNum;j++)
        {
            for (var i=1;i<=yNum;i++)
            {
                var testBox=j+"x"+i;
                
                //unit present
                if (document.getElementById(testBox+"station").value != "none"){
                    
                    //of a different team
                    if ( getUnitTeam(testBox) != team1 ){
                        //and closer than the last unit
                        
                        var tempTile = findNeighborTile(testBox);
                        if (LOGGING > 3){
                            var log = document.getElementById("logsheet").innerHTML;
                            log = log+"<br>"+boxName+" found neighbor tile for "+testBox+" as "+tempTile+" "+DIST[tempTile]+" squares away.";
                            document.getElementById("logsheet").innerHTML=log;
                        }
                                            
                        if ( DIST[tempTile] < closestDist){
                            closestDist = DIST[tempTile];
                            closestEn = testBox;
                            
                            if (LOGGING > 3){
                                var log = document.getElementById("logsheet").innerHTML;
                                log = log+"<br>"+boxName+" found closest enemy "+closestEn;
                                document.getElementById("logsheet").innerHTML=log;
                            }
                            
                        }
                    }
                }
    		}
    	}
    }
    tlog("findClosestEnemy of "+ boxName+" Returning enemyNear "+closestEn);

    return closestEn;
}

function findClosestEnemyHidden(boxName){
    
        
    team1=getUnitTeam(boxName);
    position=getLocation(boxName);
    
    closestDist=100;
    closestEn="0x0";
    
    xNum = document.getElementById("xxNum").value;
    yNum = document.getElementById("yyNum").value;
    for (var j=1;j<=xNum;j++)
    {
        for (var i=1;i<=yNum;i++)
    	{
            testBox=j+"x"+i;
            
            //unit present
            if (document.getElementById(testBox+"station").value != "none"){
                //of a different team
                if ( getUnitTeam(testBox) != team1 ){
                    //and closer than the last unit
                    if (distance(testBox,position) < closestDist){
                        closestDist = distance(testBox,position);
                        closestEn = getLocation(testBox);
                    }
                }
            }
		}
	}
    return closestEn;
}

//return the best position to move to (closest tile to an enemy that can be moved to in this turn)
function findClosestTile(boxName){
    
    position=document.getElementById("selectedBox").innerHTML;
    closestTile=position;
    dist = parseFloat(distance(position, boxName));
    
    xNum = document.getElementById("xxNum").value;
    yNum = document.getElementById("yyNum").value;
    
    //the new approach
    //of making use of the pathfinding distance instead of the direct distance
    //difficult to implement if the enemy far away is reachable only through range
    //leave it be for now
    /*
    startSq = document.getElementById("selectedBox").innerHTML;
    endSq = boxName;
    
	tlog("pathfinding from "+startSq+" to "+endSq);
    pathFind(startSq,"");
    
    var i=0;
    tlog("PREVIOUS["+endSq+"] is "+PREVIOUS[endSq]); 
    while ( PREVIOUS[endSq] != startSq && PREVIOUS[endSq] !== "none" ){
    	tlog("PREVIOUS["+endSq+"] is "+PREVIOUS[endSq]); 
    	endSq = PREVIOUS[endSq];
    	i++;
    	if (i>30){
    		break;
    	}
    }
    
    //print out all PREVIOUS
    for (var j=1;j<=xNum;j++){
        for (var i=1;i<=yNum;i++){
            var vertex = j+"x"+i;
            tlog("PREVIOUS["+vertex+"] is "+PREVIOUS[vertex]);
    	}
	}
    */
    //ending new approach
                
    
    
    for (j=1;j<=xNum;j++)
    {
    	for (i=1;i<=yNum;i++)
		{
            testBox=j+"x"+i;
            //if movable
            if ( document.getElementById(testBox+"movable").value == 1 ){
                
                //get the direct distance
                newDist=parseFloat(distance(testBox, boxName));
                if (newDist<dist){
                    closestTile=testBox;
                    dist=newDist;
                }
            }
		}
	}
	tlog("findClosestTile to "+boxName+" returned "+closestTile);
    return closestTile;
}

function findNeighborTile(boxName){
    
    if (LOGGING > 3){
        var log = document.getElementById("logsheet").innerHTML;
        log = log+"<br>findNeighborTile to "+boxName;
        document.getElementById("logsheet").innerHTML=log;
    }
    
    dist = 999;
    var yNum = document.getElementById("xxNum").value;
    var xNum = document.getElementById("yyNum").value;
    
    var x = boxName.indexOf("x");
    var yVal = parseInt(boxName.slice(0,x));
    var xVal = parseInt(boxName.slice(x+1));
    
    var tempSq="-1x-1";
    var retSq="-1x-1";
    
    //Four side squares
    if (yVal > 1){
        tempSq=(yVal-1)+"x"+(xVal);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if (yVal < yNum){
        tempSq=(yVal+1)+"x"+(xVal);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if ( xVal > 1){
        tempSq=(yVal)+"x"+(xVal-1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if ( xVal < xNum){
        tempSq=(yVal)+"x"+(xVal+1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    
    //Four corner squares
    if (yVal > 1 && xVal > 1){
        tempSq=(yVal-1)+"x"+(xVal-1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if (yVal < yNum && xVal < xNum){
        tempSq=(yVal+1)+"x"+(xVal+1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if (yVal > 1 && xVal < xNum){
        tempSq=(yVal-1)+"x"+(xVal+1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    if (yVal < yNum && xVal > 1){
        tempSq=(yVal+1)+"x"+(xVal-1);
        if (pathExists(tempSq)){
            if (DIST[tempSq] < dist){
                dist = DIST[tempSq];
                retSq=tempSq;
            }
        }
    }
    
    return retSq;
}


function getUnitNameFromBox(boxName){

    var uname = document.getElementById(boxName).getElementsByTagName("div")[0].id;
    
    return uname;
}

function getArmyId ( armyName ){
    var aid = armyName.replace("unit_","");
    return aid;
}

function generateSequence (){
   
    var x=document.getElementsByName("armies");
    
    for (var i=0; i<x.length ; i++){
        SEQUENCE[ i ] = getArmyId(x[i].id);
    }
    
    
    //bubblesort with initiative
    var swapped=1;
    while ( swapped == 1 ){
        swapped = 0;
        for (var i=0; i<(SEQUENCE.length -1) ; i++){
            if ( parseInt(getUnitInitiative(SEQUENCE[i])) < parseInt(getUnitInitiative(SEQUENCE[i+1])) ){
                temp = SEQUENCE[i];
                SEQUENCE[i] = SEQUENCE[i+1];
                SEQUENCE[i+1] = temp;
                swapped = 1;
            }
        }
    }
    if (LOGGING > 3){
            var log = document.getElementById("logsheet").innerHTML;
            for (i=0; i<SEQUENCE.length; i++){
                log = log+"<br>"+i+" . "+SEQUENCE[i] +" "+getUnitInitiative(SEQUENCE[i]);
            }
            document.getElementById("logsheet").innerHTML=log;
        }
    return 0;
}




function meleeAttackAnimation(prevSq , boxName){
    var att=$("#"+prevSq).position();
    var def=$("#"+boxName).position();
    defName = getArmyId(boxName);
    
    $("#melee").show();
    $("#melee").offset({ top: att.top , left: att.left });
    
    
    
    $("#melee").animate({
        left: def.left , 
        top: def.top , 
        opacity:'0.5' 
        }, 400 , function() { $(this).hide(); });
    playAudio('../../common/audio/anthill_melee.wav');
    
    $("#"+defName+"Pic").animate({opacity:'0.4'}, 200);
    $("#"+defName+"Pic").animate({opacity:'1.0'}, 200);
}





function pathLight(start, end){
    
    pathFind (start , end);
    
    var pathlet = PREVIOUS[end];
    while ( pathlet !== start ){
        highlight(pathlet);
        pathlet = PREVIOUS[pathlet];
    }
    
    
}



function rangedAttackAnimation(prevSq , boxName){
    
    var att=$("#"+prevSq).position();
    var def=$("#"+boxName).position();
    defName = getArmyId(boxName);
    
    $("#bullet").show();
    $("#bullet").offset({ top: att.top , left: att.left });
    $("#bullet").animate({
        left: def.left , 
        top: def.top , 
        opacity:'0.5' 
        }, 400 , function() { $(this).hide(); });
    playAudio('../../common/audio/anthill_arrow.wav');
    $("#"+defName+"Pic").animate({opacity:'0.4'}, 200);
    $("#"+defName+"Pic").animate({opacity:'1.0'}, 200);
}



function selectForMove (boxName){ //The function does selectForAction() again if there are MOVES left after moving
    
    console.log("Executing selectForMove on "+boxName);
    
    
    //Find if square is movable
    movable = parseInt (document.getElementById(boxName+"movable").value , 10);
    
    console.log("Square "+boxName+" movable status: "+movable);
    
    //Get the unit name from the selection
    prevSq = document.getElementById("selectedBox").innerHTML;
    uname = document.getElementById(prevSq).getElementsByTagName("div")[0].id;
    
    //dist = parseFloat(distance (prevSq , boxName));
    pathFind(prevSq,"");
    dist = DIST[boxName];
    
    range = parseFloat(getUnitRange(prevSq));
    
    // dist == 0 if the player is ending the turn
    if ( dist == 0 ){
        selectNextUnit();
    }
    else
    {
        if ( movable == "1" ) // square can be moved into
        {
            // Fill up the square
            tlog("Moving "+uname+" from "+prevSq+" to "+boxName);
            
            moveInnerHTML ( prevSq+"display" , boxName+"display" );
            document.getElementById(prevSq+"display").innerHTML = "";
            document.getElementById(boxName+"station").value = uname;
            document.getElementById(prevSq+"station").value = "none";
            document.getElementById("selectedBox").innerHTML = "NONE";
            //update the unit's location
            document.getElementById(uname).getElementsByTagName("input")[3].value = boxName;
            
                        
            var pos = $("#"+uname).offset();
            $("#"+uname+"Pic").animate({left:(pos.left), top:(pos.top) });
            
            //apply the bonuses
            var bonus = document.getElementById(getLocation(uname)+"bonus").value;

            if (bonus !== "0" ){
                applyBonus(uname, bonus);
            }
            
                        
            //Update MOVES of the selected unit
            // dist always <= MOVES , since the square is marked 'movable'
            MOVES -= dist;
            
            //deselect all movable tiles
            unLightAll ( );
            
            //Select the unit again if it has MOVES left.
            if ( MOVES >= 1 ){
                selectForAction(uname);
            }// No moves left; reset MOVES
            else{
            	//TODO
            	//check if there are enemies in range
            	if ( ifEnemiesInRange(uname) === "TRUE" ){
            		tlog("Enemies found within range");
            		
            		selectForAction(uname);
            	}
            	//if no enemies in range, end turn
            	else{
            		tlog("Enemies not found within range, skipping turn");
            		MOVES="-1";
                	selectNextUnit();
            	}
            	
                
            }
        }
        else if ( movable == "3" )
        {
            
            if (LOGGING > 3){
                var log = document.getElementById("logsheet").innerHTML;
                log = log+"<br>Currently "+uname+" is about to attack "+boxName;
                document.getElementById("logsheet").innerHTML=log;
            }
            //Attackable square within range?
            if (distance(prevSq,boxName) <= range)
            {
                combat(boxName);
                
                //end the moves (for now, until double strikes are introduced)
                selectNextUnit();
            }
            else
            {
                /*if (LOGGING > 3){
                    var log = document.getElementById("logsheet").innerHTML;
                    log = log+"<br>dist and range are "+dist+" and "+range;
                    
                    var xNum = document.getElementById("xxNum").value;
                    var yNum = document.getElementById("yyNum").value;
                    for (j=1;j<=xNum;j++)
                    {
                    	for (i=1;i<=yNum;i++)
                		{
                            var testBox=j+"x"+i;
                            log = log+"<br>DIST["+testBox+"] is "+DIST[testBox];
                		}
                	}
                    
                    document.getElementById("logsheet").innerHTML=log;
                }*/
                alert ("move closer to start combat");
            }
        }
        else if ( movable == "-1" )
        {
            alert ("This square cannot be moved into.");
        }
        else // square is empty
        {
            alert ("Click on a highlighted square to move there.");
        }
    }
}
function ifEnemiesInRange(uname){
	console.log("Checking for enemies in range");
	var loc = getLocation(uname);
	var range = getUnitRange(uname);
	var closestEnemy = findClosestEnemy(loc);
	var ret = "FALSE";
	console.log("Closest guy is at "+closestEnemy);
	
	var dist = distance (loc, closestEnemy);
	if (dist >range){
		console.log("Closest enemy beyond range");
	}
	else{
		console.log("Closest enemy within range");
		ret = "TRUE";
	}
	return ret;	
}
function setxNumyNum(){
    //find xNum and yNum values from Matrix 
    var labrat = new Array();
    labrat = document.getElementById("Matrix").getElementsByClassName("cellTable");
    var xy = labrat[labrat.length-1].id;
    
    var x = xy.indexOf("x");
    var xNum = parseInt(xy.slice(0,x));
    var yNum = parseInt(xy.slice(x+1));
    
    document.getElementById("xxNum").value = xNum;
    document.getElementById("yyNum").value = yNum;
}



function updateInventoryNumbers(){
	$( "#healthPotionIcon" ).html(INVENTORY[1]);
	$( "#strengthPotionIcon" ).html(INVENTORY[2]);
	$( "#barkskinPotionIcon" ).html(INVENTORY[3]);
}
function showInventory() {
	
	//fill the inventory values correctly
	updateInventoryNumbers();
	
	$( "#inventoryBox" ).toggle();
	
	$("#inventoryBox").offset({
	   top: 60,
	   left: $(document).width()/2 -  157
	});
	
}

function showMenu(){
	console.log("showmenu selected");
	
	var dropDown = document.createElement("table");
	dropDown.className = "mainOptions";
		
	window.location.href = "../maplist.html";
}

function updateEffects(uname){
	
	//Add the effects
    var eff = $('#'+uname+'_effects').val();
    var arr = eff.split(' ');
    
    //update only valid effects in this variable and then replace.
    var effects = "";
    for (var i=0; i<arr.length; i++){
    	efct = arr[i];
    	
    	var realEff = efct.split('_')[0];
    	var turns = parseInt(efct.split('_')[1]);
		
		if (turns > 1){
			turns --;
			var newEff = efct.split('_')[0]+"_"+turns;
			
			//causes a leading whitespace. will this be a problem?
			effects = effects+" "+newEff;
		}
		//if turns are at 1 then it is the last turn, dont add this effect anymore
    }
    //update the new effects string
	$('#'+uname+'_effects').val(effects);
}




