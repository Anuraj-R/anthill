
var Creatures = [
    //0                1        2        3          4      5       6      7             8           9       10              11
    //name             attack,  defence, Location, moves, Health, Team, unit_type,  initiative, range, rangedDefence, maxHealth
    ["DebutAnt",       50,      40,      "-1x-1",   3.0,   120,    0,    "infantry",   99,         1.5,    20,             120 ],
    ["KidSlinger",     20,      -40,     "-1x-1",   1.5,   80,     0,    "ranged",     97,         2.24,   0,              80  ],
    ["WarrAnt",        35,      15,      "-1x-1",   4.5,   100,    0,    "infantry",   90,         1.5,    20,             100 ],
    ["FormicArcher",   45,      -30,     "-1x-1",   2.0,   80,     0,    "ranged",     98,         3.4,    20,             80  ],
    ["Spidlings",      20,      0,       "-1x-1",   2.0,   40,     0,    "ranged",     50,         2.0,    5,              40  ],
    ["Spider",         35,      5,       "-1x-1",   2.0,   70,     0,    "infantry",   40,         1.5,    30,             70  ],
    ["GreySpider",     45,      40,      "-1x-1",   3.0,   100,    0,    "infantry",   30,         1.5,    5,              100 ],
    ["MutAnt",         35,      0,       "-1x-1",   3.5,   90,     0,    "infantry",   90,         1.5,    0,              90  ],
    ["BlackWidow",     40,      40,      "-1x-1",   4.0,   140,    0,    "infantry",   30,         1.5,    20,             140 ],
    ["RedTailSpider",  40,      -15,     "-1x-1",   2.5,   80,     0,    "ranged",     30,         2.4,    10,             80  ],
    ["BogTroll",       150,     70,      "-1x-1",   2.0,   140,    0,    "infantry",   10,         1.5,    -30,            140 ],
    ["SpiderQueen",    120,     40,      "-1x-1",   3.5,   400,    0,    "ranged",     30,         2.2,    30,             400 ]
    ];

var CreatureImages = [
    ["DebutAnt",       "common/images/units/DebutAnt.png"          ],
    ["KidSlinger",     "common/images/units/kidslinger.png"        ],
    ["WarrAnt",        "common/images/units/WarrAnt.png"           ],
    ["FormicArcher",   "common/images/units/FormicArcher.png"      ],
    ["Spidlings",      "common/images/units/spidling.png"          ],
    ["Spider",         "common/images/units/spider.png"            ],
    ["GreySpider",     "common/images/units/grey_spider.png"       ],
    ["MutAnt",         "common/images/units/mutant.png"            ],
    ["BlackWidow",     "common/images/units/blackWidow.png"        ],
    ["RedTailSpider",  "common/images/units/RedTailSpider.png"     ],
    ["BogTroll",       "common/images/units/bogtroll.png"          ],
    ["SpiderQueen",    "common/images/units/redspider.png"         ]
    ];

// creates a Creature with unique ID, and increases the COUNTER used to generate IDs
var COUNTER=0;
class Creature {

    constructor(name, attack, defence, moves, type, initiative, range, rangedDefence, maxHealth) {
        this.id = "unit_" + COUNTER++;
        this.name = name;
        this.attack = attack;
        this.defence = defence;
        this.moves = moves;
        this.type = type;
        this.initiative = initiative;
        this.range = range;
        this.rangedDefence = rangedDefence;
        this.maxHealth = maxHealth;

        // defaults
        this.health = maxHealth;
        this.position = "-1x-1";
        this.team = 1;
        this.image = this.getCreatureImage();
        this.healthBar = this.createHealthBar();
        this.effects = "";
        
        this.log(9, "unit " + this.name + " created with ID " + this.id);
        return this;
    }

    getCreatureImage(){
        var i;
        for ( i = 0; i < CreatureImages.length; i++) {
            if (CreatureImages[i][0] == this.name) {
                return CreatureImages[i][1];
            }
        }
        this.log(9, "A creature image for " + this.name + " not found in the database. Exiting with null");
        return "";
    }

    // methods
    teamColor() {
        var col = "#00ff00";
        if (this.team == 1) {
            col = "#0000ff";
        }
        else if (this.team == 2) {
            col = "#ff0000";
        }
        else if (this.team == 3) {
            col = "#aaaaff";
        }
        else if (this.team == 4) {
            col = "#aaaaff";
        }
        else if (this.team == 9) {
            col = "#bebebe";
        }
        return col;
    }

