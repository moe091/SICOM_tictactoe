
/**
	The Board class is responsive for maintaining the state of the board, modifying the board, and performing all of the board functions.
**/
class Board {
	//store the board internally as a 2d(3x3) array. e.g board[0][2] represents the cell in row 0, column 2
	constructor() {
		this.board = [
			[" ", " ", " "],
			[" ", " ", " "],
			[" ", " ", " "]
		];
		this.moves = 0; //count moves, so that board can check if game has ended in a tie in constant time
	}

	//renders the entire board in its current state
	renderBoard() {
		process.stdout.write("\n\n"); //print a couple new lines, because the board should always have space around it to prevent clutter
		
		//loop through every cell on the board, printing the value of each cell from this.board
		for (var y = 0; y < 3; y++) { //loop through each row of board
			for (var x = 0; x < 3; x++) { //loop through each column of each row
				//for the middle colum(x = 1), print " | " on each side of the cells value to create the frame of the board
				if (x == 1) {
					process.stdout.write(" | " + this.board[y][x] + " | ");
				} else {
					process.stdout.write(this.board[y][x]);
				}
			}
			//after printing the cells for a row, print a line of '_'s on the next line to create the frame of the board
			//unless it is the last row(y==2), because the frame of a tictactoe board doesn't have a line across the bottom
			if (y != 2) {
				process.stdout.write("\n_________\n");
			}
		}
		
		process.stdout.write("\n\n"); //newlines to prevent clutter
	}
	
	
	isMoveValid(row, col) { 
		if (this.board[row] == null)
			return false;
		if (this.board[row][col] == null)
			return false;
		
		if (this.board[row][col] == " ") {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	* Place an 'X' or 'O' in one of the cells of the board
	* 
	* @param Number row - the row in which the X/O will be placed(0, 1, or 2)
	* @param Number col - the column in which the X/O will be placed(0, 1, or 2)
	* @param String mark - the mark that should be placed in the cell(X or O)
	*
	* Error: if the mark is not 'X' or 'O'
	* Error: if row is less than 0 or greater than 2
	* Error: if col is less than 0 or greater than 2
	**/
	placeMove(row, col, mark) {
		if (mark != "X" && mark != "O")
			throw Error("Invalid Argument Exception - Mark is not 'O' or 'X'. mark = ", mark);
		if (row < 0 || row > 2)
			throw Error('Argument Out Of Range Exception - row is less than 0 or greater than 2. row=', row);
		if (col < 0 || col > 2)
			throw Error('Argument Out Of Range Exception - col is less than 0 or greater than 2. col=', col);
		this.board[row][col] = mark;
		this.moves++;
	}
	
	tryMove(row, col, mark) {
		if (this.isMoveValid(row, col)) {
			try {
				this.placeMove(row, col, mark);
				return true;
			} catch(err) {
				return false;
			}
		} else {
			return false;
		}
		
	}
	
	isGameOver() {
		if (this.moves >= 9) 
			return true;
		else
			return false;
	}
	
	
	
}

module.exports = Board;