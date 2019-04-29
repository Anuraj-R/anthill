


var statsTable = ""+
'<table id="statsTable" name="statsTable">														'+
'	<tr><td colspan="2">                                                                        '+
'		<div class="statsTableButtons" id="statsTablePrevBtn" onclick="showPrevUnit()"></div>   '+
'		<div class="statsTableButtons" id="statsTablePic"></div>                                '+
'		<div class="statsTableButtons" id="statsTableNxtBtn" onclick="showNextUnit()"></div>    '+
'		<div class="statsTableButtons" id="statsTableCloseBtn" onclick="hideStats()"></div>     '+
'	</td></tr>                                                                                  '+
'	<tr><td>Name		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Attack		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Defense		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Location	</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Moves		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Health		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Team		</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Unit Type	</td>                                                                   '+
'		<td>.</td></tr>                                                                         '+
'	<tr><td>Initiative	</td>                                                                   '+
'       <td>.</td></tr>                                                                         '+
'    <tr><td>Range		</td>                                                                   '+
'    	<td>.</td></tr>                                                                         '+
'    <tr><td>Ranged Defense</td>                                                                '+
'        <td>.</td></tr>                                                                        '+
'    <tr><td>Hit Points	</td>                                                                   '+
'        <td>.</td></tr>                                                                        '+
'    <tr><td>Effects	</td>                                                                   '+
'        <td>.</td></tr>                                                                        '+
'</table>                                                                                       ';

var SHOWINDEX = 0;
function showStats(x){
    //find the clicked location in the sequence box. and set SHOWINDEX to the clicked index.
    //this is required when user clicks next/previous buttons
    var uid = x.replace("orderBox","");
    for ( var i=0; i<SEQUENCE.length; i++) 
        if ( uid === SEQUENCE[i].id ) 
            SHOWINDEX = i;

    fillStatsTable(uid);
    $("#statsTable").show();
    
    //show the menu on the left hand corner of map
    var position = $("#"+GRIDNAME+"inventorybutton").position();
    $("#statsTable").offset({left:position.left+48,top:position.top+48});
}

function hideStats(){
    $("#statsTable").hide();
}

function showNextUnit(){
	SHOWINDEX = (SHOWINDEX + 1) % SEQUENCE.length;
	showStats( SEQUENCE[SHOWINDEX].id );
}

function showPrevUnit(){
	SHOWINDEX = (SHOWINDEX - 1 + SEQUENCE.length) % SEQUENCE.length;
	showStats( SEQUENCE[SHOWINDEX].id );
}

function fillStatsTable(uname){

    $("#statsTable").remove();
    $("body").append('<table id="statsTable" name="statsTable">'); 

    var thisUnit = SEQUENCE[0];
    for (var i=0; i<SEQUENCE.length ; i++){
        if(SEQUENCE[i].id === uname){
            thisUnit = SEQUENCE[i];
            break;
        }
    }

    var str = ""+
    '<table id="statsTable" name="statsTable">														'+
    '	<tr><td colspan="2">                                                                        '+
    '		<div class="statsTableButtons" id="statsTablePrevBtn" onclick="showPrevUnit()"></div>   '+
    '		<div class="statsTableButtons" id="statsTablePic"></div>                                '+
    '		<div class="statsTableButtons" id="statsTableNxtBtn" onclick="showNextUnit()"></div>    '+
    '		<div class="statsTableButtons" id="statsTableCloseBtn" onclick="hideStats()"></div>     '+
    '	</td></tr>                                                                                  ';
    //TODO: update terrain bonus
    str+='<tr><td>Name</td><td>'+thisUnit.name+'</td></tr>'					;
    str+='<tr><td>Attack</td><td>'+thisUnit.attack+'</td></tr>'              ;
    str+='<tr><td>Defence</td><td>'+thisUnit.defence+'</td></tr>'            ;
    str+='<tr><td>Health</td><td>'+thisUnit.health+'</td></tr>'              ;
    str+='<tr><td>MaxHealth</td><td>'+thisUnit.maxHealth+'</td></tr>'        ;
    str+='<tr><td>Range</td><td>'+thisUnit.range+'</td></tr>'                ;
    str+='<tr><td>RangedDefence</td><td>'+thisUnit.rangedDefence+'</td></tr>';
    str+='<tr><td>Initiative</td><td>'+thisUnit.initiative+'</td></tr>'      ;
    str+='<tr><td>Type</td><td>'+thisUnit.type+'</td></tr>'                  ;
    str+='<tr><td>Team</td><td>'+thisUnit.team+'</td></tr>'                  ;
    str+='<tr><td>Position</td><td>'+thisUnit.position+'</td></tr>'          ;

    //update effects
    /*
    for (var key in array) {
        var value = array[key];
        console.log(key, value);
    }
    */
   str+='<tr><td>Effects	</td><td>';
                   
    var effs = "";
    var arr = EFFECTS[thisUnit.id];
    for (var key in arr){
        var value = arr[key];
        if(value!=0) effs+= key + "(" + value + ")<br>";
    }
    str+=effs + '</td></tr>';

    //close the table
    str+='</table>';

    $("#statsTable").html(str);

    //put the picture
    var unitName = thisUnit.name;
    var imgurl = document.getElementById("creatureImage_"+thisUnit.id).src;
    $('#statsTablePic').css("background-image", "url("+imgurl+")");  
    $('#statsTableNxtBtn').css("background-image", "url(common/images/next.png)");  
    $('#statsTablePrevBtn').css("background-image", "url(common/images/prev.png)");  
    $('#statsTableCloseBtn').css("background-image", "url(common/images/close.png)");  



    return;
}
