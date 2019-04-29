/* eslint-disable no-console */

/* This is the pool of units from which armies are formed automatically
   based on the map-level.
   There is also an additional unit called DebutAnt, which is unique and
   part of every player-army on all levels. */

   //var playerUnitsPool = [ "KidSlinger", "WarrAnt", "FormicArcher" ];
   var AIUnitsPool = [ "Spider","Spidlings","GreySpider","MutAnt","BlackWidow",
                   "RedTailSpider","BogTroll", "SpiderQueen"];
   

class CreaturePlacer{

    constructor(mapLevel, grid){
        this.grid = grid;
        this.mapLevel = mapLevel;
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
        console.log("player weight is: " + calcWeightOfArray(playerUnits));
    
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

window.module = window.module || {};
module.exports = CreaturePlacer;
