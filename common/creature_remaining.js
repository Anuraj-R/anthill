
var CREATURES = new Units();

function Units() {
    this.units = [];

    this.add = function(unit) {
        this.units.push(unit);
    };
    this.remove = function(id) {
        CreatureLog( typeof (id));
        CreatureLog(this.units[id]);
        llog(9, "Seeking to remove " + id);
        for (var i = 0; i < this.units.length; i++) {
            if (id == this.units[i].id) {
                llog(9, "removing " + this.units[i].id + " of type " + this.units[i].name);
                this.units.splice(i, 1);
                break;
            }
        }
    };
    this.list = function() {
        CreatureLog("Listing Units");
        for (var i = 0; i < this.units.length; i++) {
            llog(9, "listing " + this.units[i].id + " of type " + this.units[i].name);
        }
    };
}

function getCreatureIndex(unit_type) {
    var i;
    for ( i = 0; i < Creatures.length; i++) {
        if (Creatures[i][0] == unit_type) {
            break;
        }
    }
    if (i == Creatures.length) {
        llog(9, "A creature by the name " + unit_type + " not found in the database. Exiting with null");
        i = -1;
    }
    return i;
}



//returns type Creature
function CreateCreature(unit_type) {

    var unit = null;
    var i = getCreatureIndex(unit_type);
    if (i != -1) {
        //name, 			attack, 	defence, 			moves, 			type, 		initiative, 	range, 			rangedDefence, 	maxHealth
        unit = new Creature(Creatures[i][0], Creatures[i][1], Creatures[i][2], Creatures[i][4], Creatures[i][7], Creatures[i][8], Creatures[i][9], Creatures[i][10], Creatures[i][11]);
        CREATURES.add(unit);
    }
    return unit;
}



function getCreatureAttack(unit_type) {
    var i = getCreatureIndex(unit_type);
    return Creatures[i][1];
}

function getCreatureMaxHealth(unit_type) {
    var i = getCreatureIndex(unit_type);
    return Creatures[i][10];
}

function addStatsTable() {
    $("body").append(statsTable);

    //update unit stats from saved structures
    updateUnitStats();
    loadInventory();
    determineAudio();

    //determine audio status muted/on
    //play music
    playMusic();

    //edit DROPCHANCE
    DROPCHANCE = [0, 0, 0, 0];
}

function updateUnitStats() {
    CreatureLog("Inside updateUnitStats");

    var x = document.getElementsByName("armies");
    CreatureLog(x.length + " units found.");

    for (var i = 0; i < x.length; i++) {
        var updUnitName = getArmyId(x[i].id);
        //CreatureLog("Updating "+updUnitName );

        //Get the unit/array name without number
        var updNam = updUnitName.replace(/[0-9]*__/i, '');

        //reference array using the array name stored in updNam string (like "Spider" )
        var array_name = this[updNam];
        if ( array_name instanceof Array) {
            CreatureLog("Array found " + updNam + ": " + array_name);

            //init the values
            initValues(updUnitName, array_name);

        } else {
            CreatureLog("Array named " + updNam + " NOT found");
        }
    }
}

//takes the army id (eg. 8__DebutaAnt) and the corresponding value Array (eg. DebutAnt)
function initValues(armyID, val_array) {

    for (var i = 0; i < 12; i++) {
        //skip indices 0,3,6  (name, location, team respectively)
        if (i != 0 && i != 3 && i != 6) {
            document.getElementById(armyID).getElementsByTagName("input")[i].value = val_array[i];
        }
    }

    //add the effects input field.
    $('#' + armyID + ">form").append('<input type="hidden" name="effects" id="' + armyID + "_effects" + '" value="" />');
}

function llog(level, string) {
    if (level >= LOGLEVEL) {
        CreatureLog(string);
    }
}

function CreatureLog(data){
    if( LOGGINGSCOPE.includes("CREATURE") ){
		console.log(data);
	}
}
