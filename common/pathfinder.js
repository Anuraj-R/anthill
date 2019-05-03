

class PathFinder {
    constructor(grid) {
        this.grid = grid;
        this.visited = new Array();
        this.dist = new Array();
        this.previous = new Array();
    }

    //Fills up this.previous[vertex] and this.dist[vertex] for each tile in the map, from using 'start' as starting point.
    //'end' is not used, always return -1 in dist which is also not used!
    pathFind (start){

        //Queue to keep nodes to be visited
        var Q = "";
        this.initializeArrays();

        //dist[source]  := 0;
        this.dist[start]=0;
        //insert source into Q;
        Q=pushQ(Q, start);

        //while Q is not empty:
        while (Q !== "" ){

            //u := vertex in Q with smallest distance in this.dist[] and has not been visited;
            //gets 'start' in the first round (since this.dist[start] is 0), nearer tiles to it from the next round onwards.
            var u = this.findSmallestUnvisitedInDist();

            //there are unvisited nodes
            if (u !== "none" ){

                //remove u from Q;
                Q=popQ(Q,u);

                //visited[u] := true
                this.visited[u]="YES";

                //for each neighbor v of u:
                //fill up distance to neighbors
                var neighbors = new Array();
                neighbors = this.findNeighbors(u);
                for (var i = 0; i < neighbors.length; i++) {

                    var v = neighbors[i];
                    var altDist = this.dist[u] + distance(u, v);

                    if ( altDist < this.dist[v] && this.visited[v] === "NO"){
                        this.dist[v] = altDist;
                        this.previous[v] = u;
                        Q=pushQ(Q, v);
                    }

                }
            }
            //all nodes visited
            else {
                Q="";
            }
        }
        return 0;
    }

    initializeArrays(){
        for (var j=0;j<this.grid.width;j++){
            for (var i=0;i<this.grid.height;i++){
                var vertex = this.grid.name+'_'+j+"x"+i;
                this.visited[vertex]="NO";
                this.dist[vertex]=1000;
                this.previous[vertex]="none";
            }
        }
    }

    //find the smallest value in array this.dist[cell] which is also unvisited (VISITED[cell]==NO)
    findSmallestUnvisitedInDist(){

        this.grid.iterateAll(this.testFn);

        //check if there is atleast one unvisited node.
        //If no, return 'none'.
        //If yes, get the first one and use it later for comparison with all other cells
        var smallest = this.findAnUnvisitedVertex();
        if (smallest == "none"){
            return "none";
        }

        //There is atleast one unvisited node found.
        //Check if it is the smallest in this.dist[]. If not, replace it with the smallest in this.dist[]
        for (var j=0;j<this.grid.width;j++){
            for (var i=0;i<this.grid.height;i++){
                var vertex = this.grid.name+'_'+j+"x"+i;

                if ( this.visited[vertex] == "NO"){
                    if (this.dist[vertex]<this.dist[smallest]){
                        smallest = vertex;
                    }
                }
            }
        }
        return smallest;
    }

    findAnUnvisitedVertex(){
        var unvisitedVertex="none";
        for (var j=0;j<this.grid.width;j++){
            for (var i=0;i<this.grid.height;i++){
                var vertex = this.grid.name+'_'+j+"x"+i;
                //if there are unvisited nodes
                if ( this.visited[vertex] == "NO"){
                    unvisitedVertex = vertex;
                }
            }
        }
        return unvisitedVertex;
    }

    findNeighbors(node){

        var tempArr = new Array();
        var index=0;
    
        //get maximum allowable values for coordinates
        var xNum = this.grid.width-1;
        var yNum = this.grid.height-1;
    
        var x = node.lastIndexOf("x");
        var start = 1+node.lastIndexOf("_");
        var xVal = parseInt(node.slice(start,x));
        var yVal = parseInt(node.slice(x+1));
    
        var containerPrefix = node.slice(0,start);
    
        this.addToArray = function(x,y){
            if (this.pathExists(x,y)){
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

    pathExists(x,y){
        var loc = this.grid.name+"_"+x+"x"+y;
        return this.grid.isMovable(loc);
    }

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

    var distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    if(isNaN(distance))console.log("distance from "+boxName1+" to "+boxName2 + " is " +distance);

    return distance;
}

function pushQ( Q , node ){
    return Q+"/"+node+"/";
}

function popQ( Q , node ){
    return Q.replace("/"+node+"/","");
}

window.module = window.module || {};
module.exports = PathFinder;
