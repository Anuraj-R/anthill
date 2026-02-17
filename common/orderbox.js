/*
    This file maintains the box on the top, where
    the units are displayed in the order they would
    move.
*/


class OrderBox {
    constructor(gridName, blockSize) {
        this.id = gridName + "orderList";
        this.gridName = gridName;
        this.blockSize = blockSize;
        this.firstUnitMoved = false;

        this.cardSize = blockSize;
        this.bigSize = blockSize + 6;
    }

    addToContainer(container){
        var orderList = document.createElement('div');
        orderList.id = this.id;
        $("#"+container).append(orderList);
        $('#'+orderList.id).addClass("orderList");
        $('#'+orderList.id).css('width',222);
        $('#'+orderList.id).css('height',this.blockSize*1.4);
        $('#'+orderList.id).css('margin-left',this.blockSize*2.8);
        $("#"+container).append('<br>');
    }


    fillOrderBox(SEQUENCE){
        this.createHtml(SEQUENCE);
        this.setHtmlAndPictures(SEQUENCE);
    }

    setHtmlAndPictures(SEQUENCE){
        document.getElementById(this.id).innerHTML = this.html;
        var x=document.getElementsByName(this.gridName+"creatureCard");
        for (var i in SEQUENCE) x[i].src = SEQUENCE[i].image;
    }

    createHtml(SEQUENCE){
        var orderBoxHtml="";
        for (var i=0; i<SEQUENCE.length ; i++){
            orderBoxHtml += '<img id="orderBox'+SEQUENCE[i].id+'" name="'+
            this.gridName+'creatureCard" onmouseover="showStats(this.id)" class="orderCard" style="font-size:20px; height: '
            +this.blockSize+'px; width: '+this.blockSize+'px;" >';
        }
        this.html = orderBoxHtml;
    }

    progress(){
        //console.log("progress called on OrderBox");
        var firstEl  = this.get(0);
        var secondEl = this.get(1);
        var lastEl   = this.get(-1);

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

    get(index){
        var cardsCollection = "[name='" + this.gridName+ "creatureCard" + "']";
        return $(cardsCollection).get(index);
    }
}

window.module = window.module || {};
module.exports = OrderBox;
