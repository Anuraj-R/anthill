

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

    //insert the inventory box
    var str = '<div id="healthPotionIcon" class="potionIcon" onclick="useHealthPotion()">13</div>';
    str += '<div id="strengthPotionIcon" class="potionIcon" onclick="useStrengthPotion()">0</div>';
    str += '<div id="barkskinPotionIcon" class="potionIcon" onclick="useBarkskinPotion()">0</div>';
    str = '<div id="inventoryBox" class="ui-widget-content ui-corner-all" onclick="" style="display:none;">' + str + '</div>';
    $(str).insertAfter("#failBox");

    //insert the menu box
    str = '<div id="soundIcon" class="menuIcon" onclick="toggleSound()"></div>';
    str += '<div id="musicIcon" class="menuIcon" onclick="toggleMusic()"></div>';
    str += '<div id="helpIcon" class="menuIcon" onclick="showHelp()"></div>';
    str = '<div id="menuBox" class="ui-widget-content ui-corner-all" onclick="" style="display:none;">' + str + '</div>';
    $(str).insertAfter("#failBox");

}
function saveInventory() {
    console.log("Saving the player inventory..");
    if ( INVENTORY instanceof Array) {
        localStorage.setItem("ANTHILL_PLAYER_INVENTORY", JSON.stringify(INVENTORY));
    }
}
function showInventory() {
    updateInventoryNumbers();
    $("#inventoryBox").toggle();
    $("#menuBox").hide();
    hideStats();
    var pos = $("#"+GRIDNAME+"inventorybutton").position();
    $("#inventoryBox").offset({
        top : pos.top + 46,
        left : pos.left
    });
}
function updateInventoryNumbers() {
    $("#healthPotionIcon").html(INVENTORY[0]);
    $("#strengthPotionIcon").html(INVENTORY[1]);
    $("#barkskinPotionIcon").html(INVENTORY[2]);
}

function showMenu() {
    setMusic();
    setSound();
    $("#inventoryBox").hide();
    $("#menuBox").toggle();
    hideStats();
    var pos = $("#"+GRIDNAME+"mapbutton").position();
    $("#menuBox").offset({
        top : pos.top + 46,
        left : pos.left
    });
}

/* Inventory items application effects */
function useHealthPotion() {
    var healAmount = 50;
    //health potion available
    numPotions = parseInt(INVENTORY[0]);
    if (numPotions > 0) {
        //get current unit
        crit = SEQUENCE[NEXTINDEX];
        var mxHealth = crit.maxHealth;
        var health = crit.health;
        if (health < mxHealth) {
            crit.setHealth(parseInt(health)+parseInt(healAmount));
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
    usePotion("strengthPotion", turns);
}
function useBarkskinPotion() {
    var turns = 3;
    usePotion("barkSkinPotion", turns);
}

function usePotion(potion, turns){

    /* TODO
    //remove this mental map of positioning potions and improve the inventory structure    */
   var idx = 0;
   if(potion == "strengthPotion")idx = 1;
   if(potion == "barkSkinPotion")idx = 2;

    //barkskin potion available
    numPotions = parseInt(INVENTORY[idx]);
    if (numPotions > 0) {
        //get current unit
        uname = SEQUENCE[NEXTINDEX];
        var ret = uname.applyEffect(potion, turns);

        if (ret == true) {
            INVENTORY[idx] = --numPotions;
            saveInventory();
            updateInventoryNumbers();
        }
    }
}


