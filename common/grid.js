

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


//tileProperties.movable; 
//These are temporary values used to help functions communicate the state of the map
//They may not reflect the actual state of the tile
//var EMPTY = 0;
var IMPASSABLE = -1;
var MOVABLE = 1;
var NONE = "none";
//contains the movability of the tile, and the name of the unit stationed if any
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

class Grid{

    constructor(width, height, gridName, mapLevel){
        this.width = width;
        this.height = height;
        this.gridName = gridName;
        this.mapLevel = mapLevel;
        this.html = this.createHtml();
    }

    createHtml(){
        var grid = "";
        console.log ("Creating grid named "+this.gridName );
        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++){
                var cellName = this.gridName + "_"+ i + "x" + j ;
                grid += '<div id="' + cellName + '" class="mapTile" onclick="selectForMove(' + cellName + ')" ></div>';
                //console.log ("Created "+name +"_"+ i + "x" + j);
                TILES[this.gridName +"_"+ i + "x" + j] = new tileProperties(MOVABLE, NONE);
            }
            grid += "<br>";
        }
        return grid;
    }

    paint(){
        this.perlinAntMap();
        //( this.mapLevel % 5 == 0 ) ? paintWolframGrid(GRIDNAME) : perlinAntMap();
    }

    getHtml(){
        return this.html;
    }

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
}

window.module = window.module || {};
module.exports = Grid;
