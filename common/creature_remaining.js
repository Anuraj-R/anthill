
function Units() {
    this.units = [];

    this.add = function(unit) {
        this.units.push(unit);
    };
    this.remove = function(id) {
        CreatureLog( typeof (id));
        CreatureLog(this.units[id]);
        CreatureLog(9, "Seeking to remove " + id);
        for (var i = 0; i < this.units.length; i++) {
            if (id == this.units[i].id) {
                CreatureLog(9, "removing " + this.units[i].id + " of type " + this.units[i].name);
                this.units.splice(i, 1);
                break;
            }
        }
    };
    this.list = function() {
        CreatureLog("Listing Units");
        for (var i = 0; i < this.units.length; i++) {
            CreatureLog(9, "listing " + this.units[i].id + " of type " + this.units[i].name);
        }
    };
}


function getCreatureAttack(unit_type) {
    var i = Creature.getIndex(unit_type);
    return Creatures[i][1];
}

function getCreatureMaxHealth(unit_type) {
    var i = Creature.getIndex(unit_type);
    return Creatures[i][11]; // maxHealth is at index 11
}

function addStatsTable() {
    var $target = $("#container").length ? $("#container") : $("body");
    $target.append(statsTable);

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

function CreatureLog(data){
    if( LOGGINGSCOPE.includes("CREATURE") ){
		console.log(data);
	}
}
