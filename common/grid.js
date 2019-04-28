
SEQUENCE=[];
var GAMEOVER = 0;


var BOG = [
	"common/images/terrains/bog/bog_001.png",
	"common/images/terrains/bog/bog_002.png",
	"common/images/terrains/bog/bog_003.png",
	"common/images/terrains/bog/bog_004.png",
	"common/images/terrains/bog/bog_005.png",
	"common/images/terrains/bog/bog_006.png",
	"common/images/terrains/bog/bog_007.png",
	"common/images/terrains/bog/bog_008.png",
	"common/images/terrains/bog/bog_009.png",
	"common/images/terrains/bog/bog_010.png"
];

var WOODS = [
	"common/images/terrains/woods/trees_001.png",
	"common/images/terrains/woods/trees_002.png",
	"common/images/terrains/woods/trees_003.png",
	"common/images/terrains/woods/trees_004.png"
];

var HEIGHTS = [
	"common/images/terrains/heights/mountain_001.png",
	"common/images/terrains/heights/mountain_002.png",
	"common/images/terrains/heights/mountain_003.png"
];

var PLAINS = [
	"common/images/terrains/plains/dots_001.png",
	"common/images/terrains/plains/dots_002.png",
	"common/images/terrains/plains/dots_003.png",
	"common/images/terrains/plains/dots_004.png",
	"common/images/terrains/plains/dots_005.png",
	"common/images/terrains/plains/dots_006.png",
	"common/images/terrains/plains/dots_007.png",
	"common/images/terrains/plains/dots_008.png",
	"common/images/terrains/plains/dots_009.png",
	"common/images/terrains/plains/dots_010.png",
	"common/images/terrains/plains/dots_011.png",
	"common/images/terrains/plains/plains_01.png",
	"common/images/terrains/plains/plains_02.png"
];

var HIDDEN = [
	""
];

WOLFRAMLIST = [ 88, 98, 104, 102, 95, 103, 105, 106, 107, 108, 109, 110, 
111, 114, 115, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 
131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 144, 145, 146, 147, 
148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 
164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 177, 180, 181, 
182, 184, 185, 186, 188, 189, 190, 192, 193, 194, 195, 196, 197, 198, 199, 
200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 
216, 217, 218, 220, 221, 222, 224, 225, 226, 227, 228, 229, 230, 231, 232, 
233, 234, 235, 236, 237, 239, 240, 241, 242, 244, 245, 246, 249, 250, 253];

//tileProperties.movable; 
//These are temporary values used to help functions communicate the state of the map
//They may not reflect the actual state of the tile
//var EMPTY = 0;
var IMPASSABLE = -1;
var MOVABLE = 1;
//var OCCUPIED = 2;
//var ATTACKABLE = 3;
var NONE = "none";

//contains if impassable tile, and the name of the unit stationed
function tileProperties(movable, station){
	this.movable = movable;    // EMPTY IMPASSABLE MOVABLE OCCUPIED ATTACKABLE 
	this.station = station;    //TILES[cellName].station contains the UNIT if occupied, NONE otherwise
	return this;
}

var TILES = new Array();
TILES.reset = function( tile ) { 
    tlog("Resetting "+tile);
    TILES[tile] = new tileProperties(MOVABLE, NONE);
};

//TODO
/*
class Grid{

    constructor(width, height, paintingAlgorithm){
        this.width = width;
        this.height = height;
        this.paintingAlgorithm = paintingAlgorithm; //perlin wolfram
        this.html = this.createHtml();
    }

    createHtml(){
        var grid = "";
        console.log ("Creating grid named "+GRIDNAME );
        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++){
                var cellName = GRIDNAME + "_"+ i + "x" + j ;
                grid += '<div id="' + cellName + '" class="mapTile" onclick="selectForMove(' + cellName + ')" ></div>';
                //console.log ("Created "+name +"_"+ i + "x" + j);
                TILES[GRIDNAME +"_"+ i + "x" + j] = new tileProperties(MOVABLE, NONE);
            }
            grid += "<br>";
        }
        return grid;
    }
}

*/

function createGrid(width, height) {
	var grid = "";
	//arrays of height length, stacked by width number of those, so that ixj maps correctly
	//MOVABLE = new Array(width).fill(new Array(height).fill(1));
	//STATION = new Array(width).fill(new Array(height).fill("none"));
	
	//console.log ("Creating grid named "+GRIDNAME );
	for (var j = 0; j < height; j++) {
		for (var i = 0; i < width; i++){
			
			var cellName = GRIDNAME + "_"+ i + "x" + j ;
		    grid += '<div id="' + cellName + '" class="mapTile" onclick="selectForMove(' + cellName + ')" ></div>';
		    //console.log ("Created "+name +"_"+ i + "x" + j);
		    TILES[GRIDNAME +"_"+ i + "x" + j] = new tileProperties(MOVABLE, NONE);
		}
		grid += "<br>";
	}
	return grid;
}

