// Controller
$(document).ready(function() {
  var game = new Game;
  // var game = new Game("128,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0"); // for testing
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
      updatedGame.isWinningBoard();
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
        $tile.text(end[i].toString());
      } else {
        $tile.text("");
      }
      if (oldClass !== newClass) {
        $tile.switchClass(oldClass, newClass, 500, "easeInOutBounce");
      }
    }
  }

  this.flashNewTile = function(tileNumber) {
    var $tile = $("#tile" + tileNumber);
    $tile.switchClass("value0", "value2", 250, "easeInOutBounce");
    $tile.text("2");
  }

  this.flashWinningStatement = function() {
    $("#winner").show();
  }
}
