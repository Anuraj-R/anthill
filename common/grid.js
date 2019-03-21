var showStartMessageState = true;
var showFailMessageState = true;
var showWinMessageState = true;

SEQUENCE=[];

var GAMEOVER = 0;




/* This is the pool of units from which armies are formed automatically
   based on the map-level.
   There is also an additional unit called DebutAnt, which is unique and
   part of every player-army on all levels. */
var playerUnitsPool = [ "KidSlinger", "WarrAnt", "FormicArcher" ];
var AIUnitsPool = [	"Spider","Spidlings","GreySpider","MutAnt","BlackWidow",
				"RedTailSpider","BogTroll", "SpiderQueen"];




//place units on grid based on the current map level
//unit_weight = (2 * attack) + MaxHealth
function placeUnitsOnGrid(){

	var mapWeight = 100*MAPLEVEL;

	console.log("MAPLEVEL is: "+MAPLEVEL);
	//create player's units
	playerUnits = selectPlayerUnits();

	//create AI units
	AIUnits = selectAIUnits();
	console.log(AIUnits);

	placeUnits(playerUnits, HEIGHT-1);
	placeUnits(AIUnits, 0);

	setSEQUENCE(playerUnits, AIUnits);
	console.log(SEQUENCE);
}

//set the sequence in which units take action. Also populate SEQUENCE global array.
function setSEQUENCE(playerUnits, AIUnits){
	SEQUENCE = $.merge(playerUnits, AIUnits);
	//sort descending; greater initiative means early turn
	SEQUENCE.sort(function(a,b){return b.initiative - a.initiative;});
}

//Takes an array of units and places them in the mentioned row
function placeUnits(unitsArray, row){

	for (var i in unitsArray){

		var unit = unitsArray[i];
		unit.position = GRIDNAME+"_"+i+"x"+row;

		TILES[unit.position] = new tileProperties(MOVABLE,unit);

		var img = document.createElement('img');
		img.id = "creatureImage_"+unit.id;
		img.className = "creatureImage";

		img.src = unit.image;
		$('body').append(img);
		$('#'+img.id).css('width',BLOCKSIZE);
		$('#'+img.id).css('height',BLOCKSIZE);

		//set the CSS properties for the first time for the image
		var p = $( '#'+unit.position );
		var position = p.position();
		$('#'+img.id).css({
		  	position:'absolute',
		  	top:position.top-5,
		  	left:position.left
		});

		unit.refreshGraphics();
	}
}

//returns an array of 'Creature' objects
function selectPlayerUnits(){

	var playerUnits=["DebutAnt"];
	var unitsArray=[];

	if (MAPLEVEL < 3){
		//do nothing
	}
	else if (MAPLEVEL <= 5){
		playerUnits.push("KidSlinger");
	}
	else if (MAPLEVEL < 7){
		playerUnits.push("KidSlinger");
		playerUnits.push("WarrAnt");
	}
	else if (MAPLEVEL < 8){
		playerUnits.push("KidSlinger");
		playerUnits.push("WarrAnt");
		playerUnits.push("WarrAnt");
	}
	else if (MAPLEVEL < 9){
		playerUnits.push("WarrAnt");
		playerUnits.push("WarrAnt");
		playerUnits.push("FormicArcher");
	}
	else if (MAPLEVEL < 12) {
		playerUnits.push("WarrAnt");
		playerUnits.push("WarrAnt");
		playerUnits.push("FormicArcher");
		playerUnits.push("FormicArcher");
	}
	else{
		playerUnits.push("WarrAnt");
		playerUnits.push("WarrAnt");
		playerUnits.push("FormicArcher");
		playerUnits.push("FormicArcher");
		playerUnits.push("FormicArcher");
	}

	//playerWeight = calcWeightOfArray(playerUnits);
	console.log("player units are: " + playerUnits);
	console.log("player weight is: " + calcWeightOfArray(playerUnits));

	for (var i in playerUnits) unitsArray.push(CreateCreature(playerUnits[i]));
	for (var i in unitsArray) unitsArray[i].team = 1;
	return unitsArray;
}

