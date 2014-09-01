var board = function (xsize, ysize) {
    var id;
    var width = xsize;
    var height = ysize;
    var winState = [7, 73, 273, 146, 292, 84, 56, 448];
    var players = [];
    var states = [];
    var max_players = 2;
    var thisBoard=this;
    var DBAPI = $.post("https://tictactoe.couchappy.com/tictactoe/_design/boards/_update/board",{size:xsize*ysize},function(data){
        id=data;
    });



    var nextPlayer = function () {
        players.rotate(1);
        radio('player move').broadcast(players[0]);
        alert(players[0].getPlayerName() + " turn");
    }

    var win = function (pid) {
        for (item in winState) {
            if ((states[pid] & winState[item]) == winState[item]) {
                states=[];
                radio("reset").broadcast(thisBoard);
                return true;
            }
        }
        return false;
    }
    this.addPlayer = function (Player) {
        DBAPI.done(function(){
            $.post("https://tictactoe.couchappy.com/tictactoe/_design/boards/_update/player/"+id,{player:Player.getPlayerName()});
        });
        players.push(Player);
        states[Player.getPlayerId()] = 0;
        if (players.length == max_players) {
            players.shuffle();
            nextPlayer();

        }
        else
            alert("wait to player");
    };
    this.move = function (Player, coordinates, arrSquare) {
        var pid = Player.getPlayerId();
        if (Player !== players[0]) {
            alert('not yor move');
            return;
        }
        states[pid] |= Math.pow(2, coordinates);
        radio('state change').broadcast(Player, states[pid], coordinates, arrSquare);
        DBAPI.done(function(){
            $.post("https://tictactoe.couchappy.com/tictactoe/_design/boards/_update/move/"+id,{where: coordinates, player:Player.getPlayerName()});
        });
        if (win(pid)) radio('win').broadcast(Player);
        nextPlayer();
    };
    this.getCurrentPlayer = function () {
        return players[0];
    }
    this.getId=function () {return id;}

    viewBox();

    return {
        addPlayer: this.addPlayer,
        move: this.move,
        getCurrentPlayer: this.getCurrentPlayer,
        getId :this.getId()
    }
}

var player = function (playerSide, playerId, playerName) {
    var id = playerId;
    var playerSide = playerSide;
    var name = playerName;
    return{
        getPlayerId: function () {
            return id;
        },
        getPlayerSide: function () {
            return playerSide;
        },
        getPlayerName: function () {
            return name;
        }
    }
}

var viewBox = function (board) {
    var new_box = templateBox = $(".box.template").clone();
    new_box.removeClass('template');
    new_box.appendTo('.leftSide');
    $('<li>' + 'click to start the game' + '</li>').appendTo('.rightSide .boardLIst');
    $('li').bind("click", function () {
        radio("add player to start").broadcast(new_box);

    })
}
