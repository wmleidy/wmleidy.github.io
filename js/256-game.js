var Game = function(gameString) {
  this._board = this.createBoard(gameString);
  this.isWinner = false;
};

Game.prototype.board = function() {
  return this._board;
}

Game.prototype.setBoard = function(board) {
  this._board = board;
  return this;
}

Game.prototype.createBoard = function(gameString) {
  // If no gameString passed in, randomly place two 2's
  if (!gameString) {
    var randomNumbers = []
    do {
      randomNumbers[0] = Math.floor(Math.random()*16);
      randomNumbers[1] = Math.floor(Math.random()*16);
    } while (randomNumbers[0] === randomNumbers[1]);

    var template = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]

    randomNumbers.forEach(function(randomNumber) {
      var row = Math.floor(randomNumber / 4);
      var column = randomNumber % 4;
      template[row][column] = 2;
    })
    return template;
  }
  // ...else if gameString passed in, place the digits in specified places
  else {
    var template = [];
    var gameArray = gameString.split(",").map(Number);
    for(var i = 0; i < 13; i += 4) {
      template.push(gameArray.slice(i, i + 4));
    };
    return template;
  }
};

// Helper methods
Game.prototype.toString = function() {
  return _.flatten(this.board()).join(",");
}

Game.prototype.toFlatArray = function() {
  return _.flatten(this.board());
}

// Move logic (stack => combine => spawn)
Game.prototype.move = function(direction) {
  switch(direction) {
    case "left":
      return processMove(this);
      break;
    case "right":
      return processMove(this, true);
      break;
    case "up":
      return processMove(this, false, true);
      break;
    case "down":
      return processMove(this, true, true);
      break;
  }

  function processMove (game,reverse,transpose) {
    var reverse = reverse || false;
    var transpose = transpose || false;

    var newBoard = [];

    var workingBoard = game.board();

    if (transpose) { workingBoard = _.zip.apply(null,workingBoard) }

    workingBoard.forEach(function(row) {
      if (reverse) { row = row.reverse()}
      row = stackTiles(row);
      row = combineTiles(row);
      if (reverse) { row = row.reverse() }
      newBoard.push(row);
    });

    if (transpose) {
      newBoard = _.zip.apply(null,newBoard);
      // workingBoard = _.zip.apply(null,workingBoard);
    }
    // return newBoard;  // When testing for loss, return the board, not the Game object
    game.setBoard(newBoard);
    return game;
  }
}

function stackTiles(array) {
  var condensedArray = _.reject(array, function(value) {return value === 0});
  while (condensedArray.length < 4) {
    condensedArray.push(0);
  }
  return condensedArray;
}

function combineTiles(array) {
  if (array[0] === array [1]) {
    array[0] = 2 * array[0];
    array[1] = 0;
    if (array[2] === array[3]) {
      array[2] = 2 * array[2];
      array[3] = 0;
    }
  } else if (array[1] === array[2]) {
    array[1] = 2 * array[1];
    array[2] = 0;
  } else if (array[2] === array[3]) {
    array[2] = 2 * array[2];
    array[3] = 0;
  }
  array = stackTiles(array);
  return array;
}

Game.prototype.spawnNewTile = function() {
  var currentArray = this.toFlatArray();
  var zeroLocations = [];
  for (var i = 0; i < currentArray.length; i++) {
    if (currentArray[i] === 0) {
      zeroLocations.push(i);
    }
  }
  var updateLocation = _.sample(zeroLocations);
  var tileRandomizer = Math.floor(Math.random()*8);
  if (tileRandomizer === 7) {
    currentArray[updateLocation] = 4;
  } else {
    currentArray[updateLocation] = 2;
  }
  var template = [];
   for(var i=0; i < 13 ;i+=4) {
    template.push(currentArray.slice(i, i + 4))
  };
  this.setBoard(template);
  return [updateLocation, currentArray[updateLocation]];
}

Game.prototype.checkStatus = function() {
  var that = this;
  var flattenedArray = this.toFlatArray();
  flattenedArray.forEach(function(tile) {
    if (tile === 2048) {
      that.isWinner = true;
    }
  })

  // These tests cause the actual game board to change (reverse) due to object references
  // being copied (probably in the var workingBoard = game.board() line). Therefore, the
  // code to check for losing conditions must be refactored somehow to prevent weird stuff
  // from happening.

  // if (that.toString() === _.flatten(processMove(that)).join(",") &&
  //     that.toString() === _.flatten(processMove(that,true)).join(",") &&
  //     that.toString() === _.flatten(processMove(that,false,true)).join(",") &&
  //     that.toString() === _.flatten(processMove(that,true,true)).join(",")) {
  //   return "loser"
  // }
  // console.log(that.toString());
  // return this
}
