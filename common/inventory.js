

function localStorageGetOrSetVar(varname, defaultValue){
    if (localStorage.getItem(varname) === null) {
        //map level not set. Initialize it to 3.
        localStorage.setItem(varname, defaultValue);
    }
    return localStorage.getItem(varname);
}


function animateDrop(i, loc){
    
    console.log("animate dropping item "+i);
        
    var image_url = "";
    switch ( i ){
        case 0:
            image_url = 'common/images/healthPotion.png';
            break;
        case 1:
            image_url = 'common/images/strengthPotion.png';
            break;
        case 2:
            image_url = 'common/images/barkSkinPotion.png';
            break;
        default:
            break;
    }
    var duraton = 300+800*Math.random();
    animateNewObject(loc, GRIDNAME+"inventorybutton", duraton, image_url);
    
    $("#"+GRIDNAME+"inventorybutton").animate({opacity:'0.4'}, 400);
    $("#"+GRIDNAME+"inventorybutton").animate({opacity:'1.0'}, 400);
}
function animateNewObject(start, end, duration, image_url){
    
    var uniqueId = Math.random().toString(36).substr(2, 9);
    
    createAndAddImg(uniqueId, '30px', '30px', image_url);
    //tlog("Animating "+uniqueId+" from "+start +" to "+end+ " using "+image_url);
    
    //get the actual position() of the cells
    start = $("#"+start).position();
    end = $("#"+end).position();
    
    //tlog("Animating from "+start.top+","+start.left+" to "+end.top+","+end.left);
        
    $("#"+uniqueId).show();
    $("#"+uniqueId).offset({ top: start.top , left: start.left });
    $("#"+uniqueId).animate({
        left: end.left, 
        top: end.top, 
        opacity:'0.5' 
        }, duration , function() { 
            $(this).hide(); 
            var elem = document.getElementById(uniqueId);
            document.body.removeChild(elem);
        });
}
function createAndAddImg(id, width, height, image_url){
    //create and append an IMG to the document
    var oImg=document.createElement("img");
    oImg.setAttribute('id', id);
    oImg.setAttribute('width', width);
    oImg.setAttribute('height', height);
    oImg.setAttribute('src', image_url);
    //defaults
    oImg.setAttribute('alt', 'na');
    oImg.style.position="absolute";
    //append
    document.body.appendChild(oImg);
}
function dropItems(loc){
    
    console.log("Inside DropItems");;
    var dropChance = 30 + 2*(MAPLEVEL/100);
    
    //get enemy unit numbers.
    var eNum = 0;
    for ( var j=0; j<SEQUENCE.length ;  j++){
        if ( SEQUENCE[j].team != "1" ){
            eNum++;
        }
    }
    console.log(eNum+ " enemies detected to calculate dropChance");
    if (eNum != 0) dropChance = dropChance * 5 / eNum;

    while (dropChance > 0){
        var dropOrNot = parseInt(100*Math.random());
        if (dropChance >= dropOrNot){
            var itemNum = parseInt(100*Math.random());
            dropItem(itemNum, loc);
        }
        dropChance -= 100;
    }
}
function dropItem(itemNum, loc){
    /*
     * 0 = Health Potion
     * 1 = Strength Potion
     * 2 = Barkskin Potion
     */
    var item = 0;
    if (itemNum > 66){
        item = 2;
    }else if( itemNum > 33){
        item = 1;
    }
    console.log("dropping item "+item);
    
    INVENTORY[item] += 1;
    saveInventory();
    animateDrop(item, loc);
}
function loadInventory() {
    console.log("loading the player inventory..");
    INVENTORY = new Array();
    if (localStorage.getItem("ANTHILL_PLAYER_INVENTORY") === null) {
        //inventory is not set. Initialize it.
        INVENTORY[0] = 0; //Health Potion
        INVENTORY[1] = 0; //strength potion
        INVENTORY[2] = 0; //stoneskin potion

        //store the inventory in the local storage
        localStorage.setItem("ANTHILL_PLAYER_INVENTORY", JSON.stringify(INVENTORY));
    } else {
        //load the inventory
        var retrievedData = localStorage.getItem("ANTHILL_PLAYER_INVENTORY");
        INVENTORY = JSON.parse(retrievedData);
    }

    var str = '<div id="healthPotionIcon" class="potionIcon" onclick="useHealthPotion()">13</div>';
    str += '<div id="strengthPotionIcon" class="potionIcon" onclick="useStrengthPotion()">0</div>';
    str += '<div id="barkskinPotionIcon" class="potionIcon" onclick="useBarkskinPotion()">0</div>';
    //add more potions here

    str = '<div id="inventoryBox" class="ui-widget-content ui-corner-all" onclick="" style="display:none;">' + str + '</div>';

    //insert the inventory box to display
    //$('<div id="inventoryBox" class="ui-widget-content ui-corner-all" onclick="" style="display:none;">Inventory</div>').insertAfter("#failBox");
    $(str).insertAfter("#failBox");

}
function saveInventory() {
    console.log("Saving the player inventory..");
    if ( INVENTORY instanceof Array) {
        localStorage.setItem("ANTHILL_PLAYER_INVENTORY", JSON.stringify(INVENTORY));
    }
}
function showInventory() {
    //fill the inventory values correctly
    updateInventoryNumbers();
    $("#inventoryBox").toggle();
    var pos = $("#"+GRIDNAME+"inventorybutton").position();
    $("#inventoryBox").offset({
        top : pos.top + 46,
        //left: $(document).width()/2 -  157
        left : pos.left
    });
}
function updateInventoryNumbers() {
    $("#healthPotionIcon").html(INVENTORY[0]);
    $("#strengthPotionIcon").html(INVENTORY[1]);
    $("#barkskinPotionIcon").html(INVENTORY[2]);
}