    createHealthBar() {
        this.log("Creating healthbar for " + this.name);
        var barLength = 40;
        var col = this.teamColor();
        var greyLength = ((this.maxHealth - this.health) / this.maxHealth) * barLength;
        var greenLength = barLength - greyLength;
        var outerDiv = document.createElement('div');
        outerDiv.style.position = "absolute";
        //width, height, color
        var div = Creature.createDiv(greenLength + "px", "2px", col);
        outerDiv.appendChild(div);
        document.body.appendChild(outerDiv);
        return outerDiv;
    }
    
    //The target should be of a different team, this should be validated before calling this method.
    combat(enemy) {
        this.log("Combat --------> " + this.name + " attacks " + enemy.name + " at " + enemy.position);
        combatGeneric(this, enemy);
    }

    updateEffects() {
        //Add the effects
        var eff = this.effects;
        var arr = eff.split(' ');
        //update only valid effects in this variable and then replace.
        var effectsUpdated = "";
        for (var i = 0; i < arr.length; i++) {
            var effect = arr[i];
            var turns = parseInt(effect.split('_')[1]);
            if (turns > 1) {
                turns--;
                var newEff = effect.split('_')[0] + "_" + turns;
                //causes a leading whitespace. will this be a problem?
                effectsUpdated = effectsUpdated + " " + newEff;
            }
            //if turns are at 1 then it is the last turn, dont add this effect anymore
        }
        //update the new effects string
        this.effects = effectsUpdated;
    }

    moveTo(loc) {
        //update the TILES status array of the map
        TILES[this.position].station = NONE;
        TILES[loc].station = this;
        //update location
        this.position = loc;
        //reposition the image
        this.refreshGraphics();
        //legacy
        //support SELECTEDBOX which is a global variable used to identify the currently selected box
        //this is used for highlighting movables tiles and such
        SELECTEDBOX = "NONE";
    }

    refreshGraphics() {
        //get the cell offset and set the image location to that
        var pos = $("#" + this.position).offset();
        $("#creatureImage_" + this.id).animate({
            left: (pos.left),
            top: (pos.top)
        }, 200, function () {
            // Animation complete.
        });
        $(this.healthBar).detach();
        this.healthBar = this.createHealthBar();
        $(this.healthBar).offset({ top: pos.top - 12, left: pos.left });
        this.log("Refreshed graphics for " + this.name);
        //CreatureLog(this);
    }

    die() {
        this.log("Removing self: " + this.id);
        //mark the map tile empty
        TILES.reset(this.position);
        //fadeout the picture
        $("#creatureImage_" + this.id).fadeOut(600);
        //drop items if it is an enemy unit that got killed
        if (this.team != "1") {
            //drop Items based on DROPCHANCE
            this.log("Dropping items at " + this.position);
            dropItems(this.position);
        }
        //remove the unit from SEQUENCE
        var index = SEQUENCE.indexOf(this);
        SEQUENCE.splice(index, 1);
        //remove the unit from the orderBox
        //id orderBox+uname
        $("#orderBox" + this.id).remove();
        //If the dead unit's index is less than NEXTINDEX, reduce NEXTINDEX by 1
        //so that the very next unit in turn is not skipped
        if (index < NEXTINDEX) {
            NEXTINDEX -= 1;
        }
    }

    setHealth(num) {
        if (num > this.maxHealth) {
            this.health = this.maxHealth;
        }
        else if (num <= 0) {
            this.health = 0;
            this.die();
            return;
        }
        else {
            this.health = num;
        }
        this.refreshGraphics();
    }

    static createDiv(width, height, color) {
        var div = document.createElement('div');
        div.style.width = width;
        div.style.height = height;
        div.style.background = color;
        div.style.display = "inline-block";
        div.className = "healthbar";
        return div;
    }

    log(data){
        if (typeof LOGGINGSCOPE === "undefined"){
            var LOGGINGSCOPE="CREATURE";
        }
        if( LOGGINGSCOPE.includes("CREATURE") ){
            if (typeof data === 'string' || data instanceof String){
                // eslint-disable-next-line no-console
                console.log(this.name + ":---> " + data);
            }
            else{
                // eslint-disable-next-line no-console
                console.log(this.name + ":---> ");
                // eslint-disable-next-line no-console
                console.log(data);
            }
        }
    }

}

module.exports = Creature;