//wolfram (rule, length, seed, iterations)
function wolfram(ruleNum, len, seed, iterations) {

	this.rule = [];
	this.CAlen = len + 2;
	this.weight = 0;
	genNow = [];
	genNext = [];
	
	//shade is the array keeping the 0/1 values for the entire grid
	shade = [];
	
	this.fillShade = function() {
	    shade.push(genNow);
		for (var p = 1; p < HEIGHT; p++) {
			this.advance();
			shade.push(genNow.slice());
		}
		this.setWeight();
	};

	//paint this wolfram on the given grid with HIDDEN terrain
	this.display = function(gridName) {
		for (var y = 0; y < HEIGHT; y++) {
		    var row = shade[y];
            for (var x = 0; x < WIDTH; x++) {
                tileID = gridName + "_"+ x + "x" + y;
                var val = row[x+1];
                if(val == 1) terrainPaint(tileID, HIDDEN, "HIDDENtile");
            }
        }
        //Full content of the cellular automata matrix
        //console.log("->" + shade);
	};
	this.index = function(x,y){
	    return y*WIDTH+x;
	};
	this.setRule = function(ruleNum) {
		//8 rule bits
		//Initialize to 30
		this.rule = [0, 1, 1, 0, 1, 1, 1, 0];

        var i = 8;
        do {
            var val = ruleNum & (1);
            this.rule[--i] = val;
            ruleNum = ruleNum>>1;
        } while ( i );
	};
	this.advance = function() {
		for (var i = 1; i < this.CAlen ; i++) {
			var ruleindex = genNow[i - 1] * 4 + genNow[i] * 2 + genNow[i + 1] * 1;
			genNext[i] = this.rule[ruleindex];
		}

		for (var i = 1; i < this.CAlen -1 ; i++) {
			genNow[i] = genNext[i];
		}
	};
	this.setWeight = function() {
	    var numerator = 0;
	    var denominator = 0;
        for (var y = 0; y < HEIGHT; y++) {
            var row = shade[y];
            for (var x = 0; x < WIDTH; x++) {

                var val = row[x+1];
                denominator++;
                if(val == 1){
                    numerator++;
                }
            }
        }
        this.weight = numerator/denominator;
        //console.log("This Cellular Automata's weight is " + this.weight);
    };
    
    this.setSeed = function(seed) {
        if (seed == undefined) seed = 32;
        for (var i = 0; i < this.CAlen; i++) {
            genNow[i] = 0;
            genNext[i] = 0;
        }
        //set seed to 32
        //custom seed is not implemented
        genNow[this.CAlen / 2] = 1;
    };
	this.setSeed(seed);
	this.setRule(ruleNum);
	this.fillShade();
}

//assign terrain class and a random terrain background
function terrainPaint(tileID, TERRAIN_ARRAY, terrain_class){
    //set background image from the array
    var imgIndex = ( Math.floor(100 * Math.random()) ) % TERRAIN_ARRAY.length;
    var link = TERRAIN_ARRAY[imgIndex];
    document.getElementById(tileID).style.backgroundImage = "url(\"" + link + "\")";
    
    //set the terrain class
    $("#"+tileID).addClass(terrain_class);
}

//A random walker ant draws the map
function perlinAntMap() {

    //ant starts at 0,0 and moves randomly, painting the terrain
    var x=0, y=0;
    noise.seed(Math.random());
    
    for (var i=0; i<WIDTH*HEIGHT; i++){
    
        var mov = Math.random();
        if (mov < .25){ //moveleft
            (x == 0)? x = WIDTH-1 : x = (x-1);
        } else if (mov < .5) { //moveright
            (x == WIDTH-1)? x = 0 : x = (x+1);
        } else if (mov < .75) { //moveup
            (y == 0)? y = HEIGHT-1 : y = (y-1);
        } else { //movedown
            (y == HEIGHT-1)? y = 0 : y = (y+1);
        }
            
        var val = noise.perlin2(y / 100, x / 100);
        //console.log("antval is: " + val);
        
        tileID = GRIDNAME + "_"+ x + "x" + y;
        if (val < -0.02){ //BOG
            terrainPaint(tileID, BOG, "BOGtile");
        }
        else if (val <.03){ //WOODS
            terrainPaint(tileID, WOODS, "WOODStile");
        }
        else if (val <.07){ //HEIGHTS
            terrainPaint(tileID, HEIGHTS, "HEIGHTStile");
        }
        else{ //PLAINS
            terrainPaint(tileID, PLAINS, "PLAINStile");
        }
    }
}

