$(document).ready(function () {
    var all_boards_feed = new EventSource("https://tictactoe.couchappy.com/tictactoe/_changes?filter=boards/boards&status=new&include_docs=true&feed=eventsource");
    all_boards_feed.onmessage = function(msg) {
        var board = JSON.parse(msg.data).doc;
    }

    radio('state change').subscribe(function redrawBoard(player, state, coordinates, arrSquare) {
        if (player.getPlayerSide() == 'o')
            $(arrSquare).addClass("circle");
        if (player.getPlayerSide() == 'x')
            $(arrSquare).addClass("x");
    });

    radio('win').subscribe(function (PlayerName) {
        alert(PlayerName.getPlayerName() + ' WIN');
    });

    radio('reset').subscribe(function(board){
        delete board;
    })

    $("button").bind("click", function () {
        var side="x";
        var side2="o";
        if($("#browesSide").is(':checked')){
            side='o';
            side2="x";
        }
        var b = new board(3, 3);
        b.addPlayer(new player(side, 3, "PLAYER 1"));
        radio('add player to start').subscribe(function(new_box){
            b.addPlayer(new player(side2, 4, "PLAYER 2"));
            new_box.find(".square").bind("click", function () {
                if ($(this).hasClass('circle') || $(this).hasClass('x'))
                    return;
                var i = $(this).parent().find('.square').index(this);
                b.move(b.getCurrentPlayer(), i, this);
            });
        })
        //b.addPlayer(new player(side2, 4, "PLAYER 2"));
    })

});

Array.prototype.rotate = (function () {
    var push = Array.prototype.push,
        splice = Array.prototype.splice;
    return function (count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int
        // convert count to value in range [0, len[
        count = ((count % len) + len) % len;
        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * ( i + 1 ));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}