function selectAIUnits(){
	var AIUnits = [];
	var unitsArray = [];
	var mapWeight = 45 + 100*(MAPLEVEL);
	var totalWeight = 0;

	//get a sorted list from the units pool
	var AIUnitsSorted = sortUnitsByWeight(AIUnitsPool.slice());
	var idx = AIUnitsSorted.length - 1;

	do {
		//allow maximum of 8 units only
		if (AIUnits.length > 7) break;

		var selected = AIUnitsSorted[idx];
		if ( selected.weight < (mapWeight - totalWeight) * .33){
			AIUnits.push(selected.name);
			totalWeight += selected.weight;
		}
		else{
			idx--;
		}
	}while(idx >= 0);

	//console.log(AIUnitsSorted);
	console.log("AI units are: " + AIUnits);
	console.log("AI weight is: " + calcWeightOfArray(AIUnits));

	//convert to actual creatures
	for (var i in AIUnits) unitsArray.push(CreateCreature(AIUnits[i]));
	for (var i in unitsArray) unitsArray[i].team = 2;
	return unitsArray;

}
function sortUnitsByWeight(unitsArray){
	var unitsSortedArray = [];
	for ( var i=0; i< unitsArray.length; i++)
		unitsSortedArray.push(new weightedUnit(unitsArray[i]));
	unitsSortedArray.sort(function(a,b){return a.weight - b.weight;});
	return unitsSortedArray;
}

//This is a structure with just the unit names and their weights
//It is used as a helper structure for sorting units based on weights
function weightedUnit(uname){
	this.name = uname;
	this.weight = calcWeight(uname);
}

//calculate total weight of units in the array, by calcWeight function
function calcWeightOfArray(unitsArray){
	var units_weight=0;
	for ( var i=0; i< unitsArray.length; i++) units_weight += calcWeight(unitsArray[i]);
	return units_weight;
}

//method to calculate weight of a unit based on a formula
//unit_weight = (2 * attack) + MaxHealth
function calcWeight(unitName){
	return getCreatureMaxHealth(unitName) + (getCreatureAttack(unitName) * 2);
}


function selectNextUnit(){

    unLightAll ();

    tlog("selectNextUnit with "+SEQUENCE[0].name);

    SELECTEDBOX = "NONE";
    MOVES = "-1";

    if (GAMEOVER == 1){
        return 0;
    }
    else
    {

        var NEWINDEX = (NEXTINDEX + 1) % SEQUENCE.length;
        LASTINDEX = (NEWINDEX - 2 + SEQUENCE.length ) % SEQUENCE.length;

        //to avoid the first unit
        if (NEXTINDEX != "-1" )
        {

            //In the new world order, the first element always disappears!
            //hook the elements, and insert the first one after the last
            var firstEl = $("[name='" + GRIDNAME+ "orderBoxes" + "']").get(0);
            var secndEl = $("[name='" + GRIDNAME+ "orderBoxes" + "']").get(1);
            var lastEl  = $("[name='" + GRIDNAME+ "orderBoxes" + "']").get(SEQUENCE.length - 1);

			//update the potion effects before moving the unit back.
            //Wrong place to do that, should move if possible
    		SEQUENCE[NEXTINDEX].updateEffects();

            $(secndEl).css({ height: "+=6" , width: "+=6"});
            $(firstEl).css({ height: "-=6" , width: "-=6"});

            $(firstEl).hide(600, function () {
                $(firstEl).insertAfter(lastEl);
                $(firstEl).show('slow', function() {
                    NEXTINDEX = NEWINDEX;
                    setTimeout(function(){
                        selectForAction (SEQUENCE[NEXTINDEX]);},600);
                });
            });
        }
        else {
            NEXTINDEX = NEWINDEX;
            setTimeout(function(){selectForAction (SEQUENCE[NEXTINDEX]);},400);
        }
    }
}