/* Inventory items application effects */
function useHealthPotion() {
    var healAmount = 50;
    //health potion available
    numPotions = parseInt(INVENTORY[0]);
    if (numPotions > 0) {
        //get current unit
        uname = SEQUENCE[NEXTINDEX];
        var mxHealth = uname.maxHealth;
        var health = uname.health;
        if (health < mxHealth) {
            uname.setHealth(parseInt(health)+parseInt(healAmount));
            INVENTORY[0]--;
            saveInventory();
            updateInventoryNumbers();
        }
        else alert("Health is full already.");
    }
    else alert("No more health potions available!");
}
function useStrengthPotion() {
    var turns = 3;

    //strength potion available
    numPotions = parseInt(INVENTORY[1]);
    if (numPotions > 0) {
        //get current unit
        uname = SEQUENCE[NEXTINDEX];

        var ret = addEffects(uname, "strengthPotion", turns);

        if (ret == true) {
            INVENTORY[1] = --numPotions;
            saveInventory();
            updateInventoryNumbers();
        }
    }
}
function useBarkskinPotion() {
    var turns = 3;

    //barkskin potion available
    numPotions = parseInt(INVENTORY[2]);
    if (numPotions > 0) {
        //get current unit
        uname = SEQUENCE[NEXTINDEX];

        var ret = addEffects(uname, "barkSkinPotion", turns);

        if (ret == true) {
            INVENTORY[2] = --numPotions;
            saveInventory();
            updateInventoryNumbers();
        }
    }
}


EFFECTS = {};
function addEffects(unit, effect, turns){
    //check if the effect exists on the unit
    //no effects already
    if (!EFFECTS[unit.id]){
        var unit_effect = [];
        unit_effect[effect] = turns;
        EFFECTS[unit.id] = unit_effect;
    }
    else{
        var unit_effect = EFFECTS[unit.id];
        //if this specific effect exists
        if (unit_effect[effect] && unit_effect[effect] != 0){
            alert("this effect already exists.");
            return false;
        }
        else{
            unit_effect[effect] = turns;
            EFFECTS[unit.id] = unit_effect;
        }

    }

    return true;


	var eff = $('#'+unit+'_effects').val();
	
	if(eff.indexOf(effect) != -1){
    	console.log("Effect "+effect+" already exists for "+unit+".");
    	//Exit for now. Later, if decided to do it that way, the turns could be reset.
    	
    	return 1;
    	
    	//var idx1 = eff.indexOf(effect);
    	//var str = eff.substr(idx1);
   
   		//get the remaining turns
    	//var turns = str.match(/[0-9]*/);
    	//turn = turns[0];
    	
	}
	else{
		//add if doesnt exist
		eff = eff+" "+effect+"_"+turns;
		$('#'+unit+'_effects').val(eff);
		console.log("Effect "+effect+" set for "+unit);
		
		return 0;
	}
}



/*
javascrit Map
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map


var myMap = new Map();

var keyString = 'a string',
    keyObj = {},
    keyFunc = function() {};

// setting the values
myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj, 'value associated with keyObj');
myMap.set(keyFunc, 'value associated with keyFunc');

myMap.size; // 3

// getting the values
myMap.get(keyString);    // "value associated with 'a string'"
myMap.get(keyObj);       // "value associated with keyObj"
myMap.get(keyFunc);      // "value associated with keyFunc"

myMap.get('a string');   // "value associated with 'a string'"
                         // because keyString === 'a string'
myMap.get({});           // undefined, because keyObj !== {}
myMap.get(function() {}) // undefined, because keyFunc !== function () {}


myMap.forEach(function(value, key) {
  console.log(key + ' = ' + value);
});
// Will show 2 logs; first with "0 = zero" and second with "1 = one"
Object.keys(obj).forEach(function(key,index) {
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
});

* 
* 
* 
* */








