var Board = require('./Board.js');
var Game = require('./Game.js');


class Player {
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
	
	// where the player attempts to make a move and returns it an array of length 2([0] = row, [1] = col). Should be implemented by child class
	requestMove(makeMove) { 
		
	} 
	

	/**
	* function for calculating if a player has won the game in constant time, updates the score by including the latest move and recalculating values for the win-state check, sets isWinner to true if player has won
	* adds 1 to the corresponding element of colScore, 1 to the corresponding element of rowScore, and the corresponding diagScore(s) if any.
	* if any rowScore, colScore, or diagScore adds up to 3, then the player has won and isWinner is set to true
	*
	* this doesn't check for the same move being added multiple times, because that shouldn't be able to happen in a single game(if it does, there is a problem somewhere else)
	* 
	* @param row Number - the row of the move being added to the score
	* @param col Number - the column of the move being added to the score
	**/
	updateScore(row, col) { 
		// throw an error if the move is invalid
		if (row > 2 || row < 0 || col > 2 || col < 0) {
			throw Error("row and col must both be between 0 and 2(inclusive), got " + row + " and " + col);
		}
		
		// rowScores[n] corresponds to the 'n'th row, so add 1 to the number who's index equals the row in which the move took place
		this.rowScores[row]++;
		if (this.rowScores[row] == 3)
			this.isWinner = true;
		
		// add 1 to the column in which the move took place
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


module.exports = Player;