//A global variable variable to hold the moves left for the currently selected unit
MOVES=-1;
function selectForAction (unitName){

    tlog("inside selectForAction with unit name:" + unitName.name);
    console.log(unitName);
    tlog("Current SELECTEDBOX contains "+SELECTEDBOX);
    

    // no other unit is present in selection, select this unit
    if (SELECTEDBOX == "NONE" ){

        tlog(unitName.name);
        //Update the location in selection box
        SELECTEDBOX = unitName.position;
        SELECTEDUNIT = unitName;

        if (MOVES == -1) MOVES = unitName.moves;

        highLightMoves (SELECTEDBOX , MOVES );
        highLight(SELECTEDBOX);
        //If the unit is AI controlled, make it autoMove
        if (unitName.team != 1){
            tlog("Automoving "+ unitName.name);
            autoMove(unitName, MOVES);
    	}
    	tlog("exiting selectForAction " +  unitName.name);
	}
	else{
		//same unit is selected?
		if (unitName.team != 1){
            tlog("Automoving "+unitName.name);
            autoMove(unitName, MOVES);
    	}
	}
}

//function moves the currently active (selected) unit to the target location specified
//clicking on a tile invokes this method with that tile as argument.
//selected unit is implicit and global settings are used
function selectForMove (targetBox){ //The function does selectForAction() again if there are MOVES left after moving


    var targetBoxName = targetBox;
    if ( "string" != typeof targetBox ){
        targetBoxName = targetBoxName.id;
    }
    tlog("Invoking selectForMove on: "+targetBoxName);

	this.endTurn = function(){
        tlog ("ending turns for "+targetBoxName);
        MOVES="-1";
        selectNextUnit();
    };

	//check if player is ending turn by clicking onthe same tile
	if ( targetBoxName == SELECTEDUNIT.position ){
        tlog("Unit skipping turn.");
        this.endTurn();
        return;
    }

	//Find if the tile is impassable
	if (TILES[targetBoxName].movable == IMPASSABLE ){
	    tlog ("This square is impassable and cannot be moved into.");
	    return;
	}

	//calculate distance
	var dist = distance(SELECTEDUNIT.position, targetBoxName);

    //Find if square is empty
    if ( TILES[targetBoxName].station == NONE ) // square can be moved into
    {
        //Is distance less than the moves left?
        if ( dist > MOVES ){
            tlog ("This square is too far. Movable squares are highlighted in green.");
            return;
        }

        // Update MOVES(global variable) left for the selected unit
        tlog("Moving "+SELECTEDUNIT.id+" from "+SELECTEDUNIT.position+" to "+targetBoxName);
        MOVES -= dist;

        SELECTEDUNIT.moveTo( targetBoxName );

        //apply the bonuses
        //this should be implemented in the unit class
        //document.getElementById("3x5"+"bonus").value
        /*
        if (getUnitTeam(uname) == "1"){
            if (document.getElementById(getLocation(uname)+"bonus").value == "5" ){
                //Heal Fully!
                setUnitHealth(uname , getUnitMaxHealth(uname) );
                healthBar(uname);
                document.getElementById(boxName+"display").style.backgroundImage = "url(\"\")";
                document.getElementById(getLocation(uname)+"bonus").value = 0;
                $("#"+uname+"Pic").animate({opacity:'0.4'}, 200);
                $("#"+uname+"Pic").animate({opacity:'1.0'}, 200);
            }
        }
        */

        //deselect all movable tiles
        unLightAll();

        //Select the unit again if it has MOVES left.
        if ( MOVES >= 1 ){
            //select the unit for action
            selectForAction(SELECTEDUNIT);
        }// No moves left; reset MOVES
        else{
            MOVES="-1";
            //alert("selecting next");
            selectNextUnit();
        }
    }
    else // Some other unit stationed here.
    {

        //Ally?
        if ( TILES[ targetBoxName].station.team == SELECTEDUNIT.team ) {
            //ally stationed on this square
            alert ("This tile is already occupied by your ally.");
            return;

        }
        else{//Enemy
            //within range or not?
            if (dist <= SELECTEDUNIT.range)
            {
                SELECTEDUNIT.combat(TILES[targetBoxName].station);

                //end the moves (for now, until double strikes are introduced)
                this.endTurn();
            }
            else
            {
                alert ("move closer to start combat");
            }
        }
    }

}


