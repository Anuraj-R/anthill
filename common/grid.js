

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

class Grid{

    constructor(width, height, gridName, mapLevel){
        this.width = width;
        this.height = height;
        this.gridName = gridName;
        this.mapLevel = mapLevel;
        //this.paintingAlgorithm = ( MAPLEVEL % 5 == 0 ) ? paintWolframGrid(GRIDNAME) : perlinAntMap(GRIDNAME);
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

    perlinAntMap() {

        //ant starts at 0,0 and moves randomly, painting the terrain
        var x=0, y=0;
        noise.seed(Math.random());
        
        for (var i=0; i<this.width*this.height; i++){
        
            var mov = Math.random();
            if (mov < .25){ //moveleft
                (x == 0)? x = this.width-1 : x = (x-1);
            } else if (mov < .5) { //moveright
                (x == this.width-1)? x = 0 : x = (x+1);
            } else if (mov < .75) { //moveup
                (y == 0)? y = this.height-1 : y = (y-1);
            } else { //movedown
                (y == this.height-1)? y = 0 : y = (y+1);
            }
                
            var val = noise.perlin2(y / 100, x / 100);
            //console.log("antval is: " + val);
            
            var tileID = GRIDNAME + "_"+ x + "x" + y;
            if (val < -0.02){ //BOG
                Grid.terrainPaint(tileID, BOG, "BOGtile");
            }
            else if (val <.03){ //WOODS
                Grid.terrainPaint(tileID, WOODS, "WOODStile");
            }
            else if (val <.07){ //HEIGHTS
                Grid.terrainPaint(tileID, HEIGHTS, "HEIGHTStile");
            }
            else{ //PLAINS
                Grid.terrainPaint(tileID, PLAINS, "PLAINStile");
            }
        }
    }
}

window.module = window.module || {};
module.exports = Grid;
