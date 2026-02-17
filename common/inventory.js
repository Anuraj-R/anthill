

function localStorageGetOrSetVar(varname, defaultValue){
    if (localStorage.getItem(varname) === null) {
        localStorage.setItem(varname, defaultValue);
    }
    return localStorage.getItem(varname);
}


var healthPotion = "HealthPotion";
var strengthPotion = "StrengthPotion";
var barkSkinPotion = "BarkSkinPotion";

function animateDrop(i, loc){
    
    console.log("animate dropping item "+i);
        
    var image_url = "";
    switch ( i ){
        case healthPotion:
            image_url = 'common/images/healthPotion.png';
            break;
        case strengthPotion:
            image_url = 'common/images/strengthPotion.png';
            break;
        case barkSkinPotion:
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
        if (SEQUENCE[j].team !== "1"){
            eNum++;
        }
    }
    console.log(eNum+ " enemies detected to calculate dropChance");
    if (eNum !== 0) dropChance = dropChance * 5 / eNum;

    while (dropChance > 0) {
        var dropOrNot = parseInt(100 * Math.random(), 10);
        if (dropChance >= dropOrNot) {
            var itemNum = parseInt(100 * Math.random(), 10);
            dropItem(itemNum, loc);
        }
        dropChance -= 100;
    }
}
function dropItem(itemNum, loc) {
    var item = healthPotion;
    if (itemNum > 66) {
        item = barkSkinPotion;
    } else if (itemNum > 33) {
        item = strengthPotion;
    }
    console.log("dropping item " + item);

    INVENTORY.set(item, (INVENTORY.get(item) || 0) + 1);
    saveInventory();
    animateDrop(item, loc);
}

function loadInventory() {
    console.log("loading the player inventory..");
    INVENTORY = new Map();
    if (localStorage.getItem("ANTHILL_INVENTORY_ITEMS") === null) {
        INVENTORY.set(healthPotion, 0);
        INVENTORY.set(strengthPotion, 0);
        INVENTORY.set(barkSkinPotion, 0);
        saveInventory();
    } else {
        var ANTHILL_INVENTORY_ITEMS = JSON.parse(localStorage.getItem("ANTHILL_INVENTORY_ITEMS"));
        var ANTHILL_INVENTORY_NUMBERS = JSON.parse(localStorage.getItem("ANTHILL_INVENTORY_NUMBERS"));
        for (var i = 0; i < ANTHILL_INVENTORY_ITEMS.length; i++) {
            INVENTORY.set(ANTHILL_INVENTORY_ITEMS[i], ANTHILL_INVENTORY_NUMBERS[i]);
        }
    }

    //insert the inventory box
    var str = '<div id="healthPotionIcon" class="potionIcon" onclick="useHealthPotion()">0</div>';
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
    var ANTHILL_INVENTORY_ITEMS = [];
    var ANTHILL_INVENTORY_NUMBERS = [];
    INVENTORY.forEach(function (count, item) {
        ANTHILL_INVENTORY_ITEMS.push(item);
        ANTHILL_INVENTORY_NUMBERS.push(count);
    });
    localStorage.setItem("ANTHILL_INVENTORY_ITEMS", JSON.stringify(ANTHILL_INVENTORY_ITEMS));
    localStorage.setItem("ANTHILL_INVENTORY_NUMBERS", JSON.stringify(ANTHILL_INVENTORY_NUMBERS));
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
    $("#healthPotionIcon").html(INVENTORY.get(healthPotion) || 0);
    $("#strengthPotionIcon").html(INVENTORY.get(strengthPotion) || 0);
    $("#barkskinPotionIcon").html(INVENTORY.get(barkSkinPotion) || 0);
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
    usePotion(new HealthPotion(healAmount));
}

function useStrengthPotion() {
    var turns = 3;
    usePotion(new StrengthPotion(turns));
}

function useBarkskinPotion() {
    var turns = 3;
    usePotion(new BarkSkinPotion(turns));
}

function usePotion(potion) {
    var numPotions = parseInt(INVENTORY.get(potion.name) || 0, 10);
    if (numPotions > 0) {
        var ret = potion.applyEffect(Grid.currentCreature());
        if (ret === true) {
            INVENTORY.set(potion.name, numPotions - 1);
            saveInventory();
            updateInventoryNumbers();
        }
    }
}