//paint a wolfram grid on the given grid
function paintWolframGrid(){
    console.log("painting "+MAPLEVEL);
    
    var idx = Math.floor(MAPLEVEL/5) - 1;
    var design = WOLFRAMLIST[idx];
    
    //Cellular Automata
    CA = new wolfram(design,8,32);
    CA.display(GRIDNAME);
    paintcount++;
    
}




/* This is the pool of units from which armies are formed automatically
   based on the map-level.
   There is also an additional unit called DebutAnt, which is unique and
   part of every player-army on all levels. */
var playerUnitsPool = [ "KidSlinger", "WarrAnt", "FormicArcher" ];
var AIUnitsPool = [ "Spider","Spidlings","GreySpider","MutAnt","BlackWidow",
                "RedTailSpider","BogTroll", "SpiderQueen"];




//place units on grid based on the current map level
//unit_weight = (2 * attack) + MaxHealth
function placeUnitsOnGrid(){

    tlog("MAPLEVEL is: "+MAPLEVEL);

    var playerUnits = selectPlayerUnits();
    var AIUnits = selectAIUnits();
    tlog(playerUnits);
    tlog(AIUnits);

    placeUnits(playerUnits, HEIGHT-1);
    placeUnits(AIUnits, 0);

    setSEQUENCE(playerUnits, AIUnits);
    tlog(SEQUENCE);
}

// returns an array of 'Creature' objects
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

    for (var i in playerUnits) unitsArray.push(Creature.create(playerUnits[i]));
    for (var i in unitsArray) unitsArray[i].team = 1;
    return unitsArray;
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
    for (var i in AIUnits) unitsArray.push(Creature.create(AIUnits[i]));
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
    if (GAMEOVER == 1)return 0;
    tlog("selectNextUnit with "+SEQUENCE[0].name);

    SELECTEDBOX = "NONE";
    MOVES = "-1";

    //the first unit to move
    if (NEXTINDEX == -1 )
    {
        tlog("NEXTINDEX is -1, initializing...");
        NEXTINDEX = (NEXTINDEX + 1) % SEQUENCE.length;
        setTimeout(function(){selectForAction (SEQUENCE[NEXTINDEX]);},400);
    }
    else {
        //update effects on the current selected unit and invoke the next
        SEQUENCE[NEXTINDEX].updateEffects();
        NEXTINDEX = (NEXTINDEX + 1) % SEQUENCE.length;
        ORDERBOX.progress();
        setTimeout(function(){
            selectForAction (SEQUENCE[NEXTINDEX]); }, 700);
    }
}

//A global variable variable to hold the moves left for the currently selected unit
MOVES=-1;
function selectForAction (unitName){

    tlog(unitName);

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
            unitName.combat(enemyNear);
            selectNextUnit();
        }
    }
    else if ( moveTarget != unitName.position ){
    //make sure that we are not moving to the current position it already is in
    //shouldnt arrive here, because the (dist <= range ) loop would have handled this scenario
    //and subsequently called 'selectNextUnit'
        if (MOVES >=1){
            //move to the nearest tile to the enemy (moveTarget)
            tlog("moving to : "+moveTarget);
            selectForMove(moveTarget);
        }
        else{
            selectNextUnit();
        }
    }
    else
    //Closest enemy not within reach;
    //but we are on closest possible tile.(moveTarget == unitName.position).
    //End turn
    {
        MOVES = "-1";
        selectNextUnit();
    }


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
    (yVal > 0)      && this.addToArray((xVal),(yVal-1)); //up
    (yVal < yNum)   && this.addToArray((xVal),(yVal+1)); //down
    (xVal > 0)      && this.addToArray((xVal-1),(yVal)); //left
    (xVal < xNum)   && this.addToArray((xVal+1),(yVal)); //right

    //Four corner squares
    (yVal > 0 && xVal > 0)      && this.addToArray((xVal-1),(yVal-1));
    (yVal < yNum && xVal < xNum)&& this.addToArray((xVal+1),(yVal+1));
    (yVal > 0 && xVal < xNum)   && this.addToArray((xVal+1),(yVal-1));
    (yVal < yNum && xVal > 0)   && this.addToArray((xVal-1),(yVal+1));

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