AUTOMOVECOUNTER = 1;
function autoMove(unitName, moves){

    AUTOMOVECOUNTER++;
    tlog("Inside autoMove - "+AUTOMOVECOUNTER + " with moves " + moves +".");
    tlog(unitName);

    var enemyNear = findClosestEnemy(unitName.position);
    tlog("unitName.name: "+unitName.name);
    tlog("enemyNear: "+enemyNear.name);

    var moveTarget = findNeighborTileCloserTo(unitName.position, enemyNear.position, moves);
    tlog("moveTarget: "+moveTarget);

    //see if enemy is within range; then no need to move
    var range = unitName.range;
    var dist = distance(unitName.position, enemyNear.position);

    if (dist <= range){ //enemy within range; attack if moves left
        if (MOVES >=0){
            //end the moves (for now, until double strikes are introduced)
            MOVES="-1";
            //TODO combat
            //change combat functons

            unitName.combat(enemyNear);

            //combat(enemyNear);
            selectNextUnit();
        }
    }
    //make sure that we are not moving to the current position it already is in
    //shouldnt arrive here, because the (dist <= range ) loop would have handled this scenario
    //and subsequently called 'selectNextUnit'
    //else if ( moveTarget != unitName.position )
    //{
        if (MOVES >=1){
            //move to the nearest tile to the enemy (moveTarget)
            tlog("moving to : "+moveTarget);
            selectForMove(moveTarget);

        }
        else{
            selectNextUnit();
        }
    //}
    //else //Closest enemy not within reach; but we are on closest possible tile.(moveTarget == boxName). End turn
    //{
        //MOVES = "-1";
        //selectNextUnit();
    //}


    return 0;
}


function findClosestEnemy(boxName){

    tlog("findClosestEnemy called with "+boxName);

    pathFind (boxName);

    var closestDist=1000;
    var closestEnemyWithinRange="-1x-1";
    var closestEnemyReachable="-1x-1";
    var closestEnemyLocation="-1x-1";

    this.enemyWithinRange = function(){
        closestDist=1000;
        //check units within range
        for (var i=0;i<WIDTH;i++){
            for (var j=0;j<HEIGHT;j++){
                var testBox=GRIDNAME+"_"+i+"x"+j;
                //unit present
                if (TILES[testBox].station != NONE ){
                    //of a different team
                    if ( TILES[testBox].station.team != SELECTEDUNIT.team ){
                        //and within range
                        if ( distance(testBox,boxName) <= SELECTEDUNIT.range){

                            //and closer than last unit within range
                            if ( distance(testBox,boxName) < closestDist){
                                closestDist = distance(testBox,boxName);
                                closestEnemyWithinRange = testBox;
                            }
                        }
                    }
                }
            }
        }
        tlog("closestEnemyWithinRange is "+closestEnemyWithinRange);
        return closestEnemyWithinRange;
    }

    this.enemyReachable = function(){
        closestDist=1000;
        for (var i=0;i<WIDTH;i++){
            for (var j=0;j<HEIGHT;j++){
                var testBox=GRIDNAME+"_"+i+"x"+j;
                //unit present
                if (TILES[testBox].station != NONE ){
                    //of a different team
                    if ( TILES[testBox].station.team != SELECTEDUNIT.team ){
                        //and closer than the last unit

                        var tempTile = findNeighborTileCloserTo(SELECTEDUNIT.position, testBox, 1.5);
                        tlog(boxName+" found neighbor tile for "+testBox+" as "+tempTile+" "+DIST[tempTile]+" squares away.");

                        if ( DIST[tempTile] < closestDist){
                            closestDist = DIST[tempTile];
                            closestEnemyReachable = testBox;
                        }
                    }
                }
            }
        }
        tlog("closestEnemyReachable is "+closestEnemyReachable);
        return closestEnemyReachable;
    }

    this.closestEnemyUnreachable = function(){
        closestDist=1000;
        for (var i=0;i<WIDTH;i++){
            for (var j=0;j<HEIGHT;j++){
                var testBox=GRIDNAME+"_"+i+"x"+j;
                //unit present
                if (TILES[testBox].station != NONE ){
                    //of a different team
                    if ( TILES[testBox].station.team != SELECTEDUNIT.team ){
                        //and closer than the last unit

                        //occupied tiles have a distance of 1000 (impassable)
                        //so find the closest neighbor and return it
                        var tempTile = findNeighborTileCloserTo(SELECTEDUNIT.position, testBox, 1.5);
                        tlog(boxName+" found neighbor tile for "+testBox+" as "+tempTile+" "+DIST[tempTile]+" squares away.");

                        if ( DIST[tempTile] < closestDist){
                            closestDist = DIST[tempTile];
                            closestEnemyLocation = testBox;
                            tlog("closestEnemyLocation changed to "+closestEnemyLocation);
                        }
                    }
                }
            }
        }
        tlog("closestEnemyLocation is "+closestEnemyLocation);
        return closestEnemyLocation;
    }



    //return the actual Creature
    if (this.enemyWithinRange() != "-1x-1") return TILES[closestEnemyWithinRange].station;
    if (this.enemyReachable()   != "-1x-1") return TILES[closestEnemyReachable].station;
    return TILES[this.closestEnemyUnreachable()];

    //TODO
    //what if there are no enemies left (?) Will this situation happen?

}

