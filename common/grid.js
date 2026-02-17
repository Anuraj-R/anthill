

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


// Tile mobility constants
var IMPASSABLE = -1;
var MOVABLE = 1;
var NONE = "none";

/** Represents tile state: mobility and stationed unit (if any) */
function TileProperties(movable, station) {
    this.movable = movable;
    this.station = station;
    return this;
}

class Grid{

    constructor(width, height, gridName, mapLevel){
        this.width = width;
        this.height = height;
        this.name = gridName;
        this.mapLevel = mapLevel;
        this.tiles = new Array();
        this.html = this.createHtml();
    }


    resetTile(tile) { this.tiles[tile] = new TileProperties(MOVABLE, NONE); }

    placeCreature(creature) { this.tiles[creature.position] = new TileProperties(MOVABLE, creature); }

    isImpassable(loc){ return this.tiles[loc].movable == IMPASSABLE; }

    isVacant(loc){ return this.tiles[loc].station == NONE; }

    isMovable(loc){ return ( this.isVacant(loc) && (!this.isImpassable(loc))); }

    station(loc){ return this.tiles[loc].station; }

    moveCreature(creature, loc){
        this.resetTile(creature.position);
        this.tiles[loc].station = creature;
    }

    isEnemy(loc, team){
        if ( ! this.isVacant(loc) ){
            if(this.station(loc).team != team) return true;
        }
        return false;
    }

    createHtml(){
        var grid = "";
        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++){
                var cellName = this.name + "_"+ i + "x" + j ;
                grid += '<div id="' + cellName + '" class="mapTile" onclick="selectForMove(' + cellName + ')" ></div>';
                //console.log ("Created "+name +"_"+ i + "x" + j);
                this.tiles[this.name + "_" + i + "x" + j] = new TileProperties(MOVABLE, NONE);
            }
            grid += "<br>";
        }
        return grid;
    }

    paint(){
        this.perlinAntMap();
        //( this.mapLevel % 5 == 0 ) ? paintWolframGrid(GRIDNAME) : perlinAntMap();
    }

    getHtml(){ return this.html; }

    static terrainPaint(tileID, terrainArray, terrainClass){

        var imgIndex = ( Math.floor(100 * Math.random()) ) % terrainArray.length;
        var link = terrainArray[imgIndex];
        document.getElementById(tileID).style.backgroundImage = "url(\"" + link + "\")";

        $("#"+tileID).addClass(terrainClass);
    }

    //An ant starts at 0,0 and moves randomly, painting the terrain
    perlinAntMap() {

        var x=0, y=0;
        noise.seed(Math.random());
        for (var i=0; i<this.width*this.height; i++){

            var move = Math.random();
            if (move < .25) (x == 0)? x = this.width-1 : x = (x-1);       //move left
            else if (move < .5)  (x == this.width-1)? x = 0 : x = (x+1);  //move right
            else if (move < .75) (y == 0)? y = this.height-1 : y = (y-1); //move up
            else (y == this.height-1)? y = 0 : y = (y+1);                 //move down

            var tileID = GRIDNAME + "_"+ x + "x" + y;
            var val = noise.perlin2(y / 100, x / 100);
            if (val < -0.02) Grid.terrainPaint(tileID, BOG, "BOGtile");
            else if (val <.03) Grid.terrainPaint(tileID, WOODS, "WOODStile");
            else if (val <.07) Grid.terrainPaint(tileID, HEIGHTS, "HEIGHTStile");
            else Grid.terrainPaint(tileID, PLAINS, "PLAINStile");
        }
    }

    static currentCreature(){
        return SEQUENCE[NEXTINDEX];
    }

    getLoc(x,y){
        return this.name + "_"+ x + "x" + y;
    }

    static getX(loc){
        var xLoc = loc.lastIndexOf("x");
        var xyStart = 1+loc.lastIndexOf("_");
        return parseInt(loc.slice(xyStart,xLoc));
    }

    static getY(loc){
        var xLoc = loc.lastIndexOf("x");
        return parseInt(loc.slice(xLoc+1));
    }
}

window.module = window.module || {};
module.exports = Grid;
