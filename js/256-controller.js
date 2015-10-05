// Controller
$(document).ready(function() {
  var game = new Game;
  // var game = new Game("2,4,8,16,2,4,8,16,2,4,8,16,2,4,8,16"); // for testing reverse
  // var game = new Game("1024,1024,0,0,0,0,0,0,0,0,0,0,0,0,0,0"); // for testing winning
  var view = new View;
  view.updateBoard([], game.toFlatArray(), 'down');
  var originalGame, updatedGame;
  var keyBindings = ['left', 'right', 'up', 'down'];

  keyBindings.forEach(function(direction) {
    Mousetrap.bind(direction, function() {
      originalGame = game;
      updatedGame  = game.move(direction);
      view.updateBoard(originalGame.toFlatArray(), updatedGame.toFlatArray(), direction);
      view.flashNewTile(game.spawnNewTile());
      view.cleanBoard(updatedGame.toFlatArray());   // otherwise a bit buggy when moving fast
      
      if (updatedGame.checkStatus() === "loser") {  // not currently implemented
        view.flashLosingStatement();
        Mousetrap.reset();
      }
      if (updatedGame.isWinner) {
        view.flashWinningStatement();
        Mousetrap.reset();
      }
    })
  })
});

// View
var View = function() {
  this.updateBoard = function(start, end, direction) {
    for (var i = 0; i < 16; i++) {
      var $tile = $("#tile" + i);
      var oldClass = $tile.attr('class');
      var newClass = "value" + end[i].toString();
      if (end[i] > 0) {
        $tile.text(end[i]);
      } else {
        $tile.text("");
      }
      if (oldClass !== newClass) {
        $tile.switchClass(oldClass, newClass, 200, "easeInOutBounce");
      }
    }
  }

  this.flashNewTile = function(tilePositionAndNumber) {
    var $tile = $("#tile" + tilePositionAndNumber[0]);
    $tile.effect("highlight", {color: "#F5F5DC"}, 100);
    $tile.switchClass("value0", "value" + tilePositionAndNumber[1], 350, "easeInOutBounce");
    $tile.text(tilePositionAndNumber[1]);
  }

  this.cleanBoard = function(end) {
    for (var i = 0; i < 16; i++) {
      var $tile = $("#tile" + i);
      if (end[i] === 0) {
        $tile.stop(true, true).removeClass().addClass("value0");
      }
    }
  } 

  this.flashWinningStatement = function() {
    $("#status").text("Congratulations! You’ve won!");
    $("#status").css("visibility", "visible");
  }

  this.flashLosingStatement = function() {
    $("#status").text("Sorry, you’ve lost!");
    $("#status").css("visibility", "visible");
  }
}
