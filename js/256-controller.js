// Controller
$(document).ready(function() {
  var game = new Game;
  var view = new View;
  view.updateBoard([], game.toFlatArray(), 'down');
  var originalGameState, updatedGame, updatedGameState;
  var keyBindings = ['left', 'right', 'up', 'down'];

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  keyBindings.forEach(function(direction) {
    Mousetrap.bind(direction, function() {
      originalGameState = game.toFlatArray();
      updatedGame  = game.move(direction);
      updatedGameState = updatedGame.toFlatArray();
      view.updateBoard(originalGameState, updatedGameState, direction);

      if (!arraysEqual(originalGameState, updatedGameState)) {
        view.flashNewTile(game.spawnNewTile());
      }
      
      view.cleanBoard(updatedGame.toFlatArray());   // otherwise a bit buggy when moving fast
      
      if (updatedGame.checkStatus() === "loser") {
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
