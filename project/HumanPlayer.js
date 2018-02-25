var Board = require('./Board.js');
var Game = require('./Game.js');


class HumanPlayer {
	constructor(game) {
		this.game = game;
		this.mark;
		
		//keep track of how many pieces each user has in each line, update on each turn to check for win condition in O(1) time
		this.rowScores;
		this.colScores;
		this.diagScores;
		this.isWinner = false;
	}
	
	initPlayer(mark) {
        if (typeof mark != "string")
          throw Error("mark must be of type 'string', instead received " + (typeof mark));
		this.mark = mark;
		
		//initialize totals for each possible line to zero
		this.rowScores = [0, 0, 0]; //scores for each row. on each move, increment the for the row of that move by one( rowScores[move[1]]++ )
		this.colScores = [0, 0, 0]; //scores for each column. on each move, increment the score for the column of that move by one( colScores[move[0]]++ )
		this.diagScores = [0, 0]; //scores for each diagonal. on each move, increment score for the diagonal of the move by one. ( if (move[0] == move[1]) diagScores[0]++, if (move[0] == 2 - move[1]) diagScores[1]++ )
		this.isWinner = false;
	}
	
	requestMove(makeMove) { 
		return this.game.getInputs("Select A Row: ", "Select A Column: "); 
	} 
	

	updateScore(row, col) { 
		if (row > 2 || row < 0 || col > 2 || col < 0) {
			throw Error("row and col must both be between 0 and 2(inclusive), got " + row + " and " + col);
		}
		this.rowScores[row]++;
		if (this.rowScores[row] == 3)
			this.isWinner = true;
		
		
		this.colScores[col]++;
		if (this.colScores[col] == 3)
			this.isWinner = true;
		
		if (row == col) {
			this.diagScores[0]++;
			if (this.diagScores[0] == 3)
				this.isWinner = true;
		} 
		if (row == 2 - col) {
			this.diagScores[1]++;
			if (this.diagScores[1] == 3) 
				this.isWinner = true;
		}
		 
		
	}
	
}


module.exports = HumanPlayer;