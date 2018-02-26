var Board = require('./Board.js');
var Game = require('./Game.js');
var Player = require('./Player.js');


class HumanPlayer extends Player {
	
	requestMove(board) { 
		return this.game.getInputs("Select A Row: ", "Select A Column: "); 
	} 

	
}


module.exports = HumanPlayer;