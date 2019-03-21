


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
    
    CA = new wolfram(design,8,32);
    CA.display(GRIDNAME);
    paintcount++;
    
}

