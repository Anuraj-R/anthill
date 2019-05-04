/* eslint-disable no-console */

/* This is the pool of units from which armies are formed automatically
   based on the map-level.
   There is also an additional unit called DebutAnt, which is unique and
   part of every player-army on all levels. */

   //var playerUnitsPool = [ "KidSlinger", "WarrAnt", "FormicArcher" ];
   var AIUnitsPool = [ "Spider","Spidlings","GreySpider","MutAnt","BlackWidow",
                   "RedTailSpider","BogTroll", "SpiderQueen"];
   

class CreaturePlacer{

    constructor(grid){
        this.grid = grid;
        this.mapLevel = grid.mapLevel;
    }

    selectPlayerUnits(){

        var playerUnits=["DebutAnt"];
        if (this.mapLevel >= 3) playerUnits.push("KidSlinger");
        if (this.mapLevel >= 5) playerUnits.push("WarrAnt");
        if (this.mapLevel >= 7) playerUnits.push("WarrAnt");
        if (this.mapLevel >= 8){
            playerUnits.splice(1,1);
            playerUnits.push("FormicArcher");
        }
        if (this.mapLevel >= 9) playerUnits.push("FormicArcher");
        if (this.mapLevel >= 12) playerUnits.push("FormicArcher");
    
        //playerWeight = calcWeightOfArray(playerUnits);
        console.log("player units are: " + playerUnits);
        console.log("player weight is: " + CreaturePlacer.calcWeightOfArray(playerUnits));
    
        return CreaturePlacer.convertToCreatures(playerUnits, 1);
    }

    selectAIUnits(){
        var AIUnits = [];
        var mapWeight = 45 + 140*(this.mapLevel);
        var totalWeight = 0;
    
        //get a sorted list from the units pool
        var AIUnitsSorted = CreaturePlacer.sortUnitsByWeight(AIUnitsPool.slice());
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

        //minimum one unit should be present
        if(AIUnits.length == 0)AIUnits.push(AIUnitsSorted[0].name);
    
        //console.log(AIUnitsSorted);
        console.log("AI units are: " + AIUnits);
        console.log("AI weight is: " + CreaturePlacer.calcWeightOfArray(AIUnits));
    
        return CreaturePlacer.convertToCreatures(AIUnits, 2);
    }

    static convertToCreatures(creatureStringArray, team){
        var unitsArray=[];
        for(var i=0; i<creatureStringArray.length; i++){
            unitsArray.push(Creature.create(creatureStringArray[i]));
            unitsArray[i].team = team;
        }
        return unitsArray;
    }

    
    static sortUnitsByWeight(unitsArray){
        var unitsSortedArray = [];
        for ( var i=0; i< unitsArray.length; i++)
            unitsSortedArray.push(new weightedUnit(unitsArray[i]));
        unitsSortedArray.sort(function(a,b){return a.weight - b.weight;});
        return unitsSortedArray;
    }

    

    //calculate total weight of units in the array, by calcWeight function
    static calcWeightOfArray(unitsArray){
        var units_weight=0;
        for ( var i=0; i< unitsArray.length; i++) units_weight += Creature.weight(unitsArray[i]);
        return units_weight;
    }
}

//This is a structure with just the unit names and their weights
//It is used as a helper structure for sorting units based on weights
function weightedUnit(uname){
    this.name = uname;
    this.weight = Creature.weight(uname);
}

// eslint-disable-next-line no-unused-vars
function placeUnitsOnGrid(grid){

    //tlog("MAPLEVEL is: "+MAPLEVEL);

    var creaturePlacer = new CreaturePlacer(grid);

    var playerUnits = creaturePlacer.selectPlayerUnits();
    var AIUnits = creaturePlacer.selectAIUnits();
    tlog(playerUnits);
    tlog(AIUnits);

    placeUnits(playerUnits, grid, grid.height-1);
    placeUnits(AIUnits, grid, 0);

    setSEQUENCE(playerUnits, AIUnits);
    tlog(SEQUENCE);
}

//Takes an array of units and places them in the mentioned row
function placeUnits(unitsArray, grid, row){

    for (var i in unitsArray){

        var unit = unitsArray[i];
        unit.position = grid.getLoc(i,row);

        grid.placeCreature(unit);

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

//set the sequence in which units take action. Also populate SEQUENCE global array.
function setSEQUENCE(playerUnits, AIUnits){
    SEQUENCE = $.merge(playerUnits, AIUnits);
    //unit with greater initiative comes first in the sequence
    SEQUENCE.sort(function(a,b){return b.initiative - a.initiative;});
}

window.module = window.module || {};
module.exports = CreaturePlacer;
