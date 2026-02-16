var showStartMessageState = true;
var showFailMessageState = true;
var showWinMessageState = true;

function centrify(messageBox) {
    $("#" + messageBox).offset({
        top: BLOCKSIZE,
        left: $(document).width() / 2 - 157
    });
}
function popBox(msgBox) {
    var $box = $("#" + msgBox);
    $box.show();
    if (msgBox === "startBox") {
        $box.css({ opacity: 0 }).animate({ opacity: 1 }, 400);
    } else {
        var textColor = msgBox === "failBox" ? "#f5e6d3" : "#2D1A1C";
        $box.animate({
            color: textColor,
            width: BLOCKSIZE * 7
        }, 800);
    }
}

function fillBox(msgBox, msg) {
    $("#" + msgBox).html(msg);
}

function showStartMessage() {
    var msg = '<div class="start-title">Ready for Battle</div>';
    msg += '<div class="start-mission">Destroy the enemy and secure the area.</div>';
    msg += '<div class="start-cta">Tap here to start</div>';
    fillBox("startBox", msg);

    if (showStartMessageState) {
        popBox("startBox");

    } else {
        //user clicked on the box. fadeout the box and start music
        $("#startBox").fadeOut("fast");
        playMusic();
        selectNextUnit();
    }
    showStartMessageState = !showStartMessageState;
}
function showWinMessage() {

    var msg = "<p><br><br><br><br><br>";
    msg += "<br><br>Well done warrior! You have unlocked more adventures! <br><br>Tap here to dismiss this message.<br><br></p>";
    fillBox("winBox", msg);

    centrify("winBox");
    if (showWinMessageState) {

        popBox("winBox");
        showWinMessageState = !showWinMessageState;
    } else {
        $("#winBox").fadeOut("slow", function () {
            showWinMessageState = !showWinMessageState;
            window.location = "maplist.html";
        });
    }
}
function showFailMessage() {
    centrify("failBox");
    if (showFailMessageState) {
        popBox("failBox");
        showFailMessageState = !showFailMessageState;
    } else {
        $("#failBox").fadeOut("slow", function () {
            // Animation complete.
            showFailMessageState = !showFailMessageState;

            //redirect to the same page without changing MAPLEVEL
            window.location = "map.html";
        });
    }
}
