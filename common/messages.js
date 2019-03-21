var showStartMessageState = true;
var showFailMessageState = true;
var showWinMessageState = true;

var antMessage = "The ant's a centaur in his dragon world."+
"So, uh, do you ever worry that your itsy little neck is just going to snap under the weight of your head? "+
"Stop asking me that. You ask me that, like, every five minutes. "+
"Sometimes I notice my antennae out of the corner of my eye and I'm all, like: AHH! Something is on me! Get it off! Get it off! "+
"Yeah, the antennae again. Listen, I just remembered, I have to go walk around aimlessly now. "+
"Okay, So Maybe I Do Have Superpowers "+
"What is it about the ant way of life that has stood the test of time so well? All ants belong to extended families, and carry their "+
"prey home to share. Unselfishness is the rule. Everything they do is for their colony's good. "+
"Little Creatures Who Run the World "+
"Still we live meanly, like ants ... our life is frittered away by detail. "+
"Life is priceless even to an ant."+
"Many ants kill a camel."+
"The tiny ant, a creature of great industry, drags with its mouth whatever it can, "+
"and adds it to the heap which she is piling up, not unaware nor careless of the future."+
"The greatest enemies of ants are other ants, just as the greatest enemies of spiders are other spiders."+
"Ants are not only efficient, they are hard-working and thrifty, qualities which"+
" have always seemed like good reasons for seeing them as virtuous role models."+
"An ant on the move does more than a dozing ox."+
"The ant is knowing and wise, but he doesn't know enough to take a vacation. The worshipper of energy is too physically "+
"energetic to see that he cannot explore certain higher fields until he is still."+
"Ants are so much like grass hoppers as to be an embarrassment. They farm fungi, raise aphids as livestock, "+
"launch armies into wars, use chemical sprays to alarm and confuse enemies, capture slaves. The families of "+
"weaver ants engage in child labor, holding their larvae like shuttles to spin out the thread that sews the "+
"leaves together for their fungus gardens. They exchange information ceaselessly. They do everything but watch television. ";

var dinkamMessage = "king in Pankilam."+
"What profit hath a ant of all his labour which he taketh under the sun? One generation passeth away, and another generation cometh "+
"but the earth abideth for ever. "+
"The sun also ariseth, and the sun goeth down, and hasteth to his place where he arose. "+
"The wind goeth toward the south, and turneth about unto the north; it whirleth about continually, and the wind returneth again according "+
"to his circuits. "+
"All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again. "+
"All things are full of labour; ant cannot utter it the eye is not satisfied with seeing, nor the ear filled with hearing. "+
"The thing that hath been, it is that which shall be; and that which is done is that which shall be done and there is no new thing under "+
"the sun. "+
"Is there any thing whereof it may be said, See, this is new? it hath been already of old time, which was before us. "+
"There is no remembrance of former things; neither shall there be any remembrance of things that are to come with those that shall come "+
"after. "+
"I the Preacher was king over AntHill in Pankilam. "+
"And I gave my heart to seek and search out by wisdom concerning all things that are done under heaven this sore travail hath God given "+
"to the sons of ant to be exercised therewith. "+
"I have seen all the works that are done under the sun; and, behold, all is vanity and vexation of spirit. "+
"That which is crooked cannot be made straight and that which is wanting cannot be numbered. "+
"I communed with mine own heart, saying, Lo, I am come to great estate, and have gotten more wisdom than all they that have been before me "+
"in Pankilam yea, my heart had great experience of wisdom and knowledge. "+
"And I gave my heart to know wisdom, and to know madness and folly I perceived that this also is vexation of spirit. "+
"For in much wisdom is much grief and he that increaseth knowledge increaseth sorrow. "+
"I said in mine heart, Go to now, I will prove thee with mirth, therefore enjoy pleasure and, behold, this also is vanity. "+
"I said of laughter, It is mad and of mirth, What doeth it? I sought in mine heart to give myself unto wine, yet acquainting mine heart with "+
"wisdom; and to lay hold on folly, till I might see what was that "+
"good for the sons of ant, which they should do under the heaven all the days of their life. ";

var order = 3;
var txt = antMessage + dinkamMessage;
var grams = {};
var beginnings = [];

function isUpper( charvar ){
    if (charvar == charvar.toLowerCase())return false;
    return true;
}

function DinkamQuote() {
    for (var i = 0; i < (txt.length - order); i++) {
        var gram = txt.substr(i, order);
        //mark it a suitable beginner gram for a sentence if it starts with an upper case
        if (isUpper(txt.charAt(i))) beginnings.push(gram);
        if (!grams[gram]) {
            grams[gram] = [];
            grams[gram].push(txt.charAt(i + order));
        }
        else {
            grams[gram].push(txt.charAt(i + order));
        }
    }

    //create chains
    var rand = Math.floor(Math.random() * beginnings.length);
    var nxt = beginnings[rand];
    var result = nxt;
    //get a beginning for each line
    for (var i = 0; i < 120;) {

        if (grams[nxt]) {
            var possibilities = grams[nxt];
            rand = Math.floor(Math.random() * possibilities.length);
            result = result + possibilities[rand];
            //break after a full sentence
            if (possibilities[rand] == ".") break;
            nxt = result.substr(++i, order);
        }
        else {
            break;
        }
    }
    return result + "<br><b>--Dinkam Stone</b>";
}


function centrify(messageBox) {
    $("#" + messageBox).offset({
        top: BLOCKSIZE,
        left: $(document).width() / 2 - 157
    });
}
function popBox(msgBox) {
    $("#" + msgBox).show();
    $("#" + msgBox).animate({
        color: "#2D1A1C",
        width: BLOCKSIZE * 7
    }, 800);
}

function fillBox(msgBox, msg) {
    $("#" + msgBox).html(msg);
}

function showStartMessage() {
    var msg = "<p><br><br><br><br><br><br>";
    msg += DinkamQuote();
    msg += "<br><br>Tap here to start the game!<br><br><br><br><br><br></p>";
    fillBox("startBox", msg);

    centrify("startBox");
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
    msg += DinkamQuote();
    msg += "<br><br>Well done warrior! You have unlocked more adventures! <br><br>Tap here to dismiss this message.<br><br></p>";
    fillBox("winBox", msg);

    centrify("winBox");
    if (showWinMessageState) {

        popBox("winBox");
        showWinMessageState = !showWinMessageState;
    } else {
        $("#winBox").fadeOut("slow", function () {
            // Animation complete.
            showWinMessageState = !showWinMessageState;

            //redirect to maplist
            //window.location = "../maplist.html";
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