//find neighbortile of the selected unit, closest to a target location, subject to number of moves available
function findNeighborTileCloserTo(startLoc, targetLoc, moves){
    //pathFind (startLoc);
    tlog("From "+startLoc+", findNeighborTileCloserTo "+targetLoc+ " within moves "+moves+".");
    var minDist = 1000;
    var returnNode = "-1x-1";

    var moveRadius = 0;
    if(moves >= 1  )  moveRadius = 1;
    if(moves >= 1.41)  moveRadius = 1.42;

    //for finding neighbor tiles, iterate through the board and look for
    for (var i=0;i<WIDTH;i++){
        for (var j=0;j<HEIGHT;j++){
            var testBox=GRIDNAME+"_"+i+"x"+j;
            //a neighbor tile
            if (distance(startLoc, testBox) <= moveRadius){
                //tlog("Processing neighbor tile "+testBox);
                //If not impassable and unoccupied, see if it moves closer to our target
                if(TILES[testBox].movable == MOVABLE && TILES[testBox].station == NONE){
                    var temp = distance(testBox, targetLoc);
                    if (temp < minDist) {
                        minDist = temp;
                        returnNode = testBox;
                        //tlog("returnNode changed to "+returnNode);
                    }
                }

            }
        }
    }
    return returnNode;
}


function unLightAll (){
    //tlog("inside UnlightAll");
	for (var i=0;i<WIDTH;i++){
		for (var j=0;j<HEIGHT;j++){
            var testBox=GRIDNAME+"_"+i+"x"+j;
            $("#"+testBox).css('background-color', ORIGINALCOLORS[testBox]);
		}
	}
}


function highLight (boxName, tintPercentage){

    var hexColor = $("#"+boxName).css('background-color');
    hexColor = rgbToHex(hexColor);

    var hexColorNew = lightenBy(hexColor, tintPercentage);
    $("#"+boxName).css('background-color', hexColorNew);

    //tlog( boxName+": highlighting "+ hexColor +" by "+tintPercentage+"% to "+hexColorNew);
}

var ORIGINALCOLORS = new Array();
var ORIGINALCOLORS_initialized = 0;
function initializeORIGINALCOLORS(){
    if (ORIGINALCOLORS_initialized == 0){
        ORIGINALCOLORS_initialized = 1;
        for (j=0;j<WIDTH;j++) {
            for (i=0;i<HEIGHT;i++) {
                testBox=GRIDNAME+'_'+j+"x"+i;
                ORIGINALCOLORS[testBox] = '#' + rgbToHex( $("#"+testBox).css('background-color') );
            }
        }
    }
}

function highLightMoves (boxName , movepoints){

    var moveTint = 65; //in %
    var rangeTint = 50;

    initializeORIGINALCOLORS();

    var moves = movepoints;
    //tlog("inside HightlightMoves");
    pathFind (boxName, "");

    for (j=0;j<WIDTH;j++) {
        for (i=0;i<HEIGHT;i++) {
            testBox=GRIDNAME+'_'+j+"x"+i;

            //Highlight movable squares
            if(TILES[testBox].movable != IMPASSABLE){
                var dist = DIST[testBox];
                if ( dist <= moves ) highLight (testBox, moveTint);
            }

            //Highlight Range
            var dist = parseFloat(distance(boxName, testBox));
            if ( dist <= SELECTEDUNIT.range ) highLight (testBox, rangeTint);

		}
	}
}

