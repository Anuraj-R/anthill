

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
                neighbors = this.findAdjacentTiles(u);
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

    findSmallestUnvisitedInDist(){
        var smallestUnvisitedVertex="none";
        for (var j=0;j<this.grid.width;j++){
            for (var i=0;i<this.grid.height;i++){
                var vertex = this.grid.name+'_'+j+"x"+i;
                if ( this.visited[vertex] == "NO"){
                    if ( smallestUnvisitedVertex == "none" || this.dist[vertex] < this.dist[smallestUnvisitedVertex]){
                        smallestUnvisitedVertex = vertex;
                    }
                }
            }
        }
        return smallestUnvisitedVertex;
    }

    findAdjacentTiles(node){

        var arr = new Array();
    
        //get maximum allowable values for coordinates
        var xNum = this.grid.width-1;
        var yNum = this.grid.height-1;
    
        var xVal = Grid.getX(node);
        var yVal = Grid.getY(node);

        //Four side squares
        (yVal > 0)      && this.addToArray(arr,(xVal),(yVal-1)); //up
        (yVal < yNum)   && this.addToArray(arr,(xVal),(yVal+1)); //down
        (xVal > 0)      && this.addToArray(arr,(xVal-1),(yVal)); //left
        (xVal < xNum)   && this.addToArray(arr,(xVal+1),(yVal)); //right
    
        //Four corner squares
        (yVal > 0 && xVal > 0)      && this.addToArray(arr,(xVal-1),(yVal-1));
        (yVal < yNum && xVal < xNum)&& this.addToArray(arr,(xVal+1),(yVal+1));
        (yVal > 0 && xVal < xNum)   && this.addToArray(arr,(xVal+1),(yVal-1));
        (yVal < yNum && xVal > 0)   && this.addToArray(arr,(xVal-1),(yVal+1));
    
        return arr;
    }

    addToArray(arr, x, y) {
        var loc = this.grid.getLoc(x, y);
        if (this.grid.isMovable(loc)) {
            arr.push(loc);
        }
    }
}

function distance (tile1, tile2){
    var x1 = Grid.getX(tile1);
    var y1 = Grid.getY(tile1);
    var x2 = Grid.getX(tile2);
    var y2 = Grid.getY(tile2);
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function pushQ( Q , node ){
    return Q+"/"+node+"/";
}

function popQ( Q , node ){
    return Q.replace("/"+node+"/","");
}

window.module = window.module || {};
module.exports = PathFinder;
