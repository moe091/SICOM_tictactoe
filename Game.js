var Board = require('./Board.js');
var HumanPlayer = require('./HumanPlayer.js');
var BotPlayer = require('./BotPlayer.js');


/**
	Game controls the actual gameplay. It houses the main game loop, the players, and the board, and controls the flow of the game
**/
class Game {
	constructor(app) {
		this.app = app;
		this.board = new Board();
		this.inputCB; 
		this.playerX = new HumanPlayer(this);
		this.playerO = new BotPlayer(this);
		this.currentPlayer;
	}
	
	/**
	*	starts the game: starts listening for input, initializes both players and sets playerX as the first currentPlayer, calls startTurn to enter the game loop
	**/
	startGame() { 
		this.playerX.initPlayer("X");
		this.playerO.initPlayer("O");
		
		// X always goes first
		this.currentPlayer = this.playerX;
		this.startTurn();
	}
	
	/**
	*	Begins the main game loop - renders board and calls getMove
	**/
	startTurn() { 
		this.clearConsole();
		this.board.renderBoard();
		process.stdout.write("\n\nPlayer " + this.currentPlayer.mark + "'s Turn:\n");
		
		// get the current players move
		this.getMove();
	}
	
	/**
	*	Get the current players move. If the move is not valid getMove calls itself recursively until a valid move is entered, then it calls endTurn
	**/
	getMove() {
		// ask the current player for their move
		this.currentPlayer.requestMove(this.board).then((move) => {
			//shift row and col down by 1 before doing anything to convert the user input into correct array indices
			let row = move[0] - 1;
			let col = move[1] - 1;
			
			// if the move entered by the current player is valid, update the players score and end their turn
			if (this.board.tryMove(row, col, this.currentPlayer.mark)) {
				this.currentPlayer.updateScore(row, col);
				this.endTurn();
			// if the current players move is not valid, notify the player and ask for their move again
			} else {
				this.invalidMove();
              console.log("move = ", move);
				this.getMove();
			}
		});
		
	}
	
	/**
	* prints to the console to notify the player that their move was invalid
	**/
	invalidMove() {
		process.stdout.write("\n*********Invalid Move - try again*********\n");
	}
		
	/**
	*	checks if the currentPlayer has won(other can't have won at this point, if they did it would've been caught on the last loop when they were the currentPlayer).
	* calls gameOver if currentPlayer has won, otherwise it switches currentPlayer and calls startTurn to restart the game loop
	**/
	endTurn() {
		// check if the currentPlayer has won and end game if so
		if (this.currentPlayer.isWinner) {
			this.gameOver(this.currentPlayer)
		// check if the game has ended in a tie and end game if so
		} else if (this.board.isGameOver()) {
			this.gameOver();
		// if the game is not over, switch currentPlayer and start the new currentPlayer's turn
		} else {
			if (this.currentPlayer == this.playerX) 
				this.currentPlayer = this.playerO;
			else if (this.currentPlayer == this.playerO)
				this.currentPlayer = this.playerX;
			
			this.startTurn();
		}
	}
	
	/**
	*	clears the console and renders the board to show how the game ended, announces the winning player
	**/
	gameOver(winningPlayer) {
		// clear the console and render the board to show the end state
		this.clearConsole();
		this.board.renderBoard();
		
		// print the Game Over message:
	 	process.stdout.write("****************************************************\n");
		if (winningPlayer == null) // if there is no winning player, print the Tie Game message
			process.stdout.write("**********--- Game Has Ended In A Tie ---***********\n");
		else											 // if there is a winning player, print a message declaring that player the winner
			process.stdout.write("***************--- Player " + winningPlayer.mark + " Has Won ---*************\n");
	 	process.stdout.write("****************************************************\n\n\n\n");
		
		this.askNewGame();
	}
	
	/**
	* Asks the player if they want to start a new game. If yes, start a new game. If no, exit the game
	**/
	askNewGame() {
		this.getInputs("would you like to play again?\n(1) - Yes\n(2) - No\n\n").then((input) => {
			if (input == 1) { // start a new game if the user enters 1
				this.app.newGame();
			} else if (input == 2) { // stop the process if the user enters 2
				this.app.close();
			} else { // if the users input is invalid(not 1 or 2), inform them that their input wasn't valid and ask again
				process.stdout.write("\nInvalid Response, try again");
				this.askNewGame();
			}
		});
	}

	
	/**
	*	optionally prints multiple messages to the user, accepting one input for each message, and returns the users inputs
	*
	* @param prompts... string(s) - any number of strings, each one a message to be printed to the console. getInputs accepts one input per prompt, pass in empty strings to accept input without printing a message
	* 
	* @return Promise([Number]) - A promise that resolves into an array of Numbers, each string containing a single input from the user
	**/
	getInputs() {
		// convert arguments to an array so it's easier to work with, if there 
		var prompts = [].slice.call(arguments);
		
		// return a promise that resolves when the user has inputted 1 value for each prompt
		return new Promise((resolve, reject) => {
			var answers = []; // will store the users inputs in order
      if (prompts.length > 0)
				process.stdout.write(prompts.shift()); // remove the first prompt and print it to the console
			
			
			this.app.setInputCallback((input) => { // executed when an input is received:
				answers.push(input);
				if (prompts.length == 0) { // if there are no prompts left to display, resolve the promise with the array of inputs
					resolve(answers);
				} else { // if there are more prompts left to display, print the next one to the console
					process.stdout.write(prompts.shift());
				}
			});
			
		});
	}
	

	

	// clears the console
	clearConsole() { 
		// set lines to the number of lines in the console window at its current size
		var lines = process.stdout.getWindowSize()[1];
		// print that many blank lines so the console scrolls down to show an empty screen
		for(var i = 0; i < lines; i++) {
				process.stdout.write('\r\n');
		} 
	}
	
}

module.exports = Game;