function rgbToHex(rgb){
	var hex = "";
	//"rgb(226, 242, 226)"

	this.valArray = function(rgb){
		var m = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
	    if( m) {
	        return [m[1],m[2],m[3]];
	    }
   	};


	this.valToHex = function (num) {
  		var hex = Number(num).toString(16);
	  	if (hex.length < 2) {
	       	hex = "0" + hex;
	  	}
	  	return hex;
	};

	this.fullColorHex = function(r,g,b) {
  		var red = valToHex(r);
  		var green = valToHex(g);
  		var blue = valToHex(b);
  		return red+green+blue;
	};


   	var valArr = valArray(rgb);
	hex = fullColorHex(valArr[0],valArr[1],valArr[2]);
	return hex;

}

function darken( hexColor, factor )
{
    if ( factor < 0 ) factor = 0;

    var c = hexColor;
    if ( c.substr(0,1) == "#" )
    {
        c = c.substring(1);
    }

    if ( c.length == 3 || c.length == 6 )
    {
        var i = c.length / 3;

        var f;  // the relative distance from white

        var r = parseInt( c.substr(0, i ), 16 );
        f = ( factor * r / (256-r) );
        r = Math.floor((256 * f) / (f+1));

        r = r.toString(16);
        if ( r.length == 1 ) r = "0" + r;

        var g = parseInt( c.substr(i, i), 16);
        f = ( factor * g / (256-g) );
        g = Math.floor((256 * f) / (f+1));
        g = g.toString(16);
        if ( g.length == 1 ) g = "0" + g;

        var b = parseInt( c.substr( 2*i, i),16 );
        f = ( factor * b / (256-b) );
        b = Math.floor((256 * f) / (f+1));
        b = b.toString(16);
        if ( b.length == 1 ) b = "0" + b;

        c =  r+g+b;
     }

     return "#" + c;

}

function lightenBy(color, percent){
    return darken(color, percent/100.0);
}

function darkenBy(color, percent){
    return darken(color, -1 * percent / 100.0);
}

//TODO
//remove third argument if 'end' is not used anywhere
//why did i make this function always return -1? recall and fix it
var VISITED = new Array();
var DIST = new Array();
var PREVIOUS = new Array();
//Fills up PREVIOUS[vertex] and DIST[vertex] for each tile in the map, from using 'start' as starting point.
//'end' is not used, always return -1 in dist which is also not used!
function pathFind (start , end){
    var stopper = 0;
    var dist=-1;
    var xNum = WIDTH;
    var yNum = HEIGHT;

    //Queue to keep nodes to be visited
    var Q = "";

    //Initialize arrays required for pathfinding
    for (var j=0;j<xNum;j++){
        for (var i=0;i<yNum;i++){
            var vertex = GRIDNAME+'_'+j+"x"+i;
            VISITED[vertex]="NO";
            DIST[vertex]=1000;
            PREVIOUS[vertex]="none";
    	}
	}

    //dist[source]  := 0;
    DIST[start]=0;

    //insert source into Q;
    Q=pushQ(Q, start);

    //while Q is not empty:
    while (Q !== "" ){

        //u := vertex in Q with smallest distance in DIST[] and has not been visited;
        //gets 'start' in the first round (since DIST[start] is 0), nearer tiles to it from the next round onwards.
        var u = findSmallestInDIST();

        //there are unvisited nodes
        if (u !== "none" ){

            //remove u from Q;
            Q=popQ(Q,u);

            //visited[u] := true
            VISITED[u]="YES";

            //for each neighbor v of u:
            //fill up distance to neighbors
            var neighbors = new Array();
            neighbors = findNeighbors(u);
            for (var i = 0; i < neighbors.length; i++) {

                var v = neighbors[i];

                //alt := dist[u] + dist_between(u, v);
                var alt = DIST[u] + distance(u, v);

                //if alt < dist[v] && !visited[v]:
                if ( alt < DIST[v] && VISITED[v] === "NO"){

                    //dist[v]  := alt;
                    DIST[v] = alt;

                    //previous[v]  := u;
                    PREVIOUS[v] = u;

                    //insert v into Q;
                    Q=pushQ(Q, v);
                }

            }
        }
        //all nodes visited
        else {
            Q="";
        }
    }
	tlog("pathfind from "+start+" returns after filling up DIST");
	tlog (DIST);
    return 0;
}
function pushQ( Q , node ){
    return Q+"/"+node+"/";
}

