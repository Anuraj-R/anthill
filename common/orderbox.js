/*
    This file maintains the box on the top, where
    the units are displayed in the order they would
    move.
*/


class OrderBox{

    constructor(GRIDNAME, BLOCKSIZE){
        
        this.id = GRIDNAME+"orderList"; //contains the ID used for the html element
        this.BLOCKSIZE = BLOCKSIZE;     //a value to scale the cards in the box
        this.firstUnitMoved = false;    //to handle the first time movement boundary condition

        this.cardSize = 37;
        this.bigSize = 43;
    }

    addToContainer(){
        var orderList = document.createElement('div');
        orderList.id = this.id;
        $("#container").append(orderList);
        $('#'+orderList.id).addClass("orderList");
        $('#'+orderList.id).css('width',this.BLOCKSIZE*4.6);
        $('#'+orderList.id).css('height',this.BLOCKSIZE*1.4);
        $('#'+orderList.id).css('margin-left',this.BLOCKSIZE*2.8);
        $("#container").append('<br>'); 
    }


    fillOrderBox(SEQUENCE){
        this.createHtml(SEQUENCE);
        this.setHtmlAndPictures();
    }

    setHtmlAndPictures(){
        document.getElementById(this.id).innerHTML = this.html;
        var x=document.getElementsByName(GRIDNAME+"creatureCard");
        for (var i in SEQUENCE) x[i].src = SEQUENCE[i].image;
    }

    createHtml(SEQUENCE){
        var orderBoxHtml="";
        for (var i=0; i<SEQUENCE.length ; i++){
            orderBoxHtml += '<img id="orderBox'+SEQUENCE[i].id+'" name="'+
            GRIDNAME+'creatureCard" onmouseover="showStats(this.id)" class="orderCard" style="font-size:20px; height: '
            +this.BLOCKSIZE+'px; width: '+this.BLOCKSIZE+'px;" >';
        }
        this.html = orderBoxHtml;
    }

    progress(){
        console.log("progress called on OrderBox");

        var cardsCollection = "[name='" + GRIDNAME+ "creatureCard" + "']";
        var firstEl  = $(cardsCollection).get(0);
        var secondEl = $(cardsCollection).get(1);
        var lastEl   = $(cardsCollection).get(SEQUENCE.length - 1);

        if(! this.firstUnitMoved){
            $(firstEl).css({ height: this.bigSize , width: this.bigSize });
            this.firstUnitMoved = true;
        }
        else{
            $(firstEl).css({ height: this.cardSize , width: this.cardSize });
            $(secondEl).css({ height: this.bigSize , width: this.bigSize });

            $(firstEl).hide(300, function () {
                $(firstEl).insertAfter(lastEl);
                $(firstEl).show(300, function() {
                });
            });
        }
    }
}