function popQ( Q , node ){
    return Q.replace("/"+node+"/","");
}
//find the smallest value in array DIST[cell] which is also unvisited (VISITED[cell]==NO)
function findSmallestInDIST(){
    xNum = WIDTH;
    yNum = HEIGHT;

    //check if there is atleast one unvisited node.
    //If no, return 'none'.
    //If yes, get the first one and use it later for comparison with all other cells
    var smallest="none";
    for (var j=0;j<xNum;j++){
        for (var i=0;i<yNum;i++){
            var vertex = GRIDNAME+'_'+j+"x"+i;
            //if there are unvisited nodes
            if ( VISITED[vertex] == "NO"){
                smallest = vertex;
            }
        }
    }

    if (smallest == "none"){
        return "none";
    }

    //There is atleast one unvisited node found.
    //Check if it is the smallest in DIST[]. If not, replace it with the smallest in DIST[]
    for (var j=0;j<xNum;j++){
        for (var i=0;i<yNum;i++){
            var vertex = GRIDNAME+'_'+j+"x"+i;

            if ( VISITED[vertex] == "NO"){
                if (DIST[vertex]<DIST[smallest]){
                    smallest = vertex;
                }
            }
    	}
	}
    return smallest;
}


function findNeighbors(node){

    var tempArr = new Array();
    var index=0;

    //get maximum allowable values for coordinates
    var xNum = WIDTH-1;
    var yNum = HEIGHT-1;

    var x = node.lastIndexOf("x");
    var start = 1+node.lastIndexOf("_");
    var xVal = parseInt(node.slice(start,x));
    var yVal = parseInt(node.slice(x+1));

    var containerPrefix = node.slice(0,start);

    this.addToArray = function(x,y){
    	if (pathExists(x,y)){
        	tempArr[index] = containerPrefix+x+"x"+y;
        	index++;
        }
    };

    //Four side squares
    (yVal > 0) 		&& this.addToArray((xVal),(yVal-1)); //up
    (yVal < yNum) 	&& this.addToArray((xVal),(yVal+1)); //down
    (xVal > 0) 		&& this.addToArray((xVal-1),(yVal)); //left
    (xVal < xNum) 	&& this.addToArray((xVal+1),(yVal)); //right

    //Four corner squares
    (yVal > 0 && xVal > 0) 		&& this.addToArray((xVal-1),(yVal-1));
    (yVal < yNum && xVal < xNum)&& this.addToArray((xVal+1),(yVal+1));
    (yVal > 0 && xVal < xNum) 	&& this.addToArray((xVal+1),(yVal-1));
    (yVal < yNum && xVal > 0) 	&& this.addToArray((xVal-1),(yVal+1));

    //console.log("findNeighbors for "+node+" returns :");
    //console.log(tempArr);
    return tempArr;
}

//returns 1 if pathExists, 0 otherwise
function pathExists(x,y){
	var testBox = GRIDNAME+"_"+x+"x"+y;
	if ( TILES[testBox].movable == MOVABLE ){
        if (TILES[testBox].station == NONE){
            return 1;
        }
    }
    return 0;
}

function distance (boxName1, boxName2){

    //tlog("distance between "+boxName1+" "+boxName2);
    var box1=boxName1;
    var box2=boxName2;

    var x = box1.lastIndexOf("x");
    var start = 1+box1.lastIndexOf("_");
    var x1 = parseInt(box1.slice(start,x));
    var y1 = parseInt(box1.slice(x+1));

    x = box2.lastIndexOf("x");
    var x2 = parseInt(box2.slice(start,x));
    var y2 = parseInt(box2.slice(x+1));

    var dist = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    if(dist == NaN)tlog("distance from "+boxName1+" to "+boxName2 + " is " +dist);

    return dist;
}




